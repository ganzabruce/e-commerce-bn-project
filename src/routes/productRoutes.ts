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
 *
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




productRouter.post("/products", saveProduct);
productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getProductById);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
