const mongoose = require('mongoose');
const StatsSchema = new mongoose.Schema({
  // player: { type: Number, ref: 'User', unique: true },
  player: Number,
  quizzesCompleted: Number,
  correctPercentage: Number,
  progress: [{ label: String, value: Number }],
  leaderboard: [{ name: String, score: Number }]
});
module.exports = mongoose.model('Stats', StatsSchema);
