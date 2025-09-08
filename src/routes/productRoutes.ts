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


//==================== DOCUMENTATION ==========================
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *     Bearer:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - imageUrl
 *         - category
 *         - quantity
 *       properties:
 *         name:
 *           type: string
 *           description: name of the product
 *         price:
 *           type: number
 *           description: price of the product
 *         description:
 *           type: string
 *           description: Detailed description of the product
 *         imageUrl:
 *           type: string
 *           description: link of and image of the product
 *         category:
 *           type: string
 *           description: category of the product
 *         quantity:
 *           type: number
 *           description: qantity of the products
 *         
 */

/**
 * @swagger
 * /api/routes/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create new Product
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error (missing fields or price must be > 1)
 *       500:
 *         description: Internal server error
 */
productRouter.post("/products", saveProduct);

/**
 * @swagger
 * /api/routes/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Failed to fetch products
 */

productRouter.get("/products", getProducts);

/**
 * @swagger
 * 
 * /api/routes/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to fetch product
 */

productRouter.get("/products/:id", getProductById);

/** 
 * @swagger
 * 
 *   put:
 *     tags:
 *       - Products
 *     summary: Update product by ID
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product
 */
productRouter.put("/products/:id", updateProduct);

/** 
 * @swagger
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete product by ID
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to delete product
 */





productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
