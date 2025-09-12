import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController";
import authMiddleware from "../middlewares/auth";
const orderRouter = express.Router();
// orderRouter.use(authMiddleware)


/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: ID of the product in the order
 *         quantity:
 *           type: number
 *           description: Quantity of that product
 *       example:
 *         productId: 64a7fbb3a2a83d12cd89c431
 *         quantity: 2
 * 
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated order ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice:
 *           type: number
 *           description: Total price of the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 64a8c123f9d0b812cd89f123
 *         items:
 *           - productId: 64a7fbb3a2a83d12cd89c431
 *             quantity: 2
 *         totalPrice: 100.00
 *         createdAt: 2025-09-07T10:00:00Z
 *         updatedAt: 2025-09-07T10:00:00Z
 */

/**
 * @swagger
 * /api/routes/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Place a new order
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cart is empty or invalid product
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/routes/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Failed to fetch orders
 */

/**
 * @swagger
 * /api/routes/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order by ID
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to fetch order
 */

/**
 * @swagger
 * /api/routes/orders/{id}:
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Cancel (delete) an order
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to cancel order
 */

orderRouter.post("/orders", placeOrder);
orderRouter.get("/orders", getOrders);
orderRouter.get("/orders/:id", getOrderById);
orderRouter.delete("/orders/:id", cancelOrder);

export default orderRouter;
