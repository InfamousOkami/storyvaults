import express from "express";
import ChapterModel, { ChapterI } from "../Models/chapterModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";
import StoryModel from "../Models/storyModel";
import { Document } from "mongoose";

// Create Chapter
export const createChapter = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(req.body);
    const story = await StoryModel.findById(req.body.storyId);

    const chapterPrice =
      story?.readerAccess == "payByChapter" ? story.price : 0.0;

    const chapters = await ChapterModel.find({ storyId: req.body.storyId });

    chapters.forEach(async (chapterDoc: Document<any, any, ChapterI>) => {
      const chapter = chapterDoc as ChapterI;
      if (chapter.chapterNumber >= req.body.chapterNumber) {
        await ChapterModel.findByIdAndUpdate(chapter._id, {
          chapterNumber: chapter.chapterNumber + 1,
        });
      }
    });

    const newChapter = await ChapterModel.create({
      ...req.body,
      userId: req.user._id,
      chapterNumber: req.body.chapterNumber
        ? req.body.chapterNumber
        : story?.chapterAmount! + 1,
      price: chapterPrice,
    });

    await StoryModel.findByIdAndUpdate(req.body.storyId, {
      $inc: { chapterAmount: 1, wordAmount: req.body.wordCount },
    });

    res.status(200).json({
      status: "Success",
      data: {
        newChapter,
      },
    });
  }
);

// Get Chapters
export const getAllChapters = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const Chapters = await ChapterModel.find().populate("storyId");

    return res.status(200).json({
      status: "Success",
      results: Chapters.length,
      data: Chapters,
      pagination: {
        total: Chapters.length,
        pages: Math.ceil(Chapters.length / 25),
      },
    });
  }
);

// Get Chapters
export const getStoryChapters = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { storyId } = req.params;

    const Chapters = await ChapterModel.find({ storyId })
      .populate("storyId")
      .sort({ chapterNumber: 1 });

    return res.status(200).json({
      status: "Success",
      results: Chapters.length,
      data: Chapters,
      pagination: {
        total: Chapters.length,
        pages: Math.ceil(Chapters.length / 25),
      },
    });
  }
);

// Get Chapter
export const getChapter = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { storyId, chapterNumber } = req.params;

    const Chapter = await ChapterModel.findOne({
      storyId,
      chapterNumber,
    }).populate("storyId");

    return res.status(200).json({
      status: "Success",
      data: Chapter,
    });
  }
);

// Update Chapter
// TODO: When Update chapter number change numbers between new and old number
export const updateChapter = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const chapter: ChapterI | null = await ChapterModel.findById(id);

    if (!chapter) {
      next(new AppError("No chapter found with that ID", 404));
    }

    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Owner" &&
      chapter!.userId !== req.user.id
    ) {
      next(new AppError("You do not have permission to access this", 401));
    }

    const updatedChapter = await ChapterModel.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(chapter);
    const story = await StoryModel.findById(chapter?.storyId);

    let newWordCount = story!.wordAmount - chapter!.wordCount;
    newWordCount = newWordCount + updatedChapter!.wordCount;

    await StoryModel.findByIdAndUpdate(chapter?.storyId, {
      wordAmount: newWordCount,
    });

    res.status(200).json({
      status: "Success",
      data: {
        category: updatedChapter,
      },
    });
  }
);

// Delete Chapter
export const deleteChapter = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const chapter: ChapterI | null = await ChapterModel.findById(id);

    if (!chapter) {
      next(new AppError("No chapter found with that ID", 404));
    }

    // check if Admin or Owner
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Owner" &&
      chapter!.userId !== req.user.id
    ) {
      next(
        new AppError("You do not have permission to update this chapter", 401)
      );
    }

    const deletedChapter = await ChapterModel.findByIdAndDelete(id);

    if (!deletedChapter) {
      next(new AppError("No chapter found with that ID", 404));
    }

    const chapterWordCount = chapter!.wordCount;
    await StoryModel.findByIdAndUpdate(chapter!.storyId, {
      $inc: { chapterAmount: -1, wordAmount: -chapterWordCount },
    });

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
