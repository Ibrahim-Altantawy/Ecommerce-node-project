import express from 'express'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import path from 'path';
import initApp from './src/index.router.js';
import chalk from 'chalk';
const _dirname= path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path:path.join(_dirname,'/config/.env')})
const app =express()
const port =process.env.PORT||3000;
initApp(app,express)
app.listen(port,()=>{
    console.log(chalk.green(`server is runing in port ${port}   😍`));
})
