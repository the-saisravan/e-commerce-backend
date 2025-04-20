import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

export const CategoryModel = model("Category", categorySchema);
