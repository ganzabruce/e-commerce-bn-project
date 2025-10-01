"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    console.log("Authorization header:", authorization);
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token is required" });
    }
    const token = authorization.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await userModel_1.default.findById(decoded.id).select("_id");
        const admin = await adminModel_1.default.findById(decoded.id).select("_id");
        if (!user && !admin) {
            return res.status(401).json({ error: "User not found" });
        }
        if (user) {
            req.userId = String(user?._id);
            return next();
        }
        if (admin) {
            req.userId = String(admin?._id);
            return next();
        }
        return res.status(401).json({ error: "User or Admin not found" });
    }
    catch (error) {
        console.error("auth error: ", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.default = authMiddleware;
