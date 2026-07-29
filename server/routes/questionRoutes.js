const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {

    createQuestion,

    getAllQuestions,

    getQuestionById,

    updateQuestion,

    deleteQuestion,

    getTestQuestions,

    importQuestions

} = require("../controllers/questionController");

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Random Questions For Test
router.get(
    "/test/:testId",
    authMiddleware,
    getTestQuestions
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Create Question
router.post(
    "/create",
    authMiddleware,
    adminMiddleware,
    createQuestion
);

// Get All Questions
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllQuestions
);

// Get Question By Id
router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getQuestionById
);

// Update Question
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateQuestion
);

// Delete Question
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteQuestion
);

// Import Questions
router.post(
    "/import",
    authMiddleware,
    adminMiddleware,
    importQuestions
);

module.exports = router;