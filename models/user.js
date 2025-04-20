import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
   },
   email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    //used regex to validate email
    // ^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$  =>  ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

export const UserModel = model("user", userSchema);
