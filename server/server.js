const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const dns = require("dns");

dotenv.config();

// ======================================================
// DNS FIX FOR MONGODB ATLAS SRV
// ======================================================

console.log("========================================");
console.log("DNS CONFIGURATION");
console.log("========================================");
console.log("DNS Before :", dns.getServers());

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

console.log("DNS After  :", dns.getServers());
console.log("========================================");

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

        version: "2.2.0",

        environment: process.env.NODE_ENV || "development",

        message: "TEST WINNERS Backend Running Successfully"

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

        memory: process.memoryUsage(),

        dns: dns.getServers()

    });

});

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

app.use("/api/wallet", walletRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/withdrawals", withdrawalRoutes);

app.use("/api/tests", testRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/results", resultRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api/admin", adminRoutes);

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
// GLOBAL ERROR HANDLER
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
// SERVER START
// ======================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        console.log("");
        console.log("Connecting to MongoDB Atlas...");

        await connectDB();


        AutomaticExamEngine();

        app.listen(PORT, () => {

            console.log("");
            console.log("======================================================");
            console.log("TEST WINNERS Backend Started Successfully");
            console.log("======================================================");
            console.log(`Environment          : ${process.env.NODE_ENV || "development"}`);
            console.log(`Server URL           : http://localhost:${PORT}`);
            console.log(`API Base             : http://localhost:${PORT}/api`);
            console.log(`Health API           : http://localhost:${PORT}/api/health`);
            console.log(`MongoDB              : Connected`);
            console.log(`DNS Servers          : ${dns.getServers().join(", ")}`);
            console.log("Automatic Exam Engine: Running");
            console.log("Helmet               : Enabled");
            console.log("Compression          : Enabled");
            console.log("HPP                  : Enabled");
            console.log("Rate Limiter         : Enabled");
            console.log("======================================================");
            console.log("");

        });

    } catch (error) {

        console.error("");
        console.error("======================================================");
        console.error("SERVER START FAILED");
        console.error("======================================================");
        console.error(error);
        console.error("======================================================");

        process.exit(1);

    }

};

startServer();