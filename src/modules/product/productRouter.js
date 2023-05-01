import { Router } from "express";
import reviewRouter from '../review/reviewRouter.js'
import * as productController from './productController/productController.js'
import { fileType, fileUplod } from "../../utlis/multer.js";
import { auth } from "../../middleware/authenticationMiddelware.js";
import { authorization } from "../../middleware/authorizationMiddelware.js";
import { roles } from "../../middleware/authorizationMiddelware.js";
import { validation } from "../../middleware/validation.js";
import * as productShema from './productController/productValidation.js'
const router = Router();

router.use('/:productId/review',reviewRouter)
router.get('/',productController.getALLPoduct);
/**============= */
router.post('/creatProduct',
auth(),
 authorization([roles.Admin]),
 fileUplod(fileType.Image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImage',maxCount:4},

]),
validation(productShema.creat),
productController.creatProduct);
/**============= */
router.put('/:productId/updateProduct',
auth(),
 authorization([roles.Admin]),
 fileUplod(fileType.Image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImage',maxCount:4},

]),
validation(productShema.update),
productController.updateProduct);



export default router;