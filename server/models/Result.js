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
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= SUBMIT TEST =================

const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;

    const questions = await Question.find({
      test: req.params.id,
    });

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "Questions not found",
      });
    }

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    questions.forEach((question) => {
      const selectedAnswer = answers?.[question._id.toString()];

      if (
        selectedAnswer === undefined ||
        selectedAnswer === null ||
        selectedAnswer === ""
      ) {
        unanswered++;
      } else if (selectedAnswer == question.correctAnswer) {
        correctAnswers++;
        score += question.marks;
      } else {
        wrongAnswers++;
        score -= question.negativeMarks;
      }
    });

    const result = await Result.create({
      user: req.user.id,
      test: req.params.id,
      score,
      correctAnswers,
      wrongAnswers,
      unanswered,
    });

    res.status(201).json({
      success: true,
      message: "Test Submitted Successfully",
      result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};