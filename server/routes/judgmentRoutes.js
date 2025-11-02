// routes/judgmentRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getJudgments,
  getJudgmentById,
  createJudgment
} from "../controllers/judgmentController.js";

const router = express.Router();

// Judgment routes - some public (read), some protected (create)
router.get("/", getJudgments); // Public: Anyone can search judgments
router.get("/:id", getJudgmentById); // Public: Anyone can view judgment details

// Protected routes
router.use(protect);
router.post("/", createJudgment);

export default router;

