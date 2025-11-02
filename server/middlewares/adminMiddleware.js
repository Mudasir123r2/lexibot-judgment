// middlewares/adminMiddleware.js
import User from "../models/User.js";

// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Fetch user from database to check role
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

