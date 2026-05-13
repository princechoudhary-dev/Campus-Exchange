import mongoose from "mongoose";
import { College } from "./college.schema.js";

export const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    quantity: {
      type: Number,
    },

    images: [{ url: String, public_id: String }],
    instock: {
      type: Boolean,
      default: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
