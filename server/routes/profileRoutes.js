// routes/profileRoutes.js
import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All profile routes require authentication
router.use(protect);

router.get("/", getProfile);
router.put("/", updateProfile);

export default router;

