"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinAdmin = void 0;
const adminModel_1 = __importDefault(require("../../model/adminModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, String(secret), { expiresIn: "3d" });
};
const signinAdmin = async (req, res) => {
    console.log(secret);
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "please send both password and email" });
        }
        const admin = await adminModel_1.default.findOne({ email });
        if (!admin) {
            return res.status(404).json({ error: "admin email not found , please signup first" });
        }
        const isMatched = await bcrypt_1.default.compare(password, admin.password);
        if (!isMatched) {
            return res.status(500).json({ error: "incorrect password" });
        }
        const adminToken = generateToken(String(admin._id));
        console.log("logged in a admin");
        return res.status(200).json({
            message: "successfully logged in",
            data: {
                id: admin._id,
                email: admin.email,
                token: adminToken
            }
        });
    }
    catch (error) {
        console.log("error signing in a admin : ", error);
        return res.status(500).json({ error: `error signing in a admin : ${error}` });
    }
};
exports.signinAdmin = signinAdmin;
