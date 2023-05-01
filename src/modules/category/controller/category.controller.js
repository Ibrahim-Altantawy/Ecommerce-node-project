import categoryModel from "../../../../DB/dbModels/categoruModel.js";
import { asyncErrorHandler } from "../../../utlis/errorHandling.js";
import cloudinary from './../../../utlis/cloudinary.js';
import slugify from 'slugify'


export const creatCategory = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;
    if (await categoryModel.findOne({ name })) {
        return next(new Error('duplicated category name', { cause: 409 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/category` })
    const category = await categoryModel.create({
        name,
        slug: slugify(name, '_'),
        image: { secure_url, public_id },
        createBy:req.user._id
    })
    if (!category) {
        return res.status(400).json({ essage: "failed", category })
    }
    return res.status(201).json({ message: "Done", category })

})
/**---------------------------------------------- */
export const updateCategory = asyncErrorHandler(async (req, res, next) => {

    const oldCategory = await categoryModel.findById(req.params.categoryId)
    if (!oldCategory) {
        return next(new Error('in_vaild category id', { cause: 409 }))
    }
    if (req.body.name) {
        if (oldCategory.name == req.body.name) {
            return next(new Error('sorry cannot update category by same name ', { cause: 400 }))
        }
        if (await categoryModel.findOne({ name: req.body.name })) {
            return next(new Error('duplicated category name', { cause: 409 }))
        }
        oldCategory.name =req.body.name;
        oldCategory.slug = slugify(req.body.name, '_')
    }
    if(req.file){
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/category` })
        await cloudinary.uploader.destroy(oldCategory.image.public_id);
        oldCategory.image={ secure_url, public_id };
     
    }

   
  await oldCategory.save()
   
    return res.status(200).json({ message: " update Done", oldCategory })

})
/**------------------------------- */
export const getCategory=asyncErrorHandler(async(req,res,next)=>{
    const category= await categoryModel.find().populate({path:'subCatogry',select:"name -categoryId "})
    if(category?.length<1){
        return res.status(404).json({message:'there is not data to show'})
    }
    return res.status(200).json ({message:'Done',category})

})