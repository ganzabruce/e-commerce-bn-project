"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./src/routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./src/routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./src/routes/orderRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const orderModel_1 = __importDefault(require("./src/model/orderModel"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const swagger_1 = __importDefault(require("./swagger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const uri = process.env.DB_URI;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, _res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
mongoose_1.default
    .connect(String(uri))
    .then(() => {
    console.log("MongoDB connected ");
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect MongoDB:", err.message);
});
app.get("/admin-orders", async (_req, res) => {
    try {
        const orders = await orderModel_1.default.find().populate("orderBy");
        console.log(orders);
        return res.status(200).json({ orders });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});
const contactRouter_1 = __importDefault(require("./src/routes/contactRouter"));
app.use("/contact", contactRouter_1.default);
app.use("/api/routes", productRoutes_1.default);
app.use("/api/routes", cartRoutes_1.default);
app.use("/api/routes", orderRoutes_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api-docs", swagger_1.default);
