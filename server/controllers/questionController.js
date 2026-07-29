const Question = require("../models/Question");
const Test = require("../models/Test");

/*
|--------------------------------------------------------------------------
| CREATE QUESTION
|--------------------------------------------------------------------------
| POST /api/questions/create
*/

const createQuestion = async (req, res) => {

    try {

        const {

            subject,
            question,
            options,
            correctAnswer,
            difficulty,
            marks,
            negativeMarks

        } = req.body;

        if (
            !subject ||
            !question ||
            !options ||
            !correctAnswer
        ) {

            return res.status(400).json({

                success: false,

                message: "All required fields are mandatory."

            });

        }

        if (!Array.isArray(options) || options.length < 2) {

            return res.status(400).json({

                success: false,

                message: "Minimum two options are required."

            });

        }

        const newQuestion = await Question.create({

            subject,

            question,

            options,

            correctAnswer,

            difficulty,

            marks,

            negativeMarks

        });

        return res.status(201).json({

            success: true,

            message: "Question Created Successfully",

            question: newQuestion

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET ALL QUESTIONS
|--------------------------------------------------------------------------
| GET /api/questions
*/

const getAllQuestions = async (req, res) => {

    try {

        let {

            page = 1,
            limit = 20,
            subject,
            difficulty

        } = req.query;

        page = Number(page);

        limit = Number(limit);

        const query = {};

        if (subject) {

            query.subject = subject;

        }

        if (difficulty) {

            query.difficulty = difficulty;

        }

        const totalQuestions = await Question.countDocuments(query);

        const questions = await Question.find(query)

            .sort({

                createdAt: -1

            })

            .skip((page - 1) * limit)

            .limit(limit);

        return res.status(200).json({

            success: true,

            pagination: {

                currentPage: page,

                totalPages: Math.ceil(totalQuestions / limit),

                totalQuestions,

                limit

            },

            questions

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET QUESTION BY ID
|--------------------------------------------------------------------------
| GET /api/questions/:id
*/

const getQuestionById = async (req, res) => {

    try {

        const question = await Question.findById(req.params.id);

        if (!question) {

            return res.status(404).json({

                success: false,

                message: "Question Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            question

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| UPDATE QUESTION
|--------------------------------------------------------------------------
| PUT /api/questions/:id
*/

const updateQuestion = async (req, res) => {

    try {

        const updatedQuestion = await Question.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!updatedQuestion) {

            return res.status(404).json({

                success: false,

                message: "Question Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            message: "Question Updated Successfully",

            question: updatedQuestion

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| DELETE QUESTION
|--------------------------------------------------------------------------
| DELETE /api/questions/:id
*/

const deleteQuestion = async (req, res) => {

    try {

        const deletedQuestion = await Question.findByIdAndDelete(
            req.params.id
        );

        if (!deletedQuestion) {

            return res.status(404).json({

                success: false,

                message: "Question Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            message: "Question Deleted Successfully"

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET RANDOM QUESTIONS FOR TEST
|--------------------------------------------------------------------------
| GET /api/questions/test/:testId
*/

const getTestQuestions = async (req, res) => {

    try {

        const { testId } = req.params;

        const test = await Test.findById(testId);

        if (!test) {

            return res.status(404).json({

                success: false,

                message: "Test Not Found"

            });

        }

        const questions = await Question.aggregate([

            {
                $match: {

                    subject: test.subject

                }

            },

            {
                $sample: {

                    size: test.totalQuestions

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            totalQuestions: questions.length,

            questions

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| IMPORT QUESTIONS (Placeholder)
|--------------------------------------------------------------------------
| POST /api/questions/import
*/

const importQuestions = async (req, res) => {

    try {

        return res.status(200).json({

            success: true,

            message: "Question Import API will be implemented in the next phase."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {

    createQuestion,

    getAllQuestions,

    getQuestionById,

    updateQuestion,

    deleteQuestion,

    getTestQuestions,

    importQuestions

};