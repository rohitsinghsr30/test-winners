const mongoose = require("mongoose");
const dns = require("dns");

// ======================================================
// FORCE GOOGLE DNS
// Fix for MongoDB Atlas SRV lookup
// ======================================================

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const connectDB = async () => {

    try {

        console.log("========================================");
        console.log("MONGODB CONNECTION");
        console.log("========================================");
        console.log("DNS Servers :", dns.getServers());
        console.log("MongoDB URI Loaded");
        console.log("Connecting to MongoDB Atlas...");
        console.log("========================================");

        await mongoose.connect(process.env.MONGO_URI, {

            serverSelectionTimeoutMS: 30000,

            connectTimeoutMS: 30000,

            socketTimeoutMS: 45000,

            maxPoolSize: 20,

            minPoolSize: 5

        });

        console.log("");
        console.log("========================================");
        console.log("MongoDB Connected Successfully");
        console.log("========================================");
        console.log("Host     :", mongoose.connection.host);
        console.log("Database :", mongoose.connection.name);
        console.log("State    :", mongoose.connection.readyState);
        console.log("========================================");
        console.log("");

    } catch (err) {

        console.error("");
        console.error("========================================");
        console.error("MONGODB CONNECTION FAILED");
        console.error("========================================");
        console.error(err);
        console.error("----------------------------------------");
        console.error("Name    :", err.name);
        console.error("Code    :", err.code);
        console.error("Message :", err.message);
        console.error("Reason  :", err.reason);
        console.error("DNS     :", dns.getServers());
        console.error("========================================");

        process.exit(1);

    }

};

module.exports = connectDB;