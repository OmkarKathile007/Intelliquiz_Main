const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
 const Stats = require('./models/Stats.js')
 const connectDB = require('./config/db')
// const questions = require('./quizes/quiz.js');

const app = express();
const server = http.createServer(app);


app.use(cors());
 connectDB();


// const PORT =process.env.PORT|| 5000;

const io = socketio(server, {
    cors: {
      //    origin: `http://localhost:5173`,
      //  // origin: `${process.env.VITE_REACT_APP_FRONTEND_BASEURL}`,
      //   methods: ["GET", "POST"]
      origin: ['https://intelliquiz-main-4v98.vercel.app', 'http://localhost:5173'], // Allow frontend URLs
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    }
});
app.get('/dashboard/api/stats/:playerId', async (req, res) => {
   try {
     const stats = await Stats.findOne({ player: req.params.playerId });
     console.log(stats);
     if (!stats) return res.status(404).json({ msg: 'Stats not found' });
     res.json(stats);
   } catch (err) {
     res.status(500).send('Server Error');
   }
 });

const PORT =process.env.PORT|| 5000;

const questions = [
  {
    question: "What is a transformer model in AI?",
    answers: [
      { text: "A neural network architecture based on self-attention mechanisms", correct: true },
      { text: "A hardware accelerator for deep learning", correct: false },
      { text: "A data processing pipeline for big data", correct: false },
      { text: "A method for encrypting neural signals", correct: false },
    ],
  },
  {
    question: "Which framework is most popular for building deep learning models?",
    answers: [
      { text: "TensorFlow", correct: true },
      { text: "Angular", correct: false },
      { text: "React", correct: false },
      { text: "Laravel", correct: false },
    ],
  },
  {
    question: "What does 'Big O' notation primarily describe in computer science?",
    answers: [
      { text: "Algorithmic complexity", correct: true },
      { text: "Memory allocation", correct: false },
      { text: "Data storage formats", correct: false },
      { text: "Network latency", correct: false },
    ],
  },
  {
    question: "Which data structure is best suited for implementing an LRU (Least Recently Used) Cache?",
    answers: [
      { text: "Hash Map combined with a Doubly Linked List", correct: true },
      { text: "Stack", correct: false },
      { text: "Queue", correct: false },
      { text: "Binary Search Tree", correct: false },
    ],
  },
  {
    question: "Which breakthrough has most significantly advanced natural language processing in recent years?",
    answers: [
      { text: "Transformer-based models", correct: true },
      { text: "Decision trees", correct: false },
      { text: "Support Vector Machines", correct: false },
      { text: "Genetic algorithms", correct: false },
    ],
  },
  {
    question: "Which programming language is widely adopted in both CS education and AI research?",
    answers: [
      { text: "Python", correct: true },
      { text: "Java", correct: false },
      { text: "C++", correct: false },
      { text: "Ruby", correct: false },
    ],
  },
  {
    question: "What technology underpins secure, decentralized verification in many modern applications?",
    answers: [
      { text: "Blockchain", correct: true },
      { text: "Cloud Computing", correct: false },
      { text: "Virtual Reality", correct: false },
      { text: "Internet of Things", correct: false },
    ],
  },
  {
    question: "In machine learning, what does 'overfitting' refer to?",
    answers: [
      { text: "A model learning the training data too well, including noise, and performing poorly on new data", correct: true },
      { text: "A model that cannot learn from the training data", correct: false },
      { text: "A model trained on insufficient data", correct: false },
      { text: "A model that generalizes perfectly to unseen data", correct: false },
    ],
  },
  {
    question: "Which innovation has revolutionized image generation in modern AI?",
    answers: [
      { text: "Generative Adversarial Networks (GANs)", correct: true },
      { text: "Convolutional Neural Networks (CNNs)", correct: false },
      { text: "Recurrent Neural Networks (RNNs)", correct: false },
      { text: "Autoencoders", correct: false },
    ],
  },
  {
    question: "Who is renowned for pioneering theoretical computer science and proposing the Turing Test?",
    answers: [
      { text: "Alan Turing", correct: true },
      { text: "John von Neumann", correct: false },
      { text: "Claude Shannon", correct: false },
      { text: "Donald Knuth", correct: false },
    ],
  },
];


let rooms = {};

// Connection established
io.on("connection", (socket) => {
    console.log('A user has connected');

    // Message from frontend 'JoinRoom'
    socket.on("joinRoom", (room, name) => {
        socket.join(room);

        // Initialize the room if it doesn't exist yet
        if (!rooms[room]) {
            rooms[room] = {
                players: [],
                CurrentQuestion: null,
                CorrectAnswer: null,
                questionTimeout: null,
                askNewQuestion: true
            };
        }

        rooms[room].players.push({ id: socket.id, name });

        // Broadcast message to everyone who has joined the room
        io.to(room).emit("message", `${name} has joined the room`);

        // Ask a new question if the room is ready
        if (rooms[room].askNewQuestion) {
            askNewQuestion(room);
        }
    });

    // Handle submitted answers from players
    socket.on("submitAnswer", (room, answerIndex) => {

        // Find the player who submitted the answer
        const currentPlayer = rooms[room].players.find(player => player.id === socket.id);

        // Check if the answer is correct
        if (currentPlayer) {
            const correctAnswer = rooms[room].CorrectAnswer;
            const isCorrect = correctAnswer !== null && correctAnswer === answerIndex;

            
            currentPlayer.score = isCorrect ? (currentPlayer.score || 0) + 1 : (currentPlayer.score || 0)-1;

           
            clearTimeout(rooms[room].questionTimeout);

            // Send the result of the answer to the room
            io.to(room).emit("answerResult", {
                playerName: currentPlayer.name,
                isCorrect,
                correctAnswer,
                scores: rooms[room].players.map(player => ({
                    name: player.name,
                    score: player.score || 0,
                })),
            });

            
            const winningThreshold = 5;
            const winner = rooms[room].players.find(player => (player.score || 0) >= winningThreshold);

          
            if (winner) {
                io.to(room).emit("gameOver", { winner: winner.name });
                delete rooms[room]; 
            } else {
                
                askNewQuestion(room);
            }
        }
    });
});


function askNewQuestion(room) {

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

server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
