const User = require("../models/user");
const Test = require("../models/Test");
const Result = require("../models/Result");
const Transaction = require("../models/Transaction");

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTests = await Test.countDocuments();
    const totalResults = await Result.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    const totalRevenueData = await Transaction.aggregate([
      {
        $match: {
          type: "Entry Fee",
          status: "Success",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue =
      totalRevenueData.length > 0
        ? totalRevenueData[0].total
        : 0;

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTests = await Test.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalTests,
        totalResults,
        totalTransactions,
        totalRevenue,
        recentUsers,
        recentTests,
      },
    });

  } catch (error) {

    console.error("ADMIN DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================================
// CREATE TEST
// ======================================================

const createTest = async (req, res) => {

  try {

    const {
      title,
      description,
      subject,
      duration,
      totalQuestions,
      totalMarks,
      marksPerQuestion,
      negativeMarking,
      entryFee,
      maxParticipants,
      prizePool,
      prizes,
      startTime,
      endTime,
      allowMultipleAttempts,
    } = req.body;

    // ================= VALIDATION =================

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title and Subject are required.",
      });
    }

    let finalPrizes = [];

    if (Array.isArray(prizes) && prizes.length > 0) {

      finalPrizes = prizes
        .map((item) => ({
          rank: Number(item.rank),
          amount: Number(item.amount),
        }))
        .filter(
          (item) =>
            item.rank > 0 &&
            item.amount >= 0
        )
        .sort((a, b) => a.rank - b.rank);

    } else {

      finalPrizes = [
        { rank: 1, amount: 500 },
        { rank: 2, amount: 300 },
        { rank: 3, amount: 200 },
      ];

    }

    const test = await Test.create({

      // BASIC DETAILS
      title,
      description,
      subject,

      // EXAM SETTINGS
      duration: duration || 180,
      totalQuestions: totalQuestions || 100,
      totalMarks: totalMarks || 100,
      marksPerQuestion: marksPerQuestion || 1,
      negativeMarking:
        negativeMarking === undefined
          ? 0.25
          : negativeMarking,

      // ENTRY
      entryFee: entryFee || 10,
      maxParticipants: maxParticipants || 0,

      // PRIZE
      prizePool: prizePool || 0,
      prizes: finalPrizes,

      // TIME
      startTime,
      endTime,

      // RESULT
      allowMultipleAttempts:
        allowMultipleAttempts || false,

      winnersPublished: false,

      // STATS
      joinedUsers: 0,
      totalRevenue: 0,
      totalSubmissions: 0,
      averageScore: 0,

      // STATUS
      status: "upcoming",

    });

    return res.status(201).json({
      success: true,
      message: "Test created successfully.",
      test,
    });

  } catch (error) {

    console.error("CREATE TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getDashboard,
  createTest,
};