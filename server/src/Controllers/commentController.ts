import express from "express";
import CommentModel, { CommentI } from "../Models/commentModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { CustomRequest } from "../../typings";

// Create Comment
export const createComment = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newComment = await CommentModel.create(req.body);

    res.status(200).json({
      status: "Success",
      data: {
        newComment,
      },
    });
  }
);

// Get Comments
export const getAllComments = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const comments = await CommentModel.find();

    return res.status(200).json({
      status: "Success",
      results: comments.length,
      data: comments,
      pagination: {
        total: comments.length,
        pages: Math.ceil(comments.length / 25),
      },
    });
  }
);

export const getAllCommentForParentId = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const comments = await CommentModel.find({ parentId: req.params.parentId });

    return res.status(200).json({
      status: "Success",
      results: comments.length,
      data: comments,
      pagination: {
        total: comments.length,
        pages: Math.ceil(comments.length / 25),
      },
    });
  }
);

export const getComment = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const comment = await CommentModel.findById(req.params.id);

    if (!comment) {
      next(new AppError("No comment found with that ID", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: {
        comment,
      },
    });
  }
);

// Update Comment
export const updateComment = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const comment: CommentI | null = await CommentModel.findById(id);

    if (!comment) {
      next(new AppError("No comment found with that ID", 404));
    }

    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Owner" &&
      req.user.id !== comment?.userId
    ) {
      next(new AppError("You do not have permission to access this", 401));
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(
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
        comment: updatedComment,
      },
    });
  }
);

// Delete Comment
export const deleteComment = catchAsync(
  async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;

    const comment: CommentI | null = await CommentModel.findById(id);

    if (!comment) {
      next(new AppError("No comment found with that ID", 404));
    }

    // check if Admin or Owner
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Owner" &&
      req.user.id !== comment?.userId
    ) {
      next(
        new AppError("You do not have permission to update this comment", 401)
      );
    }

    const deletedComment = await CommentModel.findByIdAndDelete(id);

    if (!deletedComment) {
      next(new AppError("No comment found with that ID", 404));
    }

    return res.json({
      status: "Success",
      data: null,
    });
  }
);
