import joi from 'joi';
import { generalFields } from '../../../middleware/validation.js';


export const signUpShema=joi.object({
    userName:joi.string().min(2).max(20).required(),
    address:joi.string().min(2).max(60).required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    cPassword:generalFields.cPassword.valid(joi.ref('password'))

}).required();
/**================= */
export const loginShema=joi.object({
    email:generalFields.email.required(),
    password:generalFields.password.required(),
}).required();
/**======================= */
export const updatePassword=joi.object({
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    cPassword:generalFields.cPassword.valid(joi.ref('password')),
    forgetCode:joi.string().regex(new RegExp(/^[1-9]{4}$/)).required()
}).required()
