import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    paymentMethod: String,
    paymentStatus: { type: String, default: "Pending" },
    orderStatus: { type: String, default: "Processing" },
    totalAmount: Number,
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
