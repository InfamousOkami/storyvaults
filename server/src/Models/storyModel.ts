import mongoose, { Document } from "mongoose";
import slugify from "slugify";

type readerAccessT = "free" | "payFull" | "payByChapter";
type editorRequestT = "Declined" | "Accepted" | "Pending" | "None";
type statusT = "Complete" | "Incomplete";

export interface StoryI extends Document {
  title: string;
  description: string;
  active: boolean;
  readerAccess: readerAccessT;
  price: number;
  slug: string;
  category: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  editorId?: mongoose.Schema.Types.ObjectId;
  editorRequestStatus: editorRequestT;
  picturePath?: string;
  status: statusT;
  ratingsAverage: number;
  language: mongoose.Schema.Types.ObjectId;
  genre: mongoose.Schema.Types.ObjectId;
  chapterAmount: number;
  wordAmount: number;
  commentAmount: number;
  bookmarkAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Your story must have a title"],
    trim: true,
    maxlength: [100, "Your title needs to be less than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Your story must have a description"],
  },
  active: {
    type: Boolean,
    required: [true, "Your story must be set to active or deactive"],
  },
  readerAccess: {
    type: String,
    enum: ["free", "payFull", "payByChapter"],
    required: [true, "You need to select what access the readers will have"],
    defrault: "free",
  },
  price: {
    type: Number,
    default: 0,
  },
  slug: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryModel",
    required: [true, "You must select a category"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: [true, "You must be logged in"],
  },
  editorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  editorRequestStatus: {
    type: String,
    enum: ["Declined", "Accepted", "Pending", "None"],
    default: "None",
  },
  picturePath: String,
  status: {
    type: String,
    required: [true, "You must provide a status"],
    enum: ["Complete", "Incomplete"],
    default: "Incomplete",
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    set: (val: number) => Math.round(val * 10) / 10,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LanguageModel",
    required: [true, "You must select a language for your story"],
  },
  // genre: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: [true, "You must provide a genre"],
  //   ref: "GenresModel",
  // },
  chapterAmount: {
    type: Number,
    default: 0,
  },
  wordAmount: {
    type: Number,
    default: 0,
  },
  commentAmount: {
    type: Number,
    default: 0,
  },
  bookmarkAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    sortingDates: {
      date: Date.now(),
      string: new Date().toLocaleDateString("en-US"),
    },
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
    sortingDates: {
      date: Date.now(),
      string: new Date().toLocaleDateString("en-US"),
    },
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

StorySchema.index({ createdAt: 1 });
StorySchema.index({ updatedAt: 1 });
StorySchema.index({ title: "text", description: "text" });

StorySchema.set("toJSON", { getters: true });

StorySchema.pre("save", function (next) {
  // Sets price based on readerAccess
  if (this.readerAccess === "free") {
    this.price = 0;
  }
  if (this.readerAccess === "payFull" || this.readerAccess === "payByChapter") {
    this.price = this.price;
  }

  // Generates Slug
  this.slug = slugify(this.title, { lower: true });
  next();
});

const StoryModel = mongoose.model("StoryModel", StorySchema);

export default StoryModel;
