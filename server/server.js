const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ================= API ROUTES =================

// Authentication Routes
app.use("/api/auth", authRoutes);

// Wallet Routes
app.use("/api/wallet", walletRoutes);

// ================= HOME ROUTE =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 TEST WINNERS Backend Running Successfully",
  });
});

// ================= TEST ROUTE =================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API Working Successfully ✅",
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("================================");
  console.log("🚀 TEST WINNERS Backend Running");
  console.log("🌐 PORT :", PORT);
  console.log("================================");
});