const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use('/dashboard/api', dashboardRoutes);
// app.use('/quiz/api', quizRoutes);

module.exports = app;