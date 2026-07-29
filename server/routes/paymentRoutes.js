const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {

    createOrder,

    verifyPayment,

    getPaymentHistory,

    getAllPayments,

    getPaymentStatistics,

    markPaymentFailed,

    refundPayment

} = require("../controllers/paymentController");

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// Create Payment Order
router.post(
    "/create-order",
    authMiddleware,
    createOrder
);

// Verify Payment
router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

// Payment History
router.get(
    "/history",
    authMiddleware,
    getPaymentHistory
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Payment Statistics
router.get(
    "/statistics",
    authMiddleware,
    adminMiddleware,
    getPaymentStatistics
);

// All Payments
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllPayments
);

// Mark Payment Failed
router.put(
    "/:id/fail",
    authMiddleware,
    adminMiddleware,
    markPaymentFailed
);

// Refund Payment
router.post(
    "/:id/refund",
    authMiddleware,
    adminMiddleware,
    refundPayment
);

module.exports = router;