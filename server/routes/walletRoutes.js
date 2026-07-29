const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWallet,
  depositMoney,
  withdrawMoney,
  getTransactions,
  getWalletSummary,
} = require("../controllers/walletController");

// ================= WALLET =================

// Wallet Balance
router.get("/", authMiddleware, getWallet);

// Wallet Summary
router.get("/summary", authMiddleware, getWalletSummary);

// Transaction History
router.get("/transactions", authMiddleware, getTransactions);

// Deposit Money
router.post("/deposit", authMiddleware, depositMoney);

// Withdraw Money
router.post("/withdraw", authMiddleware, withdrawMoney);

module.exports = router;