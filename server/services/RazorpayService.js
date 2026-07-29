const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, receipt) => {

    const options = {

        amount: amount * 100, // Convert INR to paise

        currency: "INR",

        receipt,

        payment_capture: 1,

    };

    return await razorpay.orders.create(options);
};

module.exports = {

    razorpay,

    createOrder,

};