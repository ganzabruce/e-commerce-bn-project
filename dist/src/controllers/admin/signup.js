"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupAdmin = void 0;
const adminModel_1 = __importDefault(require("../../model/adminModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const secret = process.env.JWT_SECRET;
dotenv_1.default.config();
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, String(secret), { expiresIn: "3d" });
};
const signupAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "please fill all required fields" });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ error: 'Email not valid' });
        }
        const emailExists = await adminModel_1.default.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: "That email is already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const signedUpadmin = await adminModel_1.default.create({ email, password: hashedPassword });
        const adminToken = generateToken(String(signedUpadmin._id));
        console.log("signed up a admin");
        return res.status(201).json({ message: "created admin successfull", data: { id: signedUpadmin._id, email: signedUpadmin.email, token: adminToken } });
    }
    catch (error) {
        console.log("error signing up a admin : ", error);
        return res.status(500).json({ error: `error signing up a admin : ${error}` });
    }
};
exports.signupAdmin = signupAdmin;
