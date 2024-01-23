import mongoose, { Document } from "mongoose";

export interface GenreI extends Document {
  name: string;
  storyAmount: {
    total: number;
    book: number;
    oneShot: number;
    lightNovel: number;
  };
}

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must provide a name for the genre"],
  },
  storyAmount: {
    total: {
      type: Number,
      default: 0,
    },
    book: {
      type: Number,
      default: 0,
    },
    oneShot: {
      type: Number,
      default: 0,
    },
    lightNovel: {
      type: Number,
      default: 0,
    },
  },
});

const GenreModel = mongoose.model("GenreModel", GenreSchema);

export default GenreModel;
