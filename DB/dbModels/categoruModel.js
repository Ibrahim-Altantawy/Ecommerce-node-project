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
    createBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    }

}, {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}

},)
shema.virtual('subCatogry',{
    ref:'SubCategory',
    localField:"_id",
    foreignField:'categoryId', 
     justOne: false
    

})
const categoryModel = mongoose.models.Category || model('Category', shema)

export default categoryModel;