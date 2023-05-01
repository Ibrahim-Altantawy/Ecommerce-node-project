import mongoose, { Schema, Types, model } from "mongoose";

const schema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

const reviewModel = mongoose.models.Review || model("Review", schema);
export default reviewModel;
