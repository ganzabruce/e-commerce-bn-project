import express,{Request,Response} from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRouter from "./src/routes/productRoutes";
import cartRouter from "./src/routes/cartRoutes";
import orderRouter from "./src/routes/orderRoutes";
import dotenv from "dotenv"
import Order from "./src/model/orderModel";
import authRouter from "./src/routes/auth";
import swaggerRouter from "./swagger";
dotenv.config()
const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.DB_URI;
app.use(express.json());
app.use(cors());
app.use((req, _res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
mongoose
  .connect(String(uri))
  .then(() => {
    console.log("MongoDB connected ");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })


  
  
  .catch((err) => {
    console.error("Failed to connect MongoDB:", err.message);
  });


app.get("/admin-orders",async(_req:Request,res:Response)=>{
  try {
    const orders = await Order.find().populate("orderBy")
    console.log(orders)
    return res.status(200).json({orders})
  } catch (error) {
    console.log(error)
    return res.status(500).json({error})
  }
})
import contactRouter from "./src/routes/contactRouter";
app.use("/contact",contactRouter)
app.use("/api/routes", productRouter);
app.use("/api/routes", cartRouter);
app.use("/api/routes", orderRouter);
app.use("/api/auth", authRouter);
app.use("/api-docs",swaggerRouter)

