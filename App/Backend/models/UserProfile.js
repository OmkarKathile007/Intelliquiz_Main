const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    displayName: { type: String, default: "", maxlength: 50 },
    bio: { type: String, default: "", maxlength: 200 },
    avatarColor: { type: String, default: "#06b6d4" },
    streaks: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: String, default: null },
      history: [{ type: String }],
    },
    preferences: {
      defaultDifficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium",
      },
      quizTimeWarnings: { type: Boolean, default: true },
      showLeaderboard: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
