import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CartModel= model("Cart", cartSchema);