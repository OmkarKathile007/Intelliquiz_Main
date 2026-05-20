// import React, { useState } from 'react';
// import SpinnerLoad from './SpinnerLoad';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { getAuth } from "firebase/auth";

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(API_KEY);

// const QUIZ_LIMIT = 5;

// // --- Helper: Exponential Backoff Retry Logic ---
// async function sendMessageWithRetry(chatSession, prompt, retries = 3, delay = 2000) {
//   try {
//     return await chatSession.sendMessage(prompt);
//   } catch (error) {
//     // Check if the error is a Quota/Rate Limit error (429) or Server Error (503)
//     const isRetryable = error.message.includes("429") || error.message.includes("503");

//     if (retries > 0 && isRetryable) {
//       console.warn(`Quota hit. Retrying in ${delay}ms... (Attempts left: ${retries})`);
      
//       // Wait for the specified delay
//       await new Promise((resolve) => setTimeout(resolve, delay));
      
//       // Retry with double the delay (2s -> 4s -> 8s)
//       return sendMessageWithRetry(chatSession, prompt, retries - 1, delay * 2);
//     } else {
//       // No retries left or non-retryable error
//       throw error;
//     }
//   }
// }

// function getTodayDateString() {
//   return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
// }

// // Insecure client‑side limit using localStorage
// function canGenerateQuiz(uid) {
//   const key = `quizLimit_${uid}`;
//   const today = getTodayDateString();
//   const raw = localStorage.getItem(key);
//   let data = raw ? JSON.parse(raw) : { date: today, count: 0 };

//   if (data.date !== today) {
//     data = { date: today, count: 0 };
//   }

//   if (data.count < QUIZ_LIMIT) {
//     data.count += 1;
//     localStorage.setItem(key, JSON.stringify(data));
//     return { allowed: true, remaining: QUIZ_LIMIT - data.count };
//   } else {
//     return { allowed: false, remaining: 0 };
//   }
// }

// const GenAI = () => {
//   const [paragraph, setParagraph] = useState("");
//   const [status, setStatus] = useState("idle"); // "idle", "loading", "playing", "finished"
//   const [mcqs, setMcqs] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [remaining, setRemaining] = useState(QUIZ_LIMIT);

//   const generateQuiz = async () => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) {
//       alert("Please log in first");
//       return;
//     }

//     // Check limits BEFORE calling the API
//     const rawLimitCheck = canGenerateQuiz(user.uid);
//     if (!rawLimitCheck.allowed) {
//       alert("Daily limit reached! Come back tomorrow.");
//       setRemaining(0);
//       return;
//     }
    
//     // Note: We only decrement the UI counter if the generation actually succeeds 
//     // to be fair to users, but your current logic decrements it on attempt.
//     // I kept your logic as-is, just updating the state.
//     setRemaining(rawLimitCheck.remaining);

//     if (!paragraph.trim()) {
//       alert("Please enter a valid paragraph.");
//       return;
//     }

//     setStatus("loading");
//     try {
//       // double check your model name here. 
//       // Use "gemini-1.5-flash" or "gemini-2.0-flash-exp" if 2.5 fails.
//       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
      
//       const generationConfig = { 
//         temperature: 1, 
//         topP: 0.95, 
//         topK: 40, 
//         maxOutputTokens: 8192,
//         responseMimeType: "application/json" // Force JSON mode for better stability
//       };
      
//       const chatSession = model.startChat({ generationConfig, history: [] });

//       const prompt = `You are an assistant that creates multiple-choice quizzes from a given paragraph. Output valid JSON only in this format:\n{\n  \"mcqs\": [ ... ]\n}\nParagraph: \"${paragraph}\"`;

//       // --- NEW: USE THE RETRY FUNCTION ---
//       const result = await sendMessageWithRetry(chatSession, prompt);
      
//       const text = result.response.text();
      
//       // Cleanup JSON: Sometimes models return markdown blocks (```json ... ```)
//       // This regex extracts purely the JSON object/array
//       const jsonMatch = text.match(/\{[\s\S]*\}/);
//       const jsonString = jsonMatch ? jsonMatch[0] : text;
      
//       const data = JSON.parse(jsonString);

//       setMcqs(
//         data.mcqs.map((q) => ({
//           question: q.mcq || q.question || "",
//           options: q.options,
//           correct: q.correct,
//         }))
//       );
//       setCurrentIndex(0);
//       setScore(0);
//       setStatus("playing");
//     } catch (error) {
//       console.error("Error generating quiz:", error);
//       alert("Failed to generate quiz (Server might be busy). Please try again.");
//       setStatus("idle");
//     }
//   };

