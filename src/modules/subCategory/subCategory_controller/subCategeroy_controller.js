import { nanoid } from "nanoid";
import subCategoryModel from "../../../../DB/dbModels/SubCategoruModel.js";
import categoryModel from "../../../../DB/dbModels/categoruModel.js";
import cloudinary from "../../../utlis/cloudinary.js";
import { asyncErrorHandler } from "../../../utlis/errorHandling.js";
import slugify from "slugify";
export const creatSub = asyncErrorHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("In_vaild category Id", { cause: 400 }));
  }
  const { name } = req.body;
  if (await subCategoryModel.findOne({ name })) {
    return next(new Error("duplicate sub category name", { cause: 409 }));
  }
  const customSubId = nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.App_Name}/category/subCategoryFor__${categoryId}/${customSubId}`,
    }
  );
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name, "_"),
    image: { secure_url, public_id },
    categoryId,
    customSubId,
    createBy: req.user._id,
  });
  return res.status(201).json({ message: "Done", subCategory });
});
export const updateSub = asyncErrorHandler(async (req, res, next) => {
  const { subcategoryId, categoryId } = req.params;
  const subcategory = await subCategoryModel.findById(subcategoryId);
  if (!subcategory) {
    return next(new Error("In_vaild subcategory Id", { cause: 400 }));
  }
  if (req.body.name) {
    const { name } = req.body;
    if (name == subcategory.name) {
      return next(
        new Error("we cannot uupadet subCategory in same name", { cause: 400 })
      );
    }
    if (await subCategoryModel.findOne({ name })) {
      return next(new Error("duplicate subcategory name", { cause: 409 }));
    }
    subcategory.name = name;
    subcategory.slug = slugify(name, "_");
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.App_Name}/category/${categoryId}/${subcategory.customSubId}`,
      }
    );
    await cloudinary.uploader.destroy(subcategory.image.public_id);
    subcategory.image = { secure_url, public_id };
  }
  await subcategory.save();
  return res.status(201).json({ message: "Done", subcategory });
});
/**===================* */
export const getsubCategory = asyncErrorHandler(async (req, res, next) => {
  const subcategory = await subCategoryModel.find();
  if (subcategory?.length < 1) {
    return res.status(404).json({ message: "there is not data to show" });
  }
  return res.status(200).json({ message: "Done", subcategory });
});
