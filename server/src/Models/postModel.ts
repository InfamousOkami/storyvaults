import mongoose, { Document } from "mongoose";

export interface PostI extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  subject: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  postContent: string;
  likes: Map<mongoose.Schema.Types.ObjectId, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  subject: {
    type: String,
    maxlength: 100,
  },
  backgroundColor: { type: String, default: "#ffffff" },
  textColor: { type: String, default: "#000000" },
  borderColor: { type: String, default: "#000000" },
  postContent: {
    type: String,
    required: true,
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

const PostModel = mongoose.model("PostModel", PostSchema);

export default PostModel;
