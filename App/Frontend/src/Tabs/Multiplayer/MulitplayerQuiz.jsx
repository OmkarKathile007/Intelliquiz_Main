

// import React, { useState, useEffect } from 'react';
// import { FaTrophy, FaGamepad } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import io from 'socket.io-client';
// import ConfettiAnimation from '../../component/magicui/ConfettiAnimation';
// import ScoreBoard from './ScoreBoard';

// // // http://localhost:3000  VITE_REACT_APP_BACKEND_BASEURL=http://localhost:3000
// // // const socket = io("ws://localhost:5000");

// const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL);

// export default function MultiplayerQuiz() {
//   // User & room info
//   const [name, setName] = useState('');
//   const [room, setRoom] = useState('');
//   const [joined, setJoined] = useState(false);

//   // Quiz state
//   const [question, setQuestion] = useState('');
//   const [options, setOptions] = useState([]);
//   const [answered, setAnswered] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [seconds, setSeconds] = useState(0);
//   const [scores, setScores] = useState([]);
//   const [winner, setWinner] = useState('');

//   // Handle form submit (join room)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (name.trim() && room.trim()) {
//       socket.emit('joinRoom', room, name);
//       setJoined(true);
//     }
//   };

//   // Countdown timer effect
//   useEffect(() => {
//     if (seconds <= 0) return;
//     const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
//     return () => clearInterval(timer);
//   }, [seconds]);

//   // Setup socket listeners
//   useEffect(() => {
//     socket.on('message', (msg) => toast.info(msg, { position: 'top-right' }));

//     socket.on('newQuestion', (data) => {
//       setQuestion(data.question);
//       setOptions(data.answers);
//       setAnswered(false);
//       setSelectedIndex(null);
//       setSeconds(data.timer);
//     });

//     socket.on('answerResult', (data) => {
//       if (data.isCorrect) {
//         toast.success(`${data.playerName} got it right!`, { position: 'bottom-center', autoClose: 1500 });
//       }
//       setScores(data.scores);
//     });

//     socket.on('gameOver', (data) => {
//       setWinner(data.winner);
//     });

//     return () => {
//       socket.off('message');
//       socket.off('newQuestion');
//       socket.off('answerResult');
//       socket.off('gameOver');
//     };
//   }, []);

//   // Handle answer click
//   const handleAnswer = (idx) => {
//     if (answered) return;
//     setSelectedIndex(idx);
//     socket.emit('submitAnswer', room, idx);
//     setAnswered(true);
//   };

//   // Winner screen
//   if (winner) {
//     return (
//       <div className="bg-black min-h-screen w-screen flex flex-col items-center justify-center p-6 text-white">
//         <ConfettiAnimation name={winner} />
//         <h1 className="text-5xl md:text-7xl font-extrabold mb-6">Winner is {winner}!</h1>
//         <button
//           className="mt-8 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition"
//           onClick={() => window.location.reload()}
//         >
//           Play Again
//         </button>
//       </div>
      
      
//     );
//   }

//   // Main UI
//   return (
//     <div className="bg-black min-h-screen flex items-center justify-center p-6">
//       <ToastContainer />

//       {!joined ? (
//         <div className="relative bg-neutral-800 border border-gray-500 bg-opacity-60 backdrop-blur-lg rounded-2xl  sm:w-3/4 md:w-1/2  p-6 sm:p-8 text-white shadow-xl mx-auto">
//       {/* Floating icons */}
//       <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
//         <FaTrophy className="text-yellow-400 text-2xl sm:text-3xl" />
//         <FaGamepad className="text-blue-400 text-2xl sm:text-3xl" />
//       </div>

//       <h1 className="mt-8 text-center text-lg sm:text-xl md:text-2xl font-semibold">Join Our Exciting</h1>
//       <h2 className="mt-2 text-center text-2xl sm:text-3xl md:text-4xl font-bold">
//         <span className="text-blue-400">Multiplayer</span>{' '}
//         <span className="text-yellow-400">Battles Mode</span>
//       </h2>

//       <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Enter your name"
//             required
//             className="w-full pl-10 pr-4 py-2 sm:py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <FaGamepad className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
//         </div>

//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Enter room no"
//             required
//             className="w-full pl-10 pr-4 py-2 sm:py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             value={room}
//             onChange={(e) => setRoom(e.target.value)}
//           />
//           <FaTrophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition"
//         >
//           JOIN ROOM
//         </button>
//       </form>

//       <div className="mt-6 flex justify-center space-x-2">
//         <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></span>
//         <span className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></span>
//         <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-600 rounded-full"></span>
//       </div>
//     </div>
        
//       ) : (
//         <div className="bg-neutral-800 bg-opacity-60 backdrop-blur-lg rounded-2xl w-full max-w-2xl p-6 text-white shadow-xl">
//           <h2 className="text-center text-2xl font-bold mb-2">Room: {room}</h2>
//           <div className="text-center mb-4">
//             Time Left: <span className="font-semibold">{seconds}s</span>
//           </div>

