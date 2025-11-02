import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetEmail, sendVerificationEmail } from "../utils/mailer.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check email case-insensitively (escape special regex characters)
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const exists = await User.findOne({ email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    // Generate email verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const user = await User.create({
      name,
      email,
      password,
      role,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: expiresAt,
      isEmailVerified: false,
    });

    // Send verification email
    const baseUrl = process.env.WEB_BASE_URL || "http://localhost:5173";
    const verificationUrl = `${baseUrl}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;

    try {
      await sendVerificationEmail({ to: email, verificationUrl });
      return res.status(201).json({
        message: "Registration successful! Please check your email to verify your account.",
      });
    } catch (emailErr) {
      // If email fails, cleanup user or log error (for development, keep user)
      console.error("Failed to send verification email:", emailErr);
      return res.status(201).json({
        message: "Registration successful! However, we couldn't send the verification email. Please contact support.",
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Registration failed. Please try again later." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user case-insensitively
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({ email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in. Check your inbox for the verification link.",
      });
    }

    // Check if account is active
    if (user.isActive === false) {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact an administrator.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server configuration error. Please contact support." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ user: { name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user case-insensitively
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({ email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } });
    
    // Respond 200 even if not found to avoid user enumeration
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    // Invalidate previous token by overwriting fields
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpiresAt = expiresAt;
    await user.save();

    const baseUrl = process.env.WEB_BASE_URL || "http://localhost:5173";
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    try {
      await sendResetEmail({ to: email, resetUrl });
      return res.json({ message: "If that email exists, a reset link has been sent." });
    } catch (e) {
      console.error("Failed to send reset email:", e);
      // cleanup on failure
      user.resetPasswordTokenHash = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
      return res.status(500).json({ message: "Failed to send reset email. Please try again later." });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
};

export const resetPassword = async (req, res) => {
  const { email, token: resetToken, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ message: "Email, token, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Find user case-insensitively
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({ email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } });
    
    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    if (user.resetPasswordExpiresAt < new Date()) {
      user.resetPasswordTokenHash = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
      return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
    }

    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    if (tokenHash !== user.resetPasswordTokenHash) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // set new password and invalidate the token
    // Set password to plain text - the User model's pre-save hook will hash it
    user.password = newPassword;
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.json({ message: "Password reset successful. You can now sign in." });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "An error occurred during password reset. Please try again." });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, token: verificationToken } = req.query;

  try {
    // Validate input
    if (!email || !verificationToken) {
      return res.status(400).json({ message: "Missing email or token" });
    }

    // Find user case-insensitively
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({ email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } });
    if (!user) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(200).json({
        message: "Email already verified. You can now sign in.",
      });
    }

    // Check if token exists and not expired
    if (!user.emailVerificationTokenHash || !user.emailVerificationExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    if (user.emailVerificationExpiresAt < new Date()) {
      user.emailVerificationTokenHash = undefined;
      user.emailVerificationExpiresAt = undefined;
      await user.save();
      return res.status(400).json({ message: "Verification link has expired. Please register again." });
    }

    // Verify token
    const tokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
    if (tokenHash !== user.emailVerificationTokenHash) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    // Mark email as verified and clear token
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully! You can now sign in.",
    });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "An error occurred during email verification. Please try again." });
  }
};