import express, { Router } from "express";
import * as routerController from "./orderController/orderController.js";
import { auth } from "./../../middleware/authenticationMiddelware.js";
import { validation } from "../../middleware/validation.js";
import * as orderValidators from "./orderController/orderValidation.js";
import { webhook } from "../../utlis/payment.js";
const router = Router();

router.get("/",
auth(),
 routerController.getAllOrder);
/**=================== */
router.post(
  "/creatOrder",
  auth(),
  validation(orderValidators.creatOderChema),
  routerController.creatOrder
);
/**============== */
router.post(
    "/cancelOrder/:orderId",
    auth(),
    validation(orderValidators.cancelOrder),
    routerController.cancelOrder
  );

  /**======webhook====== */
router.post('/webhook', express.raw({type: 'application/json'}),webhook);
export default router;
