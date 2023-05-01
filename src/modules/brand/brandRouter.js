import Router from 'express'
import * as brandController from './branController/brandController.js'
import { validation } from '../../middleware/validation.js';
import * as brandSchem from './branController/brandValidSchema.js'
import { fileType, fileUplod } from '../../utlis/multer.js'
import { auth } from '../../middleware/authenticationMiddelware.js';
import { authorization, roles } from '../../middleware/authorizationMiddelware.js';
const router = Router();

router.post('/creatBrand',auth(),
authorization([roles.User]),
 fileUplod(fileType.Image).single('image'),
  validation(brandSchem.creatBrandSchema),
   brandController.creatBrand)
/**========================= */
router.put('/:brandId/updateBrand',auth(),
authorization([roles.User]),
 fileUplod(fileType.Image).single('image'),
  validation(brandSchem.updateBrandSchema),
   brandController.updateBrand)



export default router;