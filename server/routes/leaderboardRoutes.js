const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getLeaderboard,
    getMyRank,
    getTopWinners
} = require("../controllers/leaderboardController");

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Leaderboard
router.get(
    "/:testId",
    getLeaderboard
);

// Top Winners
router.get(
    "/:testId/top",
    getTopWinners
);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
*/

// My Rank
router.get(
    "/:testId/me",
    authMiddleware,
    getMyRank
);

module.exports = router;