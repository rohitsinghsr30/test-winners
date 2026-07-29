const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // ===========================================
        // USER
        // ===========================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // ===========================================
        // TEST
        // ===========================================

        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test",
            default: null,
            index: true,
        },

        // ===========================================
        // NOTIFICATION
        // ===========================================

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "Prize",
                "Result",
                "Wallet",
                "Deposit",
                "Withdraw",
                "Referral",
                "System",
                "Announcement"
            ],
            default: "System",
        },

        // ===========================================
        // STATUS
        // ===========================================

        isRead: {
            type: Boolean,
            default: false,
        },

        // ===========================================
        // EXTRA DATA
        // ===========================================

        referenceId: {
            type: String,
            default: "",
            trim: true,
        },

        actionUrl: {
            type: String,
            default: "",
            trim: true,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// ===========================================
// INDEXES
// ===========================================

notificationSchema.index({
    user: 1,
    createdAt: -1,
});

notificationSchema.index({
    user: 1,
    isRead: 1,
});

notificationSchema.index({
    type: 1,
});

notificationSchema.index({
    referenceId: 1,
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);