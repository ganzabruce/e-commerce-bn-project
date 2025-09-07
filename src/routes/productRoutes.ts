import express from "express";
import authMiddleware from "../middlewares/auth";
import {
  saveProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
const productRouter = express.Router();

productRouter.use(authMiddleware)

productRouter.post("/products", saveProduct);
productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getProductById);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
