import cartModel from "../../../../DB/dbModels/cartModel.js";
import productModel from "../../../../DB/dbModels/productModel.js";
import { asyncErrorHandler } from "../../../utlis/errorHandling.js";

export const creatCart = asyncErrorHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("In_Valid product ID", { cause: 400 }));
  }
  if (product.stock < quantity) {
    await productModel.updateOne(
      { _id: productId },
      { $addToSet: { wishList: req.user._id } }
    );
    return next(
      new Error(`available quantity of this product is ${product.stock} `, {
        cause: 400,
      })
    );
  }
  if (product.isDeleted) {
    await productModel.updateOne(
      { _id: productId },
      { $addToSet: { wishList: req.user._id } }
    );
    return next(
      new Error(`sorry this product not available now `, { cause: 400 })
    );
  }
  let cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
    if (!newCart) {
      return next(new Error(`create cart has failed `, { cause: 400 }));
    }
    return res
      .status(201)
      .json({ message: " creat cart Done", newCart: newCart });
  } else {
    const updatedCart = updateProductCart(cart, productId, quantity);
    cart = updatedCart;
    await cart.save();


    return res
      .status(200)
      .json({ message: " update cart Done", newCart: cart });
  }

  
});

const updateProductCart = (cart, productId, quantity) => {
  let match = false;
  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId == productId) {
      cart.products[i].quantity = +quantity;
      match = true;
      break;
    }
  }
  if (match == false) {
    cart.products.push({ productId, quantity });
  }
  return cart;
};
