"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinUser = void 0;
const userModel_1 = __importDefault(require("../../model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminModel_1 = __importDefault(require("../../model/adminModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, String(secret), { expiresIn: "3d" });
};
const signinUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const admin = await adminModel_1.default.findOne({ email });
    if (admin) {
        console.log("hello ", email);
        try {
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
                    token: adminToken,
                    role: "admin"
                }
            });
        }
        catch (error) {
            console.log("error signing in a admin : ", error);
            return res.status(500).json({ error: `error signing in a admin : ${error}` });
        }
    }
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    try {
        if (!email || !password) {
            console.log("please send both password and email");
            throw Error("please send both password and email");
        }
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            console.log("user email not found , please signup first");
            return res.status(404).json({ error: "user email not found , please signup first" });
        }
        const isMatched = await bcrypt_1.default.compare(password, user.password);
        if (!isMatched) {
            console.log("incorrect");
            throw Error("incorrect password");
        }
        const userToken = generateToken(String(user._id));
        console.log("logged in a user");
        return res.status(200).json({
            message: "successfully logged in",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                token: userToken,
                role: "user"
            }
        });
    }
    catch (error) {
        console.log("error signing in a user : ", error);
        return res.status(500).json({ error: `${error}` });
    }
};
exports.signinUser = signinUser;
