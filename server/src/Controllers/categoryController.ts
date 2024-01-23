import express from "express";
import CategoryModel, { CategoryI } from "../Models/categoryModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

// Create Category
export const createCategory = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newCategory = await CategoryModel.create(req.body);

    res.status(200).json({
      status: "Success",
      data: {
        newCategory,
      },
    });
  }
);

// Get Categories
export const getAllCategories = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const categories = await CategoryModel.find();

    return res.status(200).json({
      status: "Success",
      results: categories.length,
      data: categories,
      pagination: {
        total: categories.length,
        pages: Math.ceil(categories.length / 25),
      },
    });
  }
);

export const getCategory = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      next(new AppError("No category found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: {
        category,
      },
    });
  }
);

// Update Category
export const updateCategory = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const category: CategoryI | null = await CategoryModel.findById(id);

    if (!category) {
      next(new AppError("No category found with that ID", 404));
    }

    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(new AppError("You do not have permission to access this", 401));
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { ...req.body, storyAmount: category?.storyAmount },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        category: updatedCategory,
      },
    });
  }
);

// Delete Category
export const deleteCategory = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const category: CategoryI | null = await CategoryModel.findById(id);

    if (!category) {
      next(new AppError("No category found with that ID", 404));
    }

    // check if Admin or Owner
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(
        new AppError("You do not have permission to update this category", 401)
      );
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      next(new AppError("No category found with that ID", 404));
    }

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
