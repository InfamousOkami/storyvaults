import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  createStory,
  deactivateStory,
  deleteStory,
  getAllStories,
  getStory,
  updateStory,
} from "../Controllers/storyController";

const router = express.Router();

// Gets
router.get("/", getAllStories);
router.get("/:id", getStory);

// Create
router.post(
  "/new",
  isAuthenticated,
  restricToRoles("Writer", "Editor", "Admin", "Owner"),
  createStory
);

// Patches
router.patch("/story/:id", isAuthenticated, updateStory);
router.patch("/deactivate/:id", isAuthenticated, deactivateStory);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteStory);

export default router;
