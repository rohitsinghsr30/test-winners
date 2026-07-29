const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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
    // PAYMENT DETAILS
    // ======================================================

    amount: {
        type: Number,
        required: true,
        min: 1,
    },

    currency: {
        type: String,
        default: "INR",
    },

    gateway: {
        type: String,
        enum: [
            "Razorpay",
            "Cashfree",
            "PhonePe",
            "PayU",
            "Manual"
        ],
        default: "Razorpay",
    },

    purpose: {
        type: String,
        enum: [
            "Wallet Recharge",
            "Entry Fee",
            "Subscription",
            "Other"
        ],
        default: "Wallet Recharge",
    },

    // ======================================================
    // GATEWAY IDS
    // ======================================================

    orderId: {
        type: String,
        default: "",
    },

    paymentId: {
        type: String,
        default: "",
    },

    signature: {
        type: String,
        default: "",
    },

    transactionId: {
        type: String,
        default: "",
    },

    // ======================================================
    // STATUS
    // ======================================================

    status: {
        type: String,
        enum: [
            "Created",
            "Pending",
            "Success",
            "Failed",
            "Refunded"
        ],
        default: "Created",
    },

    failureReason: {
        type: String,
        default: "",
    },

    // ======================================================
    // METADATA
    // ======================================================

    ipAddress: {
        type: String,
        default: "",
    },

    device: {
        type: String,
        default: "",
    },

    remarks: {
        type: String,
        default: "",
    }

},
{
    timestamps: true,
}
);

module.exports =
    mongoose.models.Payment ||
    mongoose.model("Payment", paymentSchema);