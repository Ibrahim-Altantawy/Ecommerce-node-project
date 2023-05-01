import cuponModel from "../../../../DB/dbModels/cuponModel.js";
import { asyncErrorHandler } from "../../../utlis/errorHandling.js";
import cloudinary from "../../../utlis/cloudinary.js";

export const creat = asyncErrorHandler(async (req, res, next) => {
  const { name } = req.body;
  if (await cuponModel.findOne({ name })) {
    return next(new Error(`duplicate  cupon name ${name}`, { cause: 409 }));
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.App_Name}/cupon` }
    );
    req.body.image = { public_id, secure_url };
  }
  req.body.addedBy = req.user._id;
  req.body.expireDate=new Date(req.body.expireDate);
  const cupon = await cuponModel.create(req.body);
  if (!cupon) {
    return next(new Error(`failed creating process`, { cause: 406 }));
  }
  return res.status(201).json({ message: `Done`, cupon });
});
/**================update ocntroller=================== */
export const updateCupon = asyncErrorHandler(async (req, res, next) => {
  const { cuponId } = req.params;
  const oldCupon = await cuponModel.findById(cuponId);
  if (!oldCupon) {
    return next(new Error(`In_valid cupon ID`, { cause: 400 }));
  }
  if (req.body.name) {
    if (req.body.name == oldCupon.name) {
      return next(
        new Error(
          `can not able to update cupon name with same name ${req.body.name}`,
          { cause: 409 }
        )
      );
    }
    if (await cuponModel.findOne({ name: req.body.name })) {
      return next(
        new Error(`duplacated cupon name ${req.body.name}`, { cause: 409 })
      );
    }
    oldCupon.name = req.body.name;
  }
  if (req.body.amount) {
    oldCupon.amount = req.body.amount;
  }
  if(req.body.expireDate){
    oldCupon.expireDate=new Date(req.body.expireDate)
  }
  if (req.file) {
    oldCupon.image
      ? await cloudinary.uploader.destroy(oldCupon.image.public_id)
      : false;
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.App_Name}/cupon` }
    );
    oldCupon.image = { public_id, secure_url };
  }
  oldCupon.addedBy = req.user._id;

  await oldCupon.save();

  return res.status(200).json({ message: `updated Done 👌`, oldCupon });
});
