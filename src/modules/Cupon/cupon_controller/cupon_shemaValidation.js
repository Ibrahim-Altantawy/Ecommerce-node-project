
import joi from 'joi';
import { generalFields } from './../../../middleware/validation.js';
export const creat = joi.object({
    name: joi.string().min(2).max(50).required(),
    amount: joi.number().positive().required(),
    expireDate:joi.date().greater(Date.now()).required(),
    file: generalFields.file,
}).required()
export const update = joi.object({
    cuponId:generalFields.id,
    name: joi.string().min(2).max(50),
    amount: joi.number().positive(),
    expireDate:joi.date().greater(Date.now()),
    file: generalFields.file,
}).required()