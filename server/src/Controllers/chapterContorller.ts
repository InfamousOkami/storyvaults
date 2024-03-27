import express from "express";
import ChapterModel, { ChapterI } from "../Models/chapterModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";
import StoryModel, { StoryI } from "../Models/storyModel";
import { Document } from "mongoose";
import { UserModel } from "../Models/userModel";

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
export const updateChapter = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const chapter: ChapterI | null = await ChapterModel.findById(id);
    const story: StoryI | null = await StoryModel.findById(chapter!.storyId);

    if (!chapter) {
      return next(new AppError("No chapter found with that ID", 404));
    }

    const storyChapters = await ChapterModel.find({
      storyId: chapter!.storyId,
    });

    // Makes chapters before previous chapterNumber and after New chapter number increse 1
    storyChapters.forEach((chap) => {
      if (
        chap.chapterNumber >= req.body.chapterNumber &&
        chap.chapterNumber < chapter!.chapterNumber &&
        chap._id !== chapter!._id
      ) {
        chap.chapterNumber = chap.chapterNumber + 1;
        chap.save();
      }
    });

    // Makes chapters before current go down 1
    storyChapters.forEach((chap) => {
      if (
        chap.chapterNumber <= req.body.chapterNumber &&
        chap.chapterNumber > chapter!.chapterNumber &&
        chap._id !== chapter!._id
      ) {
        chap.chapterNumber = chap.chapterNumber - 1;
        chap.save();
      }
    });

    const updatedChapter = await ChapterModel.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

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

export const updateChapterViews = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const chapter: ChapterI | null = await ChapterModel.findById(id);

    if (!chapter) {
      return next(new AppError("No chapter found with that ID", 404));
    }

    const updatedChapter = await ChapterModel.findByIdAndUpdate(
      id,
      {
        $inc: {
          "views.total": 1,
          "views.weeklyCount": 1,
          "views.monthlyCount": 1,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate(`storyId`);

    res.status(200).json({
      status: "Success",
      data: {
        story: updatedChapter,
      },
    });
  }
);

export const LikeChapter = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const userId = req.user._id;
    const chapter: ChapterI | null = await ChapterModel.findById(id);
    const user = await UserModel.findById(userId);

    const isLiked = chapter?.likes.get(userId);

    if (isLiked) {
      chapter!.likes.delete(userId);
    } else {
      chapter?.likes.set(userId, true);
    }

    const updatedChapter = await ChapterModel.findByIdAndUpdate(
      id,
      {
        likes: chapter?.likes,
      },
      { new: true }
    );

    user!.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "Success",
      data: updatedChapter,
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

    const storyChapters = await ChapterModel.find({
      storyId: chapter!.storyId,
    });

    storyChapters.forEach((chap) => {
      if (chap.chapterNumber > Number(chapter?.chapterNumber)) {
        chap.chapterNumber = chap.chapterNumber - 1;
        chap.save();
      }
    });

    const deletedChapter = await ChapterModel.findByIdAndDelete(id);

    if (!deletedChapter) {
      return next(new AppError("No chapter found with that ID", 404));
    }

    const chapterWordCount = chapter!.wordCount;
    await ChapterModel.findByIdAndUpdate(chapter!.storyId, {
      $inc: { chapterAmount: -1, wordAmount: -chapterWordCount },
    });

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
