const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      password,
      referredBy,
    } = req.body;

    // Check Existing User
    const userExists = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Referral Code
    const referralCode =
      "TW" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create User
    const user = await User.create({
      fullName,
      mobile,
      email,
      password: hashedPassword,
      referredBy,
      referralCode,
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ================= LOGIN USER =================

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
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
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ================= UPDATE PROFILE =================

const updateProfile = async (req, res) => {
  try {

    const { fullName, mobile, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        mobile,
        profileImage,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ================= EXPORTS =================

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateProfile,
};