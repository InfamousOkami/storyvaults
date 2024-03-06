import express from "express";
import GenreModel, { GenreI } from "../Models/genreModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

// Create Genre
export const createGenre = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newGenre = await GenreModel.create(req.body);

    res.status(200).json({
      status: "Success",
      data: {
        newGenre,
      },
    });
  }
);

// Get Genres
export const getAllGenres = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const genres = await GenreModel.find();

    return res.status(200).json({
      status: "Success",
      results: genres.length,
      data: genres,
      pagination: {
        total: genres.length,
        pages: Math.ceil(genres.length / 25),
      },
    });
  }
);

export const getGenre = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const genre = await GenreModel.findById(req.params.id);

    if (!genre) {
      next(new AppError("No genre found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: genre,
    });
  }
);

// Update Genre
export const updateGenre = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const genre: GenreI | null = await GenreModel.findById(id);

    if (!genre) {
      next(new AppError("No genre found with that ID", 404));
    }

    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(new AppError("You do not have permission to access this", 401));
    }

    const updatedGenre = await GenreModel.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        genre: updatedGenre,
      },
    });
  }
);

// Delete Genre
export const deleteGenre = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const genre: GenreI | null = await GenreModel.findById(id);

    if (!genre) {
      next(new AppError("No genre found with that ID", 404));
    }

    // check if Admin or Owner
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(
        new AppError("You do not have permission to update this genre", 401)
      );
    }

    const deletedGenre = await GenreModel.findByIdAndDelete(id);

    if (!deletedGenre) {
      next(new AppError("No genre found with that ID", 404));
    }

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
