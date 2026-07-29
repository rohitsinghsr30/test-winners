const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getDashboardSummary,
    getRecentTransactions,
    getTopWinners,
    getRecentUsers,
    getRecentTests,
    getMonthlyAnalytics
} = require("../controllers/adminDashboardController");

/*
|--------------------------------------------------------------------------
| ADMIN AUTHORIZATION
|--------------------------------------------------------------------------
*/

const adminOnly = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({

            success: false,

            message: "Unauthorized"

        });

    }

    if (req.user.role !== "admin") {

        return res.status(403).json({

            success: false,

            message: "Access Denied"

        });

    }

    next();

};

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

router.get(
    "/dashboard",
    authMiddleware,
    adminOnly,
    getDashboardSummary
);

router.get(
    "/dashboard/transactions",
    authMiddleware,
    adminOnly,
    getRecentTransactions
);

router.get(
    "/dashboard/top-winners",
    authMiddleware,
    adminOnly,
    getTopWinners
);

router.get(
    "/dashboard/recent-users",
    authMiddleware,
    adminOnly,
    getRecentUsers
);

router.get(
    "/dashboard/recent-tests",
    authMiddleware,
    adminOnly,
    getRecentTests
);

router.get(
    "/dashboard/analytics",
    authMiddleware,
    adminOnly,
    getMonthlyAnalytics
);

module.exports = router;