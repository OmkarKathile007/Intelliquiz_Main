

import React, { useState, useEffect } from 'react';
import { FaTrophy, FaGamepad } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import ConfettiAnimation from '../../component/magicui/ConfettiAnimation';

// // http://localhost:3000  VITE_REACT_APP_BACKEND_BASEURL=http://localhost:3000
// // const socket = io("ws://localhost:5000");

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL);

export default function MultiplayerQuiz() {
  // User & room info
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);

  // Quiz state
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [scores, setScores] = useState([]);
  const [winner, setWinner] = useState('');

  // Handle form submit (join room)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && room.trim()) {
      socket.emit('joinRoom', room, name);
      setJoined(true);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  // Setup socket listeners
  useEffect(() => {
    socket.on('message', (msg) => toast.info(msg, { position: 'top-right' }));

    socket.on('newQuestion', (data) => {
      setQuestion(data.question);
      setOptions(data.answers);
      setAnswered(false);
      setSelectedIndex(null);
      setSeconds(data.timer);
    });

    socket.on('answerResult', (data) => {
      if (data.isCorrect) {
        toast.success(`${data.playerName} got it right!`, { position: 'bottom-center', autoClose: 1500 });
      }
      setScores(data.scores);
    });

    socket.on('gameOver', (data) => {
      setWinner(data.winner);
    });

    return () => {
      socket.off('message');
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
    };
  }, []);

  // Handle answer click
  const handleAnswer = (idx) => {
    if (answered) return;
    setSelectedIndex(idx);
    socket.emit('submitAnswer', room, idx);
    setAnswered(true);
  };

  // Winner screen
  if (winner) {
    return (
      <div className="bg-black min-h-screen w-screen flex flex-col items-center justify-center p-6 text-white">
        <ConfettiAnimation name={winner} />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">Winner is {winner}!</h1>
        <button
          className="mt-8 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      </div>
      
      
    );
  }

  // Main UI
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <ToastContainer />

      {!joined ? (
        <div className="relative bg-neutral-800 border-2 border-white bg-opacity-60 backdrop-blur-lg rounded-2xl  sm:w-3/4 md:w-1/2  p-6 sm:p-8 text-white shadow-xl mx-auto">
      {/* Floating icons */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <FaTrophy className="text-yellow-400 text-2xl sm:text-3xl" />
        <FaGamepad className="text-blue-400 text-2xl sm:text-3xl" />
      </div>

      <h1 className="mt-8 text-center text-lg sm:text-xl md:text-2xl font-semibold">Join Our Exciting</h1>
      <h2 className="mt-2 text-center text-2xl sm:text-3xl md:text-4xl font-bold">
        <span className="text-blue-400">Multiplayer</span>{' '}
        <span className="text-yellow-400">Battles Mode</span>
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your name"
            required
            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FaGamepad className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Enter room no"
            required
            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <FaTrophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
        </div>

        <button
          type="submit"
          className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition"
        >
          JOIN ROOM
        </button>
      </form>

      <div className="mt-6 flex justify-center space-x-2">
        <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></span>
        <span className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></span>
        <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-600 rounded-full"></span>
      </div>
    </div>
        
      ) : (
        <div className="bg-neutral-800 bg-opacity-60 backdrop-blur-lg rounded-2xl w-full max-w-2xl p-6 text-white shadow-xl">
          <h2 className="text-center text-2xl font-bold mb-2">Room: {room}</h2>
          <div className="text-center mb-4">
            Time Left: <span className="font-semibold">{seconds}s</span>
          </div>

          {question ? (
            <>
              <div className="bg-cyan-50 text-black rounded-lg p-4 mb-4">
                <p className="text-lg md:text-xl">{question}</p>
              </div>
              <ul className="space-y-2">
                {options.map((opt, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleAnswer(i)}
                      disabled={answered}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 border-transparent transition hover:border-cyan-300 focus:outline-none ${
                        selectedIndex === i
                          ? 'bg-cyan-500 text-white border-cyan-500'
                          : 'bg-white text-black'
                      }`}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center py-8">Loading question...</div>
          )}

          <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 max-h-48 overflow-y-auto">
            {scores.map((p, idx) => (
              <div key={idx} className="flex justify-between mb-2">
                <span>{idx + 1}. {p.name}</span>
                <span className={p.score >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {p.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
