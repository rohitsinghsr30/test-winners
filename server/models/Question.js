const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= QUESTION =================

    questionEnglish: {
      type: String,
      required: true,
      trim: true,
    },

    questionHindi: {
      type: String,
      default: "",
      trim: true,
    },

    // Backward Compatibility
    question: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= OPTIONS =================

    optionsEnglish: {
      type: [String],
      validate: {
        validator: (v) => v.length === 4,
        message: "Exactly 4 English options are required.",
      },
      required: true,
    },

    optionsHindi: {
      type: [String],
      default: [],
    },

    // Backward Compatibility
    options: {
      type: [String],
      default: [],
    },

    // ================= ANSWER =================

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },

    // ================= MARKING =================

    marks: {
      type: Number,
      default: 1,
    },

    negativeMarks: {
      type: Number,
      default: 0.25,
    },

    // ================= DIFFICULTY =================

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    // ================= EXPLANATION =================

    explanationEnglish: {
      type: String,
      default: "",
    },

    explanationHindi: {
      type: String,
      default: "",
    },

    explanation: {
      type: String,
      default: "",
    },

    // ================= STATUS =================

    language: {
      type: String,
      enum: ["English", "Hindi", "Bilingual"],
      default: "Bilingual",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ================= FUTURE =================

    image: {
      type: String,
      default: "",
    },

    solutionImage: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);