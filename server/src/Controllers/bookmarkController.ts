import express from "express";
import BookmarkModel, { BookmarkI } from "../Models/bookmarkModel";
import StoryModel from "../Models/storyModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

// Create Bookmark
export const createBookmark = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newBookmark = await BookmarkModel.create({
      ...req.body,
      authorUsername: req.body.authorUsername,
      userId: req.user._id,
    });

    const populatedBookmark = await BookmarkModel.findById(
      newBookmark._id
    ).populate("storyId");

    const bookmarks = await BookmarkModel.find({
      storyId: req.body.storyId,
      userId: req.user._id,
    });

    await StoryModel.findByIdAndUpdate(
      req.body.storyId,
      {
        "bookmarkAmount.total": bookmarks.length,
        $inc: {
          "bookmarkAmount.monthlyCount": 1,
          "bookmarkAmount.weeklyCount": 1,
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: "Success",
      data: populatedBookmark,
    });
  }
);

// Get Bookmarks
export const getAllBookmarks = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const bookmarks = await BookmarkModel.find();

    return res.status(200).json({
      status: "Success",
      results: bookmarks.length,
      data: bookmarks,
      pagination: {
        total: bookmarks.length,
        pages: Math.ceil(bookmarks.length / 25),
      },
    });
  }
);

export const getAllUserBookmarks = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const bookmarks = await BookmarkModel.find({ userId: req.user._id })
      .populate("storyId")
      .sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      status: "Success",
      results: bookmarks.length,
      data: bookmarks,
    });
  }
);

export const getBookmark = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const bookamrk = await BookmarkModel.find({
      storyId: req.params.id,
      userId: req.user._id,
    });

    if (!bookamrk) {
      next(new AppError("No bookamrk found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: bookamrk[0],
    });
  }
);

// Update Bookamrk
export const updateBookamrk = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const bookmark: BookmarkI | null = await BookmarkModel.findById(id);

    if (!bookmark) {
      next(new AppError("No bookmark found with that ID", 404));
    }

    const updatedBookmark = await BookmarkModel.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: updatedBookmark,
    });
  }
);

// Delete Bookmark
export const deleteBookmark = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    await BookmarkModel.deleteOne({ storyId: id, userId: req.user._id });

    const bookmarks = await BookmarkModel.find({
      storyId: id,
      userId: req.user._id,
    });

    await StoryModel.findByIdAndUpdate(
      id,
      {
        "bookmarkAmount.total": bookmarks.length,
        $inc: {
          "bookmarkAmount.monthlyCount": -1,
          "bookmarkAmount.weeklyCount": -1,
        },
      },
      { new: true }
    );

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
