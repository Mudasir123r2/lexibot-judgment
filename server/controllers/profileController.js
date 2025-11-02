// controllers/profileController.js
import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mailer.js";

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -resetPasswordTokenHash -emailVerificationTokenHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, preferences, profilePicture } = req.body;
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate input
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters long" });
    }

    const updateData = { name: name.trim() };

    // Handle email change
    if (email && email !== currentUser.email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if new email already exists (case-insensitive)
      const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const emailExists = await User.findOne({ 
        _id: { $ne: req.user.id },
        email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } 
      });

      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Set new email and mark as unverified (will need to verify new email)
      updateData.email = email;
      updateData.isEmailVerified = false;
      // Clear old verification tokens
      updateData.emailVerificationTokenHash = undefined;
      updateData.emailVerificationExpiresAt = undefined;
    }

    // Update preferences if provided (language is fixed to English)
    if (preferences) {
      if (preferences.tone && !["formal", "casual"].includes(preferences.tone)) {
        return res.status(400).json({ message: "Tone must be 'formal' or 'casual'" });
      }
      updateData.preferences = {
        tone: preferences.tone || currentUser.preferences?.tone || "formal",
        language: "English", // Always English
      };
    } else {
      // Keep existing preferences but ensure language is English
      updateData.preferences = {
        tone: currentUser.preferences?.tone || "formal",
        language: "English",
      };
    }

    // Update profile picture if provided
    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -resetPasswordTokenHash -emailVerificationTokenHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If email was changed, send verification email
    let verificationMessage = "";
    if (email && email !== currentUser.email) {
      try {
        // Generate email verification token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

        user.emailVerificationTokenHash = tokenHash;
        user.emailVerificationExpiresAt = expiresAt;
        await user.save();

        const baseUrl = process.env.WEB_BASE_URL || "http://localhost:5173";
        const verificationUrl = `${baseUrl}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;

        await sendVerificationEmail({ to: email, verificationUrl });
        verificationMessage = " A verification email has been sent to your new email address.";
      } catch (emailErr) {
        console.error("Failed to send verification email:", emailErr);
        verificationMessage = " Warning: Could not send verification email to new address. Please contact support.";
      }
    }

    res.status(200).json({
      message: "Profile updated successfully." + verificationMessage,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Failed to update profile. Please try again." });
  }
};

