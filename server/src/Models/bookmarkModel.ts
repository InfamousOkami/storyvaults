import mongoose, { Document } from "mongoose";

export interface BookmarkI extends Document {
  storyId: string;
  userId: string;
  authorUsername: string;
  chapterNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StoryModel",
    required: [true, "Must have a story"],
  },
  authorUsername: {
    type: String,
    required: [true, "Must have a username"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: [true, "Must have a user"],
  },
  chapterNumber: {
    type: Number,
    default: 0,
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

BookmarkSchema.index({ userId: 1, storyId: 1 }, { unique: true });

const BookmarkModel = mongoose.model("BookmarkModel", BookmarkSchema);

export default BookmarkModel;
