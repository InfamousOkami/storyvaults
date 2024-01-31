import mongoose, { Document } from "mongoose";

type CommentTypeT = "chapter" | "story" | "comment" | "post";

export interface CommentI extends Document {
  commentType: CommentTypeT;
  userId: mongoose.Schema.Types.ObjectId;
  parentId: string;
  commentContent: string;
  likes: Map<mongoose.Schema.Types.ObjectId, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema({
  commentType: {
    type: String,
    enum: ["chapter", "story", "comment", "post"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  parentId: {
    type: String,
    required: true,
  },
  commentContent: {
    type: String,
    required: [true, "Must provide the comment"],
  },
  likes: {
    type: Map,
    of: Boolean,
    default: new Map(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (date: any) => {
      let seconds = Math.floor((new Date().getTime() - date) / 1000);
      let interval = seconds / 31536000;

      interval = seconds / 2592000;
      if (interval > 1) {
        return date.toLocaleDateString("en-US");
      }

      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " Days Ago";
      }

      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " Hours Ago";
      }

      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " Minutes Ago";
      }

      return "1 Minute Ago";
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    get: (date: any) => {
      let seconds = Math.floor((new Date().getTime() - date) / 1000);
      let interval = seconds / 31536000;

      interval = seconds / 2592000;
      if (interval > 1) {
        return date.toLocaleDateString("en-US");
      }

      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " Days Ago";
      }

      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " Hours Ago";
      }

      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " Minutes Ago";
      }

      return "1 Minute Ago";
    },
  },
});

const CommentModel = mongoose.model("CommentModel", CommentSchema);

export default CommentModel;
