const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createTest
} = require("../controllers/adminController");

/*
|--------------------------------------------------------------------------
| TEST MANAGEMENT
|--------------------------------------------------------------------------
*/

// Create Test
router.post(
    "/test/create",
    authMiddleware,
    adminMiddleware,
    createTest
);

module.exports = router;