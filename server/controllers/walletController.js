const User = require("../models/user");
const Transaction = require("../models/Transaction");

// ================= GET WALLET =================

const getWallet = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select(
      "wallet winning totalRewards"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const transactions = await Transaction.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      wallet: user.wallet,
      winning: user.winning,
      totalRewards: user.totalRewards,
      transactions,
    });

  } catch (error) {

    console.error("GET WALLET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= DEPOSIT MONEY =================

const depositMoney = async (req, res) => {
  try {

    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.wallet += Number(amount);

    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      amount,
      type: "Deposit",
      status: "Success",
      paymentMethod: paymentMethod || "UPI",
      description: "Wallet Deposit",
    });

    return res.status(200).json({
      success: true,
      message: "Money added successfully.",
      wallet: user.wallet,
      transaction,
    });

  } catch (error) {

    console.error("DEPOSIT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= WITHDRAW MONEY =================

const withdrawMoney = async (req, res) => {
  try {

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.winning < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient winning balance.",
      });
    }

    user.winning -= Number(amount);

    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      amount,
      type: "Withdraw",
      status: "Pending",
      description: "Withdrawal Request",
    });

    return res.status(200).json({
      success: true,
      message: "Withdrawal request submitted successfully.",
      winning: user.winning,
      transaction,
    });

  } catch (error) {

    console.error("WITHDRAW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= DEDUCT ENTRY FEE =================

const deductEntryFee = async (userId, testId, amount) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.wallet < amount) {
    throw new Error("Insufficient wallet balance.");
  }

  user.wallet -= Number(amount);

  await user.save();

  await Transaction.create({
    user: user._id,
    amount,
    type: "Entry Fee",
    status: "Success",
    test: testId,
    description: "Test Entry Fee",
  });

  return user.wallet;
};

// ================= CREDIT PRIZE =================

const creditPrize = async (userId, testId, amount) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.winning += Number(amount);
  user.totalRewards += Number(amount);
  user.testsWon += 1;

  await user.save();

  await Transaction.create({
    user: user._id,
    amount,
    type: "Prize",
    status: "Success",
    test: testId,
    description: "Prize Money Credited",
  });

  return user.winning;
};
// ================= GET TRANSACTION HISTORY =================

const getTransactions = async (req, res) => {
  try {

    const transactions = await Transaction.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });

  } catch (error) {

    console.error("GET TRANSACTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= GET WALLET SUMMARY =================

const getWalletSummary = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select(
      "wallet winning totalRewards testsWon testsAttempted"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const totalTransactions = await Transaction.countDocuments({
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,

      summary: {
        wallet: user.wallet,
        winning: user.winning,
        totalRewards: user.totalRewards,
        testsWon: user.testsWon,
        testsAttempted: user.testsAttempted,
        totalTransactions,
      },
    });

  } catch (error) {

    console.error("SUMMARY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= EXPORT =================

module.exports = {
  getWallet,
  depositMoney,
  withdrawMoney,
  deductEntryFee,
  creditPrize,
  getTransactions,
  getWalletSummary,
};