import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  createLanguage,
  deleteLanguage,
  getAllLanguages,
  getLanguage,
  updateLanguage,
} from "../Controllers/languageController";

const router = express.Router();

// Gets
router.get("/", getAllLanguages);
router.get("/:id", getLanguage);

// Create
router.post(
  "/new",
  isAuthenticated,
  restricToRoles("Admin", "Owner"),
  createLanguage
);

// Patches
router.patch("/update/:id", isAuthenticated, updateLanguage);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteLanguage);

export default router;
