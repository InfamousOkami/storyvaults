import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  EditorRequestUpdateStory,
  FavoriteStory,
  createStory,
  deactivateStory,
  deleteStory,
  getAllStories,
  getEditorStories,
  getStory,
  getTopGenreStories,
  getTopStories,
  getTopStoriesScroller,
  getTopThirteenStories,
  getUserStories,
  updateStory,
} from "../Controllers/storyController";

const router = express.Router();

// Gets
router.get("/", getAllStories);
router.get("/user/:id", getUserStories);
router.get("/editor", isAuthenticated, getEditorStories);
router.get("/top/:categoryId", getTopStories);
router.get("/top/genre/:genreId", getTopGenreStories);
router.get("/top/thirteen/all", getTopThirteenStories);
router.get("/top/:fieldType/:timeType/:categoryId", getTopStoriesScroller);
router.get("/:id", getStory);

router.patch("/:id/favorite", isAuthenticated, FavoriteStory);
router.patch("/editor/update/:id", isAuthenticated, EditorRequestUpdateStory);
router.patch("/deactivate/:id", isAuthenticated, deactivateStory);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteStory);

export default router;
