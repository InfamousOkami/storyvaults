import express from "express";

import {
  deactivateUser,
  deactivateMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
  getUserByUsernameProfile,
  updateUserExternalLinks,
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
router.get("/username/:username", getUserByUsernameProfile);

// Patches

router.patch("/user/:id", isAuthenticated, isOwnerOrAdmin, updateUser);
router.patch(
  "/links/:id",
  isAuthenticated,
  isOwnerOrAdmin,
  updateUserExternalLinks
);

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
