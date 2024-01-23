import express from "express";
import StoryModel, { StoryI } from "../Models/storyModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

// Get Stories
export const getAllStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const stories = await StoryModel.find();

    return res.status(200).json({
      status: "Success",
      results: stories.length,
      data: stories,
      pagination: {
        total: stories.length,
        pages: Math.ceil(stories.length / 25),
      },
    });
  }
);

export const getStory = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const story = await StoryModel.findById(req.params.id);

    if (!story) {
      next(new AppError("No story found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: {
        story,
      },
    });
  }
);

// Create Story
export const createStory = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newStory = await StoryModel.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(200).json({
      status: "Success",
      data: {
        newStory,
      },
    });
  }
);

// Update Story
export const updateStory = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const story: StoryI | null = await StoryModel.findById(id);

    if (!story) {
      next(new AppError("No story found with that ID", 404));
    }

    // check if owner or editor
    if (
      req.user.id != story?.userId &&
      req.user.id != story?.editorId &&
      req.user.role !== "Admin" &&
      req.user.role !== "Owner"
    ) {
      next(
        new AppError("You do not have permission to update this story", 401)
      );
    }

    const updatedStory = await StoryModel.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        story: updatedStory,
      },
    });
  }
);

// Delete User
export const deleteStory = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const story: StoryI | null = await StoryModel.findById(id);

    if (!story) {
      next(new AppError("No story found with that ID", 404));
    }

    // check if owner or editor
    if (
      req.user.id != story?.userId &&
      req.user.role !== "Admin" &&
      req.user.role !== "Owner"
    ) {
      next(
        new AppError("You do not have permission to update this story", 401)
      );
    }

    const deletedStory = await StoryModel.findByIdAndDelete(id);

    if (!deletedStory) {
      next(new AppError("No story found with that ID", 404));
    }

    return res.json({
      status: "Success",
      data: null,
    });
  }
);

export const deactivateStory = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const story: StoryI | null = await StoryModel.findById(id);

    if (!story) {
      next(new AppError("No story found with that ID", 404));
    }

    // check if owner or editor
    if (
      req.user.id != story?.userId &&
      req.user.role !== "Admin" &&
      req.user.role !== "Owner"
    ) {
      next(
        new AppError("You do not have permission to update this story", 401)
      );
    }

    const deactivatedStory = await StoryModel.findByIdAndUpdate(id, {
      active: !story?.active,
    });

    res.status(204).json({
      status: "Success",
      data: {
        story: deactivatedStory,
      },
    });
  }
);
