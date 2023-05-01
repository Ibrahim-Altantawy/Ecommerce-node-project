import productModel from "../../../../DB/dbModels/productModel.js";
import reviewModel from "../../../../DB/dbModels/reviewModel.js";
import userModel from "../../../../DB/dbModels/userModel.js";
import { asyncErrorHandler } from "../../../utlis/errorHandling.js";

export const getReview = asyncErrorHandler(async (req, res, next) => {
 
  const { productId } = req.params;
 
  const reviews = await reviewModel.find({ productId }).populate([{
    path:'userId',
    model:'User',
    select:"userName -_id"
  }]);
  if (!reviews) {
  return next (new Error('there is not reviews yet',{cause:400}))
   
  }


  return res.status(200).json({ message: "get all reviews Done ", reviews });
});
export const createReview = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { productId } = req.params;
  const { comment, rating } = req.body;
  const product = await productModel
    .findOne(
      {
        _id: productId,
        "soldTo.userId": _id,
      },
      "name soldTo -_id "
    )
    .populate({
      path: "soldTo.userId",
      model: userModel,
      select: "userName",
    });
  if (!product) {
    return next(
      new Error(`you cannot set review for product before buy it`, {
        cause: 400,
      })
    );
  }
  const oldReview = await reviewModel.findOne({ userId: _id, productId });
  if (oldReview) {
    oldReview.comment = comment;
    oldReview.rating = rating;
    await oldReview.save();
    return res.status(200).json({ message: "update review Done ", oldReview });
  }
  const review = await reviewModel.create({
    userId: _id,
    productId,
    comment,
    rating,
  });

  return res.status(201).json({ message: "create review Done ", review });
});
