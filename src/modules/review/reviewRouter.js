import {Router} from 'express';
import * as reviewController from './reviewController/reviewController.js'
import { auth } from '../../middleware/authenticationMiddelware.js';
import { validation } from '../../middleware/validation.js';
import * as reviewValidator from './reviewController/reviewValidation.js'
const router= Router({mergeParams:true});
/**=========== */
router.get('/',
auth(),
validation(reviewValidator.getReview),
reviewController.getReview);
/**=========== */
/**=========== */
router.post('/creat',
auth(),
validation(reviewValidator.creatReview),
reviewController.createReview);
/**=========== */
export default router;