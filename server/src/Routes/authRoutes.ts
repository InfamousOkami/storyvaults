import express from "express";
import { isAuthenticated, isOwnerOrAdmin } from "../middlewares/authMiddleware";

import {
  forgotPassword,
  login,
  register,
  resetPassword,
  updatePassword,
} from "../Controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch(
  "/updateMyPassword",
  isAuthenticated,
  isOwnerOrAdmin,
  updatePassword
);

export default router;
