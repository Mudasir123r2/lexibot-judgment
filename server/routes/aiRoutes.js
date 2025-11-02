// routes/aiRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { 
  chat, 
  summarizeJudgment, 
  extractKeyInfo, 
  predictOutcome 
} from "../controllers/aiController.js";

const router = express.Router();

// All AI routes require authentication
router.use(protect);

router.post("/chat", chat);
router.post("/summarize", summarizeJudgment);
router.post("/extract", extractKeyInfo);
router.post("/predict", predictOutcome);

export default router;

