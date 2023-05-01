import Router from 'express';
import * as authController from './authController/authController.js'
import { validation } from '../../middleware/validation.js';
import * as authSchemaValid from './authController/authValidation.js'
const router = Router();

/**============== */
router.post('/signUp',validation(authSchemaValid.signUpShema),authController.signUp)
/**=============== */
router.get('/confirmEmail/:token',authController.confirmEmail)
/**============== */
router.get('/ReConfirmEmail/:refreshToken',authController.reConfirmEmail)
/**============== */
router.post('/login',validation(authSchemaValid.loginShema),authController.login)
/**=========== */
router.patch('/sendCode',authController.sendCode)
/**=========== */
router.post('/updatePassword',
validation(authSchemaValid.updatePassword),
authController.updatePassword)

export default router;