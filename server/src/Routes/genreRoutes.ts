import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";

import {
  createGenre,
  deleteGenre,
  getAllGenres,
  getGenre,
  updateGenre,
} from "../Controllers/genreController";

const router = express.Router();

// Gets
router.get("/", getAllGenres);
router.get("/:id", getGenre);

// Create
router.post(
  "/new",
  isAuthenticated,
  restricToRoles("Admin", "Owner"),
  createGenre
);

// Patches
router.patch("/update/:id", isAuthenticated, updateGenre);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteGenre);

export default router;
