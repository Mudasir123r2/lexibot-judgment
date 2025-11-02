// scripts/createAdmin.js - Script to create an admin user
// Run with: node server/scripts/createAdmin.js or npm run create-admin (from server directory)

import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import User from "../models/User.js";
import connectDB from "../config/db.js";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server directory (parent of scripts directory)
dotenv.config({ path: join(__dirname, "..", ".env") });

const createAdmin = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      console.error("❌ Error: MONGO_URI or MONGODB_URI environment variable is not set");
      console.error("Please set it in your .env file in the server directory");
      process.exit(1);
    }

    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@lexibot.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
    const adminName = process.env.ADMIN_NAME || "System Admin";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log("✅ Admin user already exists!");
        console.log(`Email: ${adminEmail}`);
        await mongoose.connection.close();
        process.exit(0);
      } else {
        // Update existing user to admin
        existingAdmin.role = "admin";
        existingAdmin.isEmailVerified = true;
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log("✅ Existing user upgraded to admin!");
        console.log(`Email: ${adminEmail}`);
        await mongoose.connection.close();
        process.exit(0);
      }
    }

    // Create new admin user
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isEmailVerified: true,
      isActive: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("\n⚠️  IMPORTANT: Please change the default password after first login!");
    
    // Close database connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

createAdmin();

