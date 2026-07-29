const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {

    getMyResults,

    getResultById,

    getTestResults,

    getAllResults,

    deleteResult,

    getResultStatistics

} = require("../controllers/resultController");

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// My Results
router.get(
    "/my-results",
    authMiddleware,
    getMyResults
);

// Single Result
router.get(
    "/:resultId",
    authMiddleware,
    getResultById
);

// Test Results
router.get(
    "/test/:testId",
    authMiddleware,
    getTestResults
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Result Statistics
router.get(
    "/statistics/overview",
    authMiddleware,
    adminMiddleware,
    getResultStatistics
);

// Get All Results
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllResults
);

// Delete Result
router.delete(
    "/:resultId",
    authMiddleware,
    adminMiddleware,
    deleteResult
);

module.exports = router;