//   const handleAnswer = (key) => {
//     const current = mcqs[currentIndex];
//     if (key === current.correct) {
//       setScore((prev) => prev + 1);
//     }
//     const next = currentIndex + 1;
//     if (next < mcqs.length) {
//       setCurrentIndex(next);
//     } else {
//       setStatus("finished");
//     }
//   };

//   const reset = () => {
//     setParagraph("");
//     setMcqs([]);
//     setCurrentIndex(0);
//     setScore(0);
//     setStatus("idle");
//     // We don't reset 'remaining' here because it persists for the day
//   };

//   // ... (Rest of your UI render code remains exactly the same)
//   if (status === "idle") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
//         <div className="w-full max-w-2xl">
//           <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">Paste Your Paragraph</h1>
//           <textarea
//             className="w-full bg-transparent p-4 border-2 border-gray-300 rounded-lg text-white mb-6"
//             value={paragraph}
//             onChange={(e) => setParagraph(e.target.value)}
//             rows={8}
//             placeholder="Enter your content here..."
//           />
//           <button
//             className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
//             onClick={generateQuiz}
//           >
//             Generate Quiz
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
//         <SpinnerLoad />
//       </div>
//     );
//   }

//   if (status === "playing") {
//     const { question, options } = mcqs[currentIndex];
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
//         <div className="w-full max-w-2xl bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-6">
//           <div className="flex justify-between mb-4">
//             <span className="text-sm font-medium">Score: {score}</span>
//             <span className="text-sm font-medium">Remaining: {remaining}</span>
//           </div>
//           <h2 className="text-xl font-semibold mb-4">
//             Question {currentIndex + 1} of {mcqs.length}
//           </h2>
//           <p className="text-lg mb-6">{question}</p>
//           <div className="grid grid-cols-1 gap-4">
//             {Object.entries(options).map(([key, text], index) => (
//               <button
//                 key={key}
//                 className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md"
//                 onClick={() => handleAnswer(key)}
//               >
//                 <span className="font-bold uppercase mr-2">{index + 1}.</span>
//                 {text}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-6 text-center">
//         <h2 className="text-2xl font-semibold mb-4">Quiz Completed!</h2>
//         <p className="text-lg mb-6">
//           Your Score: {score} / {mcqs.length}
//         </p>
//         <button
//           className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
//           onClick={reset}
//         >
//           Create Another Quiz
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GenAI;


