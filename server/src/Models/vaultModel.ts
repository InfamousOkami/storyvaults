import mongoose, { Document } from "mongoose";

export interface VaultI extends Document {
  name: string;
  description: string;
  userId: string;
  followers: string[];
  stories: string[];
  favorites: Map<string, boolean>;
  picturePath?: string;
  pictureName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: [true, "You must be logged in"],
  },
  name: {
    type: String,
    required: [true, "Vault must have a name"],
  },
  description: {
    type: String,
    required: [true, "Must have a description"],
  },
  stories: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  favorites: {
    type: Map,
    of: Boolean,
    default: new Map(),
  },
  picturePath: String,
  pictureName: String,
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

VaultSchema.set("toJSON", { getters: true });

const VaultModel = mongoose.model("VaultModel", VaultSchema);

export default VaultModel;
