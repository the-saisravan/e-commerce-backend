import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    paymentId: String,
    amountPaid: Number,
    status: { type: String, default: "Pending" },
    paymentMethod: String,
    paidAt: Date,
  },
  { timestamps: true }
);

export default model("Payment", paymentSchema);
