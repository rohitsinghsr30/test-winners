const User = require("../models/User");
const Transaction = require("../models/Transaction");

// ================= GET WALLET =================

const getWallet = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      wallet: user.wallet,
      winning: user.winning,
      transactions,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ================= ADD MONEY =================

const addMoney = async (req, res) => {
  try {

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Amount",
      });
    }

    const user = await User.findById(req.user.id);

    user.wallet += Number(amount);

    await user.save();

    await Transaction.create({
      user: req.user.id,
      type: "deposit",
      amount,
      status: "success",
      description: "Wallet Recharge",
    });

    res.json({
      success: true,
      message: "Money Added Successfully",
      wallet: user.wallet,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ================= WITHDRAW =================

const withdrawMoney = async (req, res) => {
  try {

    const { amount } = req.body;

    const user = await User.findById(req.user.id);

    if (user.winning < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Winning Balance",
      });
    }

    user.winning -= Number(amount);

    await user.save();

    await Transaction.create({
      user: req.user.id,
      type: "withdraw",
      amount,
      status: "pending",
      description: "Withdrawal Request",
    });

    res.json({
      success: true,
      message: "Withdrawal Request Submitted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

module.exports = {
  getWallet,
  addMoney,
  withdrawMoney,
};