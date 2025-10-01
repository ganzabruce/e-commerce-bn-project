"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const productController_1 = require("../controllers/productController");
const userModel_1 = __importDefault(require("../model/userModel"));
const productController_2 = require("../controllers/productController");
const productRouter = express_1.default.Router();
productRouter.get("/products", productController_1.getProducts);
productRouter.get("/categories", productController_2.getCategories);
productRouter.get("/products/:id", productController_1.getProductById);
productRouter.get("/users", async (_req, res) => {
    try {
        const users = await userModel_1.default.find();
        console.log({ users });
        return res.status(200).json({ users });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
productRouter.use(auth_1.default);
productRouter.delete("/products/:id", productController_1.deleteProduct);
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
productRouter.post("/products", productController_1.saveProduct);
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
productRouter.put("/products/:id", productController_1.updateProduct);
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
productRouter.get("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel_1.default.findById(id);
        console.log({ user });
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
exports.default = productRouter;
