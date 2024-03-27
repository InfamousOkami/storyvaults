import express from "express";
import { UserI, UserModel } from "../Models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";
import { externalLinksI } from "../Models/userModel";
import validator from "validator";
import fs from "fs";

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

// Get Users
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
      pagination: {
        total: users.length,
        pages: Math.ceil(users.length / 25),
      },
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
      return next(new AppError("No user found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: user,
    });
  }
);

export const getUserByUsernameProfile = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = await UserModel.findOne({
      username: req.params.username,
    }).collation({
      locale: "en",
      strength: 1,
    });

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

export const FollowUser = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const LoggedInUserId = req.user._id;
    const TargetUser = await UserModel.findById(id);
    const LoggedInUser = await UserModel.findById(LoggedInUserId);

    const isFollowing = TargetUser?.followers.includes(LoggedInUserId);

    let LoggedInFollowing = LoggedInUser!.following;
    let TargetFollowers = TargetUser!.followers;

    if (isFollowing) {
      TargetFollowers = TargetFollowers.filter(
        (userId) => userId.toString() !== LoggedInUserId.toString()
      );

      LoggedInFollowing = LoggedInFollowing.filter(
        (userId) => userId.toString() !== TargetUser!._id.toString()
      );
    } else {
      TargetFollowers = [LoggedInUserId.toString(), ...TargetUser!.followers];

      LoggedInFollowing = [
        TargetUser!._id.toString(),
        ...LoggedInUser!.following,
      ];
    }

    await UserModel.findByIdAndUpdate(
      id,
      { followers: TargetFollowers },
      { new: true, runValidators: false }
    );

    await UserModel.findByIdAndUpdate(
      LoggedInUserId,
      { following: LoggedInFollowing },
      { new: true, runValidators: false }
    );

    res.status(200).json({
      status: "Success",
      data: null,
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

    if (req.user.picturePath !== req.body.picturePath) {
      fs.unlink(
        `public/assets/${req.user.username}/${req.user.picturePath}`,
        () => console.log("file deleted")
      );
    }

    // 2. Update user document
    const filteredBody = filterObj(
      req.body,
      "bio",
      "role",
      "adultContent",
      "language",
      "tosAccepted",
      "externalLinks",
      "picturePath"
    );

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
      data: updatedUser,
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

export const updateUserViews = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const user: UserI | null = await UserModel.findById(id);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $inc: {
          "profileViews.total": 1,
          "profileViews.weeklyCount": 1,
          "profileViews.monthlyCount": 1,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        story: updatedUser,
      },
    });
  }
);

export const updateUserExternalLinks = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const newExternalLinks: externalLinksI[] = [];

    Object.keys(req.body).forEach((key) => {
      newExternalLinks.push(req.body[key]);
    });

    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        externalLinks: newExternalLinks,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: "success",
      data: user,
    });
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
