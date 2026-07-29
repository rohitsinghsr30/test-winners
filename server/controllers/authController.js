const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= HELPER =================

const generateReferralCode = () => {
  return (
    "TW" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    let {
      fullName,
      mobile,
      email,
      password,
      referredBy,
    } = req.body;

    // ===== Basic Validation =====

    if (!fullName || !mobile || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    email = email.trim().toLowerCase();
    mobile = mobile.trim();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    // ===== Existing User =====

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with this email or mobile.",
      });
    }

    // ===== Referral Check =====

    if (referredBy) {
      const referrer = await User.findOne({
        referralCode: referredBy,
      });

      if (!referrer) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code.",
        });
      }
    }

    // ===== Password Hash =====

    const hashedPassword = await bcrypt.hash(password, 10);

    // ===== Unique Referral Code =====

    let referralCode;

    while (true) {
      referralCode = generateReferralCode();

      const exists = await User.findOne({
        referralCode,
      });

      if (!exists) break;
    }

    // ===== Create User =====

    const user = await User.create({
      fullName,
      mobile,
      email,
      password: hashedPassword,
      referredBy,
      referralCode,
      wallet: 0,
      winning: 0,
      rank: 0,
      role: "user",
      isVerified: false,
      status: "active",
      testsAttempted: 0,
      testsWon: 0,
      totalRewards: 0,
    });

    // ===== JWT =====

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,

      user: {
        _id: user._id,
        fullName: user.fullName,
        mobile: user.mobile,
        email: user.email,
        wallet: user.wallet,
        winning: user.winning,
        referralCode: user.referralCode,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================= LOGIN USER =================

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password.",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,

      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        wallet: user.wallet,
        winning: user.winning,
        rank: user.rank,
        referralCode: user.referralCode,
        role: user.role,
        profileImage: user.profileImage,
        testsAttempted: user.testsAttempted,
        testsWon: user.testsWon,
        totalRewards: user.totalRewards,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= GET USER =================

const getUser = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.error("GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= UPDATE PROFILE =================

const updateProfile = async (req, res) => {
  try {

    const {
      fullName,
      mobile,
      profileImage,
    } = req.body;

    if (mobile) {

      const existing = await User.findOne({
        mobile,
        _id: { $ne: req.user.id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already in use.",
        });
      }

    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        mobile,
        profileImage,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully.",
      user: updatedUser,
    });

  } catch (error) {

    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= EXPORT =================

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateProfile,
};