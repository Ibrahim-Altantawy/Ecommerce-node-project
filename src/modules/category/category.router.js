import { Router } from "express";
import * as categoryController from './controller/category.controller.js'
import { fileType, fileUplod } from "../../utlis/multer.js";
import SubCategoryRouter from '../../modules/subCategory/subCategory.router.js'
import { validation } from "../../middleware/validation.js";
import * as categoryShemaValidation from "./controller/category.validatShema.js";
import { auth } from "../../middleware/authenticationMiddelware.js";
import { authorization, roles } from "../../middleware/authorizationMiddelware.js";
 
const router =Router()




router.use('/:categoryId/subCategory',SubCategoryRouter);
/**=============================== */
router.post("/creatCategory",
auth(),
authorization([roles.Admin]),
fileUplod(fileType.Image).single('image'),
validation(categoryShemaValidation.creatShema),categoryController.creatCategory);
/**================================== */
router.put("/updatCategory/:categoryId",
auth(),
authorization([roles.Admin]),
fileUplod(fileType.Image).single('image'),validation(categoryShemaValidation.updateShema),categoryController.updateCategory);
/**============================= */
router.get("/",
auth(),
categoryController.getCategory);




export default router