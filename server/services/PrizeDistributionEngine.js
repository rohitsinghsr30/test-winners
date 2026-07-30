const mongoose = require("mongoose");

const User = require("../models/user");
const Result = require("../models/Result");
const Test = require("../models/Test");
const Transaction = require("../models/Transaction");

/*
|--------------------------------------------------------------------------
| Prize Distribution Engine
|--------------------------------------------------------------------------
|
| Responsibilities
| • Read all pending winners
| • Credit prize money
| • Create transaction
| • Update reward status
| • Prevent duplicate payment
|
*/

const PrizeDistributionEngine = async (testId) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        console.log("");
        console.log("===========================================");
        console.log("PRIZE DISTRIBUTION ENGINE STARTED");
        console.log("===========================================");
        console.log("Test :", testId);

        // =====================================================
        // LOAD TEST
        // =====================================================

        const test = await Test.findById(testId).session(session);

        if (!test) {

            await session.abortTransaction();
            session.endSession();

            return {

                success: false,

                message: "Test Not Found"

            };

        }

        // =====================================================
        // LOAD PENDING WINNERS
        // =====================================================

        const winners = await Result.find({

            test: testId,

            rewardStatus: "Pending",

            rewardAmount: {
                $gt: 0
            }

        })
        .populate("user")
        .sort({
            rank: 1
        })
        .session(session);

        if (!winners.length) {

            console.log("No Pending Winners");

            await session.commitTransaction();

            session.endSession();

            return {

                success: true,

                message: "No Pending Winners"

            };

        }

        console.log("");

        console.log(`${winners.length} Winners Found`);

        let creditedUsers = 0;

        let totalDistributed = 0;

        // =====================================================
        // START CREDIT PROCESS
        // =====================================================

        for (const winner of winners) {

            if (!winner.user) {

                continue;

            }

            const user = await User.findById(
                winner.user._id
            ).session(session);

            if (!user) {

                continue;

            }

            // Prevent duplicate credit

            if (winner.rewardStatus === "Credited") {

                continue;

            }

            user.winning += winner.rewardAmount;

            user.totalRewards += winner.rewardAmount;

            if (
                winner.prizePosition > 0
            ) {

                user.testsWon += 1;

            }

            if (
                user.bestRank === 0 ||
                winner.rank < user.bestRank
            ) {

                user.bestRank = winner.rank;

            }

            user.currentRank = winner.rank;

            await user.save({
                session
            });

            totalDistributed += winner.rewardAmount;

            creditedUsers++;
                        // =====================================================
            // CREATE TRANSACTION
            // =====================================================

            await Transaction.create(
                [
                    {
                        user: user._id,

                        amount: winner.rewardAmount,

                        type: "Prize",

                        status: "Success",

                        test: test._id,

                        referenceId:
                            `PRIZE-${test._id}-${winner._id}`,

                        description:
                            `Prize credited for ${test.title}`,
                    },
                ],
                {
                    session,
                }
            );

            // =====================================================
            // UPDATE RESULT
            // =====================================================

            winner.rewardStatus = "Credited";

            await winner.save({
                session,
            });

            console.log(
                `✔ Rank ${winner.rank} | ${user.fullName} | ₹${winner.rewardAmount} Credited`
            );

        }

        // =====================================================
        // UPDATE TEST
        // =====================================================

        test.winnersPublished = true;

        await test.save({
            session,
        });

        // =====================================================
        // COMMIT TRANSACTION
        // =====================================================

        await session.commitTransaction();

        session.endSession();

        console.log("");
        console.log("===========================================");
        console.log("PRIZE DISTRIBUTION COMPLETED");
        console.log("===========================================");
        console.log(`Total Winners     : ${creditedUsers}`);
        console.log(`Total Distributed : ₹${totalDistributed}`);
        console.log("===========================================");

        return {

            success: true,

            message: "Prize Distributed Successfully",

            winners: creditedUsers,

            totalAmount: totalDistributed,

        };

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        console.log("");
        console.log("===========================================");
        console.log("PRIZE DISTRIBUTION ERROR");
        console.log("===========================================");
        console.log(error);

        return {

            success: false,

            message: error.message,

        };

    }

};

module.exports = PrizeDistributionEngine;