import joi from 'joi';
import { generalFields } from '../../../middleware/validation.js';


export const creatBrandSchema = joi.object({
    name: joi.string().min(5).max(50).required(),
    file: generalFields.file.required(),
    // userId:generalFields.id


}).required();


export const updateBrandSchema = joi.object({
    brandId:generalFields.id.required(),
    name: joi.string().min(5).max(50),
    file: generalFields.file,
}).required();