//           {question ? (
//             <>
//               <div className="bg-cyan-50 text-black rounded-lg p-4 mb-4">
//                 <p className="text-lg md:text-xl">{question}</p>
//               </div>
//               <ul className="space-y-2">
//                 {options.map((opt, i) => (
//                   <li key={i}>
//                     <button
//                       onClick={() => handleAnswer(i)}
//                       disabled={answered}
//                       className={`w-full text-left px-4 py-3 rounded-lg border-2 border-transparent transition hover:border-cyan-300 focus:outline-none ${
//                         selectedIndex === i
//                           ? 'bg-cyan-500 text-white border-cyan-500'
//                           : 'bg-white text-black'
//                       }`}
//                     >
//                       {opt}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </>
//           ) : (
//             <div className="text-center py-8">Loading question...</div>
//           )}

//           {/* <div className="mt-6 bg-white border-2 border-green-300 bg-opacity-20 rounded-lg p-4 max-h-48 overflow-y-auto">
//             {scores.map((p, idx) => (
//               <div key={idx} className="flex justify-between mb-2">
//                 <span>{idx + 1}. {p.name}</span>
//                 <span className={p.score >= 0 ? 'text-green-400' : 'text-red-400'}>
//                   {p.score}
//                 </span>
//               </div>
//             ))}
//           </div> */}
//           <ScoreBoard scores={scores}/>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ConfettiAnimation from "../../component/magicui/ConfettiAnimation";
import ScoreBoard from "./ScoreBoard";

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL, { autoConnect: true });
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ── Helpers ──────────────────────────────────────────────────────────────────

