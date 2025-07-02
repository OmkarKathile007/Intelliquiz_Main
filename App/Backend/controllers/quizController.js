const questions = require('../quizes/quiz');
const rooms = {};

exports.handleJoin = (socket, io) => (room, name) => {
  socket.join(room);
  if (!rooms[room]) {
    rooms[room] = { players: [], askNewQuestion: true };
  }
  rooms[room].players.push({ id: socket.id, name, score: 0 });
  io.to(room).emit('message', `${name} has joined the room`);
  if (rooms[room].askNewQuestion) askQuestion(room, io);
};

exports.handleAnswer = (socket, io) => (room, answerIndex) => {
  
};

function askQuestion(room, io) {
  // question logic here...
  
      // Handle the edge case if no player 
      if (rooms[room].players.length === 0) {
          clearTimeout(rooms[room].questionTimeout);
          delete rooms[room];
          return;
      }
  
      let RandomIndex = Math.floor(Math.random() * questions.length);
      const question = questions[RandomIndex];
  
      // Store the current question in the room
      rooms[room].CurrentQuestion = question;
  
      // Find the index of the correct answer
      const correctAnswerIndex = question.answers.findIndex(answer => answer.correct === true);
      rooms[room].CorrectAnswer = correctAnswerIndex;
  
      
      rooms[room].askNewQuestion = false;
  
      // Send the new question and answers to the room
      io.to(room).emit("newQuestion", {
          question: question.question,
          answers: question.answers.map(answer => answer.text),
          timer: 10, // Set a 10-second timer for the question
      });
  
      // Set a timeout for the answer
      rooms[room].questionTimeout = setTimeout(() => {
          io.to(room).emit("answerResult", {
              playerName: "No One", // Default if no one answers
              isCorrect: false,
              correctAnswer: rooms[room].CorrectAnswer,
              scores: rooms[room].players.map(player => ({
                  name: player.name,
                  score: player.score || 0,
              })),
          });
  
          
          askNewQuestion(room);
  
      }, 10000);
}