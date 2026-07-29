const mongoose = require("mongoose");

// ================= PRIZE SCHEMA =================

const prizeSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      required: true,
      min: 1,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const testSchema = new mongoose.Schema(
  {
    // ================= BASIC DETAILS =================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // ================= EXAM SETTINGS =================

    duration: {
      type: Number,
      default: 180,
    },

    totalQuestions: {
      type: Number,
      default: 100,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    marksPerQuestion: {
      type: Number,
      default: 1,
    },

    negativeMarking: {
      type: Number,
      default: 0.25,
    },

    // ================= ENTRY =================

    entryFee: {
      type: Number,
      default: 10,
    },

    maxParticipants: {
      type: Number,
      default: 0,
    },

    // ================= PRIZE =================

    prizePool: {
      type: Number,
      default: 0,
    },

    prizes: {
      type: [prizeSchema],
      default: [
        { rank: 1, amount: 500 },
        { rank: 2, amount: 300 },
        { rank: 3, amount: 200 },
      ],
    },

    // ================= STATISTICS =================

    joinedUsers: {
      type: Number,
      default: 0,
    },

    totalRevenue: {
      type: Number,
      default: 0,
    },

    totalSubmissions: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },

    // ================= TIMING =================

    startTime: Date,

    endTime: Date,

    // ================= RESULT =================

    winnersPublished: {
      type: Boolean,
      default: false,
    },

    allowMultipleAttempts: {
      type: Boolean,
      default: false,
    },

    // ================= STATUS =================

    status: {
      type: String,
      enum: [
        "upcoming",
        "live",
        "completed",
        "cancelled",
      ],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

// ================= INDEXES =================

testSchema.index({ status: 1 });
testSchema.index({ subject: 1 });
testSchema.index({ startTime: 1 });

module.exports = mongoose.model("Test", testSchema);