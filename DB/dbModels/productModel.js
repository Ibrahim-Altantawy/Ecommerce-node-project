import mongoose, { Schema, Types, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      maxLength: [50, "maximume length shoud be 50 character"],
      minLength: [5, "minimume length shoud be 50 character"],
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: [5000, "maximume length shoud be 50 character"],
    },
    stock: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "you shoud pricing the product "],
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 1,
    },
    colors: [String],
    sizes: {
      type: [String],
      enum: ["s", "m", "l", "xl"],
    },
    mainImage: { type: Object, required: true },
    subImage: [Object],
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    subcategoryId: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brandId: { type: Types.ObjectId, ref: "Brand", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    soldTo: [
      {
        userId: { type: Types.ObjectId, ref: "User" },
        quantity: { type: Number, min: 1, required: true },
      }
    ],
    updatedBy: { type: Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    wishList: [{ type: Types.ObjectId, ref: "User" }],
    customId: String,
  },
  { toJSON:{virtuals:true},toObject:{virtuals:true},timestamps: true }
);
schema.virtual('review',{
    ref:'Review',
    localField:'_id',
    foreignField:'productId'
})

const productModel = mongoose.models.Product || model("Product", schema);
export default productModel;
