// const questions = require('../quizes/quiz');
// const rooms = {};

// exports.handleJoin = (socket, io) => (room, name) => {
//   socket.join(room);
//   if (!rooms[room]) {
//     rooms[room] = { players: [], askNewQuestion: true };
//   }
//   rooms[room].players.push({ id: socket.id, name, score: 0 });
//   io.to(room).emit('message', `${name} has joined the room`);
//   if (rooms[room].askNewQuestion) askQuestion(room, io);
// };

// exports.handleAnswer = (socket, io) => (room, answerIndex) => {
  
// };

// function askQuestion(room, io) {
//   // question logic here...
  
//       // Handle the edge case if no player 
//       if (rooms[room].players.length === 0) {
//           clearTimeout(rooms[room].questionTimeout);
//           delete rooms[room];
//           return;
//       }
  
//       let RandomIndex = Math.floor(Math.random() * questions.length);
//       const question = questions[RandomIndex];
  
//       // Store the current question in the room
//       rooms[room].CurrentQuestion = question;
  
//       // Find the index of the correct answer
//       const correctAnswerIndex = question.answers.findIndex(answer => answer.correct === true);
//       rooms[room].CorrectAnswer = correctAnswerIndex;
  
      
//       rooms[room].askNewQuestion = false;
  
//       // Send the new question and answers to the room
//       io.to(room).emit("newQuestion", {
//           question: question.question,
//           answers: question.answers.map(answer => answer.text),
//           timer: 10, // Set a 10-second timer for the question
//       });
  
//       // Set a timeout for the answer
//       rooms[room].questionTimeout = setTimeout(() => {
//           io.to(room).emit("answerResult", {
//               playerName: "No One", // Default if no one answers
//               isCorrect: false,
//               correctAnswer: rooms[room].CorrectAnswer,
//               scores: rooms[room].players.map(player => ({
//                   name: player.name,
//                   score: player.score || 0,
//               })),
//           });
  
          
//           askNewQuestion(room);
  
//       }, 10000);
// }

// const questions = require('../quizes/quiz');
// const rooms = {};

// exports.handleJoin = (socket, io) => (room, name) => {
//   socket.join(room);
//   if (!rooms[room]) {
//     rooms[room] = { players: [], askNewQuestion: true };
//   }
//   rooms[room].players.push({ id: socket.id, name, score: 0 });
//   io.to(room).emit('message', `${name} has joined the room`);
//   if (rooms[room].askNewQuestion) askQuestion(room, io);
// };

// exports.handleAnswer = (socket, io) => (room, answerIndex) => {
  
// };

// function askQuestion(room, io) {
//   // question logic here...
  
//       // Handle the edge case if no player 
//       if (rooms[room].players.length === 0) {
//           clearTimeout(rooms[room].questionTimeout);
//           delete rooms[room];
//           return;
//       }
  
//       let RandomIndex = Math.floor(Math.random() * questions.length);
//       const question = questions[RandomIndex];
  
//       // Store the current question in the room
//       rooms[room].CurrentQuestion = question;
  
//       // Find the index of the correct answer
//       const correctAnswerIndex = question.answers.findIndex(answer => answer.correct === true);
//       rooms[room].CorrectAnswer = correctAnswerIndex;
  
      
//       rooms[room].askNewQuestion = false;
  
//       // Send the new question and answers to the room
//       io.to(room).emit("newQuestion", {
//           question: question.question,
//           answers: question.answers.map(answer => answer.text),
//           timer: 10, // Set a 10-second timer for the question
//       });
  
//       // Set a timeout for the answer
//       rooms[room].questionTimeout = setTimeout(() => {
//           io.to(room).emit("answerResult", {
//               playerName: "No One", // Default if no one answers
//               isCorrect: false,
//               correctAnswer: rooms[room].CorrectAnswer,
//               scores: rooms[room].players.map(player => ({
//                   name: player.name,
//                   score: player.score || 0,
//               })),
//           });
  
          
//           askNewQuestion(room);
  
//       }, 10000);
// }


