import { asyncErrorHandler } from "./../../../utlis/errorHandling.js";
import cuponModel from "./../../../../DB/dbModels/cuponModel.js";
import productModel from "./../../../../DB/dbModels/productModel.js";
import orderModel from "../../../../DB/dbModels/orderModel.js";
import cartModel from "./../../../../DB/dbModels/cartModel.js";
import {payment} from "../../../utlis/payment.js";

export const getAllOrder = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;
  const order = await orderModel.find({ userId: _id });
  if (!order) {
    return next(new Error("there is not order fo you untill now"));
  }
  res.status(200).json({ message: "that is all your order", orders: order });
});
const globaleStatus = [
  { status: "waitPayment", message: "your order has been cancelled" },
  { status: "placed", message: "your order has been cancelled" },
  { status: "canceled", message: "your order has been cancelled before" },
  {
    status: "rejected",
    message:
      "your order has been rejected before connect with customer services ",
  },
  {
    status: "onaway",
    message: "sorry you are not able to cancel order it is onaway  ",
  },
  {
    status: "delivered",
    message:
      "sorry you are not able to cancel order, it already delivered to you   ",
  },
];
/*=========creat order======================*/
export const creatOrder = asyncErrorHandler(async (req, res, next) => {
  const { products, paymentType, coupoId } = req.body;
  const { phone, address, _id } = req.user;
  if (coupoId) {
    const coupon = await cuponModel.findOne({
      _id: coupoId,
      usedBy: { $nin: _id },
    });

    if (!coupon || coupon.expireDate < new Date(Date.now())) {
      return next(new Error("In_Valid or Used Cupon", { cause: 400 }));
    }
    
    req.body.coupon = coupon;
  }
  /**========== product====================== */
  const listProductOrder = [];
  const listProductOrderIds = [];
  let totalCost = 0;
  for (const item of products) {
    const product = await productModel.findOne(
      {
        _id: item.productId,
        stock: { $gte: item.quantity },
        isDeleted: false,
      },
      "name  finalPrice "
    );
    item.productName = product.name;
    item.unitPrice = product.finalPrice;
    item.finalPrice = item.quantity * product.finalPrice;
    listProductOrder.push(item);
    listProductOrderIds.push(item.productId);

    totalCost += item.finalPrice;
  }
  if (listProductOrder[0].length < 1) {
    return next(new Error("un availible product ", { cause: 400 }));
  }
  /*==set order details==*/
  const dummyOrder = {
    userId: _id,
    address,
    phone,
    products: listProductOrder,
    totalCost,
    coupoId,
    netCost: totalCost - (totalCost * (req.body.coupon?.amount || 0)) / 100,
    paymentType,
    status: paymentType ? "waitPayment" : "placed",
  };
  const order = await orderModel.create(dummyOrder);
  /*==update product stock ==*/
  for (const product of listProductOrder) {
    await productModel.findByIdAndUpdate(
      { _id: product.productId },
      {
        $inc: { stock: -product.quantity },
        $addToSet: { soldTo: { userId: _id, quantity: product.quantity } },
      },
      { new: true }
    );
  }
  /**== push user id in used arrar of cupon == */
  if (req.body.coupon) {
    await cuponModel.findByIdAndUpdate(
      { _id: coupoId },
      { $push: { usedBy: req.user._id } }
    );
  }

  /**==clear user cart== */
  await cartModel.updateOne(
    { userId: _id },
    { $pull: { products: { productId: { $in: listProductOrderIds } } } }
  );
  /**============payment============= */
  if (order.paymentType == "card") {
    const session = await payment({
      customer_email: req.user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      cancel_url: `${process.env.cancel_url}/orderId=${order._id.toString()}`,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.productName,
            },
            unit_amount: product.unitPrice*100,
          },
          quantity: product.quantity,
        };
      }),
      percent_off:req.body.coupon?.amount
    
    });
    return res
      .status(201)
      .json({
        message: "created order Done 😉",
        order,
        session,
        url: session.url,
      });
  }

  return res.status(201).json({ message: "created order Done 😉", order });
});
/**======cancel order======================= */
export const cancelOrder = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { _id } = req.user;
  const { reason } = req.body;
  const order = await orderModel.findOne({ _id: orderId, userId: _id });
  if (!order) {
    return next(new Error("there is not order to cancel", { cause: 400 }));
  }
  for (const status of globaleStatus) {
    if (order.status == status.status) {
      if (order.status == "waitPayment" || order.status == "placed") {
        /*==update product  ============*/
        for (const product of order.products) {
          await productModel.findByIdAndUpdate(
            { _id: product.productId },
            { $inc: { stock: product.quantity }, $pull: { soldTo: _id } },
            { new: true }
          );
          /**==update user cart============== */
          await cartModel.updateOne(
            { userId: _id },
            { $push: { products: { product } } }
          );
          /**====================================== */
        }
        /**====================================== */
        /**== pull user id in used arrar of cupon == */
        await cuponModel.findByIdAndUpdate(
          { _id: order.coupoId },
          { $pull: { usedBy: req.user._id } }
        );
        /**======================================== */
        await orderModel.findByIdAndUpdate(
          { _id: order._id },
          { products: [], status: "canceled", reason }
        );
        return res.status(200).json({ message: status.message });
      }
      return next(new Error(`${status.message}`, { cause: 400 }));
    }
  }
});
