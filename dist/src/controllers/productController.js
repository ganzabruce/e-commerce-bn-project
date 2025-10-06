"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getCategories = exports.getProducts = exports.saveProduct = void 0;
const productModel_1 = __importDefault(require("../model/productModel"));
const saveProduct = async (req, res) => {
    console.log(req.body);
    try {
        const { name, price, description, imageUrl, category, quantity } = req.body;
        if (!name || price == null || !description || !imageUrl || !category || quantity == null) {
            return res.status(400).json({ error: "please fill all required fields" });
        }
        else if (isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({ error: "the price and quantity field must all be numbers" });
        }
        if (price <= 0) {
            return res.status(400).json({ error: "the price of product must be greater than 1" });
        }
        const newProduct = await productModel_1.default.create({
            name: name,
            price,
            description,
            imageUrl,
            category,
            quantity
        });
        return res.status(201).json({ newProduct });
    }
    catch (error) {
        console.error("Error saving product:", error);
        return res.status(500).json({ error: `Internal server error : ${error}` });
    }
};
exports.saveProduct = saveProduct;
const getProducts = async (req, res) => {
    try {
        const products = await productModel_1.default.find();
        console.log(products);
        return res.json({ products: products });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch products." });
    }
};
exports.getProducts = getProducts;
const getCategories = async (req, res) => {
    try {
        const products = await productModel_1.default.find();
        console.log(products);
        return res.json({ id: products, name: products });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch products." });
    }
};
exports.getCategories = getCategories;
const getProductById = async (req, res) => {
    try {
        const product = await productModel_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ error: "Product not found." });
        console.log(product);
        res.status(200).json({ product });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch product." });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, imageUrl, category, quantity } = req.body;
        if (!name || price == null || !description || !imageUrl || !category || quantity == null) {
            return res.status(400).json({ error: "please fill all required fields" });
        }
        else if (isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({ error: "the price and quantity fields must all be numbers" });
        }
        if (price <= 0) {
            return res.status(400).json({ error: "the price of product must be greater than 1" });
        }
        const updatedProduct = await productModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct)
            return res.status(404).json({ error: "Product not found." });
        return res.status(200).json({ updatedProduct });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to update product." });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productModel_1.default.findByIdAndDelete(req.params.id);
        if (!deletedProduct)
            return res.status(404).json({ error: "Product not found." });
        return res.status(200).json({ message: "Product deleted successfully." });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete product." });
    }
};
exports.deleteProduct = deleteProduct;
