// routes/adminRoutes.js
import express from "express";
import { getAllUsers, activateUser, deactivateUser, deleteUser } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

router.get("/users", getAllUsers);
router.put("/users/:userId/activate", activateUser);
router.put("/users/:userId/deactivate", deactivateUser);
router.delete("/users/:userId", deleteUser);

export default router;
