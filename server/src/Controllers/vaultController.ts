import express from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";
import VaultModel, { VaultI } from "../Models/vaultModel";
import validator from "validator";
import fs from "fs";

// Create Vault
export const createVault = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const vault = await VaultModel.create({
      ...req.body,
      userId: req.user._id,
    });

    const newVault = await VaultModel.findById(vault._id).populate("userId");

    res.status(200).json({
      status: "Success",
      data: newVault,
    });
  }
);

// Get Vaults
export const getAllVaults = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const vaults = await VaultModel.find().populate("userId");

    return res.status(200).json({
      status: "Success",
      results: vaults.length,
      data: vaults,
      pagination: {
        total: vaults.length,
        pages: Math.ceil(vaults.length / 25),
      },
    });
  }
);

export const getFollowedVaults = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userId = req.user._id;

    const vaults = await VaultModel.find({
      $or: [{ userId: userId }, { followers: { $in: [userId.toString()] } }],
    })
      .populate("userId")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      status: "Success",
      data: vaults,
    });
  }
);

export const getVaultStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const vaults = await VaultModel.find().populate("userId");

    return res.status(200).json({
      status: "Success",
      results: vaults.length,
      data: vaults,
      pagination: {
        total: vaults.length,
        pages: Math.ceil(vaults.length / 25),
      },
    });
  }
);

export const getVault = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const vault = await VaultModel.findById(req.params.id).populate("userId");

    if (!vault) {
      next(new AppError("No vault found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: vault,
    });
  }
);

// Update Vault
export const updateVault = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const vault: VaultI | null = await VaultModel.findById(id);

    if (!vault) {
      next(new AppError("No vault found with that ID", 404));
    }

    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(new AppError("You do not have permission to access this", 401));
    }

    if (vault?.picturePath !== req.body.picturePath) {
      fs.unlink(
        `public/assets/${req.user.username}/${vault?.picturePath}`,
        () => console.log("file deleted")
      );
    }

    const updatedVault = await VaultModel.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        category: updatedVault,
      },
    });
  }
);

export const toggleVault = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { storyId } = req.body;
    const { id } = req.params;

    const vault: VaultI | null = await VaultModel.findById(id);

    if (!vault) {
      next(new AppError("No vault found with that ID", 404));
    }

    const isInVault = vault?.stories.includes(storyId);

    if (isInVault) {
      const newStoryList = vault?.stories.filter((story) => story !== storyId);

      const updatedVault = await VaultModel.findByIdAndUpdate(id, {
        stories: newStoryList,
        updatedAt: Date.now(),
      });

      res.status(200).json({
        status: "Success",
        data: updatedVault,
      });
    } else {
      const newStoryList = vault?.stories.concat(storyId);

      const updatedVault = await VaultModel.findByIdAndUpdate(id, {
        stories: newStoryList,
        updatedAt: Date.now(),
      });

      res.status(200).json({
        status: "Success",
        data: updatedVault,
      });
    }
  }
);
export const FollowVault = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const vault: VaultI | null = await VaultModel.findById(id);

    if (!vault) {
      next(new AppError("No vault found with that ID", 404));
    }

    const isFollowed = vault?.followers.includes(req.user._id.toString());

    if (isFollowed) {
      const newFollowers = vault?.followers.filter(
        (follower) => follower !== req.user._id.toString()
      );

      const updatedVault = await VaultModel.findByIdAndUpdate(id, {
        followers: newFollowers,
      });

      res.status(200).json({
        status: "Success",
        data: updatedVault,
      });
    } else {
      const newFollowers = vault?.followers.concat(req.user._id.toString());

      const updatedVault = await VaultModel.findByIdAndUpdate(id, {
        followers: newFollowers,
      });

      res.status(200).json({
        status: "Success",
        data: updatedVault,
      });
    }
  }
);

export const FavoriteVault = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const userId = req.user._id;

    const vault: VaultI | null = await VaultModel.findById(id);

    if (!vault) {
      next(new AppError("No vault found with that ID", 404));
    }

    const isFavorited = vault?.favorites.get(userId);

    if (isFavorited) {
      vault!.favorites.delete(userId);
    } else {
      vault?.favorites.set(userId, true);
    }

    const updatedVault = await VaultModel.findByIdAndUpdate(
      id,
      {
        favorites: vault?.favorites,
      },
      { new: true }
    );

    res.status(200).json({
      status: "Success",
      data: updatedVault,
    });
  }
);

// Delete Vault
export const deleteVault = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const vault: VaultI | null = await VaultModel.findById(id);

    if (!vault) {
      next(new AppError("No vault found with that ID", 404));
    }

    // check if Admin or Owner
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(
        new AppError("You do not have permission to update this vault", 401)
      );
    }

    if (vault?.picturePath) {
      fs.unlink(
        `public/assets/${req.user.username}/${vault?.picturePath}`,
        () => console.log("file deleted")
      );
    }

    const deletedVault = await VaultModel.findByIdAndDelete(id);

    if (!deletedVault) {
      next(new AppError("No category found with that ID", 404));
    }

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
