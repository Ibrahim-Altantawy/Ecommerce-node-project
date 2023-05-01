import mongoose, { Schema, Types, model } from "mongoose";

const shema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase:true,
    },
    slug:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        required:true,
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:true, 
    },
    createBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    },
    customSubId:String

}, {
    timestamps: true
})

const subCategoryModel = mongoose.models.SubCategory || model('SubCategory', shema)

export default subCategoryModel;