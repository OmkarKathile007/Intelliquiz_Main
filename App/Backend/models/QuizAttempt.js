const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  userId:    { type: String, required: true, index: true },
  quizId:    { type: Number, required: true },
  quizTitle: { type: String, required: true },
  score:     { type: Number, required: true },
  total:     { type: Number, required: true },
  accuracy:  { type: Number, required: true },
  timeTaken: { type: Number, default: 0 },
  warnings:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
