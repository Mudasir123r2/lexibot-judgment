import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import judgmentRoutes from "./routes/judgmentRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// ✅ CORS setup
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse JSON body
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/judgments", judgmentRoutes);
app.use("/api/reminders", reminderRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("LexiBot API is running...");
});

// ✅ Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
