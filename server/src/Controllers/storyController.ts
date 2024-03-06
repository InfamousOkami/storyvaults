import express from "express";
import StoryModel, { StoryI } from "../Models/storyModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

import CategoryModel from "../Models/categoryModel";
import LanguageModel from "../Models/languageModel";
import GenreModel from "../Models/genreModel";
import ChapterModel from "../Models/chapterModel";

import fs from "fs";
import { UserModel } from "../Models/userModel";

// Get Stories
export const getAllStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let queryObj = { ...req.query };

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "sortOrder",
      "keywords",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (req.query.keywords) {
      const keywords = req.query.keywords;

      queryObj = {
        ...queryObj,
        $text: { $search: keywords },
      };
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = StoryModel.find(JSON.parse(queryStr)).populate(
      `languageName genre userId category`
    );

    let PaginationQuery = StoryModel.find(JSON.parse(queryStr)).populate(
      `languageName genre userId category`
    );

    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");

      const sortOrder =
        req.query.sortOrder &&
        (req.query.sortOrder as string).toLowerCase() === "desc"
          ? -1
          : 1;

      query = query.sort({ [sortBy]: sortOrder });
    } else if (req.query.keywords) {
      query = query.sort({
        description: { $meta: "textScore" },
        title: { $meta: "textScore" },
      });
    } else {
      query = query.sort({ updatedAt: -1 });
    }

    let total = 0;
    const allStories = await PaginationQuery;
    total = allStories.length;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const stories = await query.populate(`languageName genre userId category`);

    return res.status(200).json({
      status: "Success",
      data: stories,
      pagination: {
        totalStories: total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

export const getUserStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(req.query);
    const stories = await StoryModel.find({ userId: req.params.id })
      .populate(`languageName genre userId category`)
      .sort({ [req.query.sort as string]: -1 });

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

export const getTopThirteenStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const stories = await StoryModel.find({ nsfw: false })
      .populate(`languageName genre userId category`)
      .sort({ "ratingsAverage.weeklyCount": -1 })
      .limit(13);

    return res.status(200).json({
      status: "Success",
      data: stories,
    });
  }
);

export const getTopStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { categoryId } = req.params;
    const stories = await StoryModel.find({ category: categoryId, nsfw: false })
      .populate(`languageName genre userId category`)
      .sort({ "ratingsAverage.total": -1 })
      .limit(6);

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

export const getTopGenreStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { genreId } = req.params;
    const stories = await StoryModel.find({ genre: genreId, nsfw: false })
      .populate(`languageName genre userId category`)
      .sort({ "ratingsAverage.total": -1 })
      .limit(3);

    return res.status(200).json({
      status: "Success",
      data: stories,
    });
  }
);

