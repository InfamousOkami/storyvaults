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
  editorId?: mongoose.Schema.Types.ObjectId | null;
  editorRequestStatus: editorRequestT;
  picturePath?: string;
  pictureName?: string;
  status: statusT;
  nsfw: boolean;
  ratingsAverage: {
    total: number;
    monthlyCount: number;
    weeklyCount: number;
    lastMonthlyUpdated: Date;
    lastWeeklyUpdated: Date;
  };
  languageName: mongoose.Schema.Types.ObjectId;
  genre: mongoose.Schema.Types.ObjectId;
  chapterAmount: number;
  wordAmount: number;
  commentAmount: number;
  bookmarkAmount: {
    total: number;
    monthlyCount: number;
    weeklyCount: number;
    lastMonthlyUpdated: Date;
    lastWeekUpdated: Date;
  };
  favorites: Map<string, boolean>;
  favoriteAmount: {
    total: number;
    monthlyCount: number;
    weeklyCount: number;
    lastMonthUpdated: Date;
    lastWeekUpdated: Date;
  };
  views: {
    total: number;
    monthlyCount: number;
    weeklyCount: number;
    lastWeeklyUpdated: Date;
    lastMonthlyUpdated: Date;
  };
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
  views: {
    total: { type: Number, default: 0 },
    monthlyCount: { type: Number, default: 0 },
    weeklyCount: { type: Number, default: 0 },
    lastMonthlyUpdated: { type: Date, default: Date.now() },
    lastWeeklyUpdated: { type: Date, default: Date.now() },
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
    default: "free",
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
    default: null,
  },
  editorRequestStatus: {
    type: String,
    enum: ["Declined", "Accepted", "Pending", "None"],
    default: "None",
  },
  picturePath: {
    type: String,
    default: "",
  },
  pictureName: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    required: [true, "You must provide a status"],
    enum: ["Complete", "Incomplete"],
    default: "Incomplete",
  },
  ratingsAverage: {
    total: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val: number) => Math.round(val * 10) / 10,
    },
    monthlyCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val: number) => Math.round(val * 10) / 10,
    },
    weeklyCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val: number) => Math.round(val * 10) / 10,
    },
    lastMonthlyUpdated: { type: Date, default: Date.now() },
    lastWeeklyUpdated: { type: Date, default: Date.now() },
  },
  languageName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LanguageModel",
    required: [true, "You must select a language for your story"],
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "You must provide a genre"],
    ref: "GenreModel",
  },
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
    total: { type: Number, default: 0 },
    monthlyCount: { type: Number, default: 0 },
    weeklyCount: { type: Number, default: 0 },
    lastMonthUpdated: { type: Date, default: Date.now() },
    lastWeekUpdated: { type: Date, default: Date.now() },
  },
  favorites: {
    type: Map,
    of: Boolean,
    default: new Map(),
  },
  favoriteAmount: {
    total: { type: Number, default: 0 },
    monthlyCount: { type: Number, default: 0 },
    weeklyCount: { type: Number, default: 0 },
    lastMonthUpdated: { type: Date, default: Date.now() },
    lastWeekUpdated: { type: Date, default: Date.now() },
  },
  nsfw: {
    type: Boolean,
    default: false,
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
    this.price = parseFloat(this.price.toFixed(2));
  }

  // Generates Slug
  this.slug = slugify(this.title, { lower: true });
  next();
});

// StorySchema.pre(/^find/, function (this: any, next: () => void) {
//   // Current query only finds users that are active
//   this.find({ active: true });

//   next();
// });

const StoryModel = mongoose.model("StoryModel", StorySchema);

export default StoryModel;
