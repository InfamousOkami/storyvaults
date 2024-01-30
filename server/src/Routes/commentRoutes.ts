import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  createComment,
  deleteComment,
  getAllCommentForParentId,
  getAllComments,
  getComment,
  updateComment,
} from "../Controllers/commentController";

const router = express.Router();

// Gets
router.get("/", getAllComments);
router.get("/all/:parentId", getAllCommentForParentId);
router.get("/:id", getComment);

// Create
router.post("/new", isAuthenticated, createComment);

// Patches
router.patch("/update/:id", isAuthenticated, updateComment);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteComment);

export default router;
