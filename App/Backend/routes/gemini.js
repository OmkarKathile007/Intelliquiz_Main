const express = require("express");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const TEXT_CHAR_LIMIT = 3000;
const TRANSCRIPT_CHAR_LIMIT = 4000;
const YT_ID_RE = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;

const QUIZ_PROMPT = `You are a quiz generator. Generate exactly 5 multiple-choice questions from the provided content.

RULES:
- All questions and answer options MUST be written in English, regardless of the language of the source content
- Each question must have exactly 4 options
- Exactly one option must be correct
- correctIndex must be a 0-based integer (0=A, 1=B, 2=C, 3=D)
- Questions must be based ONLY on the provided content
- Output ONLY valid JSON — no markdown, no explanation

OUTPUT FORMAT:
{
  "mcqs": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0
    }
  ]
}`;

function parseMcqs(text) {
  const match = text.match(/\{[\s\S]*\}/);
  const data = JSON.parse(match ? match[0] : text);
  const normalized = (data.mcqs || [])
    .filter((q) => Array.isArray(q.options) && q.options.length === 4)
    .map((q) => ({
      question: q.question || "",
      options: q.options,
      correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
    }));
  if (normalized.length === 0) throw new Error("No valid questions generated.");
  return normalized;
}

async function callGemini(parts, retries = 3, delay = 2000) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });
  try {
    const result = await model.generateContent(parts);
    return result.response.text();
  } catch (err) {
    const retryable = err.message?.includes("429") || err.message?.includes("503");
    if (retries > 0 && retryable) {
      await new Promise((r) => setTimeout(r, delay));
      return callGemini(parts, retries - 1, delay * 2);
    }
    throw err;
  }
}

// POST /api/gemini/generate/text
router.post("/generate/text", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ msg: "Missing text." });
  }
  try {
    const raw = await callGemini([`${QUIZ_PROMPT}\n\nCONTENT:\n"${text.slice(0, TEXT_CHAR_LIMIT)}"`]);
    res.json({ mcqs: parseMcqs(raw) });
  } catch (err) {
    console.error("[gemini/text]", err.message);
    res.status(500).json({ msg: err.message || "Quiz generation failed." });
  }
});

// Fetch transcript via YouTube InnerTube API — works from cloud servers
async function fetchYouTubeTranscript(videoId) {
  // Step 1: get caption track list from the player endpoint
  const playerRes = await fetch("https://www.youtube.com/youtubei/v1/player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "X-Goog-Api-Key": "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", // YouTube public web-client key
      Origin: "https://www.youtube.com",
      Referer: `https://www.youtube.com/watch?v=${videoId}`,
    },
    body: JSON.stringify({
      videoId,
      context: {
        client: { clientName: "WEB", clientVersion: "2.20240101.00.00", hl: "en", gl: "US" },
      },
    }),
  });

  if (!playerRes.ok) throw new Error(`YouTube player API returned ${playerRes.status}`);
  const playerData = await playerRes.json();

  const captionTracks =
    playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!captionTracks || captionTracks.length === 0) {
    throw new Error("NO_CAPTIONS");
  }

  // Prefer English; fall back to first available
  const track =
    captionTracks.find((t) => t.languageCode === "en") ||
    captionTracks.find((t) => t.languageCode?.startsWith("en")) ||
    captionTracks[0];

  // Step 2: fetch the caption file as JSON3
  const captionUrl = `${track.baseUrl}&fmt=json3`;
  const captionRes = await fetch(captionUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!captionRes.ok) throw new Error(`Caption fetch returned ${captionRes.status}`);

  const captionData = await captionRes.json();
  const text = (captionData.events || [])
    .filter((e) => e.segs)
    .flatMap((e) => e.segs.map((s) => s.utf8 || ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) throw new Error("NO_CAPTIONS");
  return text;
}

// POST /api/gemini/generate/youtube
router.post("/generate/youtube", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ msg: "Missing YouTube URL." });
  }
  const m = url.trim().match(YT_ID_RE);
  if (!m) {
    return res.status(400).json({ msg: "Could not extract a YouTube video ID from that URL." });
  }
  try {
    const transcript = await fetchYouTubeTranscript(m[1]);
    const raw = await callGemini([
      `${QUIZ_PROMPT}\n\nCONTENT:\n"${transcript.slice(0, TRANSCRIPT_CHAR_LIMIT)}"`,
    ]);
    res.json({ mcqs: parseMcqs(raw) });
  } catch (err) {
    console.error("[gemini/youtube]", err.message);
    const noCaption =
      err.message === "NO_CAPTIONS" ||
      err.message?.toLowerCase().includes("disabled") ||
      err.message?.toLowerCase().includes("no caption");
    res.status(noCaption ? 422 : 500).json({
      msg: noCaption
        ? "Transcript unavailable. The video may have captions disabled."
        : err.message || "Failed to generate quiz from video.",
    });
  }
});

// POST /api/gemini/generate/pdf
router.post("/generate/pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No PDF file uploaded." });
  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({ msg: "File must be a PDF." });
  }
  try {
    const base64 = req.file.buffer.toString("base64");
    const raw = await callGemini([
      { inlineData: { mimeType: "application/pdf", data: base64 } },
      { text: QUIZ_PROMPT },
    ]);
    res.json({ mcqs: parseMcqs(raw) });
  } catch (err) {
    console.error("[gemini/pdf]", err.message);
    res.status(500).json({ msg: err.message || "Failed to generate quiz from PDF." });
  }
});

// POST /api/gemini/generate/multiplayer
router.post("/generate/multiplayer", async (req, res) => {
  const { topic, count = 5 } = req.body;
  if (!topic || typeof topic !== "string") {
    return res.status(400).json({ msg: "Missing topic." });
  }
  const safeCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);

  const prompt = `Generate exactly ${safeCount} multiple-choice quiz questions about "${topic}".

RULES:
- Each question must have exactly 4 answer options
- Exactly ONE answer must be correct (correct: true), the rest false
- Questions should be challenging but fair
- Output ONLY valid JSON, no markdown, no explanation

OUTPUT FORMAT:
{
  "questions": [
    {
      "question": "...",
      "answers": [
        {"text": "...", "correct": true},
        {"text": "...", "correct": false},
        {"text": "...", "correct": false},
        {"text": "...", "correct": false}
      ]
    }
  ]
}`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    res.json({ questions: data.questions });
  } catch (err) {
    console.error("[gemini/multiplayer]", err.message);
    res.status(500).json({ msg: err.message || "Failed to generate questions." });
  }
});

module.exports = router;
