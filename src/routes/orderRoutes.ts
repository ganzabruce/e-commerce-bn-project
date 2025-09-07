import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController";
import authMiddleware from "../middlewares/auth";
const orderRouter = express.Router();
orderRouter.use(authMiddleware)

orderRouter.post("/orders", placeOrder);
orderRouter.get("/orders", getOrders);
orderRouter.get("/orders/:id", getOrderById);
orderRouter.delete("/orders/:id", cancelOrder);

export default orderRouter;
