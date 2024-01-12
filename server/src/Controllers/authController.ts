import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

import { Types } from "mongoose";
import { UserI, UserModel } from "../Models/userModel";
import { getUserByEmail, getUserByUsername } from "./userController";
import { sendEmail } from "../utils/email";
import { CustomRequest } from "../../typings";

const signJWT = (id: string | Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  res: express.Response
) => {
  const token = signJWT(user._id);

  return res.status(statusCode).json({
    status: "Success",
    token,
    data: {
      user,
    },
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

    createSendToken(user, 200, res);
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
      username,
      email,
      password,
      passwordConfirm,
    });

    createSendToken(newUser, 200, res);
  }
);

export const forgotPassword = async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const { email } = req.body;

  // 1. Get user based on email
  const user: UserI | null | undefined = await UserModel.findOne({ email });

  if (!user) {
    return next(new AppError("No user connected to that email", 404));
  }

  // 2. Generate random reset token
  const token = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${token}`;

  const message = `Forgot your password? Submit request with your new password to: ${resetURL} \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (Valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Please try again later!",
        500
      )
    );
  }
};

export const resetPassword = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // 1. Get user based on token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2. If token is not expired, and there is a user, set new password
    if (!user) {
      next(new AppError("Token is invalid or has expired", 400));
    }

    user!.password = req.body.password;
    user!.passwordConfirm = req.body.passwordConfirm;
    user!.passwordResetToken = undefined;
    user!.passwordResetExpires = undefined;

    await user!.save();

    // 3. Update changedPasswordAt property for the user

    // 4. Log the user in, send JWT
    createSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // 1. Get user
    const user: UserI = await UserModel.findById(req.user.id).select(
      "+password"
    );

    // 2. Check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user!.password))
    ) {
      next(new AppError("Current password is wrong", 401));
    }

    // 3. If so, Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    // 4. Log user in, send JWT
    createSendToken(user, 200, res);
  }
);