const QUESTION_TIMEOUT_MS = parseInt(process.env.QUESTION_TIMEOUT_MS, 10) || 10000;
const WINNING_THRESHOLD   = parseInt(process.env.WINNING_THRESHOLD, 10)   || 5;

const rooms = {};

exports.handleJoin = (socket, io) => (room, name) => {
  socket.join(room);

  if (!rooms[room]) {
    rooms[room] = {
      players:         [],
      customQuestions: null,
      currentQuestion: null,
      correctAnswer:   null,
      questionTimeout: null,
      gameStarted:     false,
    };
  }

  const roomData = rooms[room];
  roomData.players.push({ id: socket.id, name, score: 0 });

  const isHost = roomData.players.length === 1;
  socket.emit("hostStatus", isHost);

  io.to(room).emit("playerJoined", roomData.players.map((p) => ({ name: p.name, score: p.score })));

  // If game already in progress, sync late joiner to current state
  if (roomData.gameStarted && roomData.currentQuestion) {
    socket.emit("questionsReady");
    socket.emit("newQuestion", {
      question: roomData.currentQuestion.question,
      answers:  roomData.currentQuestion.answers.map((a) => a.text),
      timer:    Math.floor(QUESTION_TIMEOUT_MS / 1000),
    });
  }
};

exports.handleSetQuestions = (socket, io) => (room, questions) => {
  const roomData = rooms[room];
  if (!roomData || roomData.gameStarted) return; // only accept once

  if (!Array.isArray(questions) || questions.length === 0) return;

  roomData.customQuestions = questions;
  roomData.gameStarted = true;

  io.to(room).emit("questionsReady");
  askNewQuestion(room, io);
};

exports.handleAnswer = (socket, io) => (room, answerIndex) => {
  const roomData = rooms[room];
  if (!roomData) return;

  const currentPlayer = roomData.players.find((p) => p.id === socket.id);
  if (!currentPlayer) return;

  const { correctAnswer } = roomData;
  const isCorrect = correctAnswer !== null && correctAnswer === answerIndex;

  currentPlayer.score += isCorrect ? 1 : -1;

  clearTimeout(roomData.questionTimeout);

  io.to(room).emit("answerResult", {
    playerName:    currentPlayer.name,
    isCorrect,
    correctAnswer,
    scores: roomData.players.map((p) => ({ name: p.name, score: p.score })),
  });

  const winner = roomData.players.find((p) => p.score >= WINNING_THRESHOLD);
  if (winner) {
    io.to(room).emit("gameOver", { winner: winner.name });
    delete rooms[room];
  } else {
    askNewQuestion(room, io);
  }
};

exports.handleDisconnect = (socket) => () => {
  for (const room in rooms) {
    const roomData = rooms[room];
    const idx = roomData.players.findIndex((p) => p.id === socket.id);
    if (idx === -1) continue;

    roomData.players.splice(idx, 1);

    if (roomData.players.length === 0) {
      clearTimeout(roomData.questionTimeout);
      delete rooms[room];
    }
    break;
  }
};

function askNewQuestion(room, io) {
  const roomData = rooms[room];
  if (!roomData || roomData.players.length === 0) {
    if (roomData) {
      clearTimeout(roomData.questionTimeout);
      delete rooms[room];
    }
    return;
  }

  const pool = roomData.customQuestions;
  if (!pool || pool.length === 0) return;

  const question = pool[Math.floor(Math.random() * pool.length)];
  roomData.currentQuestion = question;
  roomData.correctAnswer   = question.answers.findIndex((a) => a.correct === true);

  io.to(room).emit("newQuestion", {
    question: question.question,
    answers:  question.answers.map((a) => a.text),
    timer:    Math.floor(QUESTION_TIMEOUT_MS / 1000),
  });

  roomData.questionTimeout = setTimeout(() => {
    if (!rooms[room]) return;

    io.to(room).emit("answerResult", {
      playerName:    "No One",
      isCorrect:     false,
      correctAnswer: rooms[room].correctAnswer,
      scores: rooms[room].players.map((p) => ({ name: p.name, score: p.score })),
    });

    askNewQuestion(room, io);
  }, QUESTION_TIMEOUT_MS);
}
