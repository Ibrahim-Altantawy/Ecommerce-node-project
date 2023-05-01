
import joi from 'joi'
import { generalFields } from '../../../middleware/validation.js'

export const creat= joi.object({
    name:joi.string().min(5).max(25).required(),
    price:joi.number().positive().required(),
    discount:joi.number().positive().min(1),
    sizes:joi.array(),
    colors:joi.array(),
    stock:joi.number(),
    categoryId:generalFields.id,
    subcategoryId:generalFields.id,
    brandId:generalFields.id,
    file:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).length(1).required(),
        subImage:joi.array().items(generalFields.file).min(1).max(5)
    }).required()

}).required()

export const update= joi.object({
    name:joi.string().min(5).max(25),
    price:joi.number().positive(),
    discount:joi.number().positive().min(1),
    sizes:joi.array(),
    colors:joi.array(),
    stock:joi.number(),
    categoryId:generalFields.optionalId,
    subcategoryId:generalFields.optionalId,
    productId:generalFields.id,
    brandId:generalFields.optionalId,
    file:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).max(1),
        subImage:joi.array().items(generalFields.file).max(5)
    })

}).required()