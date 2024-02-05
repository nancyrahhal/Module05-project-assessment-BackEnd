import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

//user
const Products = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value >= 0, // Enforce non-negative prices
        message: "Price must be non-negative",
      },
    },

    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", Products);