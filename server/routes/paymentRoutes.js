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
    getPaymentById,
    markPaymentFailed,
    refundPayment,
    deletePayment
} = require("../controllers/paymentController");

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// Create Razorpay Order
router.post(
    "/create-order",
    authMiddleware,
    createOrder
);

// Verify Razorpay Payment
router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

// Logged-in User Payment History
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

// Get Single Payment Details
router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getPaymentById
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

// Delete Payment
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deletePayment
);

module.exports = router;