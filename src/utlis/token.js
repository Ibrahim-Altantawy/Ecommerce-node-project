import jwt from 'jsonwebtoken';



export const genrateToken=({payload={},signature=process.
    env.token_signture,expireTime=60*60}={})=>{

    const token=jwt.sign(payload,signature,{expiresIn:parseInt(expireTime)})
    return token;

}
export const verfiToken=({payload={},signature=process.
    env.token_signture}={})=>{
const decoded =jwt.verify(payload,signature);
return decoded;
}