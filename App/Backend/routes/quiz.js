const express = require('express');
const router = express.Router();
const QuizAttempt = require('../models/QuizAttempt');

// POST /quiz/api/submit — save a completed quiz attempt
router.post('/submit', async (req, res) => {
  try {
    const { userId, quizId, quizTitle, score, total, accuracy, timeTaken, warnings } = req.body;
    if (!userId || quizId == null || !quizTitle) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    const attempt = await QuizAttempt.create({
      userId, quizId, quizTitle, score, total, accuracy, timeTaken, warnings,
    });
    res.status(201).json(attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// GET /quiz/api/user-stats/:userId — aggregated stats for the stats bar + AI path card
router.get('/user-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const attempts = await QuizAttempt.find({ userId }).sort({ createdAt: -1 });

    if (attempts.length === 0) {
      return res.json({
        questionsAnswered: 0,
        accuracy: 0,
        assessmentsCompleted: 0,
        learningStreak: 0,
        campusRank: null,
        recentAttempts: [],
        readinessScore: 0,
        nextRecommended: 'CS Fundamentals Screening',
        sprintNumber: '01',
      });
    }

    const totalCorrect   = attempts.reduce((s, a) => s + a.score, 0);
    const totalQuestions = attempts.reduce((s, a) => s + a.total, 0);
    const questionsAnswered    = totalQuestions;
    const accuracy             = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const assessmentsCompleted = attempts.length;

    // learning streak — consecutive calendar days with at least one attempt
    const uniqueDates = [...new Set(
      attempts.map(a => new Date(a.createdAt).toISOString().split('T')[0])
    )].sort((a, b) => b.localeCompare(a));

    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
    let streak = 0;
    let checkDate = (uniqueDates[0] === today || uniqueDates[0] === yesterday) ? uniqueDates[0] : null;
    if (checkDate) {
      for (const date of uniqueDates) {
        if (date === checkDate) {
          streak++;
          checkDate = new Date(new Date(checkDate).getTime() - 86_400_000).toISOString().split('T')[0];
        } else {
          break;
        }
      }
    }

    // campus rank — rank among all users by total correct answers
    const allUserScores = await QuizAttempt.aggregate([
      { $group: { _id: '$userId', totalScore: { $sum: '$score' } } },
      { $sort:  { totalScore: -1 } },
    ]);
    const rankIdx    = allUserScores.findIndex(u => u._id === userId);
    const campusRank = rankIdx >= 0 ? rankIdx + 1 : null;

    // last 4 recently attempted quiz titles (distinct, most recent first)
    const seen = new Set();
    const recentAttempts = [];
    for (const a of attempts) {
      if (!seen.has(a.quizTitle)) {
        seen.add(a.quizTitle);
        recentAttempts.push(a.quizTitle);
        if (recentAttempts.length === 4) break;
      }
    }

    // readiness score — average of best accuracy per quiz type
    const quizIds    = [1, 2, 3];
    const quizTitles = {
      1: 'CS Fundamentals Screening',
      2: 'DSA Fundamentals Assessment',
      3: 'Online Assessment Simulator',
    };
    const bestAccuracies = quizIds.map(qid => {
      const qa = attempts.filter(a => a.quizId === qid);
      return qa.length > 0 ? Math.max(...qa.map(a => a.accuracy)) : 0;
    });
    const readinessScore  = Math.round(bestAccuracies.reduce((s, v) => s + v, 0) / 3);
    const minAccuracyIdx  = bestAccuracies.indexOf(Math.min(...bestAccuracies));
    const nextRecommended = quizTitles[quizIds[minAccuracyIdx]];
    const sprintNumber    = String(Math.max(1, Math.ceil(assessmentsCompleted / 3))).padStart(2, '0');

    res.json({
      questionsAnswered,
      accuracy,
      assessmentsCompleted,
      learningStreak: streak,
      campusRank,
      recentAttempts,
      readinessScore,
      nextRecommended,
      sprintNumber,
    });
  } catch (err) {
    console.error('[user-stats]', err.stack || err);
    res.status(500).json({ msg: 'Server Error', detail: err.message });
  }
});

// GET /quiz/api/module-stats — global attempt counts per quiz (for "X attempts" on cards)
router.get('/module-stats', async (req, res) => {
  try {
    const stats = await QuizAttempt.aggregate([
      { $group: { _id: '$quizId', totalAttempts: { $sum: 1 } } },
    ]);
    res.json(stats);
  } catch (err) {
    console.error('[module-stats]', err.stack || err);
    res.status(500).json({ msg: 'Server Error', detail: err.message });
  }
});

// GET /quiz/api/user-module-stats/:userId — user's best accuracy per quiz (for completion bar)
router.get('/user-module-stats/:userId', async (req, res) => {
  try {
    const stats = await QuizAttempt.aggregate([
      { $match: { userId: req.params.userId } },
      { $group: { _id: '$quizId', bestAccuracy: { $max: '$accuracy' } } },
    ]);
    res.json(stats);
  } catch (err) {
    console.error('[user-module-stats]', err.stack || err);
    res.status(500).json({ msg: 'Server Error', detail: err.message });
  }
});

module.exports = router;
