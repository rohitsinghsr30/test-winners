const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
{
    // ======================================================
    // USER
    // ======================================================

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // ======================================================
    // AMOUNT
    // ======================================================

    amount: {
        type: Number,
        required: true,
        min: 1,
    },

    // ======================================================
    // PAYMENT DETAILS
    // ======================================================

    paymentMethod: {
        type: String,
        enum: [
            "UPI",
            "Bank",
            "Paytm",
            "PhonePe",
            "GooglePay"
        ],
        required: true,
    },

    accountHolderName: {
        type: String,
        default: "",
    },

    upiId: {
        type: String,
        default: "",
    },

    bankName: {
        type: String,
        default: "",
    },

    accountNumber: {
        type: String,
        default: "",
    },

    ifscCode: {
        type: String,
        default: "",
    },

    // ======================================================
    // STATUS
    // ======================================================

    status: {
        type: String,
        enum: [
            "Pending",
            "Approved",
            "Rejected",
            "Paid"
        ],
        default: "Pending",
    },

    adminRemark: {
        type: String,
        default: "",
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    approvedAt: {
        type: Date,
    },

    // ======================================================
    // PAYMENT
    // ======================================================

    transactionId: {
        type: String,
        default: "",
    },

    paymentReference: {
        type: String,
        default: "",
    }

},
{
    timestamps: true,
}
);

module.exports =
    mongoose.models.Withdrawal ||
    mongoose.model("Withdrawal", withdrawalSchema);