const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllTests,
  getSingleTest,
} = require("../controllers/testController");

// ================= GET ALL TESTS =================

router.get("/", authMiddleware, getAllTests);

// ================= GET SINGLE TEST =================

router.get("/:id", authMiddleware, getSingleTest);

module.exports = router;