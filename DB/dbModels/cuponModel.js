import mongoose,{ Types, model } from "mongoose";
import { Schema } from "mongoose";


const schema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase:true,
    },
    expireDate:{type: Date,required:true},
    image: Object,
    amount: {
        type: Number,
        default: 1
    },
    addedBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true 
    },
    usedBy: [{
        type: Types.ObjectId,
        ref: 'User',

    }]


}, {
    timestamps: true
});

const cuponModel = mongoose.models.Cupon || model('Cupon', schema);
export default cuponModel;