import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath}from 'url'
const __direname =path.dirname(fileURLToPath(import.meta.url))
const fullpath =path.join(__direname,'../../config/.env')
dotenv.config({path:fullpath})
// Configuration 
cloudinary.v2.config({
  cloud_name:process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret: process.env.api_secret
});

export default cloudinary.v2