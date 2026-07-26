const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllTests,
  getSingleTest,
  startTest,
  submitTest,
} = require("../controllers/testController");

router.get("/", authMiddleware, getAllTests);

router.get("/:id", authMiddleware, getSingleTest);

router.post("/:id/start", authMiddleware, startTest);

router.post("/:id/submit", authMiddleware, submitTest);

module.exports = router;