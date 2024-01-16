import express from "express";
import { UserModel } from "../Models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: Record<string, any> = {};

  Object.keys(obj).forEach((field) => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });

  return newObj;
};

export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email }).collation({
    locale: "en",
    strength: 1,
  });
};

export const getUserByUsername = (username: string) => {
  return UserModel.findOne({ username }).collation({
    locale: "en",
    strength: 1,
  });
};

export const getUserBySessionToken = (sessionToken: string) => {
  return UserModel.findOne({ "authentication.sessionToken": sessionToken });
};

export const updateUserById = (id: string, values: Record<string, any>) => {
  return UserModel.findByIdAndUpdate(id, values);
};

export const getAllUsers = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const users = await UserModel.find();

    return res.status(200).json({
      status: "Success",
      results: users.length,
      data: users,
    });
  }
);

export const getUser = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      next(new AppError("No user found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  }
);

// Update User
export const updateMe = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // 1. Create Error if user tries to change password
    if (req.body.password || req.body.passwordConfirma) {
      return next(
        new AppError(
          "Cannot change password using this route, Please use /updateMyPassword.",
          400
        )
      );
    }

    // 2. Update user document
    const filteredBody = filterObj(req.body, "email", "username", "bio");

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const updateUser = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      next(new AppError("No user with the username", 404));
    }

    const user = await UserModel.findById(id);

    if (!user) {
      next(new AppError("No user found with that ID", 404));
    }

    user!.username = username;

    await user!.save();

    return res.status(200).json(user).end();
  }
);

// Delete User
export const deleteUser = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      next(new AppError("No user found with that ID", 404));
    }

    return res.json({
      status: "Success",
      data: null,
    });
  }
);

export const deactivateMe = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log("User: ", req.user);
    const deactivatedUser = await UserModel.findByIdAndUpdate(req.user.id, {
      active: false,
    });

    res.status(204).json({
      status: "Success",
      data: {
        user: deactivatedUser,
      },
    });
  }
);

export const deactivateUser = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const deactivatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
      active: false,
    });

    res.status(204).json({
      status: "Success",
      data: {
        user: deactivatedUser,
      },
    });
  }
);
