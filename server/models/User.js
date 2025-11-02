// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "advocate", "admin"], default: "client" },
  isActive: { type: Boolean, default: true }, // For admin to activate/deactivate users
  profilePicture: { type: String },
  preferences: {
    tone: { type: String, default: "formal" },
    language: { type: String, default: "English" },
  },
  // password recovery
  resetPasswordTokenHash: { type: String, index: true },
  resetPasswordExpiresAt: { type: Date, index: true },
  // email verification
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationTokenHash: { type: String, index: true },
  emailVerificationExpiresAt: { type: Date, index: true },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);
