import{Router}from 'express';
import * as cuponController from './cupon_controller/cupon_controller.js'
import { validation } from '../../middleware/validation.js';
import * as cuponValidationShema from './cupon_controller/cupon_shemaValidation.js'
import { fileType, fileUplod } from '../../utlis/multer.js';
import { auth } from '../../middleware/authenticationMiddelware.js';
import { authorization, roles } from '../../middleware/authorizationMiddelware.js';
const router =Router();
/**--------creat cupon router---------------- */
router.post('/creatCupon',
auth(),
authorization([roles.Admin]),
fileUplod(fileType.Image).single('image'),
validation(cuponValidationShema.creat),
cuponController.creat)

/**------------update cupon router--------------- */
router.put('/:cuponId/UpdateCupon',
auth(),
authorization([roles.Admin]),
fileUplod(fileType.Image).single('image'),
validation(cuponValidationShema.update),
cuponController.updateCupon)


export default router;
