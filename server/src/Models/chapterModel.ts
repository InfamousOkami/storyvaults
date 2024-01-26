import mongoose, { Document } from "mongoose";

export interface ChapterI extends Document {
  name: string;
  chapterNumber: number;
  storyId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  chapterContent: string;
  chapterContentWords: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  needEditing: boolean;
  price: number;
}

const ChapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must provide a chapter name"],
  },
  chapterNumber: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    default: 0,
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StoryModel",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  needEditing: {
    type: Boolean,
    default: false,
  },
  chapterContent: {
    type: String,
    required: [true, "You must provide content to the chapter"],
  },
  chapterContentWords: {
    type: String,
    required: [true, "You must provide content to the chapter"],
  },
  wordCount: {
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

const ChapterModel = mongoose.model("ChapterModel", ChapterSchema);

export default ChapterModel;
