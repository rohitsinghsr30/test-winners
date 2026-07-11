const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    wallet: {
      type: Number,
      default: 0,
    },

    winning: {
      type: Number,
      default: 0,
    },

    referralCode: {
      type: String,
      unique: true,
    },

    referredBy: {
      type: String,
      default: "",
    },

    rank: {
      type: Number,
      default: 0,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);