import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";
import {
  createVault,
  deleteVault,
  getAllVaults,
  getFollowedVaults,
  getVault,
  getVaultStories,
  updateVault,
} from "../Controllers/vaultController";

const router = express.Router();

// Gets
router.get("/", getAllVaults);
router.get("/user/followed", isAuthenticated, getFollowedVaults);
router.get("/vaultStories/:id", getVaultStories);
router.get("/:id", getVault);

// Patches
router.patch("/update/:id", isAuthenticated, updateVault);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteVault);

export default router;