async function generateMultiplayerQuestions(topic, count) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
  });

  const prompt = `Generate exactly ${count} multiple-choice quiz questions about "${topic}".

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

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);
  return data.questions;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

const TimerRing = ({ seconds, total }) => {
  const pct = total > 0 ? seconds / total : 0;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const color = pct > 0.5 ? "#06b6d4" : pct > 0.25 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="-rotate-90 absolute inset-0 w-full h-full" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} stroke="#1f2937" strokeWidth="4" fill="none" />
        <circle
          cx="26" cy="26" r={r}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
        />
      </svg>
      <span className="text-sm font-bold z-10" style={{ color }}>{seconds}</span>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export default function MultiplayerQuiz() {
  // Screens: lobby | setup | waiting | playing | finished
  const [screen, setScreen] = useState("lobby");

  // Lobby
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  // Setup (host only)
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  // Waiting room
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);

  // Game
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [correctIdx, setCorrectIdx] = useState(null);
  const [scores, setScores] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(10);
  const [winner, setWinner] = useState("");
  const [feedback, setFeedback] = useState(null); // null | {playerName, isCorrect}

  const timerRef = useRef(null);

  // ── Socket setup ──────────────────────────────────────────────────────────

  useEffect(() => {
    socket.on("hostStatus", (host) => {
      setIsHost(host);
    });

    socket.on("playerJoined", (playerList) => {
      setPlayers(playerList);
      if (playerList.length > 1) {
        toast.info(`${playerList[playerList.length - 1].name} joined!`, { position: "top-right", autoClose: 2000 });
      }
    });

    socket.on("questionsReady", () => {
      setScreen("playing");
      toast.success("Game starting!", { position: "top-center", autoClose: 1500 });
    });

    socket.on("newQuestion", (data) => {
      setScreen("playing");
      setQuestion(data.question);
      setOptions(data.answers);
      setAnswered(false);
      setSelectedIdx(null);
      setCorrectIdx(null);
      setFeedback(null);
      setTotalSeconds(data.timer);
      setSeconds(data.timer);
    });

    socket.on("answerResult", (data) => {
      setFeedback({ playerName: data.playerName, isCorrect: data.isCorrect });
      setCorrectIdx(data.correctAnswer);
      setScores(data.scores);

      if (data.isCorrect) {
        toast.success(`⚡ ${data.playerName} got it right!`, {
          position: "bottom-center",
          autoClose: 1200,
          style: { background: "#052e16", border: "1px solid #16a34a" },
        });
      }
    });

    socket.on("gameOver", (data) => {
      setWinner(data.winner);
      setScreen("finished");
    });

    socket.on("message", (msg) => {
      toast.info(msg, { position: "top-right", autoClose: 2000 });
    });

    return () => {
      socket.off("hostStatus");
      socket.off("playerJoined");
      socket.off("questionsReady");
      socket.off("newQuestion");
      socket.off("answerResult");
      socket.off("gameOver");
      socket.off("message");
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    clearInterval(timerRef.current);
    if (screen !== "playing" || seconds <= 0) return;
    timerRef.current = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timerRef.current);
  }, [seconds, screen]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name.trim() || !room.trim()) return;
    socket.emit("joinRoom", room, name);
    setScreen("setup");
  };

  const handleGenerateAndStart = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const questions = await generateMultiplayerQuestions(topic, questionCount);
      socket.emit("setRoomQuestions", room, questions);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate questions. Please try again.", { position: "top-center" });
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswer = (idx) => {
    if (answered || screen !== "playing") return;
    setSelectedIdx(idx);
    setAnswered(true);
    socket.emit("submitAnswer", room, idx);
    clearInterval(timerRef.current);
  };

  const optionStyle = (idx) => {
    if (feedback !== null) {
      if (idx === correctIdx) return "border-emerald-500 bg-emerald-500/10 text-emerald-200 scale-[1.01]";
      if (idx === selectedIdx && idx !== correctIdx) return "border-red-500 bg-red-500/10 text-red-300";
      return "border-white/5 text-gray-500";
    }
    if (selectedIdx === idx) return "border-cyan-400 bg-cyan-500/10 text-cyan-200";
    return "border-white/10 bg-white/5 text-gray-200 hover:border-cyan-500/40 hover:bg-cyan-500/5 cursor-pointer";
  };

  // ── SCREENS ───────────────────────────────────────────────────────────────

  if (screen === "finished") {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white">
        <ConfettiAnimation name={winner} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            {winner} Wins!
          </h1>
          <p className="text-gray-400 mb-8">Congratulations on an amazing game.</p>
          <ScoreBoard scores={scores} final />
          <button
            className="mt-8 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/20"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  // ── LOBBY ─────────────────────────────────────────────────────────────────

  if (screen === "lobby") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <ToastContainer />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">⚔️</div>
            <h1 className="text-3xl font-extrabold text-white">
              Multiplayer{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Battle
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Real-time AI-powered quiz battles</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Room Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROOM42"
                  value={room}
                  onChange={(e) => setRoom(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition font-mono tracking-widest"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 mt-2"
              >
                Join Room →
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── SETUP / WAITING ───────────────────────────────────────────────────────

  if (screen === "setup") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <ToastContainer />
        <div className="w-full max-w-lg space-y-6">
          {/* Players in room */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Room: <span className="text-cyan-400 font-mono">{room}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {players.length > 0 ? (
                players.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm"
                  >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    {p.name} {i === 0 ? "👑" : ""}
                  </motion.div>
                ))
              ) : (
                <span className="text-gray-600 text-sm">Waiting for players…</span>
              )}
            </div>
          </div>

          {/* Host: topic setup */}
          {isHost ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-cyan-950/60 to-blue-950/60 border border-cyan-500/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">👑</span>
                <h2 className="text-xl font-bold">You're the Host</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Set a topic and let AI generate the quiz. All players will play the same questions.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Quiz Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. JavaScript, Indian History, Data Structures…"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Questions: <span className="text-cyan-400 font-bold">{questionCount}</span>
                  </label>
                  <div className="flex gap-2">
                    {[3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setQuestionCount(n)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                          questionCount === n
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                            : "border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        {n} Qs
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateAndStart}
                  disabled={!topic.trim() || generating}
                  className="w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-cyan-500/20"
                >
                  {generating ? (
                    <>
                      <Spinner />
                      Generating questions…
                    </>
                  ) : (
                    "Generate & Start Game ✨"
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-3 animate-bounce">⏳</div>
              <h2 className="text-xl font-semibold mb-1">Waiting for host</h2>
              <p className="text-gray-500 text-sm">
                The host is setting up the quiz topic. Hang tight!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ── PLAYING ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-2xl">
        {/* Room header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Room</span>
            <p className="font-mono font-bold text-cyan-400">{room}</p>
          </div>
          <TimerRing seconds={seconds} total={totalSeconds} />
          <div className="text-right">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Players</span>
            <p className="font-bold">{scores.length || players.length}</p>
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          {question ? (
            <motion.div
              key={question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-5">
                <p className="text-xl md:text-2xl font-semibold leading-relaxed">{question}</p>
              </div>

              <div className="space-y-3">
                {options.map((opt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 text-left ${optionStyle(i)}`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold shrink-0">
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <span className="text-sm md:text-base">{opt}</span>
                    {feedback !== null && i === correctIdx && (
                      <svg className="w-5 h-5 text-emerald-400 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Feedback banner */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 px-5 py-3 rounded-xl border text-sm font-medium ${
                      feedback.isCorrect
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {feedback.isCorrect
                      ? `⚡ ${feedback.playerName} answered correctly! Next question incoming…`
                      : "⏱ No one answered in time. Next question incoming…"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-3 animate-pulse">🎯</div>
              <p>Waiting for the first question…</p>
            </div>
          )}
        </AnimatePresence>

        {/* Scoreboard */}
        <div className="mt-6">
          <ScoreBoard scores={scores} />
        </div>
      </div>
    </div>
  );
}
