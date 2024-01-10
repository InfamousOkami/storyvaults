import express from "express";

import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../Controllers/userController";
import {
  isAuthenticated,
  isOwnerOrAdmin,
  restricToRoles,
} from "../middlewares/authMiddleware";

export default (router: express.Router) => {
  router.get("/users/", getAllUsers);
  router.get("/users/:id", getUser);
  router.delete("/users/:id", isAuthenticated, isOwnerOrAdmin, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwnerOrAdmin, updateUser);
};
