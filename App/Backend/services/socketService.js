const socketio = require('socket.io');
const { handleJoin, handleAnswer } = require('../controllers/quizController');

module.exports = (server) => {
  const io = socketio(server, {
    cors: { origin: ['https://intelliquiz-main-4v98.vercel.app', 'http://localhost:5173'], credentials: true }
  });
  io.on('connection', (socket) => {
    socket.on('joinRoom', handleJoin(socket, io));
    socket.on('submitAnswer', handleAnswer(socket, io));
  });
};