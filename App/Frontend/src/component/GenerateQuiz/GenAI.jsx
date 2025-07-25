


import React, { useState } from 'react';
import SpinnerLoad from './SpinnerLoad';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuth } from "firebase/auth";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const QUIZ_LIMIT = 5;

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// Insecure client‑side limit using localStorage
function canGenerateQuiz(uid) {
  const key = `quizLimit_${uid}`;
  const today = getTodayDateString();
  const raw = localStorage.getItem(key);
  let data = raw ? JSON.parse(raw) : { date: today, count: 0 };

  if (data.date !== today) {
    data = { date: today, count: 0 };
  }

  if (data.count < QUIZ_LIMIT) {
    data.count += 1;
    localStorage.setItem(key, JSON.stringify(data));
    return { allowed: true, remaining: QUIZ_LIMIT - data.count };
  } else {
    return { allowed: false, remaining: 0 };
  }
}

const GenAI = () => {
  const [paragraph, setParagraph] = useState("");
  const [status, setStatus] = useState("idle"); // "idle", "loading", "playing", "finished"
  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(QUIZ_LIMIT);

  const generateQuiz = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first");
      return;
    }

    const { allowed, remaining: rem } = canGenerateQuiz(user.uid);
    setRemaining(rem);
    if (!allowed) {
      alert("Daily limit reached! Come back tomorrow.");
      return;
    }

    if (!paragraph.trim()) {
      alert("Please enter a valid paragraph.");
      return;
    }

    setStatus("loading");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const generationConfig = { temperature: 1, topP: 0.95, topK: 40, maxOutputTokens: 8192 };
      const chatSession = model.startChat({ generationConfig, history: [] });

      const prompt = `You are an assistant that creates multiple-choice quizzes from a given paragraph. Output valid JSON only in this format:\n{\n  \"mcqs\": [ ... ]\n}\nParagraph: \"${paragraph}\"`;
      const result = await chatSession.sendMessage(prompt);
      const text = result.response.text();
      const trimmed = text.substring(7, text.length - 3);
      const data = JSON.parse(trimmed);

      setMcqs(
        data.mcqs.map((q) => ({
          question: q.mcq || q.question || "",
          options: q.options,
          correct: q.correct,
        }))
      );
      setCurrentIndex(0);
      setScore(0);
      setStatus("playing");
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Please try again.");
      setStatus("idle");
    }
  };

  const handleAnswer = (key) => {
    const current = mcqs[currentIndex];
    if (key === current.correct) {
      setScore((prev) => prev + 1);
    }
    const next = currentIndex + 1;
    if (next < mcqs.length) {
      setCurrentIndex(next);
    } else {
      setStatus("finished");
    }
  };

  const reset = () => {
    setParagraph("");
    setMcqs([]);
    setCurrentIndex(0);
    setScore(0);
    setStatus("idle");
    setRemaining(QUIZ_LIMIT);
  };

  if (status === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* <div className="mb-4 text-center font-medium">
            You have {remaining} quiz{remaining === 1 ? '' : 'zes'} left today.
          </div> */}
          <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">Paste Your Paragraph</h1>
          <textarea
            className="w-full bg-transparent p-4 border-2 border-gray-300 rounded-lg text-white mb-6"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            rows={8}
            placeholder="Enter your content here..."
          />
          <button
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
            onClick={generateQuiz}
          >
            Generate Quiz
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <SpinnerLoad />
      </div>
    );
  }

  if (status === "playing") {
    const { question, options } = mcqs[currentIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-6">
          <div className="flex justify-between mb-4">
            <span className="text-sm font-medium">Score: {score}</span>
            <span className="text-sm font-medium">Remaining: {remaining}</span>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            Question {currentIndex + 1} of {mcqs.length}
          </h2>
          <p className="text-lg mb-6">{question}</p>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(options).map(([key, text],index) => (
              <button
                key={key}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md"
                onClick={() => handleAnswer(key)}
              >
                <span className="font-bold uppercase mr-2">{index+1}.</span>
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Quiz Completed!</h2>
        <p className="text-lg mb-6">
          Your Score: {score} / {mcqs.length}
        </p>
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
          onClick={reset}
        >
          Create Another Quiz
        </button>
      </div>
    </div>
  );
};

export default GenAI;
