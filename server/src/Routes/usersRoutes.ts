import express from "express";

import {
  deactivateUser,
  deactivateMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
} from "../Controllers/userController";

import {
  isAuthenticated,
  isOwnerOrAdmin,
  restricToRoles,
} from "../middlewares/authMiddleware";

const router = express.Router();

// Gets
router.get("/", isAuthenticated, getAllUsers);
router.get("/:id", getUser);

// Patches
router.patch("/updateMe", isAuthenticated, isOwnerOrAdmin, updateMe);
router.patch("/user/:id", isAuthenticated, isOwnerOrAdmin, updateUser);

// Deletes
router.delete("/:id", isAuthenticated, isOwnerOrAdmin, deleteUser);
router.delete(
  "/delete/deleteMe",
  isAuthenticated,
  isOwnerOrAdmin,
  deactivateMe
);
router.delete(
  "/delete/deactivateUser/:id",
  isAuthenticated,
  isOwnerOrAdmin,
  deactivateUser
);

export default router;
