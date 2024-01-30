import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsByUser,
  getPost,
  updatePost,
} from "../Controllers/postController";

const router = express.Router();

// Gets
router.get("/", getAllPosts);
router.get("/all/:userId", getAllPostsByUser);
router.get("/:id", getPost);

// Create
router.post("/new", isAuthenticated, createPost);

// Patches
router.patch("/update/:id", isAuthenticated, updatePost);

// Deletes
router.delete("/delete/:id", isAuthenticated, deletePost);

export default router;
