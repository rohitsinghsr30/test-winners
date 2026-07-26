const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: 180, // Minutes
    },

    totalQuestions: {
      type: Number,
      default: 100,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    negativeMarking: {
      type: Number,
      default: 0.25,
    },

    entryFee: {
      type: Number,
      default: 10,
    },

    prizePool: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Test", testSchema);