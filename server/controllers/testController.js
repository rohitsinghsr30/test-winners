const Test = require("../models/Test");
const Question = require("../models/Question");
const Result = require("../models/Result");
const Transaction = require("../models/Transaction");
const User = require("../models/user");

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const calculatePercentile = (rank, totalParticipants) => {
  if (totalParticipants <= 1) return 100;

  return Number(
    (
      ((totalParticipants - rank) / (totalParticipants - 1)) *
      100
    ).toFixed(2)
  );
};

// =====================================================
// GET ALL TESTS
// =====================================================

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });
  } catch (error) {
    console.error("GET ALL TESTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch tests.",
    });
  }
};

// =====================================================
// GET SINGLE TEST
// =====================================================

const getSingleTest = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    const questions = await Question.find({
      test: id,
    }).select("-correctAnswer -__v");

    return res.status(200).json({
      success: true,
      test,
      totalQuestions: questions.length,
      questions,
    });
  } catch (error) {
    console.error("GET SINGLE TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch test.",
    });
  }
};

// =====================================================
// START TEST
// =====================================================

const startTest = async (req, res) => {
  try {
    const { id } = req.params;

    // ================= FIND TEST =================

    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    // ================= TEST STATUS =================

    if (test.status !== "live") {
      return res.status(400).json({
        success: false,
        message: "This test is not live.",
      });
    }

    // ================= FIND USER =================

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ================= BLOCK CHECK =================

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    // ================= ALREADY ATTEMPTED =================

    const alreadyAttempted = await Result.findOne({
      user: user._id,
      test: test._id,
    });

    if (alreadyAttempted) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this test.",
      });
    }

    // ================= ENTRY FEE CHECK =================

    if (user.wallet < test.entryFee) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance.",
      });
    }

    // ================= DEDUCT ENTRY FEE =================

    user.wallet -= test.entryFee;
    user.testsAttempted += 1;

    await user.save();

    // ================= UPDATE TEST =================

    test.joinedUsers += 1;
    test.totalRevenue += test.entryFee;

    await test.save();

    // ================= SAVE TRANSACTION =================

    await Transaction.create({
      user: user._id,
      test: test._id,
      amount: test.entryFee,
      type: "Entry Fee",
      paymentMethod: "Wallet",
      status: "Success",
      description: `${test.title} Entry Fee`,
    });

    // ================= LOAD QUESTIONS =================

    const questions = await Question.find({
      test: test._id,
    }).select("-correctAnswer -__v");

    return res.status(200).json({
      success: true,
      message: "Test started successfully.",

      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        duration: test.duration,
        totalQuestions: questions.length,
        totalMarks: test.totalMarks,
        negativeMarking: test.negativeMarking,
        entryFee: test.entryFee,
      },

      questions,

      remainingWallet: user.wallet,

      startTime: new Date(),
    });
  } catch (error) {
    console.error("START TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// SUBMIT TEST
// =====================================================

const submitTest = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      answers = {},
      timeTaken = 0,
      submissionType = "Manual",
    } = req.body;

    // =====================================================
    // FIND TEST
    // =====================================================

    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =====================================================
    // DUPLICATE CHECK
    // =====================================================

    const alreadySubmitted = await Result.findOne({
      user: user._id,
      test: test._id,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this test.",
      });
    }

    // =====================================================
    // LOAD QUESTIONS
    // =====================================================

    const questions = await Question.find({
      test: test._id,
    });

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "Questions not found.",
      });
    }

    // =====================================================
    // CALCULATE RESULT
    // =====================================================

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    for (const question of questions) {

      const selected =
        answers[question._id.toString()];

      if (
        selected === undefined ||
        selected === null ||
        selected === ""
      ) {
        unanswered++;
        continue;
      }

      if (
        Number(selected) ===
        Number(question.correctAnswer)
      ) {

        correctAnswers++;

        score += Number(question.marks);

      } else {

        wrongAnswers++;

        if (question.negativeMarks) {
          score -= Number(question.negativeMarks);
        }

      }

    }

    if (score < 0) {
      score = 0;
    }

    // =====================================================
    // CALCULATE ACCURACY
    // =====================================================

    const attempted =
      correctAnswers + wrongAnswers;

    const accuracy =
      attempted === 0
        ? 0
        : Number(
            (
              (correctAnswers / attempted) *
              100
            ).toFixed(2)
          );

    // =====================================================
    // CALCULATE PERCENTAGE
    // =====================================================

    const percentage =
      test.totalMarks > 0
        ? Number(
            (
              (score / test.totalMarks) *
              100
            ).toFixed(2)
          )
        : 0;

    // =====================================================
    // SAVE RESULT
    // =====================================================

    const result = await Result.create({

      user: user._id,

      test: test._id,

      totalQuestions: questions.length,

      score,

      correctAnswers,

      wrongAnswers,

      unanswered,

      percentage,

      accuracy,

      timeTaken,

      submissionType,

      attemptNumber: 1,

      status: "Completed",

    });

    // =====================================================
    // LEADERBOARD CALCULATION
    // =====================================================

    const leaderboard = await Result.find({
      test: test._id,
    })
      .sort({
        score: -1,
        timeTaken: 1,
        submittedAt: 1,
      });

    let currentRank = 1;

    for (let i = 0; i < leaderboard.length; i++) {

      leaderboard[i].rank = currentRank;

      leaderboard[i].percentile =
        calculatePercentile(
          currentRank,
          leaderboard.length
        );

      await leaderboard[i].save();

      currentRank++;

    }

    const updatedResult =
      await Result.findById(result._id);

          // =====================================================
          // GET UPDATED RESULT
          // =====================================================

    const finalResult = await Result.findById(result._id);

          // =====================================================
          // PRIZE DISTRIBUTION
          // =====================================================

let rewardAmount = 0;
let rewardStatus = "Pending";
let prizePosition = 0;

const prize = test.prizes.find(
  (item) => item.rank === finalResult.rank
);

if (prize) {
  rewardAmount = prize.amount;
  prizePosition = prize.rank;
}

    // =====================================================
    // CREDIT REWARD
    // =====================================================

    if (rewardAmount > 0) {

      user.wallet += rewardAmount;

      user.testsWon = (user.testsWon || 0) + 1;

      await user.save();

      rewardStatus = "Credited";

      await Transaction.create({
        user: user._id,
        test: test._id,
        amount: rewardAmount,
        type: "Reward",
        paymentMethod: "Wallet",
        status: "Success",
        description: `${test.title} Prize Reward`,
      });

    }

    // =====================================================
    // UPDATE RESULT
    // =====================================================

    finalResult.rewardAmount = rewardAmount;
    finalResult.rewardStatus = rewardStatus;
    finalResult.prizePosition = prizePosition;

    await finalResult.save();

    // =====================================================
    // UPDATE USER STATISTICS
    // =====================================================

    user.totalScore =
      (user.totalScore || 0) + score;

    user.totalCorrectAnswers =
      (user.totalCorrectAnswers || 0) +
      correctAnswers;

    user.totalWrongAnswers =
      (user.totalWrongAnswers || 0) +
      wrongAnswers;

    user.totalUnanswered =
      (user.totalUnanswered || 0) +
      unanswered;

    await user.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({

      success: true,

      message: "Test submitted successfully.",

      result: finalResult,

    });

  } catch (error) {

    console.error("SUBMIT TEST ERROR:", error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getAllTests,
  getSingleTest,
  startTest,
  submitTest,
};