const Result = require("../models/Result");
const Test = require("../models/Test");

/*
|--------------------------------------------------------------------------
| GET LEADERBOARD
|--------------------------------------------------------------------------
| GET /api/leaderboard/:testId
*/

const getLeaderboard = async (req, res) => {

    try {

        const { testId } = req.params;

        let { page = 1, limit = 50, search = "" } = req.query;

        page = Number(page);
        limit = Number(limit);

        const test = await Test.findById(testId);

        if (!test) {

            return res.status(404).json({

                success: false,

                message: "Test Not Found"

            });

        }

        let query = {

            test: testId,

            status: "Completed"

        };

        let leaderboard = await Result.find(query)

            .populate({

                path: "user",

                select: "fullName profileImage"

            })

            .sort({

                rank: 1

            });

        // ==========================================
        // SEARCH FILTER
        // ==========================================

        if (search.trim() !== "") {

            leaderboard = leaderboard.filter(item =>

                item.user &&
                item.user.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase())

            );

        }

        // ==========================================
        // PAGINATION
        // ==========================================

        const totalParticipants = leaderboard.length;

        const totalPages = Math.ceil(
            totalParticipants / limit
        );

        const start = (page - 1) * limit;

        const end = start + limit;

        leaderboard = leaderboard.slice(start, end);

        // ==========================================
        // RESPONSE DATA
        // ==========================================

        const data = leaderboard.map(result => ({

            userId: result.user?._id,

            name: result.user?.fullName || "Unknown",

            profileImage: result.user?.profileImage || "",

            rank: result.rank,

            score: result.score,

            percentage: result.percentage,

            accuracy: result.accuracy,

            correctAnswers: result.correctAnswers,

            wrongAnswers: result.wrongAnswers,

            unanswered: result.unanswered,

            timeTaken: result.timeTaken,

            percentile: result.percentile,

            prizePosition: result.prizePosition,

            rewardAmount: result.rewardAmount,

            rewardStatus: result.rewardStatus,

            submittedAt: result.submittedAt

        }));

        return res.status(200).json({

            success: true,

            test: {

                id: test._id,

                title: test.title,

                subject: test.subject

            },

            pagination: {

                currentPage: page,

                totalPages,

                totalParticipants,

                limit

            },

            leaderboard: data

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET MY RANK
|--------------------------------------------------------------------------
| GET /api/leaderboard/:testId/me
*/

const getMyRank = async (req, res) => {

    try {

        const { testId } = req.params;

        const userId = req.user.id;

        const result = await Result.findOne({

            test: testId,

            user: userId,

            status: "Completed"

        }).populate({

            path: "user",

            select: "fullName profileImage"

        });

        if (!result) {

            return res.status(404).json({

                success: false,

                message: "Result Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            data: {

                userId: result.user._id,

                name: result.user.fullName,

                profileImage: result.user.profileImage,

                rank: result.rank,

                score: result.score,

                percentage: result.percentage,

                accuracy: result.accuracy,

                percentile: result.percentile,

                prizePosition: result.prizePosition,

                rewardAmount: result.rewardAmount,

                rewardStatus: result.rewardStatus,

                submittedAt: result.submittedAt

            }

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET TOP WINNERS
|--------------------------------------------------------------------------
| GET /api/leaderboard/:testId/top
*/

const getTopWinners = async (req, res) => {

    try {

        const { testId } = req.params;

        const winners = await Result.find({

            test: testId,

            prizePosition: {

                $gt: 0

            },

            rewardAmount: {

                $gt: 0

            }

        })

        .populate({

            path: "user",

            select: "fullName profileImage"

        })

        .sort({

            rank: 1

        })

        .limit(10);

        return res.status(200).json({

            success: true,

            totalWinners: winners.length,

            winners: winners.map(item => ({

                userId: item.user?._id,

                name: item.user?.fullName || "Unknown",

                profileImage: item.user?.profileImage || "",

                rank: item.rank,

                prizePosition: item.prizePosition,

                rewardAmount: item.rewardAmount,

                rewardStatus: item.rewardStatus,

                score: item.score,

                percentage: item.percentage,

                percentile: item.percentile

            }))

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {

    getLeaderboard,

    getMyRank,

    getTopWinners

};