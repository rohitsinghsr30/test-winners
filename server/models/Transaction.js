const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: [
        "Deposit",
        "Entry Fee",
        "Prize",
        "Withdraw",
        "Refund",
        "Referral Bonus",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Cancelled"],
      default: "Pending",
    },

    referenceId: {
      type: String,
      default: "",
    },

    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "Net Banking", "Wallet", "Cash", ""],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);