export const getTopStoriesScroller = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { categoryId, fieldType, timeType } = req.params;

    const searchQuery = `${fieldType}.${timeType}`;

    console.log(searchQuery);

    const query: { [key: string]: any } = {
      category: categoryId,
      nsfw: false,
    };
    query[searchQuery] = { $gt: 0 };

    const stories = await StoryModel.find(query)
      .populate(`languageName genre userId category`)
      .sort({ [searchQuery]: -1 })
      .limit(5);

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
    let populateFields = `category languageName genre userId`;

    let story = await StoryModel.findById(req.params.id);

    let storyQuery = StoryModel.findById(req.params.id);

    // Check if editorId exists in the request params
    if (story?.editorId) {
      populateFields += " editorId";
    }

    storyQuery = storyQuery?.populate(populateFields);

    story = await storyQuery;

    if (!story) {
      next(new AppError("No story found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: story,
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
    console.log(req.body);
    const newStory = await StoryModel.create({
      ...req.body,
      userId: req.user.id,
      editorId: req.body.editorId !== "" ? req.body.editorId : null,
      editorRequestStatus: req.body.editorId !== "" ? "Pending" : "None",
    });

    const category = await CategoryModel.findById(newStory.category);
    const categoryName = category?.name;

    if (category) {
      await CategoryModel.findByIdAndUpdate(newStory.category, {
        storyAmount: category.storyAmount + 1,
      });
    } else {
      next(new AppError("No category with this id", 400));
    }

    const language = await LanguageModel.findById(newStory.languageName);

    if (language) {
      await LanguageModel.findByIdAndUpdate(newStory.languageName, {
        storyAmount: language.storyAmount + 1,
      });
    } else {
      next(new AppError("No language with this id", 400));
    }

    const genre = await GenreModel.findById(newStory.genre);

    if (genre) {
      const updateQuery = {
        $inc: {
          [`storyAmount.${categoryName}`]: 1,
          "storyAmount.total": 1,
        },
      };

      await GenreModel.findByIdAndUpdate(newStory.genre, updateQuery);
    } else {
      next(new AppError("No genre with this id", 400));
    }

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
    // TODO: If picture is updated delete old picture and update picure path and name
    const { id } = req.params;

    console.log(req.body);

    const story: StoryI | null = await StoryModel.findById(id);

    if (story?.picturePath !== req.body.picturePath) {
      fs.unlink(
        `../../public/assets/${req.user.username}/${story?.picturePath}`,
        () => console.log("file deleted")
      );
    }

    const oldCategoryName = await CategoryModel.findById(story?.category);

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
      {
        ...req.body,
        editorId: req.body.editorId === "" ? null : req.body.editorId,
        editorRequestStatus:
          story!.editorId === null && req.body.editoriId !== ""
            ? "Pending"
            : story?.editorRequestStatus,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate(`category languageName genre userId`);

    if (
      story?.readerAccess !== "free" &&
      updatedStory?.readerAccess === "free"
    ) {
      await ChapterModel.updateMany(
        { storyId: story!.id },
        {
          price: 0,
        }
      );

      await StoryModel.findByIdAndUpdate(story!.id, {
        price: 0,
      });
    }

    if (
      story?.readerAccess !== "payByChapter" &&
      updatedStory?.readerAccess === "payByChapter"
    ) {
      await ChapterModel.updateMany(
        { storyId: story!.id },
        {
          price: updatedStory.price,
        }
      );

      await StoryModel.findByIdAndUpdate(story!.id, {
        price: updatedStory,
      });
    }

    if (
      story?.readerAccess !== "payFull" &&
      updatedStory?.readerAccess === "payFull"
    ) {
      await ChapterModel.updateMany(
        { storyId: story!.id },
        {
          price: 0,
        }
      );

      await StoryModel.findByIdAndUpdate(story!.id, {
        price: updatedStory,
      });
    }

    const newCategoryName = await CategoryModel.findById(
      updatedStory?.category
    );

    // Update category storyAmounts
    if (story?.category.toString() !== updatedStory?.category.toString()) {
      const oldCategory = await CategoryModel.findById(story?.category);
      const newCategory = await CategoryModel.findById(updatedStory?.category);

      await CategoryModel.findByIdAndUpdate(oldCategory?.id, {
        storyAmount: oldCategory!.storyAmount - 1,
      });

      await CategoryModel.findByIdAndUpdate(newCategory?.id, {
        storyAmount: newCategory!.storyAmount + 1,
      });
    }

    // Update language storyAmounts
    if (
      story?.languageName.toString() !== updatedStory?.languageName.toString()
    ) {
      const oldLanguage = await LanguageModel.findById(story?.languageName);
      const newLanguage = await LanguageModel.findById(
        updatedStory?.languageName
      );

      await LanguageModel.findByIdAndUpdate(oldLanguage?.id, {
        storyAmount: oldLanguage!.storyAmount - 1,
      });

      await LanguageModel.findByIdAndUpdate(newLanguage?.id, {
        storyAmount: newLanguage!.storyAmount + 1,
      });
    }

    // Update Genre storyAmounts
    if (story?.genre.toString() !== updatedStory?.genre.toString()) {
      const oldGenre = await GenreModel.findById(story?.genre);
      const newGenre = await GenreModel.findById(updatedStory?.genre);

      const updateNewQuery = {
        $inc: {
          [`storyAmount.${newCategoryName?.name}`]: 1,
          "storyAmount.total": 1,
        },
      };
      const updateOldQuery = {
        $inc: {
          [`storyAmount.${oldCategoryName?.name}`]: -1,
          "storyAmount.total": -1,
        },
      };

      await GenreModel.findByIdAndUpdate(oldGenre?.id, updateOldQuery);

      await GenreModel.findByIdAndUpdate(newGenre?.id, updateNewQuery);
    }

    res.status(200).json({
      status: "Success",
      data: {
        story: updatedStory,
      },
    });
  }
);

export const FavoriteStory = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const userId = req.user._id;
    const story: StoryI | null = await StoryModel.findById(id);
    const user = await UserModel.findById(userId);

    console.log(id);
    console.log(userId);

    const isFavorited = story?.favorites.get(userId);

    if (isFavorited) {
      story!.favorites.delete(userId);

      user!.favoritedStories = user!.favoritedStories.filter(
        (s) => s.toString() !== story!._id.toString()
      );

      story!.favoriteAmount.total = story!.favorites.size;

      story!.favoriteAmount.weeklyCount -= 1;

      story!.favoriteAmount.monthlyCount -= 1;
    } else {
      story?.favorites.set(userId, true);

      user!.favoritedStories.push(story!._id);

      story!.favoriteAmount.total = story!.favorites.size;

      story!.favoriteAmount.weeklyCount += 1;

      story!.favoriteAmount.monthlyCount += 1;
    }

    const updatedStory = await StoryModel.findByIdAndUpdate(
      id,
      {
        favorites: story?.favorites,
        favoriteAmount: {
          total: story!.favoriteAmount.total,
          weeklyCount: story!.favoriteAmount.weeklyCount,
          monthlyCount: story!.favoriteAmount.monthlyCount,
        },
      },
      { new: true }
    );

    user!.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "Success",
      data: updatedStory,
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

    const category = await CategoryModel.findById(story!.category);
    const categoryName = category?.name;

    if (category) {
      await CategoryModel.findByIdAndUpdate(story!.category, {
        storyAmount: category.storyAmount - 1,
      });
    } else {
      next(new AppError("No category with this id", 400));
    }

    const language = await LanguageModel.findById(story!.languageName);

    if (language) {
      await LanguageModel.findByIdAndUpdate(story!.languageName, {
        storyAmount: language.storyAmount - 1,
      });
    } else {
      next(new AppError("No language with this id", 400));
    }

    const genre = await GenreModel.findById(story!.genre);

    if (genre) {
      const updateQuery = {
        $inc: {
          [`storyAmount.${categoryName}`]: -1,
          "storyAmount.total": -1,
        },
      };

      await GenreModel.findByIdAndUpdate(story!.genre, updateQuery);
    } else {
      next(new AppError("No genre with this id", 400));
    }

    await ChapterModel.deleteMany({ storyId: id });

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
