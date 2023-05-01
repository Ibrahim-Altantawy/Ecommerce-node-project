import { Router } from "express";
import * as routerController from "./orderController/orderController.js";
import { auth } from "./../../middleware/authenticationMiddelware.js";
import { validation } from "../../middleware/validation.js";
import * as orderValidators from "./orderController/orderValidation.js";
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
export default router;
