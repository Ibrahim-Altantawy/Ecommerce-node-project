import mongoose, { Schema, Types, model } from "mongoose";



const schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase:true,
    },
    image: {
        type: Object,
        required: true
    },
    addedBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
})


const brandModel = mongoose.models.Brand || model('Brand', schema)
export default brandModel;