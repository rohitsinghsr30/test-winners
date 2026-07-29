const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

/*
|--------------------------------------------------------------------------
| REQUEST WITHDRAWAL
|--------------------------------------------------------------------------
| POST /api/withdrawals/request
*/

const requestWithdrawal = async (req, res) => {

    try {

        const {

            amount,
            paymentMethod,
            accountHolderName,
            upiId,
            bankName,
            accountNumber,
            ifscCode

        } = req.body;

        if (!amount || amount <= 0) {

            return res.status(400).json({

                success: false,
                message: "Invalid withdrawal amount."

            });

        }

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        if (user.winning < amount) {

            return res.status(400).json({

                success: false,
                message: "Insufficient winning balance."

            });

        }

        const withdrawal = await Withdrawal.create({

            user: user._id,

            amount,

            paymentMethod,

            accountHolderName,

            upiId,

            bankName,

            accountNumber,

            ifscCode

        });

        return res.status(201).json({

            success: true,

            message: "Withdrawal request submitted successfully.",

            withdrawal

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
| MY WITHDRAWALS
|--------------------------------------------------------------------------
| GET /api/withdrawals/my
*/

const getMyWithdrawals = async (req, res) => {

    try {

        const withdrawals = await Withdrawal.find({

            user: req.user.id

        }).sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: withdrawals.length,

            withdrawals

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
| GET SINGLE WITHDRAWAL
|--------------------------------------------------------------------------
| GET /api/withdrawals/:id
*/

const getWithdrawalById = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id)

            .populate("user", "fullName email mobile");

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        return res.status(200).json({

            success: true,

            withdrawal

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
| APPROVE WITHDRAWAL
|--------------------------------------------------------------------------
| PUT /api/withdrawals/:id/approve
*/

const approveWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        if (withdrawal.status !== "Pending") {

            return res.status(400).json({

                success: false,

                message: "Withdrawal already processed."

            });

        }

        const user = await User.findById(withdrawal.user);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (user.winning < withdrawal.amount) {

            return res.status(400).json({

                success: false,

                message: "Insufficient winning balance."

            });

        }

        user.winning -= withdrawal.amount;
        user.totalWithdrawn += withdrawal.amount;

        await user.save();

        withdrawal.status = "Approved";
        withdrawal.approvedBy = req.user.id;
        withdrawal.approvedAt = new Date();

        await withdrawal.save();

        await Transaction.create({

            user: user._id,

            amount: withdrawal.amount,

            type: "Withdrawal",

            status: "Approved",

            paymentMethod: withdrawal.paymentMethod,

            description: "Withdrawal Approved",

            referenceId: withdrawal._id

        });

        return res.status(200).json({

            success: true,

            message: "Withdrawal approved successfully.",

            withdrawal

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
| REJECT WITHDRAWAL
|--------------------------------------------------------------------------
| PUT /api/withdrawals/:id/reject
*/

const rejectWithdrawal = async (req, res) => {

    try {

        const { remark } = req.body;

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        withdrawal.status = "Rejected";
        withdrawal.adminRemark = remark || "";

        await withdrawal.save();

        return res.status(200).json({

            success: true,

            message: "Withdrawal rejected successfully.",

            withdrawal

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
| MARK AS PAID
|--------------------------------------------------------------------------
| PUT /api/withdrawals/:id/paid
*/

const markWithdrawalPaid = async (req, res) => {

    try {

        const {

            transactionId,
            paymentReference

        } = req.body;

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        withdrawal.status = "Paid";
        withdrawal.transactionId = transactionId || "";
        withdrawal.paymentReference = paymentReference || "";

        await withdrawal.save();

        return res.status(200).json({

            success: true,

            message: "Withdrawal marked as paid.",

            withdrawal

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
| GET ALL WITHDRAWALS (ADMIN)
|--------------------------------------------------------------------------
| GET /api/withdrawals
*/

const getAllWithdrawals = async (req, res) => {

    try {

        const withdrawals = await Withdrawal.find()

            .populate("user", "fullName email mobile")

            .sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            total: withdrawals.length,

            withdrawals

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
| WITHDRAWAL STATISTICS
|--------------------------------------------------------------------------
| GET /api/withdrawals/statistics
*/

const getWithdrawalStatistics = async (req, res) => {

    try {

        const totalRequests = await Withdrawal.countDocuments();

        const pending = await Withdrawal.countDocuments({

            status: "Pending"

        });

        const approved = await Withdrawal.countDocuments({

            status: "Approved"

        });

        const paid = await Withdrawal.countDocuments({

            status: "Paid"

        });

        const rejected = await Withdrawal.countDocuments({

            status: "Rejected"

        });

        const totalAmount = await Withdrawal.aggregate([

            {

                $group: {

                    _id: null,

                    total: {

                        $sum: "$amount"

                    }

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            statistics: {

                totalRequests,

                pending,

                approved,

                paid,

                rejected,

                totalWithdrawalAmount:
                    totalAmount.length > 0
                        ? totalAmount[0].total
                        : 0

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
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {

    requestWithdrawal,

    getMyWithdrawals,

    getWithdrawalById,

    approveWithdrawal,

    rejectWithdrawal,

    markWithdrawalPaid,

    getAllWithdrawals,

    getWithdrawalStatistics

};