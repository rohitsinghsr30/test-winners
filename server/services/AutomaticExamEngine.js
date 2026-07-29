const cron = require("node-cron");

const Test = require("../models/Test");
const RankingEngine = require("./RankingEngine");
const AutomaticWinnerEngine = require("./AutomaticWinnerEngine");
const PrizeDistributionEngine = require("./PrizeDistributionEngine");
const NotificationEngine = require("./NotificationEngine");

const AutomaticExamEngine = () => {

    console.log("");
    console.log("========================================");
    console.log("Automatic Exam Engine Started");
    console.log("========================================");

    cron.schedule("* * * * *", async () => {

        try {

            console.log("Checking Tests...");

            // ==========================================
            // START UPCOMING TESTS
            // ==========================================

            await Test.updateMany(
                {
                    status: "upcoming",
                    startTime: { $lte: new Date() }
                },
                {
                    $set: {
                        status: "live"
                    }
                }
            );

            // ==========================================
            // COMPLETE LIVE TESTS
            // ==========================================

            const completedTests = await Test.find({
                status: "live",
                endTime: { $lte: new Date() }
            });

            for (const test of completedTests) {

                test.status = "completed";

                await test.save();

                console.log(`Test Completed : ${test.title}`);

                // Ranking
                await RankingEngine(test._id);

                // Winner
                await AutomaticWinnerEngine(test._id);

                // Prize
                await PrizeDistributionEngine(test._id);

                // Notification
                await NotificationEngine(test._id);

            }

        } catch (error) {

            console.log("");
            console.log("========================================");
            console.log("Automatic Exam Engine Error");
            console.log(error.message);
            console.log("========================================");

        }

    });

};

module.exports = AutomaticExamEngine;