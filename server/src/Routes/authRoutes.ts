import express from "express";
import { isAuthenticated, isOwnerOrAdmin } from "../middlewares/authMiddleware";

import {
  forgotPassword,
  login,
  register,
  resetPassword,
  updatePassword,
} from "../Controllers/authController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);

  router.post("/auth/forgotPassword", forgotPassword);
  router.patch("/auth/resetPassword/:token", resetPassword);

  router.patch(
    "/auth/updateMyPassword",
    isAuthenticated,
    isOwnerOrAdmin,
    updatePassword
  );
};
