
import userModel from '../../DB/dbModels/userModel.js';
import { verfiToken } from '../utlis/token.js';
import { asyncErrorHandler } from '../utlis/errorHandling.js';

export const auth = () => {
    return asyncErrorHandler(async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.Beerer_Key)) {
            return next(new Error('In-Valid berrer key', { cause: 400 }))
        }
        const token = authorization.split(process.env.Beerer_Key)[1];
        const decoded = verfiToken({ payload: token })
        if (!decoded?.id) {
            return next(new Error('In_valid token', { cause: 400 }))
        }
        const user = await userModel.findById({ _id: decoded.id });

        if (!user) {
            return next(new Error('this user is not Exist', { cause: 401 }))
        }
        /**make check if the user change his password or no by compare date of token  with time of chnge password */
        if(parseInt(user.changePasswordTime.getTime()/1000)>decoded.iat){
            return next(new Error('not auterization user', { cause: 403 }))
        }
    
        req.user = user;
        return next()

    })
}