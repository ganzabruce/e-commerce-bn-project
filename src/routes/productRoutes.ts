import express, {Request,Response}from "express";
import authMiddleware from "../middlewares/auth";
import {
  saveProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import User from "../model/userModel";
import { getCategories } from "../controllers/productController";
const productRouter = express.Router();
productRouter.get("/products", getProducts);
productRouter.get("/categories", getCategories);
productRouter.get("/products/:id", getProductById);
productRouter.get("/users",async (_req:Request,res:Response)=>{
  try {
    const users = await User.find()
    console.log({users})
    return res.status(200).json({users})
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
    
  }
});

productRouter.use(authMiddleware)

productRouter.delete("/products/:id", deleteProduct);


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






productRouter.get("/user/:id",async (req:Request,res:Response)=>{
  try {
    const id = req.params.id 
    const user = await User.findById(id)
    console.log({user})
    return res.status(200).json({user})
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
    
  }
});

export default productRouter;
