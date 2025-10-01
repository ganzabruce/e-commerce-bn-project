"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.getOrderById = exports.getOrders = exports.placeOrder = void 0;
const orderModel_1 = __importDefault(require("../model/orderModel"));
const cartModel_1 = __importDefault(require("../model/cartModel"));
const productModel_1 = __importDefault(require("../model/productModel"));
const placeOrder = async (req, res) => {
    try {
        const user = req.userId;
        const cartItems = await cartModel_1.default.find({ createdBy: user });
        if (cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty. Cannot place order." });
        }
        let totalPrice = 0;
        const orderItems = [];
        for (const item of cartItems) {
            const product = await productModel_1.default.findById(item.productId);
            if (!product) {
                return res.status(400).json({ error: `Product with id ${item.productId} not found.` });
            }
            const itemTotal = item.quantity * product.price;
            totalPrice += itemTotal;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
            });
        }
        const newOrder = await orderModel_1.default.create({
            items: orderItems,
            totalPrice,
            orderBy: user
        });
        await cartModel_1.default.deleteMany();
        return res.status(201).json({ newOrder });
    }
    catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};
exports.placeOrder = placeOrder;
const getOrders = async (req, res) => {
    try {
        const user = req.userId;
        const orders = await orderModel_1.default.find({ orderBy: user }).populate("items.productId");
        return res.status(200).json({ orders });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch orders." });
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        const order = await orderModel_1.default.findById(req.params.id).populate("items.productId");
        if (!order)
            return res.status(404).json({ error: "Order not found." });
        return res.status(200).json({ order });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch order." });
    }
};
exports.getOrderById = getOrderById;
const cancelOrder = async (req, res) => {
    try {
        const deletedOrder = await orderModel_1.default.findByIdAndDelete(req.params.id);
        if (!deletedOrder)
            return res.status(404).json({ error: "Order not found." });
        return res.status(200).json({ message: "Order cancelled successfully." });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to cancel order." });
    }
};
exports.cancelOrder = cancelOrder;
