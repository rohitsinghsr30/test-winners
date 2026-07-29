const Question = require("../models/Question");
const Test = require("../models/Test");

/*
|--------------------------------------------------------------------------
| TEST BUILDER ENGINE
|--------------------------------------------------------------------------
| Generates a random question paper for a test
*/

const TestBuilderEngine = async (testId) => {

    try {

        const test = await Test.findById(testId);

        if (!test) {
            throw new Error("Test Not Found");
        }

        // Paper already generated
        if (test.questions && test.questions.length > 0) {
            return test;
        }

        const totalQuestions = test.totalQuestions;

        const easyCount = Math.floor(totalQuestions * 0.40);
        const mediumCount = Math.floor(totalQuestions * 0.40);
        const hardCount =
            totalQuestions - easyCount - mediumCount;

        // ================= EASY =================

        const easyQuestions = await Question.aggregate([
            {
                $match: {
                    subject: test.subject,
                    difficulty: "Easy",
                },
            },
            {
                $sample: {
                    size: easyCount,
                },
            },
        ]);

        // ================= MEDIUM =================

        const mediumQuestions = await Question.aggregate([
            {
                $match: {
                    subject: test.subject,
                    difficulty: "Medium",
                },
            },
            {
                $sample: {
                    size: mediumCount,
                },
            },
        ]);

        // ================= HARD =================

        const hardQuestions = await Question.aggregate([
            {
                $match: {
                    subject: test.subject,
                    difficulty: "Hard",
                },
            },
            {
                $sample: {
                    size: hardCount,
                },
            },
        ]);

        const selectedQuestions = [
            ...easyQuestions,
            ...mediumQuestions,
            ...hardQuestions,
        ];

        if (selectedQuestions.length !== totalQuestions) {
            throw new Error(
                "Not enough questions available to build this paper."
            );
        }

        // Shuffle Questions

        selectedQuestions.sort(() => Math.random() - 0.5);

        test.questions = selectedQuestions.map(
            (question) => question._id
        );

        test.paperGenerated = true;

        test.paperGeneratedAt = new Date();

        await test.save();

        return test;

    } catch (error) {

        console.error("====================================");
        console.error("TEST BUILDER ENGINE");
        console.error("====================================");
        console.error(error);

        throw error;

    }

};

module.exports = TestBuilderEngine;