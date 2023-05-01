import joi from "joi";
import { generalFields } from "./../../../middleware/validation.js";


export const creatOderChema = joi
  .object({
    coupoId: generalFields.optionalId,
    products: joi
      .array()
      .items(
        joi
          .object({
            productId: generalFields.id,
            quantity: joi.number().positive().min(1).required(),
          }).required() ).required(),
          paymentType:joi.string().valid('cash','card')
  }).required();
export const cancelOrder = joi.object({
    orderId: generalFields.id,
    reason: joi.string().min(1).required(),
  }).required();
