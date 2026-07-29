const Result = require("../models/Result");
const Test = require("../models/Test");

/*
|--------------------------------------------------------------------------
| Calculate Percentile
|--------------------------------------------------------------------------
*/

const calculatePercentile = (rank, totalParticipants) => {

    if (totalParticipants <= 1) {
        return 100;
    }

    return Number(
        (
            ((totalParticipants - rank) /
                (totalParticipants - 1)) *
            100
        ).toFixed(2)
    );

};

/*
|--------------------------------------------------------------------------
| Ranking Engine
|--------------------------------------------------------------------------
*/

const RankingEngine = async (testId) => {

    try {

        console.log("");
        console.log("========================================");
        console.log("RANKING ENGINE STARTED");
        console.log("========================================");
        console.log("Test ID :", testId);

        // ===========================================================
        // CHECK TEST
        // ===========================================================

        const test = await Test.findById(testId);

        if (!test) {

            console.log("Test Not Found");

            return {
                success: false,
                message: "Test Not Found"
            };

        }

        // ===========================================================
        // LOAD RESULTS
        // ===========================================================

        const results = await Result.find({
            test: testId,
            status: "Completed"
        })
        .populate("user", "fullName")
        .sort({
            score: -1,
            timeTaken: 1,
            submittedAt: 1
        });

        if (!results.length) {

            console.log("No Results Found");

            return {
                success: false,
                message: "No Results Found"
            };

        }

        console.log("");
        console.log("Participants :", results.length);

        // ===========================================================
        // RANK CALCULATION
        // ===========================================================

        let bulkOperations = [];

        let previousScore = null;
        let previousTime = null;

        let currentRank = 1;

        for (let i = 0; i < results.length; i++) {

            const result = results[i];

            if (
                previousScore !== null &&
                (
                    result.score !== previousScore ||
                    result.timeTaken !== previousTime
                )
            ) {

                currentRank = i + 1;

            }

            previousScore = result.score;
            previousTime = result.timeTaken;

            const percentile = calculatePercentile(
                currentRank,
                results.length
            );

            bulkOperations.push({

                updateOne: {

                    filter: {
                        _id: result._id
                    },

                    update: {

                        $set: {

                            rank: currentRank,

                            percentile: percentile

                        }

                    }

                }

            });

        }
                // ===========================================================
        // UPDATE DATABASE
        // ===========================================================

        if (bulkOperations.length > 0) {

            await Result.bulkWrite(bulkOperations);

            console.log("");
            console.log(`${bulkOperations.length} Results Updated`);

        }

        // ===========================================================
        // UPDATE TEST STATISTICS
        // ===========================================================

        const totalParticipants = results.length;

        const totalScore = results.reduce(
            (sum, item) => sum + item.score,
            0
        );

        const averageScore =
            totalParticipants > 0
                ? Number(
                      (totalScore / totalParticipants).toFixed(2)
                  )
                : 0;

        await Test.findByIdAndUpdate(
            testId,
            {
                totalSubmissions: totalParticipants,
                averageScore,
                winnersPublished: true,
            },
            {
                new: true,
            }
        );

        // ===========================================================
        // TOP 10 PREVIEW
        // ===========================================================

        console.log("");
        console.log("========== TOP 10 ==========");

        results.slice(0, 10).forEach((result, index) => {

            console.log(
                `${index + 1}. ${result.user?.fullName || "Unknown"} | Score: ${result.score} | Rank: ${index + 1}`
            );

        });

        console.log("============================");

        console.log("");
        console.log("========================================");
        console.log("RANKING ENGINE COMPLETED SUCCESSFULLY");
        console.log("========================================");

        return {

            success: true,

            message: "Ranking Completed Successfully",

            totalParticipants,

            averageScore

        };

    } catch (error) {

        console.log("");
        console.log("========================================");
        console.log("RANKING ENGINE ERROR");
        console.log("========================================");
        console.log(error);

        return {

            success: false,

            message: error.message

        };

    }

};

module.exports = RankingEngine;