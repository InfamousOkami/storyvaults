import mongoose, { Document } from "mongoose";

export interface LanguageI extends Document {
  name: string;
  storyAmount: number;
}

const LanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must provide a name for the language"],
  },
  storyAmount: {
    type: Number,
    default: 0,
  },
});

const LanguageModel = mongoose.model("LanguageModel", LanguageSchema);

export default LanguageModel;
