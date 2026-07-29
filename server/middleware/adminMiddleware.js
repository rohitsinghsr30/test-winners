const User = require("../models/user");

// =======================================
// ADMIN MIDDLEWARE
// =======================================

const adminMiddleware = async (req, res, next) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();

  } catch (error) {

    console.error("ADMIN MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });

  }

};

module.exports = adminMiddleware;