import React, { useState, useEffect, useRef } from "react";
import SpinnerLoad from "./SpinnerLoad";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuth } from "firebase/auth";
import { useSubscription } from "../../context/SubscriptionContext";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// --- Retry with exponential backoff ---
async function sendWithRetry(chatSession, prompt, retries = 3, delay = 2000) {
  try {
    return await chatSession.sendMessage(prompt);
  } catch (err) {
    const retryable = err.message?.includes("429") || err.message?.includes("503");
    if (retries > 0 && retryable) {
      await new Promise((r) => setTimeout(r, delay));
      return sendWithRetry(chatSession, prompt, retries - 1, delay * 2);
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

// Progress ring component
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

const GenAI = () => {
  const { getLimit } = useSubscription();
  const dailyLimit = getLimit("aiQuizzesPerDay"); // Infinity for paid plans

  const [paragraph, setParagraph] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | playing | feedback | finished
  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [history, setHistory] = useState([]);
  const feedbackTimer = useRef(null);

  // Set initial remaining on mount
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    if (dailyLimit === Infinity) { setRemaining(Infinity); return; }
    const data = getUsageData(user.uid);
    setRemaining(Math.max(0, dailyLimit - data.count));
  }, [dailyLimit]);

  const generateQuiz = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) { alert("Please log in first."); return; }
    if (!paragraph.trim()) { alert("Please enter some text first."); return; }

    if (dailyLimit !== Infinity) {
      const data = getUsageData(user.uid);
      if (data.count >= dailyLimit) {
        alert(`Daily limit of ${dailyLimit} quizzes reached. Come back tomorrow or upgrade your plan!`);
        return;
      }
      const updated = incrementUsage(user.uid);
      setRemaining(Math.max(0, dailyLimit - updated.count));
    }

    setStatus("loading");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const generationConfig = {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      };
      const chatSession = model.startChat({ generationConfig, history: [] });

      const prompt = `You are a quiz generator. Given the paragraph below, create 5 multiple-choice questions.

RULES:
- Each question must have exactly 4 options (A, B, C, D)
- exacty one option must be correct
- correctIndex must be 0-based integer (0=A, 1=B, 2=C, 3=D)
- Output ONLY valid JSON, no markdown, no explanation

OUTPUT FORMAT:
{
  "mcqs": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0
    }
  ]
}

PARAGRAPH:
"${paragraph.slice(0, 3000)}"`;

      const result = await sendWithRetry(chatSession, prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);

      const normalized = data.mcqs
        .filter((q) => Array.isArray(q.options) && q.options.length === 4)
        .map((q) => ({
          question: q.question || "",
          options: q.options,
          correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
        }));

      if (normalized.length === 0) throw new Error("No valid questions generated.");

      setMcqs(normalized);
      setCurrentIndex(0);
      setScore(0);
      setHistory([]);
      setStatus("playing");
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz. Please try again.");
      setStatus("idle");
    }
  };

  const handleAnswer = (idx) => {
    if (status !== "playing") return;
    clearTimeout(feedbackTimer.current);

    const current = mcqs[currentIndex];
    const correct = idx === current.correctIndex;

    setSelectedIdx(idx);
    setIsCorrect(correct);
    setStatus("feedback");

    const newScore = score + (correct ? 1 : 0);
    if (correct) setScore(newScore);
    setHistory((h) => [...h, { question: current.question, selectedIdx: idx, correctIndex: current.correctIndex, correct }]);

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

  const reset = () => {
    clearTimeout(feedbackTimer.current);
    setParagraph("");
    setMcqs([]);
    setCurrentIndex(0);
    setScore(0);
    setHistory([]);
    setSelectedIdx(null);
    setIsCorrect(null);
    setStatus("idle");
  };

  // ── IDLE ──────────────────────────────────────────────────────────────────
  if (status === "idle") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-2xl">
          <div className="text-center mb-10">
            {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Quiz Generator
            </div> */}
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Paste Any Text,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Get a Quiz Instantly
              </span>
            </h1>
            <p className="text-gray-400">
              Paste lecture notes, textbook paragraphs, or any content, we'll turn it into MCQs in seconds.
            </p>
            {remaining !== null && remaining !== Infinity && (
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-amber-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                </svg>
                {remaining} quiz generation{remaining !== 1 ? "s" : ""} remaining today
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Your text / notes
            </label>
            <textarea
              className="w-full bg-gray-900/60 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/30 transition resize-none"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              rows={8}
              placeholder="Paste your paragraph, lecture notes, or textbook chapter here..."
            />
            <div className="flex items-center justify-between mt-2 mb-4">
              <span className="text-xs text-gray-600">{paragraph.length} characters</span>
              <button onClick={() => setParagraph("")} className="text-xs text-gray-500 hover:text-gray-300 transition">
                Clear
              </button>
            </div>
            <button
              onClick={generateQuiz}
              disabled={!paragraph.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-cyan-500/20"
            >
              Generate Quiz →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <SpinnerLoad />
      </div>
    );
  }

  // ── FINISHED ──────────────────────────────────────────────────────────────
  if (status === "finished") {
    const pct = Math.round((score / mcqs.length) * 100);
    const grade = pct >= 80 ? { label: "Excellent!", color: "text-emerald-400" }
                : pct >= 60 ? { label: "Good job!", color: "text-cyan-400" }
                : pct >= 40 ? { label: "Keep practicing!", color: "text-amber-400" }
                : { label: "Keep going!", color: "text-red-400" };

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Score card */}
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

          {/* Answer breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 space-y-3 max-h-64 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Answer Breakdown</h3>
            {history.map((h, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${h.correct ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                <span className={`text-sm font-bold mt-0.5 ${h.correct ? "text-emerald-400" : "text-red-400"}`}>
                  {h.correct ? "✓" : "✗"}
                </span>
                <div className="text-sm text-gray-300 leading-snug">{h.question}</div>
              </div>
            ))}
          </div>

          <button
            onClick={reset}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-semibold text-white transition-all shadow-lg"
          >
            Create Another Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── PLAYING / FEEDBACK ────────────────────────────────────────────────────
  const current = mcqs[currentIndex];
  const progress = ((currentIndex) / mcqs.length) * 100;

  const optionClass = (idx) => {
    if (status === "feedback") {
      if (idx === current.correctIndex)
        return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
      if (idx === selectedIdx && !isCorrect)
        return "border-red-500 bg-red-500/10 text-red-300";
      return "border-white/5 bg-white/2 text-gray-500";
    }
    return "border-white/10 bg-white/5 text-gray-200 hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header bar */}
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

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-5">
          <p className="text-xl md:text-2xl font-semibold leading-relaxed text-white">
            {current.question}
          </p>
        </div>

        {/* Options */}
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

        {/* Feedback banner */}
        {status === "feedback" && (
          <div className={`mt-4 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
            isCorrect
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}>
            {isCorrect ? "✓ Correct! Well done." : `✗ The correct answer was ${["A", "B", "C", "D"][current.correctIndex]}.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenAI;
