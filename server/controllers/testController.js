const Test = require("../models/Test");
const Question = require("../models/Question");
const Result = require("../models/Result");

// ================= GET ALL TESTS =================

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });
  } catch (error) {
    console.error("GET ALL TESTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE TEST =================

const getSingleTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const questions = await Question.find({
      test: test._id,
    }).select("-correctAnswer");

    res.status(200).json({
      success: true,
      test,
      questions,
    });

  } catch (error) {

    console.error("GET SINGLE TEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= START TEST =================

const startTest = async (req, res) => {
  try {

    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test Started Successfully",
      testId: test._id,
      startTime: new Date(),
    });

  } catch (error) {

    console.error("START TEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= SUBMIT TEST =================

const submitTest = async (req, res) => {

  console.log("========== SUBMIT API HIT ==========");

  try {

    console.log("User:", req.user);
    console.log("Test:", req.params.id);
    console.log("Body:", req.body);

    const answers = req.body.answers || {};

    const questions = await Question.find({
      test: req.params.id,
    });

    console.log("Questions Found:", questions.length);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Questions not found",
      });
    }

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    for (const question of questions) {

      const selected = answers[question._id.toString()];

      if (
        selected === undefined ||
        selected === null ||
        selected === ""
      ) {

        unanswered++;

      } else if (Number(selected) === question.correctAnswer) {

        correctAnswers++;
        score += Number(question.marks || 1);

      } else {

        wrongAnswers++;
        score -= Number(question.negativeMarks || 0);

      }

    }

    console.log("Score:", score);

    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    console.log("Creating Result...");

    const result = await Result.create({
      user: userId,
      test: req.params.id,
      score,
      correctAnswers,
      wrongAnswers,
      unanswered,
    });

    console.log("Result Saved Successfully");

    return res.status(201).json({
      success: true,
      message: "Test Submitted Successfully",
      result,
    });

  } catch (error) {

    console.error("========== SUBMIT ERROR ==========");
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= EXPORT =================

module.exports = {
  getAllTests,
  getSingleTest,
  startTest,
  submitTest,
};