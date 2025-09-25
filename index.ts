import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRouter from "./src/routes/productRoutes";
import cartRouter from "./src/routes/cartRoutes";
import orderRouter from "./src/routes/orderRoutes";
import dotenv from "dotenv"
import authRouter from "./src/routes/auth";
import swaggerRouter from "./swagger";
dotenv.config()
const app = express();
const port = process.env.PORT;
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
app.use("/api/routes", productRouter);
app.use("/api/routes", cartRouter);
app.use("/api/routes", orderRouter);
app.use("/api/auth", authRouter);
app.use("/api-docs",swaggerRouter)
