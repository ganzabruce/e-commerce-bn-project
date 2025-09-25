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



//===================== DOCUMENTATION  ==================

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: The ID of the product added to the cart
 *         quantity:
 *           type: number
 *           description: Number of units of the product
 *         subtotal:
 *           type: number
 *           description: Total price for this cart item (quantity * product price)
 *       example:
 *         productId: 64a7fbb3a2a83d12cd89c431
 *         quantity: 2
 *         subtotal: 50.00
 */

/**
 * @swagger
 * /api/routes/cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add a product to the cart
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID to add to cart
 *               quantity:
 *                 type: number
 *                 description: Number of items
 *     responses:
 *       201:
 *         description: New cart item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       200:
 *         description: Item already in cart, updated quantity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid input (missing fields, wrong type, or quantity <= 0)
 *       404:
 *         description: Product not found or insufficient stock
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/routes/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get all cart items
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Failed to fetch cart items
 */

/**
 * @swagger
 * /api/routes/cart/{productId}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update quantity of a product in the cart
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: New quantity value
 *     responses:
 *       200:
 *         description: Cart item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found or not in cart
 *       500:
 *         description: Failed to update cart item
 */

/**
 * @swagger
 * /api/routes/cart/{productId}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove an item from the cart
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Failed to remove item
 */





cartRouter.post("/cart", addToCart);
cartRouter.get("/cart", getCart);
cartRouter.put("/cart/:productId", updateCartItem);
cartRouter.delete("/cart/:productId", removeCartItem);

export default cartRouter;
