const Test = require("../models/Test");
const Question = require("../models/Question");

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

module.exports = {
  getAllTests,
  getSingleTest,
};