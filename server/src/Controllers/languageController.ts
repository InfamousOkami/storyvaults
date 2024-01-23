import express from "express";
import LanguageModel, { LanguageI } from "../Models/languageModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

// Create Language
export const createLanguage = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newLanguage = await LanguageModel.create(req.body);

    res.status(200).json({
      status: "Success",
      data: {
        newLanguage,
      },
    });
  }
);

// Get Languages
export const getAllLanguages = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const languages = await LanguageModel.find();

    return res.status(200).json({
      status: "Success",
      results: languages.length,
      data: languages,
      pagination: {
        total: languages.length,
        pages: Math.ceil(languages.length / 25),
      },
    });
  }
);

export const getLanguage = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const language = await LanguageModel.findById(req.params.id);

    if (!language) {
      next(new AppError("No language found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: {
        language,
      },
    });
  }
);

// Update Language
export const updateLanguage = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const language: LanguageI | null = await LanguageModel.findById(id);

    if (!language) {
      next(new AppError("No language found with that ID", 404));
    }

    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(new AppError("You do not have permission to access this", 401));
    }

    const updatedLanguage = await LanguageModel.findByIdAndUpdate(
      id,
      { ...req.body, storyAmount: language?.storyAmount },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        language: updatedLanguage,
      },
    });
  }
);

// Delete Language
export const deleteLanguage = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const language: LanguageI | null = await LanguageModel.findById(id);

    if (!language) {
      next(new AppError("No language found with that ID", 404));
    }

    // check if Admin or Owner
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(
        new AppError("You do not have permission to update this language", 401)
      );
    }

    const deletedLanguage = await LanguageModel.findByIdAndDelete(id);

    if (!deletedLanguage) {
      next(new AppError("No language found with that ID", 404));
    }

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
