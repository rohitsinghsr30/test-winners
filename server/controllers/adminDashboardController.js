const User = require("../models/user");
const Test = require("../models/Test");
const Result = require("../models/Result");
const Transaction = require("../models/Transaction");

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD SUMMARY
|--------------------------------------------------------------------------
| GET /api/admin/dashboard
*/

const getDashboardSummary = async (req, res) => {

    try {

        // ==========================================================
        // USERS
        // ==========================================================

        const totalUsers = await User.countDocuments();

        const activeUsers = await User.countDocuments({
            status: "active"
        });

        const blockedUsers = await User.countDocuments({
            status: "blocked"
        });

        // ==========================================================
        // TESTS
        // ==========================================================

        const totalTests = await Test.countDocuments();

        const upcomingTests = await Test.countDocuments({
            status: "upcoming"
        });

        const liveTests = await Test.countDocuments({
            status: "live"
        });

        const completedTests = await Test.countDocuments({
            status: "completed"
        });

        const cancelledTests = await Test.countDocuments({
            status: "cancelled"
        });

        // ==========================================================
        // RESULTS
        // ==========================================================

        const totalAttempts = await Result.countDocuments();

        const totalCompletedResults = await Result.countDocuments({
            status: "Completed"
        });

        // ==========================================================
        // REVENUE
        // ==========================================================

        const revenueData = await Transaction.aggregate([
            {
                $match: {
                    type: "Entry Fee",
                    status: "Success"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const totalRevenue =
            revenueData.length > 0
                ? revenueData[0].totalRevenue
                : 0;

        // ==========================================================
        // PRIZE DISTRIBUTION
        // ==========================================================

        const prizeData = await Transaction.aggregate([
            {
                $match: {
                    type: "Prize",
                    status: "Success"
                }
            },
            {
                $group: {
                    _id: null,
                    totalPrizeDistributed: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const totalPrizeDistributed =
            prizeData.length > 0
                ? prizeData[0].totalPrizeDistributed
                : 0;

        // ==========================================================
        // USER WALLET
        // ==========================================================

        const walletData = await User.aggregate([
            {
                $group: {
                    _id: null,
                    walletBalance: {
                        $sum: "$wallet"
                    },
                    winningBalance: {
                        $sum: "$winning"
                    },
                    totalRewards: {
                        $sum: "$totalRewards"
                    }
                }
            }
        ]);

        const walletSummary =
            walletData.length > 0
                ? walletData[0]
                : {
                    walletBalance: 0,
                    winningBalance: 0,
                    totalRewards: 0
                };

        // ==========================================================
        // RESPONSE
        // ==========================================================

        return res.status(200).json({

            success: true,

            dashboard: {

                users: {

                    total: totalUsers,

                    active: activeUsers,

                    blocked: blockedUsers

                },

                tests: {

                    total: totalTests,

                    upcoming: upcomingTests,

                    live: liveTests,

                    completed: completedTests,

                    cancelled: cancelledTests

                },

                attempts: {

                    total: totalAttempts,

                    completed: totalCompletedResults

                },

                finance: {

                    totalRevenue,

                    totalPrizeDistributed,

                    walletBalance: walletSummary.walletBalance,

                    winningBalance: walletSummary.winningBalance,

                    totalRewards: walletSummary.totalRewards

                }

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| RECENT TRANSACTIONS
|--------------------------------------------------------------------------
| GET /api/admin/dashboard/transactions
*/

const getRecentTransactions = async (req, res) => {

    try {

        const transactions = await Transaction.find()

            .populate("user", "fullName email")

            .populate("test", "title")

            .sort({
                createdAt: -1
            })

            .limit(10);

        return res.status(200).json({

            success: true,

            total: transactions.length,

            transactions

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| TOP WINNERS
|--------------------------------------------------------------------------
| GET /api/admin/dashboard/top-winners
*/

const getTopWinners = async (req, res) => {

    try {

        const winners = await Result.find({

            rewardAmount: {
                $gt: 0
            }

        })

        .populate("user", "fullName profileImage")

        .populate("test", "title")

        .sort({

            rewardAmount: -1,

            rank: 1

        })

        .limit(10);

        return res.status(200).json({

            success: true,

            total: winners.length,

            winners

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| RECENT USERS
|--------------------------------------------------------------------------
| GET /api/admin/dashboard/recent-users
*/

const getRecentUsers = async (req, res) => {

    try {

        const users = await User.find()

            .select("-password")

            .sort({

                createdAt: -1

            })

            .limit(10);

        return res.status(200).json({

            success: true,

            total: users.length,

            users

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| RECENT TESTS
|--------------------------------------------------------------------------
| GET /api/admin/dashboard/recent-tests
*/

const getRecentTests = async (req, res) => {

    try {

        const tests = await Test.find()

            .sort({

                createdAt: -1

            })

            .limit(10);

        return res.status(200).json({

            success: true,

            total: tests.length,

            tests

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| MONTHLY ANALYTICS
|--------------------------------------------------------------------------
| GET /api/admin/dashboard/analytics
*/

const getMonthlyAnalytics = async (req, res) => {

    try {

        const analytics = await Transaction.aggregate([

            {
                $match: {
                    status: "Success"
                }
            },

            {
                $group: {

                    _id: {

                        year: {
                            $year: "$createdAt"
                        },

                        month: {
                            $month: "$createdAt"
                        }

                    },

                    revenue: {

                        $sum: "$amount"

                    },

                    transactions: {

                        $sum: 1

                    }

                }

            },

            {
                $sort: {

                    "_id.year": 1,

                    "_id.month": 1

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            analytics

        });

    } catch (error) {

        console.error(error);

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

    getDashboardSummary,

    getRecentTransactions,

    getTopWinners,

    getRecentUsers,

    getRecentTests,

    getMonthlyAnalytics

};