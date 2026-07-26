const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// ================= IMPORT ROUTES =================

const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

// ================= CONNECT DATABASE =================

connectDB();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());

// ================= API ROUTES =================

// Authentication
app.use("/api/auth", authRoutes);

// Wallet
app.use("/api/wallet", walletRoutes);

// Tests
app.use("/api/tests", testRoutes);

// ================= HOME ROUTE =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 TEST WINNERS Backend Running Successfully",
  });
});

// ================= HEALTH CHECK =================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API Working Successfully ✅",
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log("🚀 TEST WINNERS Backend Running");
  console.log(`🌐 PORT : ${PORT}`);
  console.log("======================================");
});