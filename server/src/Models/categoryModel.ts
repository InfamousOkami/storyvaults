import mongoose, { Document } from "mongoose";

export interface CategoryI extends Document {
  name: string;
  description?: string;
  storyAmount?: number;
}

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category must have a name"],
  },
  description: String,
  storyAmount: {
    type: Number,
    default: 0,
  },
});

const CategoryModel = mongoose.model("CategoryModel", CategorySchema);

export default CategoryModel;
