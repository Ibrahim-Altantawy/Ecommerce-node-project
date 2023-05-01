import mongoose, { Schema, Types, model } from "mongoose";
const schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "user Id is required"],
    },
    address: { type: String, required: [true, "you should send user address"] },
    phone: [{ type: String, required: [true, "please enter user Phone"] }],
    note: String,
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],
    totalCost: { type: Number, required: true },
    coupoId: { type: Types.ObjectId, ref: "Cupon" },
    netCost: { type: Number, required: true },
    paymentType: { type: String, enum: ["cash", "card"], default: "cash" },
    status: {
      type: String,
      default: "placed",
      enum: [
        "waitPayment",
        "placed",
        "canceled",
        "rejected",
        "onaway",
        "delivered",
      ],
    },
    reason: String,
  },
  { timestamps: true }
);
const orderModel = mongoose.models.Order || model("Order", schema);
export default orderModel;
