const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {

    requestWithdrawal,

    getMyWithdrawals,

    getWithdrawalById,

    approveWithdrawal,

    rejectWithdrawal,

    markWithdrawalPaid,

    getAllWithdrawals,

    getWithdrawalStatistics

} = require("../controllers/withdrawalController");

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// Request Withdrawal
router.post(
    "/request",
    authMiddleware,
    requestWithdrawal
);

// My Withdrawals
router.get(
    "/my",
    authMiddleware,
    getMyWithdrawals
);

// Single Withdrawal
router.get(
    "/:id",
    authMiddleware,
    getWithdrawalById
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Statistics
router.get(
    "/statistics",
    authMiddleware,
    adminMiddleware,
    getWithdrawalStatistics
);

// All Withdrawals
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllWithdrawals
);

// Approve
router.put(
    "/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveWithdrawal
);

// Reject
router.put(
    "/:id/reject",
    authMiddleware,
    adminMiddleware,
    rejectWithdrawal
);

// Mark Paid
router.put(
    "/:id/paid",
    authMiddleware,
    adminMiddleware,
    markWithdrawalPaid
);

module.exports = router;