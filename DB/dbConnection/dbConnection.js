import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
const _dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(_dirname, "../../config/.env") });
const dbConnect = async () => {
  return await mongoose
    .connect(`${process.env.mongooeLink}/${process.env.dbName}`)
    .then((res) => {
      return console.log(chalk.green("we conneting with db sucessfuly 😍"));
    })
    .catch((err) => {
      return console.log(`sorry we cant connect to db.👎..${err}`);
    });
};
export default dbConnect;
