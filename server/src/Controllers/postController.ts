import express from "express";
import PostModel, { PostI } from "../Models/postModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

// Create Post
export const createPost = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newPost = await PostModel.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(200).json({
      status: "Success",
      data: {
        newPost,
      },
    });
  }
);

// Get Posts
export const getAllPosts = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const posts = await PostModel.find();

    return res.status(200).json({
      status: "Success",
      results: posts.length,
      data: posts,
      pagination: {
        total: posts.length,
        pages: Math.ceil(posts.length / 25),
      },
    });
  }
);

export const getLastThreePosts = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("userId");

    return res.status(200).json({
      status: "Success",
      results: posts.length,
      data: posts,
      pagination: {
        total: posts.length,
        pages: Math.ceil(posts.length / 25),
      },
    });
  }
);

export const getAllPostsByUser = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const posts = await PostModel.find({ userId: req.params.userId });

    return res.status(200).json({
      status: "Success",
      results: posts.length,
      data: posts,
      pagination: {
        total: posts.length,
        pages: Math.ceil(posts.length / 25),
      },
    });
  }
);

export const getPost = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      next(new AppError("No post found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: {
        post,
      },
    });
  }
);

// Update Post
export const updatePost = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const post: PostI | null = await PostModel.findById(id);

    if (!post) {
      next(new AppError("No post found with that ID", 404));
    }

    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(new AppError("You do not have permission to access this", 401));
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
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
        post: updatedPost,
      },
    });
  }
);

// Delete Post
export const deletePost = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const post: PostI | null = await PostModel.findById(id);

    if (!post) {
      next(new AppError("No post found with that ID", 404));
    }

    // check if Admin or Owner
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
      next(new AppError("You do not have permission to update this post", 401));
    }

    const deletedPost = await PostModel.findByIdAndDelete(id);

    if (!deletedPost) {
      next(new AppError("No post found with that ID", 404));
    }

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
