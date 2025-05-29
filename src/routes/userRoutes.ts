import express from "express";
import { UserController } from "../controllers/userController";
import { adminMiddleware, authMiddleware } from "../middlewares/Auth";

const router = express.Router();
const userController = new UserController();

router.put("/:id", authMiddleware, adminMiddleware, userController.updateUser);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);
router.put(
  "/:id/block",
  authMiddleware,
  adminMiddleware,
  userController.blockUser
);
router.put(
  "/:id/unblock",
  authMiddleware,
  adminMiddleware,
  userController.unblockUser
);

export default router;
