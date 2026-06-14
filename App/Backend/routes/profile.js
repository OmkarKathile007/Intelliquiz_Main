const express = require("express");
const router = express.Router();
const UserProfile = require("../models/UserProfile");

// GET /api/profile/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
      profile = await UserProfile.create({ userId });
    }
    res.json(profile);
  } catch (err) {
    console.error("[profile/get]", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// PUT /api/profile/:userId  — update display info and/or preferences
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { displayName, bio, avatarColor, preferences } = req.body;

    const update = {};
    if (displayName !== undefined) update.displayName = String(displayName).slice(0, 50);
    if (bio !== undefined) update.bio = String(bio).slice(0, 200);
    if (avatarColor !== undefined) update.avatarColor = avatarColor;
    if (preferences && typeof preferences === "object") {
      const allowed = ["defaultDifficulty", "quizTimeWarnings", "showLeaderboard", "publicProfile", "emailNotifications"];
      for (const key of allowed) {
        if (preferences[key] !== undefined) {
          update[`preferences.${key}`] = preferences[key];
        }
      }
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    console.error("[profile/put]", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
