// routes/caseRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase
} from "../controllers/caseController.js";

const router = express.Router();

// All case routes require authentication
router.use(protect);

router.get("/", getCases);
router.get("/:id", getCaseById);
router.post("/", createCase);
router.put("/:id", updateCase);
router.patch("/:id", updateCase);
router.delete("/:id", deleteCase);

export default router;

