// const socketio = require('socket.io');
// const { handleJoin, handleAnswer } = require('../controllers/quizController');

// module.exports = (server) => {
//   const io = socketio(server, {
//     cors: { origin: ['https://intelliquiz-main-4v98.vercel.app', 'http://localhost:5173'], credentials: true }
//   });
//   io.on('connection', (socket) => {
//     socket.on('joinRoom', handleJoin(socket, io));
//     socket.on('submitAnswer', handleAnswer(socket, io));
//   });
// };

const socketio = require("socket.io");
const { handleJoin, handleAnswer, handleDisconnect, handleSetQuestions } = require("../controllers/quizController");

module.exports = (server) => {
  // Always allow these origins; CORS_ORIGINS (comma-separated) can add more.
  const DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "https://intelliquiz-main-4v98.vercel.app",
  ];
  const allowedOrigins = [
    ...DEFAULT_ORIGINS,
    ...(process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean),
  ];

  const io = socketio(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom",         handleJoin(socket, io));
    socket.on("submitAnswer",     handleAnswer(socket, io));
    socket.on("setRoomQuestions", handleSetQuestions(socket, io));
    socket.on("disconnect",       handleDisconnect(socket));
  });
};
