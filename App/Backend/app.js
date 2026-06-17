// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const dashboardRoutes = require('./routes/dashboard');

// const app = express();
// app.use(express.json());
// app.use(cors());
// connectDB();

// app.use('/dashboard/api', dashboardRoutes);
// // app.use('/quiz/api', quizRoutes);

// module.exports = app;


require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const connectDB       = require("./config/db");
const dashboardRoutes    = require("./routes/dashboard");
const subscriptionRoutes = require("./routes/subscription");
const quizRoutes         = require("./routes/quiz");
const transcriptRoutes   = require("./routes/transcript");
const geminiRoutes       = require("./routes/gemini");
const profileRoutes      = require("./routes/profile");
const Stats = require("./models/Stats");

const app = express();

// Always allow these origins; CORS_ORIGINS (comma-separated) can add more.
const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "https://intelliquiz-main-4v98.vercel.app",
];
const allowedOrigins = [
  ...DEFAULT_ORIGINS,
  ...(process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean),
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

connectDB();

app.use("/dashboard/api",    dashboardRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/quiz/api",         quizRoutes);
app.use("/api/transcript",   transcriptRoutes);
app.use("/api/gemini",       geminiRoutes);
app.use("/api/profile",      profileRoutes);

app.get("/dashboard/api/stats/:playerId", async (req, res) => {
  try {
    const stats = await Stats.findOne({ player: req.params.playerId });
    if (!stats) return res.status(404).json({ msg: "Stats not found" });
    res.json(stats);
  } catch {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = app;
