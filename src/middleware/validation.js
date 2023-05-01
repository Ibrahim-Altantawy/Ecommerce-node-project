import joi from 'joi';
import { Types } from 'mongoose';


const validateObjectId=(value,helper)=>{
    return Types.ObjectId.isValid(value)?true:helper.message("in valid id")
}
export const generalFields = {

    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    /**=================== */
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().required(),
    /**====================== */
    id: joi.string().custom(validateObjectId).required(),
    optionalId:joi.string().custom(validateObjectId),
    /**========================== */
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()

    })
}



 export const validation =(shema)=>{
    return (req,res,next)=>{
        const inputData ={...req.body,...req.params,...req.query}
        if(req.file||req.files){
            inputData.file=req.file||req.files
        }
        const validationResault =shema.validate(inputData,{abortEarly:false})
        if(validationResault.error?.details){
            return res.status(400).json({message:"validation error",validationError:validationResault.error.details})
        }
        return next()
    }
}
