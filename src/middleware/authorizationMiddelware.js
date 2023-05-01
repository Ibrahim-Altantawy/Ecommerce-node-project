import { asyncErrorHandler } from "../utlis/errorHandling.js"
export const roles={
    Admin:'admin',
    User:'user'
}
export const authorization =(acceseRoles=[])=>{
    return asyncErrorHandler(async(req,res,next)=>{
        if(!acceseRoles.includes(req.user.role)){
            return next(new Error('this user is not authorization', { cause: 401 }))
        }
        next()
    })
}