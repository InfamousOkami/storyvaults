import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  createChapter,
  deleteChapter,
  getAllChapters,
  getChapter,
  getStoryChapters,
  updateChapter,
} from "../Controllers/chapterContorller";

const router = express.Router();

// Gets
router.get("/", getAllChapters);
router.get("/story/:storyId", getStoryChapters);
router.get("/:storyId/:chapterNumber", getChapter);

// Create
router.post(
  "/new",
  isAuthenticated,
  restricToRoles("Writer", "Editor", "Admin", "Owner"),
  createChapter
);

// Patches
router.patch("/update/:id", isAuthenticated, updateChapter);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteChapter);

export default router;
