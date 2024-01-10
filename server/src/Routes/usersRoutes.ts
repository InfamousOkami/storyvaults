import express from "express";

import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../Controllers/userController";
import { isAuthenticated } from "../middlewares/authMiddleware";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/:id", getUser);
  router.delete("/users/:id", isAuthenticated, deleteUser);
  router.patch("/users/:id", isAuthenticated, updateUser);
};
