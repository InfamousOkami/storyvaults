import express from "express";
import StoryModel, { StoryI } from "../Models/storyModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

import CategoryModel from "../Models/categoryModel";
import LanguageModel from "../Models/languageModel";
import GenreModel from "../Models/genreModel";
import ChapterModel from "../Models/chapterModel";

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
      `languageName genre userId`
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
    }

    const stories = await query;

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

export const getUserStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const stories = await StoryModel.find({ userId: req.params.id });

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

export const getTopStories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { categoryId } = req.params;
    const stories = await StoryModel.find({ category: categoryId })
      .populate(`languageName genre userId category`)
      .sort({ ratingsAverage: -1 })
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

    console.log(storyQuery);

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
    const { id } = req.params;

    const story: StoryI | null = await StoryModel.findById(id);

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
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

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

      console.log(oldLanguage);
      console.log(newLanguage);

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
