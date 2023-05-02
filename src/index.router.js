import dbConnect from "../DB/dbConnection/dbConnection.js";

import categoryRouter from "./modules/category/category.router.js";
import SubCategoryRouter from "./modules/subCategory/subCategory.router.js";
import { globalError } from "./utlis/errorHandling.js";
import cuponRouter from "./modules/Cupon/cuponRouter.js";
import brandRouter from "./modules/brand/brandRouter.js";
import authRouter from "./modules/auth/authRouter.js";
import cartRouter from "./modules/cart/cartRouter.js";
import orderRouter from "./modules/order/orderRouter.js";
import productRouter from "./modules/product/productRouter.js";
import cors from "cors";
const initApp = (app, express) => {
  app.use(cors());
  //   const whiteList = ["http://127.0.0.1:5000"];

  //   app.use(async (req, res, next) => {
  //     if (!whiteList.includes(req.header("origin"))) {
  //       return next(new Error("not allowed by cors", { cause: 403 }));
  //     }
  //     for (const origin of whiteList) {
  //       await res.header("Acess-Control-Allow-Origin", origin);
  //       break;
  //     }
  //     await res.header("Access-Control-Allow-Headers", "*");
  //     await res.header("Access-Control-Allow-Private-Networ", "true");
  //     await res.header("Access-Control-Allow-Methods", "*");
  //     next();
  //   });
  app.use((req,res,next)=>{
    if(req.originalUrl=='order/webhook'){
      next();
    }else{
      express.json()(req,res,next)
    }
  })
  // app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/user", authRouter);
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/category", categoryRouter);
  app.use("/subCategory", SubCategoryRouter);
  app.use("/cupon", cuponRouter);
  app.use("/brand", brandRouter);
  app.use("/", productRouter);
  app.use("*", (req, res, next) => {
    return res
      .status(404)
      .json({ message: "In-Valid router please check you rl" });
  });
  app.use(globalError);
  dbConnect();
};
export default initApp;
