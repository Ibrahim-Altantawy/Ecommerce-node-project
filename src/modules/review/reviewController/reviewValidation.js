import joi from 'joi';
import { generalFields } from '../../../middleware/validation.js';


export const creatReview=joi.object({
    productId:generalFields.id,
    comment:joi.string().required(),
    rating:joi.number().min(1).max(5).required()
}).required();
export const getReview=joi.object({
    productId:generalFields.id,

}).required();