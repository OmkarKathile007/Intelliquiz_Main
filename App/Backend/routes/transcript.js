const express = require("express");
const router = express.Router();

const YT_ID_RE = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
const TRANSCRIPT_CHAR_LIMIT = 4000;

function extractVideoId(url) {
  const m = url.match(YT_ID_RE);
  return m ? m[1] : null;
}

// POST /api/transcript/youtube
router.post("/youtube", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ msg: "Missing or invalid URL." });
  }

  const videoId = extractVideoId(url.trim());
  if (!videoId) {
    return res.status(400).json({ msg: "Could not find a valid YouTube video ID in that URL." });
  }

  try {
    const { YoutubeTranscript } = require("youtube-transcript");
    const segments = await YoutubeTranscript.fetchTranscript(videoId);

    if (!segments || segments.length === 0) {
      return res.status(422).json({
        msg: "No transcript found for this video. Make sure the video has captions/subtitles enabled.",
      });
    }

    const fullText = segments
      .map((s) => s.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    const transcript = fullText.slice(0, TRANSCRIPT_CHAR_LIMIT);

    res.json({ transcript, videoId });
  } catch (err) {
    console.error("[transcript/youtube]", err.message || err);

    const knownNoCaption =
      err.message?.toLowerCase().includes("disabled") ||
      err.message?.toLowerCase().includes("could not get") ||
      err.message?.toLowerCase().includes("no transcript");

    res.status(knownNoCaption ? 422 : 500).json({
      msg: knownNoCaption
        ? "Transcript unavailable. The video may have captions disabled or be restricted."
        : "Failed to fetch the transcript. Please try again.",
    });
  }
});

module.exports = router;
