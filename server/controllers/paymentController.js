const crypto = require("crypto");

const Payment = require("../models/Payment");
const User = require("../models/user");
const Transaction = require("../models/Transaction");

const {
    createOrder: createRazorpayOrder,
} = require("../services/RazorpayService");

/*
|--------------------------------------------------------------------------
| CREATE PAYMENT ORDER
|--------------------------------------------------------------------------
| POST /api/payments/create-order
*/

const createOrder = async (req, res) => {

    try {

        const {

            amount,

            gateway = "Razorpay",

        } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {

            return res.status(400).json({

                success: false,

                message: "Invalid payment amount."

            });

        }

        // Create Razorpay Order

        const razorpayOrder = await createRazorpayOrder(

            amount,

            `wallet_${Date.now()}`

        );

        // Save payment record

        const payment = await Payment.create({

            user: req.user.id,

            amount,

            gateway,

            currency: "INR",

            purpose: "Wallet Recharge",

            orderId: razorpayOrder.id,

            status: "Created",

            ipAddress: req.ip,

            device: req.headers["user-agent"]

        });

        return res.status(201).json({

            success: true,

            message: "Payment order created successfully.",

            order: razorpayOrder,

            payment

        });

    }

    catch (error) {

        console.error("Create Payment Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| VERIFY PAYMENT
|--------------------------------------------------------------------------
| POST /api/payments/verify
*/

const verifyPayment = async (req, res) => {

    try {

        const {

            orderId,

            paymentId,

            signature

        } = req.body;

        // ===============================================
        // Validate Request
        // ===============================================

        if (!orderId || !paymentId || !signature) {

            return res.status(400).json({

                success: false,

                message: "Missing payment details."

            });

        }

        // ===============================================
        // Find Payment
        // ===============================================

        const payment = await Payment.findOne({

            orderId

        });

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        // ===============================================
        // Prevent Duplicate Verification
        // ===============================================

        if (payment.status === "Success") {

            return res.status(200).json({

                success: true,

                message: "Payment already verified."

            });

        }

        // ===============================================
        // Verify Razorpay Signature
        // ===============================================

        const expectedSignature = crypto

            .createHmac(

                "sha256",

                process.env.RAZORPAY_KEY_SECRET

            )

            .update(`${orderId}|${paymentId}`)

            .digest("hex");

        if (expectedSignature !== signature) {

            payment.status = "Failed";

            payment.failureReason = "Invalid Razorpay Signature";

            await payment.save();

            return res.status(400).json({

                success: false,

                message: "Payment verification failed."

            });

        }

        // ===============================================
        // Update Payment
        // ===============================================

        payment.paymentId = paymentId;

        payment.signature = signature;

        payment.status = "Success";

        await payment.save();

        // ===============================================
        // Find User
        // ===============================================

        const user = await User.findById(payment.user);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        // ===============================================
        // Credit Wallet
        // ===============================================

        user.wallet += payment.amount;

        user.totalDeposited += payment.amount;

        await user.save();

        // ===============================================
        // Create Transaction
        // ===============================================

        await Transaction.create({

            user: user._id,

            amount: payment.amount,

            type: "Deposit",

            status: "Success",

            paymentMethod: payment.gateway,

            description: "Wallet Recharge",

            referenceId: payment.paymentId

        });

        return res.status(200).json({

            success: true,

            message: "Payment verified successfully.",

            wallet: user.wallet

        });

    }

    catch (error) {

        console.error("Verify Payment Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| PAYMENT HISTORY
|--------------------------------------------------------------------------
| GET /api/payments/history
*/

const getPaymentHistory = async (req, res) => {

    try {

        let {

            page = 1,

            limit = 10,

            status

        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const query = {

            user: req.user.id

        };

        if (status) {

            query.status = status;

        }

        const totalPayments = await Payment.countDocuments(query);

        const payments = await Payment.find(query)

            .sort({

                createdAt: -1

            })

            .skip((page - 1) * limit)

            .limit(limit);

        return res.status(200).json({

            success: true,

            totalPayments,

            currentPage: page,

            totalPages: Math.ceil(totalPayments / limit),

            payments

        });

    }

    catch (error) {

        console.error("Payment History Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET ALL PAYMENTS (ADMIN)
|--------------------------------------------------------------------------
| GET /api/payments
*/

const getAllPayments = async (req, res) => {

    try {

        let {

            page = 1,

            limit = 20,

            search,

            status,

            gateway

        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const query = {};

        if (status) {

            query.status = status;

        }

        if (gateway) {

            query.gateway = gateway;

        }

        // ===============================================
        // Search User
        // ===============================================

        if (search) {

            const users = await User.find({

                $or: [

                    {

                        fullName: {

                            $regex: search,

                            $options: "i"

                        }

                    },

                    {

                        email: {

                            $regex: search,

                            $options: "i"

                        }

                    },

                    {

                        mobile: {

                            $regex: search,

                            $options: "i"

                        }

                    }

                ]

            }).select("_id");

            query.user = {

                $in: users.map(user => user._id)

            };

        }

        const totalPayments = await Payment.countDocuments(query);

        const payments = await Payment.find(query)

            .populate(

                "user",

                "fullName email mobile wallet"

            )

            .sort({

                createdAt: -1

            })

            .skip(

                (page - 1) * limit

            )

            .limit(limit);

        return res.status(200).json({

            success: true,

            totalPayments,

            currentPage: page,

            totalPages: Math.ceil(

                totalPayments / limit

            ),

            payments

        });

    }

    catch (error) {

        console.error("Admin Payment Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET PAYMENT STATISTICS
|--------------------------------------------------------------------------
| GET /api/payments/statistics
*/

const getPaymentStatistics = async (req, res) => {

    try {

        const totalPayments = await Payment.countDocuments();

        const successfulPayments = await Payment.countDocuments({
            status: "Success"
        });

        const failedPayments = await Payment.countDocuments({
            status: "Failed"
        });

        const pendingPayments = await Payment.countDocuments({
            status: "Pending"
        });

        const refundedPayments = await Payment.countDocuments({
            status: "Refunded"
        });

        const totalCollection = await Payment.aggregate([

            {
                $match: {
                    status: "Success"
                }
            },

            {
                $group: {
                    _id: null,
                    amount: {
                        $sum: "$amount"
                    }
                }
            }

        ]);

        return res.status(200).json({

            success: true,

            statistics: {

                totalPayments,

                successfulPayments,

                failedPayments,

                pendingPayments,

                refundedPayments,

                totalCollection:
                    totalCollection.length > 0
                        ? totalCollection[0].amount
                        : 0

            }

        });

    } catch (error) {

        console.error("Payment Statistics Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET PAYMENT BY ID
|--------------------------------------------------------------------------
| GET /api/payments/:id
*/

const getPaymentById = async (req, res) => {

    try {

        const payment = await Payment.findById(req.params.id)

            .populate(

                "user",

                "fullName email mobile wallet"

            );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        return res.status(200).json({

            success: true,

            payment

        });

    } catch (error) {

        console.error("Get Payment Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| MARK PAYMENT FAILED
|--------------------------------------------------------------------------
| PUT /api/payments/:id/fail
*/

const markPaymentFailed = async (req, res) => {

    try {

        const payment = await Payment.findById(req.params.id);

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        payment.status = "Failed";

        payment.failureReason =
            req.body.reason || "Payment Failed";

        await payment.save();

        return res.status(200).json({

            success: true,

            message: "Payment marked as failed.",

            payment

        });

    } catch (error) {

        console.error("Payment Failed Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| REFUND PAYMENT
|--------------------------------------------------------------------------
| POST /api/payments/:id/refund
*/

const refundPayment = async (req, res) => {

    try {

        const payment = await Payment.findById(req.params.id);

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        if (payment.status !== "Success") {

            return res.status(400).json({

                success: false,

                message: "Only successful payments can be refunded."

            });

        }

        const user = await User.findById(payment.user);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (user.wallet < payment.amount) {

            return res.status(400).json({

                success: false,

                message: "Insufficient wallet balance."

            });

        }

        user.wallet -= payment.amount;

        user.totalDeposited -= payment.amount;

        await user.save();

        payment.status = "Refunded";

        await payment.save();

        await Transaction.create({

            user: user._id,

            amount: payment.amount,

            type: "Refund",

            status: "Success",

            paymentMethod: payment.gateway,

            description: "Wallet Refund",

            referenceId: payment.paymentId

        });

        return res.status(200).json({

            success: true,

            message: "Refund completed successfully.",

            payment

        });

    } catch (error) {

        console.error("Refund Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| DELETE PAYMENT
|--------------------------------------------------------------------------
| DELETE /api/payments/:id
|--------------------------------------------------------------------------
*/

const deletePayment = async (req, res) => {

    try {

        const payment = await Payment.findById(req.params.id);

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        await payment.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Payment deleted successfully."

        });

    } catch (error) {

        console.error("Delete Payment Error:", error);

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

    createOrder,

    verifyPayment,

    getPaymentHistory,

    getAllPayments,

    getPaymentStatistics,

    getPaymentById,

    markPaymentFailed,

    refundPayment,

    deletePayment

};