import joi from 'joi'
import { generalFields } from '../../../middleware/validation.js'


export const creatShema =joi.object({
    name:joi.string().max(25).required(),
    file:generalFields.file.required(),

}).required()
export const updateShema =joi.object({
    categoryId:generalFields.id.required(),
    name:joi.string().max(25),
    file:generalFields.file,

}).required()