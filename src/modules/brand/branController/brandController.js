import brandModel from "../../../../DB/dbModels/brandModel.js";
import { asyncErrorHandler } from "../../../utlis/errorHandling.js";
import cloudinary from './../../../utlis/cloudinary.js';



export const creatBrand = asyncErrorHandler(async (req, res, next) => {

    const { name } = req.body;
    if (await brandModel.findOne({ name })) {
        return next(new Error(`Duplicated brand Name ${name}`, { cause: 409 }));
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/brand` })

    const brand = await brandModel.create({ name, image: { public_id, secure_url } ,addedBy : req.user._id})
    if (!brand) { return next(new Error(`create process failed`, { cause: 400 })) }
    return res.status(200).json({ message: `create brand Done 👌`, brand })
})
/***==================== */
export const updateBrand = asyncErrorHandler(async (req, res, next) => {
    const { brandId } = req.params;
    const oldBrand = await brandModel.findById(brandId);
    if (!oldBrand) {
        return next(new Error(`In_valid brand ID`, { cause: 400 }));
    }
    if (!req.body.name && !req.file) {
        return res.status(409).json({ message: 'you must send date which will update' })
    }
    if (req.body.name) {
        if (req.body.name == oldBrand.name) {
            return next(new Error(`can not able to update brand name with same name ${req.body.name}`, { cause: 409 }));
        }
        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error(`duplacated cupon name ${req.body.name}`, { cause: 409 }));
        }
        oldBrand.name = req.body.name;
        
    }
    if (req.file) {
        oldBrand.image ? await cloudinary.uploader.destroy(oldBrand.image.public_id) : false;
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/brand` });
        oldBrand.image = { public_id, secure_url };
    }
    oldBrand.addedBy = req.user._id;
    await oldBrand.save();
    return res.status(200).json({ message: 'update process Done 👌', oldBrand })
})