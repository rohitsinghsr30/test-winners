const Notification = require("../models/Notification");
const Result = require("../models/Result");
const Test = require("../models/Test");

/*
|--------------------------------------------------------------------------
| Notification Engine
|--------------------------------------------------------------------------
|
| Creates In-App Notifications
| Future Ready:
| ✔ Email
| ✔ SMS
| ✔ Push Notification
|
*/

const NotificationEngine = async (testId) => {

    try {

        console.log("");
        console.log("=======================================");
        console.log("NOTIFICATION ENGINE STARTED");
        console.log("=======================================");

        const test = await Test.findById(testId);

        if (!test) {

            return {

                success: false,

                message: "Test Not Found"

            };

        }

        const winners = await Result.find({

            test: testId,

            rewardStatus: "Credited"

        }).populate("user");

        if (!winners.length) {

            console.log("No Winners Found");

            return {

                success: true,

                message: "No Notifications"

            };

        }

        let notifications = [];

        for (const winner of winners) {

            notifications.push({

                user: winner.user._id,

                test: test._id,

                type: "Prize",

                title: "Congratulations 🎉",

                message:
                    `Congratulations ${winner.user.fullName}! ` +
                    `₹${winner.rewardAmount} has been credited to your winning wallet for "${test.title}".`,

                referenceId:
                    `PRIZE-${test._id}-${winner.user._id}`,

                actionUrl: `/result/${test._id}`,

                metadata: {

                    rank: winner.rank,

                    rewardAmount: winner.rewardAmount,

                    prizePosition: winner.prizePosition

                }

            });

        }

                // =====================================================
        // REMOVE DUPLICATE NOTIFICATIONS
        // =====================================================

        const finalNotifications = [];

        for (const notification of notifications) {

            const exists = await Notification.findOne({

                referenceId: notification.referenceId,

                user: notification.user,

            });

            if (!exists) {

                finalNotifications.push(notification);

            }

        }

        // =====================================================
        // BULK INSERT
        // =====================================================

        if (finalNotifications.length > 0) {

            await Notification.insertMany(finalNotifications);

        }

        console.log("");

        console.log(
            `${finalNotifications.length} Notifications Created`
        );

        // =====================================================
        // FUTURE EMAIL SERVICE
        // =====================================================

        /*
        for (const notification of finalNotifications) {

            await EmailService.send({

                to: notification.user.email,

                subject: notification.title,

                message: notification.message

            });

        }
        */

        // =====================================================
        // FUTURE SMS SERVICE
        // =====================================================

        /*
        for (const notification of finalNotifications) {

            await SMSService.send({

                mobile: notification.user.mobile,

                message: notification.message

            });

        }
        */

        // =====================================================
        // FUTURE PUSH SERVICE
        // =====================================================

        /*
        for (const notification of finalNotifications) {

            await PushNotification.send({

                user: notification.user,

                title: notification.title,

                body: notification.message

            });

        }
        */

        console.log("");

        console.log("=======================================");
        console.log("NOTIFICATION ENGINE COMPLETED");
        console.log("=======================================");

        return {

            success: true,

            message: "Notifications Sent Successfully",

            totalNotifications: finalNotifications.length,

        };

    } catch (error) {

        console.log("");

        console.log("=======================================");
        console.log("NOTIFICATION ENGINE ERROR");
        console.log("=======================================");

        console.log(error);

        return {

            success: false,

            message: error.message,

        };

    }

};

module.exports = NotificationEngine;