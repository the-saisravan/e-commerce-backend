import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: String,
    stock: { type: Number, default: 0 },
    images: [String],
    rating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

export const ProductModel= model("Product", productSchema);
