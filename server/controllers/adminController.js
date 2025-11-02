// controllers/adminController.js
import User from "../models/User.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -resetPasswordTokenHash -emailVerificationTokenHash")
      .sort({ createdAt: -1 });

    // Get stats
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const verifiedUsers = users.filter((u) => u.isEmailVerified).length;

    res.status(200).json({
      users,
      stats: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers,
      },
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Activate user account
export const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot activate your own account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      message: "User account activated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("Activate user error:", err);
    res.status(500).json({ message: "Failed to activate user" });
  }
};

// Deactivate user account
export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot deactivate your own account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      message: "User account deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("Deactivate user error:", err);
    res.status(500).json({ message: "Failed to deactivate user" });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting other admin accounts
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin accounts" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

