import express from "express";

import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../Controllers/authController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);

  router.post("/auth/forgotPassword", forgotPassword);
  router.post("/auth/restPassword", resetPassword);
};
