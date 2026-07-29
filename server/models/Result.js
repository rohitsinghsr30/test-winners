const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    // Candidate
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Test
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },

    // Attempt Number
    attemptNumber: {
      type: Number,
      default: 1,
    },

    // Total Questions
    totalQuestions: {
      type: Number,
      required: true,
    },

    // Score
    score: {
      type: Number,
      default: 0,
    },

    // Correct Answers
    correctAnswers: {
      type: Number,
      default: 0,
    },

    // Wrong Answers
    wrongAnswers: {
      type: Number,
      default: 0,
    },

    // Unanswered Questions
    unanswered: {
      type: Number,
      default: 0,
    },

    // Percentage
    percentage: {
      type: Number,
      default: 0,
    },

    // Accuracy
    accuracy: {
      type: Number,
      default: 0,
    },

    // Time Taken (Seconds)
    timeTaken: {
      type: Number,
      default: 0,
    },

    // Leaderboard Rank
    rank: {
      type: Number,
      default: 0,
    },

    // Percentile
    percentile: {
      type: Number,
      default: 0,
    },

    // Prize Position
    prizePosition: {
      type: Number,
      default: 0,
    },

    // Reward Amount
    rewardAmount: {
      type: Number,
      default: 0,
    },

    // Reward Status
    rewardStatus: {
      type: String,
      enum: ["Pending", "Credited", "Rejected"],
      default: "Pending",
    },

    // Manual / Auto Submit
    submissionType: {
      type: String,
      enum: ["Manual", "Auto"],
      default: "Manual",
    },

    // Result Status
    status: {
      type: String,
      enum: ["Completed", "Cancelled"],
      default: "Completed",
    },

    // Submitted Time
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

// Fast Leaderboard Sorting
resultSchema.index({
  test: 1,
  score: -1,
  timeTaken: 1,
  submittedAt: 1,
});

// User Test Lookup
resultSchema.index({
  user: 1,
  test: 1,
  attemptNumber: -1,
});

// Rank Lookup
resultSchema.index({
  test: 1,
  rank: 1,
});

module.exports = mongoose.model("Result", resultSchema);