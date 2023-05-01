import slugify from "slugify";
import subCategoryModel from "../../../../DB/dbModels/SubCategoruModel.js";
import brandModel from "../../../../DB/dbModels/brandModel.js";
import { asyncErrorHandler } from "../../../utlis/errorHandling.js";
import cloudinary from "../../../utlis/cloudinary.js";
import { nanoid } from "nanoid";
import productModel from "../../../../DB/dbModels/productModel.js";
import { apiFeature } from "../../../utlis/apiFeature.js";

export const getALLPoduct = asyncErrorHandler(async (req, res, next) => {
  const apifeatures = new apiFeature(productModel.find(), req.query)
    .pagination()
    .fillter()
    .sort()
    .search()
    .select();
  const products = await apifeatures.mongooeQuary.populate([
    {
      path: "review",
      model: "Review",
      select: " comment rating -productId -_id",
    },
  ]);
  res.status(200).json({ message: "Done", products });
});
/**============ceate product=================== */
export const creatProduct = asyncErrorHandler(async (req, res, next) => {
  const { name, categoryId, subcategoryId, brandId, price, discount } =
    req.body;
  if (
    !(await subCategoryModel.findOne({
      _id: subcategoryId,
      categoryId: categoryId,
    }))
  ) {
    return next(new Error("In_valid category Id", { cause: 400 }));
  }
  if (!(await brandModel.findById({ _id: brandId }))) {
    return next(new Error("In_valid brand ID", { cause: 400 }));
  }
  req.body.slug = slugify(name, {
    replacement: "-",
    trim: true,
    lower: true,
  });

  req.body.finalPrice = Number.parseFloat(
    price - (price * discount || 0) / 100
  ).toFixed(2);

  req.body.customId = nanoid();
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: `${process.env.App_Name}/product/${req.body.customId}` }
  );
  req.body.mainImage = { public_id, secure_url };

  if (req.files.subImage) {
    req.body.subImage = [];
    for (const file of req.files.subImage) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.App_Name}/product/${req.body.customId}/subImages`,
        }
      );
      req.body.subImage.push({ public_id, secure_url });
    }
  }
  req.body.createdBy = req.user._id;

  const product = await productModel.create(req.body);
  if (!product) {
    return next(new Error("fail to creat new product", { cause: 400 }));
  }
  return res.status(201).json({ message: "done", product });
});
/**===========update product========= */
export const updateProduct = asyncErrorHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("In_valid product Id", { cause: 400 }));
  }
  const para = Object.keys(req.body);
  for (const item of para) {
    if (item == "name") {
      product.slug = slugify(req.body[item], "_");
    }
    if (item == "price" && item == "discount") {
      product.finalPrice = Number.parseFloat(
        req.body.price - (req.body.price * req.body.discount) / 100
      ).toFixed(2);
    } else if (item == "price") {
      product.finalPrice = Number.parseFloat(
        req.body.price - (req.body.price * (product.discount || 0)) / 100
      ).toFixed(2);
    } else if (item == "discount") {
      product.finalPrice = Number.parseFloat(
        product.price - (product.price * (req.body.discount || 0)) / 100
      ).toFixed(2);
    }
    product[item] = req.body[item];
  }
  if (req.files?.mainImage?.length) {
    await cloudinary.uploader.destroy(product.mainImage.public_id);

    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      { folder: `${process.env.App_Name}/product/${product.customId}` }
    );
    product.mainImage = { public_id, secure_url };
  }
  if (req.files?.subImage?.length) {
    await cloudinary.api.delete_resources_by_prefix(
      `${process.env.App_Name}/product/${product.customId}/subImages`,
      (error, result) => {
        if (error) {
          return next(
            new Error("we can not delet old pictuer", { cause: 405 })
          );
        }
      }
    );

    product.subImage = [];
    for (const file of req.files.subImage) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.App_Name}/product/${product.customId}/subImages`,
        }
      );
      product.subImage.push({ public_id, secure_url });
    }
  }

  await product.save();
  return res.status(200).json({ message: "update product Done ", product });
});
