import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SpinnerLoad from "./SpinnerLoad";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuth } from "firebase/auth";
import { useSubscription } from "../../context/SubscriptionContext";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BACKEND = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";
const genAI = new GoogleGenerativeAI(API_KEY);

const TEXT_CHAR_LIMIT = 3000;
const PDF_SIZE_LIMIT_MB = 5;
const PDF_SIZE_LIMIT = PDF_SIZE_LIMIT_MB * 1024 * 1024;
const HISTORY_MAX = 3;
const PDF_FREE_LIMIT = 2;
const YT_FREE_LIMIT = 2;

const YT_URL_RE = /(?:youtube\.com\/watch|youtu\.be\/|youtube\.com\/embed\/)/i;

// ── Utilities ──────────────────────────────────────────────────────────────────

async function sendWithRetry(fn, retries = 3, delay = 2000) {
  try {
    return await fn();
  } catch (err) {
    const retryable = err.message?.includes("429") || err.message?.includes("503");
    if (retries > 0 && retryable) {
      await new Promise((r) => setTimeout(r, delay));
      return sendWithRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUsageData(uid) {
  const raw = localStorage.getItem(`iq_quiz_${uid}`);
  const data = raw ? JSON.parse(raw) : { date: "", count: 0 };
  if (data.date !== todayKey()) return { date: todayKey(), count: 0 };
  return data;
}

function incrementUsage(uid) {
  const data = getUsageData(uid);
  data.count += 1;
  localStorage.setItem(`iq_quiz_${uid}`, JSON.stringify(data));
  return data;
}

function historyKey(uid) {
  return `iq_quiz_history_${uid}`;
}

function loadHistory(uid) {
  try {
    const raw = localStorage.getItem(historyKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function pushToHistory(uid, entry) {
  let hist = loadHistory(uid).filter((h) => h.id !== entry.id);
  hist.unshift(entry);
  hist = hist.slice(0, HISTORY_MAX);
  localStorage.setItem(historyKey(uid), JSON.stringify(hist));
  return hist;
}

function getPdfCount(uid) {
  return parseInt(localStorage.getItem(`iq_pdf_count_${uid}`) || "0", 10);
}

function incrementPdfCount(uid) {
  const next = getPdfCount(uid) + 1;
  localStorage.setItem(`iq_pdf_count_${uid}`, String(next));
  return next;
}

function getYtCount(uid) {
  return parseInt(localStorage.getItem(`iq_yt_count_${uid}`) || "0", 10);
}

function incrementYtCount(uid) {
  const next = getYtCount(uid) + 1;
  localStorage.setItem(`iq_yt_count_${uid}`, String(next));
  return next;
}

async function uploadPdfToGemini(file) {
  const meta = JSON.stringify({
    file: { display_name: file.name, mime_type: "application/pdf" },
  });
  const metaBlob = new Blob([meta], { type: "application/json" });
  const form = new FormData();
  form.append("metadata", metaBlob);
  form.append("file", file, file.name);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?uploadType=multipart&key=${API_KEY}`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "PDF upload failed.");
  }
  return (await res.json()).file;
}

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

// ── Progress Ring ──────────────────────────────────────────────────────────────

const ProgressRing = ({ value, total }) => {
  const pct = total > 0 ? value / total : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  return (
    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r={r} stroke="#1f2937" strokeWidth="6" fill="none" />
      <circle
        cx="32" cy="32" r={r}
        stroke="url(#scoreGrad)"
        strokeWidth="6"
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <defs>
        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ── Source icon for history entries ───────────────────────────────────────────

const SourceIcon = ({ source }) => {
  if (source === "pdf") {
    return (
      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  if (source === "youtube") {
    return (
      <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

const GenAI = () => {
  const navigate = useNavigate();
  const { getLimit, canAccess } = useSubscription();
  const dailyLimit = getLimit("aiQuizzesPerDay");
  const canUploadPdf = canAccess("pdfUpload");

  const [inputMode, setInputMode] = useState("text"); // "text" | "youtube" | "pdf"
  const [paragraph, setParagraph] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [loadingMsg, setLoadingMsg] = useState("Generating quiz…");
  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [currentQuizEntry, setCurrentQuizEntry] = useState(null);
  const [pdfUsed, setPdfUsed] = useState(0);
  const [ytUsed, setYtUsed] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(true);
  const feedbackTimer = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;
    if (dailyLimit === Infinity) {
      setRemaining(Infinity);
    } else {
      const data = getUsageData(user.uid);
      setRemaining(Math.max(0, dailyLimit - data.count));
    }
    setQuizHistory(loadHistory(user.uid));
    setPdfUsed(getPdfCount(user.uid));
    setYtUsed(getYtCount(user.uid));
  }, [dailyLimit]);

  // ── Start quiz from generated MCQs ────────────────────────────────────────

  function startQuiz(normalized, entry) {
    setMcqs(normalized);
    setCurrentIndex(0);
    setScore(0);
    setAnswerHistory([]);
    setSelectedIdx(null);
    setIsCorrect(null);
    setCurrentQuizEntry(entry);
    setStatus("playing");
  }

  // ── Enforce daily limit ───────────────────────────────────────────────────

  function checkAndIncrementLimit(user) {
    if (dailyLimit === Infinity) return true;
    const data = getUsageData(user.uid);
    if (data.count >= dailyLimit) {
      navigate("/pricing");
      return false;
    }
    const updated = incrementUsage(user.uid);
    setRemaining(Math.max(0, dailyLimit - updated.count));
    return true;
  }

  // ── Generate from Text ────────────────────────────────────────────────────

  const generateFromText = async () => {
    const user = getAuth().currentUser;
    if (!user) { alert("Please log in first."); return; }
    if (!paragraph.trim()) { alert("Please enter some text first."); return; }
    if (!checkAndIncrementLimit(user)) return;

    setLoadingMsg("Generating quiz…");
    setStatus("loading");

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      });
      const chatSession = model.startChat({ history: [] });
      const prompt = `${QUIZ_PROMPT}\n\nCONTENT:\n"${paragraph.slice(0, TEXT_CHAR_LIMIT)}"`;
      const result = await sendWithRetry(() => chatSession.sendMessage(prompt));
      const normalized = parseMcqs(result.response.text());

      const entry = {
        id: Date.now(),
        title: `Text quiz – ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`,
        source: "text",
        mcqs: normalized,
        date: todayKey(),
      };
      setQuizHistory(pushToHistory(user.uid, entry));
      startQuiz(normalized, entry);
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz. Please try again.");
      setStatus("idle");
    }
  };

  // ── Generate from YouTube ─────────────────────────────────────────────────

  const generateFromYoutube = async () => {
    const user = getAuth().currentUser;
    if (!user) { alert("Please log in first."); return; }

    const url = youtubeUrl.trim();
    if (!url) { alert("Please enter a YouTube URL first."); return; }
    if (!YT_URL_RE.test(url)) {
      alert("That doesn't look like a YouTube video URL. Please paste a link from youtube.com or youtu.be.");
      return;
    }

    if (!canUploadPdf && getYtCount(user.uid) >= YT_FREE_LIMIT) {
      navigate("/pricing");
      return;
    }

    if (!checkAndIncrementLimit(user)) return;

    setLoadingMsg("Fetching video transcript…");
    setStatus("loading");

    try {
      const res = await fetch(`${BACKEND}/api/transcript/youtube`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to fetch transcript.");

      setLoadingMsg("Generating quiz…");

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      });
      const chatSession = model.startChat({ history: [] });
      const prompt = `${QUIZ_PROMPT}\n\nCONTENT:\n"${data.transcript}"`;
      const result = await sendWithRetry(() => chatSession.sendMessage(prompt));
      const normalized = parseMcqs(result.response.text());

      const entry = {
        id: Date.now(),
        title: `YouTube quiz – ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`,
        source: "youtube",
        mcqs: normalized,
        date: todayKey(),
      };
      if (!canUploadPdf) {
        const newCount = incrementYtCount(user.uid);
        setYtUsed(newCount);
      }
      setQuizHistory(pushToHistory(user.uid, entry));
      startQuiz(normalized, entry);
    } catch (err) {
      console.error(err);
      alert(`Failed: ${err.message || "Please try again."}`);
      setStatus("idle");
    }
  };

  // ── Generate from PDF ─────────────────────────────────────────────────────

  const generateFromPdf = async () => {
    const user = getAuth().currentUser;
    if (!user) { alert("Please log in first."); return; }
    if (!pdfFile) { alert("Please select a PDF file first."); return; }

    if (!canUploadPdf) {
      const used = getPdfCount(user.uid);
      if (used >= PDF_FREE_LIMIT) {
        navigate("/pricing");
        return;
      }
    }

    if (!checkAndIncrementLimit(user)) return;

    setLoadingMsg("Uploading PDF…");
    setStatus("loading");

    try {
      const uploaded = await uploadPdfToGemini(pdfFile);

      setLoadingMsg("Reading document…");

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      });

      const result = await sendWithRetry(() =>
        model.generateContent([
          { fileData: { fileUri: uploaded.uri, mimeType: "application/pdf" } },
          { text: QUIZ_PROMPT },
        ])
      );

      const normalized = parseMcqs(result.response.text());
      const entry = {
        id: Date.now(),
        title: `${pdfFile.name.replace(/\.pdf$/i, "")} – ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`,
        source: "pdf",
        mcqs: normalized,
        date: todayKey(),
      };

      if (!canUploadPdf) {
        const newCount = incrementPdfCount(user.uid);
        setPdfUsed(newCount);
      }

      setQuizHistory(pushToHistory(user.uid, entry));
      startQuiz(normalized, entry);
    } catch (err) {
      console.error(err);
      alert(`Failed: ${err.message || "Please try again."}`);
      setStatus("idle");
    }
  };

  // ── Replay saved quiz ─────────────────────────────────────────────────────

  const replayQuiz = (entry) => {
    clearTimeout(feedbackTimer.current);
    startQuiz(entry.mcqs, entry);
  };

  // ── Answer handler ────────────────────────────────────────────────────────

  const handleAnswer = (idx) => {
    if (status !== "playing") return;
    clearTimeout(feedbackTimer.current);

    const current = mcqs[currentIndex];
    const correct = idx === current.correctIndex;
    setSelectedIdx(idx);
    setIsCorrect(correct);
    setStatus("feedback");
    if (correct) setScore((s) => s + 1);
    setAnswerHistory((h) => [
      ...h,
      { question: current.question, selectedIdx: idx, correctIndex: current.correctIndex, correct },
    ]);

    feedbackTimer.current = setTimeout(() => {
      const next = currentIndex + 1;
      if (next < mcqs.length) {
        setCurrentIndex(next);
        setSelectedIdx(null);
        setIsCorrect(null);
        setStatus("playing");
      } else {
        setStatus("finished");
      }
    }, 1400);
  };

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = () => {
    clearTimeout(feedbackTimer.current);
    setParagraph("");
    setYoutubeUrl("");
    setPdfFile(null);
    setMcqs([]);
    setCurrentIndex(0);
    setScore(0);
    setAnswerHistory([]);
    setSelectedIdx(null);
    setIsCorrect(null);
    setCurrentQuizEntry(null);
    setStatus("idle");
  };

  // ── File handlers ─────────────────────────────────────────────────────────

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > PDF_SIZE_LIMIT) {
      alert(`PDF must be under ${PDF_SIZE_LIMIT_MB}MB.`);
      return;
    }
    setPdfFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      if (file.size > PDF_SIZE_LIMIT) { alert(`PDF must be under ${PDF_SIZE_LIMIT_MB}MB.`); return; }
      setPdfFile(file);
    }
  };

  // ── IDLE ──────────────────────────────────────────────────────────────────

  if (status === "idle") {
    const headerText = {
      text:    { main: "Paste Any Text,",    sub: "Paste lecture notes, textbook paragraphs, or any content — we'll turn it into MCQs in seconds." },
      youtube: { main: "Paste a YouTube Link,", sub: "Drop any educational video URL — we'll pull the transcript and build a quiz from it." },
      pdf:     { main: "Upload a PDF,",      sub: "Upload your notes or textbook PDF — Gemini reads it natively and generates questions." },
    }[inputMode];

    return (
      <div className="min-h-screen bg-gray-950 text-white relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-col lg:flex-row gap-0 items-start">
          <div className="flex-1 min-w-0 w-full lg:order-2 p-4 pt-8">
          <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {headerText.main}<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Get a Quiz Instantly
              </span>
            </h1>
            <p className="text-gray-400 text-sm">{headerText.sub}</p>
            {remaining !== null && remaining !== Infinity && (
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-amber-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                </svg>
                {remaining} quiz generation{remaining !== 1 ? "s" : ""} remaining today
              </div>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-4 gap-1">
            {/* Text */}
            <button
              onClick={() => setInputMode("text")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                inputMode === "text"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Paste Text
            </button>

            {/* YouTube */}
            <button
              onClick={() => setInputMode("youtube")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                inputMode === "youtube"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube
              {!canUploadPdf && (
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                  {Math.max(0, YT_FREE_LIMIT - ytUsed)} left
                </span>
              )}
            </button>

            {/* PDF */}
            <button
              onClick={() => setInputMode("pdf")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                inputMode === "pdf"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Upload PDF
              {!canUploadPdf && (
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">Pro</span>
              )}
            </button>
          </div>

          {/* Input Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            {inputMode === "text" ? (
              <>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your text / notes
                  <span className="ml-2 text-xs text-gray-600">
                    (only first {TEXT_CHAR_LIMIT.toLocaleString()} chars used)
                  </span>
                </label>
                <textarea
                  className="w-full bg-gray-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/30 transition resize-none"
                  value={paragraph}
                  onChange={(e) => setParagraph(e.target.value)}
                  rows={8}
                  placeholder="Paste your paragraph, lecture notes, or textbook chapter here..."
                />
                <div className="flex items-center justify-between mt-2 mb-4">
                  <span className={`text-xs ${paragraph.length > TEXT_CHAR_LIMIT ? "text-amber-400" : "text-gray-600"}`}>
                    {paragraph.length} / {TEXT_CHAR_LIMIT} chars
                    {paragraph.length > TEXT_CHAR_LIMIT && " — will be trimmed"}
                  </span>
                  <button
                    onClick={() => setParagraph("")}
                    className="text-xs text-gray-500 hover:text-gray-300 transition"
                  >
                    Clear
                  </button>
                </div>
                <button
                  onClick={generateFromText}
                  disabled={!paragraph.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-cyan-500/20"
                >
                  Generate Quiz →
                </button>
              </>
            ) : inputMode === "youtube" ? (
              (!canUploadPdf && ytUsed >= YT_FREE_LIMIT) ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">YouTube quiz limit reached</p>
                    <p className="text-gray-400 text-sm mt-1">
                      You've used your {YT_FREE_LIMIT} free YouTube quiz generations. Upgrade to Pro for unlimited access.
                    </p>
                  </div>
                  <a
                    href="/pricing"
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-xl font-semibold text-white text-sm transition-all shadow-lg"
                  >
                    Upgrade to Pro →
                  </a>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-400">
                      YouTube video URL
                    </label>
                    {!canUploadPdf && (
                      <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        {YT_FREE_LIMIT - ytUsed} of {YT_FREE_LIMIT} free uses left
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </span>
                    <input
                      type="url"
                      className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 transition"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      onKeyDown={(e) => { if (e.key === "Enter") generateFromYoutube(); }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 mb-5">
                    Works best with educational videos that have captions enabled. Transcript is fetched server-side.
                  </p>
                  <button
                    onClick={generateFromYoutube}
                    disabled={!youtubeUrl.trim()}
                    className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-red-500/20"
                  >
                    Generate Quiz from Video →
                  </button>
                </>
              )
            ) : (canUploadPdf || pdfUsed < PDF_FREE_LIMIT) ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-400">
                    Your PDF file
                    <span className="ml-2 text-xs text-gray-600">(max {PDF_SIZE_LIMIT_MB} MB)</span>
                  </label>
                  {!canUploadPdf && (
                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      {PDF_FREE_LIMIT - pdfUsed} of {PDF_FREE_LIMIT} free uses left
                    </span>
                  )}
                </div>
                {/* Drop zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => !pdfFile && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    pdfFile
                      ? "border-cyan-500/50 bg-cyan-500/5"
                      : "border-white/10 hover:border-cyan-500/30 hover:bg-white/5 cursor-pointer"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  {pdfFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-white truncate max-w-xs">{pdfFile.name}</p>
                      <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="text-xs text-red-400 hover:text-red-300 transition mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-sm">
                        Drag & drop your PDF here, or{" "}
                        <span className="text-cyan-400 underline">browse</span>
                      </p>
                      <p className="text-xs text-gray-600">PDF files up to {PDF_SIZE_LIMIT_MB} MB</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={generateFromPdf}
                  disabled={!pdfFile}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-cyan-500/20"
                >
                  Generate Quiz from PDF →
                </button>
              </>
            ) : (
              /* Subscription gate */
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">PDF Upload is a Pro feature</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Upgrade to Pro or Premium to upload PDFs and generate quizzes from your notes.
                  </p>
                </div>
                <a
                  href="/pricing"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl font-semibold text-white text-sm transition-all shadow-lg"
                >
                  Upgrade to Pro →
                </a>
              </div>
            )}
          </div>
          </div>

          </div>

          {/* Quiz History Sidebar */}
          {quizHistory.length > 0 && (
            <div className="lg:w-64 w-full shrink-0 lg:order-1 lg:pl-4 lg:pr-4 lg:pt-8 lg:border-r lg:border-white/10 lg:min-h-screen">
              {/* Header with toggle */}
              <button
                onClick={() => setHistoryOpen((o) => !o)}
                className="w-full flex items-center justify-between mb-3 group"
              >
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                  Recent Quizzes
                  <span className="ml-2 text-gray-600 normal-case font-normal">({quizHistory.length})</span>
                </h2>
                <svg
                  className={`w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-all duration-300 ${historyOpen ? "rotate-0" : "-rotate-180"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>

              {/* Collapsible list */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: historyOpen ? `${quizHistory.length * 120}px` : "0px", opacity: historyOpen ? 1 : 0 }}
              >
                <div className="space-y-3">
                  {quizHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <SourceIcon source={entry.source} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{entry.title}</p>
                          <p className="text-xs text-gray-500">
                            {entry.date} &nbsp;·&nbsp; {entry.mcqs.length} questions
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => replayQuiz(entry)}
                        className="mt-3 w-full px-3 py-1.5 text-xs font-semibold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 rounded-lg transition-all"
                      >
                        Play Again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LOADING ────────────────────────────────────────────────────────────────

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <SpinnerLoad />
        <p className="text-gray-400 text-sm animate-pulse">{loadingMsg}</p>
      </div>
    );
  }

  // ── FINISHED ──────────────────────────────────────────────────────────────

  if (status === "finished") {
    const pct = Math.round((score / mcqs.length) * 100);
    const grade =
      pct >= 80 ? { label: "Excellent!", color: "text-emerald-400" }
      : pct >= 60 ? { label: "Good job!", color: "text-cyan-400" }
      : pct >= 40 ? { label: "Keep practicing!", color: "text-amber-400" }
      : { label: "Keep going!", color: "text-red-400" };

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <ProgressRing value={score} total={mcqs.length} />
                <div className="absolute inset-0 flex items-center justify-center rotate-90">
                  <span className="text-lg font-bold">{pct}%</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-1">{score} / {mcqs.length}</h2>
            <p className={`text-lg font-semibold ${grade.color}`}>{grade.label}</p>
            <p className="text-gray-500 text-sm mt-1">
              {score} correct &nbsp;·&nbsp; {mcqs.length - score} incorrect
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 space-y-3 max-h-64 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Answer Breakdown</h3>
            {answerHistory.map((h, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  h.correct ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                }`}
              >
                <span className={`text-sm font-bold mt-0.5 shrink-0 ${h.correct ? "text-emerald-400" : "text-red-400"}`}>
                  {h.correct ? "✓" : "✗"}
                </span>
                <div className="text-sm text-gray-300 leading-snug">{h.question}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            {currentQuizEntry && (
              <button
                onClick={() => replayQuiz(currentQuizEntry)}
                className="flex-1 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-semibold text-white transition-all"
              >
                Play Again
              </button>
            )}
            <button
              onClick={reset}
              className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-semibold text-white transition-all shadow-lg"
            >
              New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING / FEEDBACK ────────────────────────────────────────────────────

  const current = mcqs[currentIndex];
  const progress = (currentIndex / mcqs.length) * 100;

  const optionClass = (idx) => {
    if (status === "feedback") {
      if (idx === current.correctIndex) return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
      if (idx === selectedIdx && !isCorrect) return "border-red-500 bg-red-500/10 text-red-300";
      return "border-white/5 bg-white/2 text-gray-500";
    }
    return "border-white/10 bg-white/5 text-gray-200 hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
              {currentIndex + 1}
            </div>
            <span className="text-gray-400 text-sm">of {mcqs.length} questions</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold">{score}</span>
          </div>
        </div>

        <div className="h-1.5 bg-gray-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-5">
          <p className="text-xl md:text-2xl font-semibold leading-relaxed text-white">
            {current.question}
          </p>
        </div>

        <div className="space-y-3">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={status === "feedback"}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 text-left ${optionClass(idx)}`}
            >
              <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold shrink-0">
                {["A", "B", "C", "D"][idx]}
              </span>
              <span className="text-sm md:text-base leading-snug">{opt}</span>
              {status === "feedback" && idx === current.correctIndex && (
                <svg className="w-5 h-5 text-emerald-400 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === "feedback" && idx === selectedIdx && !isCorrect && (
                <svg className="w-5 h-5 text-red-400 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {status === "feedback" && (
          <div className={`mt-4 px-5 py-3 rounded-xl border text-sm font-medium ${
            isCorrect
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}>
            {isCorrect
              ? "✓ Correct! Well done."
              : `✗ The correct answer was ${["A", "B", "C", "D"][current.correctIndex]}.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenAI;
