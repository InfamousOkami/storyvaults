import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  createBookmark,
  deleteBookmark,
  getAllBookmarks,
  getAllUserBookmarks,
  getBookmark,
  updateBookamrk,
} from "../Controllers/bookmarkController";

const router = express.Router();

// Gets
router.get("/", isAuthenticated, getAllBookmarks);
router.get("/user/bookmarks", isAuthenticated, getAllUserBookmarks);
router.get("/:id", isAuthenticated, getBookmark);

// Create
router.post("/new", isAuthenticated, createBookmark);

// Patches
router.patch("/update/:id", isAuthenticated, updateBookamrk);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteBookmark);

export default router;
