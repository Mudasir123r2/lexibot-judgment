// routes/reminderRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getReminders,
  createReminder,
  updateReminder,
  completeReminder,
  deleteReminder
} from "../controllers/reminderController.js";

const router = express.Router();

// All reminder routes require authentication
router.use(protect);

router.get("/", getReminders);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.patch("/:id", updateReminder);
router.patch("/:id/complete", completeReminder);
router.delete("/:id", deleteReminder);

export default router;

