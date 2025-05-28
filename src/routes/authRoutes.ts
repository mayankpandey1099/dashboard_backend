import express from "express";
import { adminMiddleware, authMiddleware } from "../middlewares/Auth";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

// router.post("/register", authMiddleware, adminMiddleware, authController.register);
router.post(
  "/register",
  authController.register
);
router.post("/login", authController.login);

export default router;
