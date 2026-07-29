const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================================================
    // BASIC DETAILS
    // ======================================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // ======================================================
    // WALLET
    // ======================================================

    wallet: {
      type: Number,
      default: 0,
      min: 0,
    },

    winning: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalRewards: {
      type: Number,
      default: 0,
    },

    totalDeposited: {
      type: Number,
      default: 0,
    },

    totalWithdrawn: {
      type: Number,
      default: 0,
    },

    totalEntryFeesPaid: {
      type: Number,
      default: 0,
    },

    // ======================================================
    // REFERRAL
    // ======================================================

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    referredBy: {
      type: String,
      default: "",
    },

    totalReferrals: {
      type: Number,
      default: 0,
    },

    referralEarnings: {
      type: Number,
      default: 0,
    },

    // ======================================================
    // ROLE & ACCOUNT
    // ======================================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // ======================================================
    // TEST STATISTICS
    // ======================================================

    testsAttempted: {
      type: Number,
      default: 0,
    },

    testsWon: {
      type: Number,
      default: 0,
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    totalCorrectAnswers: {
      type: Number,
      default: 0,
    },

    totalWrongAnswers: {
      type: Number,
      default: 0,
    },

    totalUnanswered: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },

    highestScore: {
      type: Number,
      default: 0,
    },

    bestRank: {
      type: Number,
      default: 0,
    },

    currentRank: {
      type: Number,
      default: 0,
    },

    totalTimeSpent: {
      type: Number,
      default: 0,
    },

    winRate: {
      type: Number,
      default: 0,
    },

    // ======================================================
    // LOGIN & SECURITY
    // ======================================================

    lastLogin: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    lastLoginIP: {
      type: String,
      default: "",
    },

    refreshToken: {
      type: String,
      default: "",
    },

    // ======================================================
    // NOTIFICATION SETTINGS
    // ======================================================

    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },

      push: {
        type: Boolean,
        default: true,
      },

      sms: {
        type: Boolean,
        default: false,
      },
    },

    // ======================================================
    // KYC (Future Ready)
    // ======================================================

    kyc: {
      isVerified: {
        type: Boolean,
        default: false,
      },

      fullName: {
        type: String,
        default: "",
      },

      aadhaarNumber: {
        type: String,
        default: "",
      },

      panNumber: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// EXPORT MODEL
// ======================================================

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);