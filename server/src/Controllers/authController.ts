import express from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail, getUserByUsername } from "./userController";
import { UserModel } from "../Models/userModel";
import { Types } from "mongoose";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const signJWT = (id: string | Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

export const login = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email = undefined, username = undefined, password } = req.body;

    // Check if email, username or password were entered
    if (!email && !username) {
      next(new AppError("Email or Username are required", 400));
    }

    if (!password) {
      next(new AppError("Password is required", 400));
    }

    // Check if user exists
    let user: any = undefined;

    if (!email && username) {
      user = await UserModel.findOne({ username })
        .select("+password")
        .collation({
          locale: "en",
          strength: 1,
        });
    } else if (!username && email) {
      user = await UserModel.findOne({ email }).select("+password").collation({
        locale: "en",
        strength: 1,
      });
    }

    if (!user || !(await user.correctPassword(password, user.password))) {
      next(new AppError("Incorrect Email, Username or Password", 400));
    }

    const token = signJWT(user._id);

    return res
      .status(200)
      .json({
        status: "Success",
        token,
        user,
      })
      .end();
  }
);

export const register = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password, passwordConfirm, username } = req.body;

    if (!email || !password || !username) {
      next(new AppError("Email, Username and Password are required", 400));
    }

    if (password !== passwordConfirm) {
      next(new AppError("Passwords do not match!", 400));
    }

    const existingUserEmail = await getUserByEmail(email);
    if (existingUserEmail) {
      next(new AppError("Email already registered", 400));
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      next(new AppError("Username already registered", 400));
    }

    const newUser = await UserModel.create({
      username: username.toLowerCase(),
      email,
      password,
      passwordConfirm,
    });

    const token = signJWT(newUser._id);

    return res.status(201).json({
      status: "Success",
      token,
      data: {
        user: newUser,
      },
    });
  }
);
