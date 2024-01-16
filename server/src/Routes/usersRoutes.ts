import express from "express";

import {
  deactivateUser,
  deactivateMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
} from "../Controllers/userController";

import {
  isAuthenticated,
  isOwnerOrAdmin,
  restricToRoles,
} from "../middlewares/authMiddleware";

export default (router: express.Router) => {
  // Gets
  router.get("/users/", isAuthenticated, getAllUsers);
  router.get("/users/:id", getUser);

  // Patches
  router.patch("/users/updateMe", isAuthenticated, isOwnerOrAdmin, updateMe);
  router.patch("/users/user/:id", isAuthenticated, isOwnerOrAdmin, updateUser);

  // Deletes
  router.delete("/users/:id", isAuthenticated, isOwnerOrAdmin, deleteUser);
  router.delete(
    "/users/delete/deleteMe",
    isAuthenticated,
    isOwnerOrAdmin,
    deactivateMe
  );
  router.delete(
    "/users/delete/deactivateUser/:id",
    isAuthenticated,
    isOwnerOrAdmin,
    deactivateUser
  );
};
