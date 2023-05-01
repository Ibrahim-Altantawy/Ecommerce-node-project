import { Router } from 'express';
import * as cartController from './cartController/cartController.js'
import { auth } from './../../middleware/authenticationMiddelware.js';

const router = Router();


router.post('/creatCart',
    auth(),
    cartController.creatCart)
export default router;