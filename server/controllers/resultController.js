const Result = require("../models/Result");
const Test = require("../models/Test");
const User = require("../models/user");

/*
|--------------------------------------------------------------------------
| GET MY RESULTS
|--------------------------------------------------------------------------
| GET /api/results/my-results
*/

const getMyResults = async (req, res) => {

    try {

        let { page = 1, limit = 10 } = req.query;

        page = Number(page);
        limit = Number(limit);

        const totalResults = await Result.countDocuments({
            user: req.user.id
        });

        const results = await Result.find({
            user: req.user.id
        })
            .populate("test", "title subject startTime endTime")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({

            success: true,

            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalResults / limit),
                totalResults,
                limit
            },

            results

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
| GET RESULT BY ID
|--------------------------------------------------------------------------
| GET /api/results/:resultId
*/

const getResultById = async (req, res) => {

    try {

        const result = await Result.findById(req.params.resultId)

            .populate("user", "fullName email")

            .populate("test");

        if (!result) {

            return res.status(404).json({

                success: false,

                message: "Result Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            result

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
| GET TEST RESULTS
|--------------------------------------------------------------------------
| GET /api/results/test/:testId
*/

const getTestResults = async (req, res) => {

    try {

        const results = await Result.find({

            test: req.params.testId

        })

            .populate("user", "fullName profileImage")

            .sort({

                rank: 1

            });

        return res.status(200).json({

            success: true,

            totalResults: results.length,

            results

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
| GET ALL RESULTS (ADMIN)
|--------------------------------------------------------------------------
| GET /api/results
*/

const getAllResults = async (req, res) => {

    try {

        let {

            page = 1,
            limit = 20,
            test,
            user

        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const query = {};

        if (test) {
            query.test = test;
        }

        if (user) {
            query.user = user;
        }

        const totalResults = await Result.countDocuments(query);

        const results = await Result.find(query)

            .populate("user", "fullName email")

            .populate("test", "title subject")

            .sort({

                createdAt: -1

            })

            .skip((page - 1) * limit)

            .limit(limit);

        return res.status(200).json({

            success: true,

            pagination: {

                currentPage: page,

                totalPages: Math.ceil(totalResults / limit),

                totalResults,

                limit

            },

            results

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
| DELETE RESULT
|--------------------------------------------------------------------------
| DELETE /api/results/:resultId
*/

const deleteResult = async (req, res) => {

    try {

        const result = await Result.findById(req.params.resultId);

        if (!result) {

            return res.status(404).json({

                success: false,

                message: "Result Not Found"

            });

        }

        await Result.findByIdAndDelete(req.params.resultId);

        return res.status(200).json({

            success: true,

            message: "Result Deleted Successfully"

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
| RESULT STATISTICS
|--------------------------------------------------------------------------
| GET /api/results/statistics/overview
*/

const getResultStatistics = async (req, res) => {

    try {

        const totalResults = await Result.countDocuments();

        const totalUsers = await User.countDocuments();

        const totalTests = await Test.countDocuments();

        const averageScore = await Result.aggregate([

            {

                $group: {

                    _id: null,

                    average: {

                        $avg: "$score"

                    }

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            statistics: {

                totalResults,

                totalUsers,

                totalTests,

                averageScore:
                    averageScore.length > 0
                        ? Number(averageScore[0].average.toFixed(2))
                        : 0

            }

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

    getMyResults,

    getResultById,

    getTestResults,

    getAllResults,

    deleteResult,

    getResultStatistics

};