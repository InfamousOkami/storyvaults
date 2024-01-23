import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../Controllers/categoryController";

const router = express.Router();

// Gets
router.get("/", getAllCategories);
router.get("/:id", getCategory);

// Create
router.post(
  "/new",
  isAuthenticated,
  restricToRoles("Admin", "Owner"),
  createCategory
);

// Patches
router.patch("/update/:id", isAuthenticated, updateCategory);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteCategory);

export default router;
