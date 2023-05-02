import { Stripe } from "stripe";
import { asyncErrorHandler } from "./errorHandling.js";
import orderModel from "../../DB/dbModels/orderModel.js";
export async function payment({
  stripe = new Stripe(process.env.stripKey),
  payment_method_types = ["card"],
  mode = "payment",
  customer_email,
  metadata={},
  cancel_url = process.env.cancel_url,
  success_url = process.env.success_url,
  discounts = [],
  line_items = [],
  percent_off,
  duration = "once",
} = {}) {
  var cuponPayment;
  if (percent_off) {
    cuponPayment = await stripe.coupons.create({
      percent_off,
      duration,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types,
    mode,
    customer_email,
    metadata,
    cancel_url,
    success_url,
    discounts: cuponPayment ? [{ coupon: cuponPayment.id }] : [],
    line_items,
  });
  return session;
}

/*======================*/
export const webhook = asyncErrorHandler(async (req, res) => {
  const stripe = new Stripe(process.env.stripKey);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  const { orderId } = event.data.object.metadata;
  if (event.type != "checkout.session.completed") {
    await orderModel.updateOne({ _id: orderId }, { status: "rejected" });
    return res.status(400).json({ message: "Rejected Order" });
  }
  await orderModel.updateOne({ _id: orderId }, { status: "placed" });
  return res.status(200).json({ message: "Done" });
});
