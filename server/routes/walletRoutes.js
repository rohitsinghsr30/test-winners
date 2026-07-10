const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWallet,
  addMoney,
  withdrawMoney,
} = require("../controllers/walletController");

// Get Wallet Details
router.get("/", authMiddleware, getWallet);

// Add Money
router.post("/add", authMiddleware, addMoney);

// Withdraw Money
router.post("/withdraw", authMiddleware, withdrawMoney);

module.exports = router;