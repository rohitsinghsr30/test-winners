const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

dotenv.config();

const connectDB = require("./config/db");

// ======================================================
// IMPORT ROUTES
// ======================================================

const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/adminRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");

// ======================================================
// IMPORT SERVICES
// ======================================================

const AutomaticExamEngine = require("./services/AutomaticExamEngine");

const app = express();

// ======================================================
// SECURITY
// ======================================================

app.disable("x-powered-by");

app.use(helmet());

app.use(compression());

app.use(hpp());

// ======================================================
// RATE LIMITER
// ======================================================

const limiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 300,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message: "Too many requests. Please try again later."

    }

});

app.use(limiter);

// ======================================================
// CORS
// ======================================================

app.use(cors({

    origin: process.env.CLIENT_URL || "*",

    credentials: true

}));

// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json({

    limit: "20mb"

}));

app.use(express.urlencoded({

    extended: true,

    limit: "20mb"

}));

// ======================================================
// LOGGER
// ======================================================

app.use(morgan("dev"));

app.use((req, res, next) => {

    console.log(

        `[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`

    );

    next();

});

// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        application: "TEST WINNERS",

        version: "2.1.0",

        environment: process.env.NODE_ENV || "development",

        message: "🚀 TEST WINNERS Backend Running Successfully"

    });

});

// ======================================================
// HEALTH
// ======================================================

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,

        status: "Healthy",

        uptime: process.uptime(),

        timestamp: new Date(),

        memory: process.memoryUsage()

    });

});

// ======================================================
// API ROUTES
// ======================================================

// Authentication
app.use("/api/auth", authRoutes);

// Wallet
app.use("/api/wallet", walletRoutes);

// Payments
app.use("/api/payments", paymentRoutes);

// Withdrawals
app.use("/api/withdrawals", withdrawalRoutes);

// Tests
app.use("/api/tests", testRoutes);

// Questions
app.use("/api/questions", questionRoutes);

// Results
app.use("/api/results", resultRoutes);

// Leaderboard
app.use("/api/leaderboard", leaderboardRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Admin Dashboard
app.use("/api/admin", adminDashboardRoutes);

// ======================================================
// 404
// ======================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "API Route Not Found",

        route: req.originalUrl

    });

});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {

    console.error("========================================");
    console.error("GLOBAL ERROR");
    console.error("========================================");
    console.error(err);

    res.status(err.status || 500).json({

        success: false,

        message: err.message || "Internal Server Error",

        ...(process.env.NODE_ENV !== "production" && {

            stack: err.stack

        })

    });

});

// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();

        AutomaticExamEngine();

        app.listen(PORT, () => {

            console.log("");
            console.log("==================================================");
            console.log("🚀 TEST WINNERS Backend Started Successfully");
            console.log("==================================================");
            console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
            console.log(`🌐 Server      : http://localhost:${PORT}`);
            console.log(`📡 API Base    : http://localhost:${PORT}/api`);
            console.log(`❤️ Health      : http://localhost:${PORT}/api/health`);
            console.log("🤖 Automatic Exam Engine : Running");
            console.log("🛡️ Security    : Helmet + HPP + Rate Limit");
            console.log("🗜️ Compression : Enabled");
            console.log("==================================================");

        });

    } catch (error) {

        console.error("==================================================");
        console.error("❌ SERVER START FAILED");
        console.error("==================================================");
        console.error(error);

        process.exit(1);

    }

};

startServer();