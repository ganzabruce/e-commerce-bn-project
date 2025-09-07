import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController";

const cartRouter = express.Router();
import authMiddleware from "../middlewares/auth";
cartRouter.use(authMiddleware)


cartRouter.post("/cart", addToCart);
cartRouter.get("/cart", getCart);
cartRouter.put("/cart/:productId", updateCartItem);
cartRouter.delete("/cart/:productId", removeCartItem);

export default cartRouter;
