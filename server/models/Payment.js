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
        index: true,
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
        enum: ["INR"],
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
        unique: true,
        sparse: true,
        trim: true,
    },

    paymentId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },

    signature: {
        type: String,
        default: "",
    },

    transactionId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
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
        index: true,
    },

    failureReason: {
        type: String,
        default: "",
        trim: true,
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
        trim: true,
    },

    // ======================================================
    // AUDIT
    // ======================================================

    verifiedAt: {
        type: Date,
        default: null,
    },

    refundedAt: {
        type: Date,
        default: null,
    },

    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    refundDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    }

},
{
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

// ======================================================
// INDEXES
// ======================================================

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ gateway: 1 });

module.exports =
    mongoose.models.Payment ||
    mongoose.model("Payment", paymentSchema);