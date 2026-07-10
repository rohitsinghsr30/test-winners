const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get Logged-in User
router.get("/me", authMiddleware, getUser);

// Update Profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;