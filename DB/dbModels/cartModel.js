import mongoose, { Schema, Types, model } from "mongoose";
const schema = new Schema({
    userId: {
        type: Types.ObjectId, ref: 'User', required: true, unique: true
    },
    products: [{
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 }
    }]
}, { timestamps: true });
const cartModel = mongoose.models.Cart || model('Cart', schema);
export default cartModel;