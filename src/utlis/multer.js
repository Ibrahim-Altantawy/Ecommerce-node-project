
import multer from 'multer'


export const fileType={
    Image:['image/jpg','image/jpeg','image/png','image/gif'],
    file:['application/pdf','application/msword']
}

export const fileUplod=(fileValidation=[])=>{
    const storage = multer.diskStorage({ })
    function fileFilter(req,file,cb){
        if(fileValidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb('In_valid format',false)
        }
    
    }
    const upload = multer({fileFilter,storage })
    return upload;
}
