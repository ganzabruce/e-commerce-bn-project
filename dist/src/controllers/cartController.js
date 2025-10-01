"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItem = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const cartModel_1 = __importDefault(require("../model/cartModel"));
const productModel_1 = __importDefault(require("../model/productModel"));
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || quantity == null) {
            return res.status(400).json({ error: "please fill all required data" });
        }
        else if (isNaN(quantity)) {
            return res.status(400).json({ error: "please send the quantity as a number " });
        }
        else if (quantity <= 0) {
            return res.status(400).json({ error: "please send the quantity of products you need as number greater that 0" });
        }
        const userId = req.userId;
        console.log(userId);
        const product = await productModel_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ error: "Product not found." });
        if (quantity > product?.quantity) {
            return res.status(404).json({ error: `the requested amount of products is greater than what we currently have in the stock, we only have ${product?.quantity} while you reqested ${quantity}` });
        }
        let cartItem = await cartModel_1.default.findOne({ productId, createdBy: userId });
        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.subtotal = cartItem.quantity * product.price;
            await cartItem.save();
            // Populate the updated cart item
            const populatedCartItem = await cartModel_1.default.findById(cartItem._id).populate({
                path: 'productId',
                select: 'name price description imageUrl category quantity'
            });
            return res.status(200).json({ cartItem: populatedCartItem });
        }
        const newCartItem = await cartModel_1.default.create({
            createdBy: userId,
            productId,
            quantity,
            subtotal: quantity * product.price,
        });
        // Populate the new cart item
        const populatedNewCartItem = await cartModel_1.default.findById(newCartItem._id).populate({
            path: 'productId',
            select: 'name price description imageUrl category quantity'
        });
        return res.status(201).json({ newCartItem: populatedNewCartItem });
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ error: `Internal server error. ${error} ` });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        const user = req.userId;
        const cartItems = await cartModel_1.default.find({ createdBy: user }).populate({
            path: 'productId',
            select: 'name price description imageUrl category quantity'
        });
        return res.status(200).json({ cartItems });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch cart items." });
    }
};
exports.getCart = getCart;
const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!productId) {
            return res.status(400).json({ error: "please send the product id in params" });
        }
        else if (quantity == null) {
            return res.status(400).json({ error: "please provide the quantity value" });
        }
        else if (isNaN(quantity)) {
            return res.status(400).json({ error: "please send the quantity as a number " });
        }
        else if (quantity <= 0) {
            return res.status(400).json({ error: "please send the quantity of products you need as number greater that 0" });
        }
        const product = await productModel_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ error: "Product not found." });
        const user = req.userId;
        const cartItem = await cartModel_1.default.findOne({ productId, createdBy: user });
        if (!cartItem)
            return res.status(404).json({ error: "Item not in cart." });
        cartItem.quantity = quantity;
        cartItem.subtotal = quantity * product.price;
        await cartItem.save();
        // Populate the updated cart item
        const populatedCartItem = await cartModel_1.default.findById(cartItem._id).populate({
            path: 'productId',
            select: 'name price description imageUrl category quantity'
        });
        return res.status(200).json({ cartItem: populatedCartItem });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to update cart item." });
    }
};
exports.updateCartItem = updateCartItem;
const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;
        const deletedItem = await cartModel_1.default.findOneAndDelete({ productId, createdBy: userId });
        if (!deletedItem)
            return res.status(404).json({ error: "Item not found in cart." });
        return res.status(200).json({ message: "Item removed from cart." });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to remove item." });
    }
};
exports.removeCartItem = removeCartItem;
