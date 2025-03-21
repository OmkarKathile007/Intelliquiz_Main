

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import ConfettiAnimation from '../../component/magicui/ConfettiAnimation';
// http://localhost:3000  VITE_REACT_APP_BACKEND_BASEURL=http://localhost:3000
// const socket = io("ws://localhost:5000");
const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL);

function MultiplayerQuiz() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [info, setInfo] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [scores, setScores] = useState([]);
  const [winner, setWinner] = useState('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && room) {
      setInfo(true);
    }
  };

  useEffect(() => {
    if (seconds === 0) return;
    const timerInterval = setInterval(() => {
      setSeconds(prevTime => prevTime - 1);
    }, 1000);
    return () => {
      clearInterval(timerInterval);
    };
  }, [seconds]);

  useEffect(() => {
    if (name) {
      socket.emit('joinRoom', room, name);
    }
  }, [info]);

  useEffect(() => {
    socket.on('message', (message) => {
      toast(`${message} joined`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    socket.on('newQuestion', (data) => {
      setQuestion(data.question);
      setOptions(data.answers);
      setAnswered(false);
      setSeconds(data.timer);
      setSelectedAnswerIndex(null);
    });

    socket.on('answerResult', (data) => {
      if (data.isCorrect) {
        toast(`Correct! ${data.playerName} got it right.`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      setScores(data.scores);
    });

    socket.on('gameOver', (data) => {
      setWinner(data.winner);
    });

    return () => {
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
    };
  }, []);

  const handleAnswer = (answerIndex) => {
    if (!answered) {
      setSelectedAnswerIndex(answerIndex);
      socket.emit('submitAnswer', room, answerIndex);
      setAnswered(true);
    }
  };

  if (winner) {
    return (
      <>
        <ConfettiAnimation name={winner} />
        <div className="bg-black min-h-screen w-screen text-white flex flex-col justify-center items-center p-4">
          <h1 className='text-5xl md:text-7xl font-bold mb-6'>Winner is {winner}</h1>
          <button
            className='mt-10 px-6 py-3 bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors'
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="bg-black min-h-screen  w-screen text-white flex flex-col justify-center items-center p-4">
      {!info ? (
        <div className='bg-neutral-900 border border-pink-200 bg-opacity-70 backdrop-blur-lg rounded-lg  max-w-screen-lg p-20 mt-10 shadow-lg flex flex-col gap-4'>
          <h1 className='text-center text-2xl md:text-3xl font-bold'>Join Our Exciting</h1>
          <h2 className='text-center text-3xl md:text-4xl font-bold mb-4'>
            Multiplayer Battles Mode 🏆
          </h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              type='text'
              required
              placeholder='Enter your name'
              className='text-white p-3 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type='number'
              required
              placeholder='Enter room no'
              className='text-white p-3 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600'
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              type='submit'
              className='p-3 bg-blue-400 rounded-md w-full font-semibold hover:bg-cyan-700 transition-colors mt-4'
            >
              JOIN ROOM
            </button>
          </form>
        </div>
      ) : (
        <div className='bg-gray-900 bg-opacity-70 backdrop-blur-lg rounded-lg w-full max-w-lg p-6 mt-10 shadow-lg flex flex-col gap-4'>
          <h1 className='text-3xl md:text-4xl font-bold text-center'>QuizClash 💡</h1>
          <p className='text-center'>Room Id: {room}</p>
          <ToastContainer />
          {question ? (
            <div className='flex flex-col gap-4'>
              <p className='text-center'>Remaining Time: {seconds}</p>
              <div className='bg-white text-black rounded-md p-4'>
                <p className='text-xl'>{question}</p>
              </div>
              <ul className='flex flex-col gap-2'>
                {options.map((answer, index) => (
                  <li className='bg-white text-black rounded-md' key={index}>
                    <button
                      className={`w-full p-3 border-2 border-black rounded-md hover:bg-cyan-500 transition-colors ${selectedAnswerIndex === index ? 'bg-cyan-500' : ''}`}
                      onClick={() => handleAnswer(index)}
                      disabled={answered}
                    >
                      {answer}
                    </button>
                  </li>
                ))}
              </ul>
              <div className='mt-4'>
                {scores.map((player, index) => (
                  <p key={index} className="text-center">
                    {player.name}: {player.score}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p className='text-center'>Loading question...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiplayerQuiz;
