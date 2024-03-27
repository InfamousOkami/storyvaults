import express from "express";

import { isAuthenticated, restricToRoles } from "../middlewares/authMiddleware";
import {
  FavoriteVault,
  FollowVault,
  createVault,
  deleteVault,
  getAllVaults,
  getFollowedVaults,
  getVault,
  getVaultStories,
  toggleVault,
  updateVault,
} from "../Controllers/vaultController";

const router = express.Router();

// Gets
router.get("/", getAllVaults);
router.get("/user/followed", isAuthenticated, getFollowedVaults);
router.get("/vaultStories/:id", getVaultStories);
router.get("/:id", getVault);

// Patches

router.patch("/follow/:id", isAuthenticated, FollowVault);
router.patch("/stories/toggle/:id", isAuthenticated, toggleVault);
router.patch("/favorite/:id", isAuthenticated, FavoriteVault);

// Deletes
router.delete("/delete/:id", isAuthenticated, deleteVault);

export default router;
