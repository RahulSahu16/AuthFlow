import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getUserProfile, updateUserProfile , logoutUser , refreshToken } from '../controllers/userController.js';

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logoutUser);

export default router;