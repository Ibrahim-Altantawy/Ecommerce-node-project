import { Router } from "express";
import * as subcategoryShema from './subCategory_controller/subCategory_validation.js'
import * as subCat_Controller from './subCategory_controller/subCategeroy_controller.js'
import { fileType, fileUplod } from "../../utlis/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/authenticationMiddelware.js";
import { authorization, roles } from "../../middleware/authorizationMiddelware.js";
const router =Router({mergeParams:true})





router.get('/getSubCate',auth(),subCat_Controller.getsubCategory);
/**================== */
router.post('/creatSubCate',auth(),authorization([roles.Admin]),fileUplod(fileType.Image).single('image'),validation(subcategoryShema.creatShema),subCat_Controller.creatSub);
/**================== */

router.post('/:subcategoryId/updateSubCate',fileUplod(fileType.Image).single('image'),validation(subcategoryShema.updateShema),subCat_Controller.updateSub);
/**================== */

export default router;