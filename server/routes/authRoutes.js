// routes/authRoutes.js
import express from "express";
import { register, login, forgotPassword, resetPassword, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

export default router;
