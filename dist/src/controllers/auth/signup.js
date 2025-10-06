"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupUser = void 0;
const userModel_1 = __importDefault(require("../../model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const secret = process.env.JWT_SECRET;
dotenv_1.default.config();
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, String(secret), { expiresIn: "3d" });
};
const signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "please fill all required fields" });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ error: 'Email not valid' });
        }
        const usernameExists = await userModel_1.default.findOne({ username });
        if (usernameExists) {
            console.log("alredy exists");
            return res.status(400).json({ error: "that username already exists please use another username" });
        }
        const emailExists = await userModel_1.default.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: "That email is already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const signedUpUser = await userModel_1.default.create({ username, email, password: hashedPassword });
        const userToken = generateToken(String(signedUpUser._id));
        console.log("signed up a user");
        return res.status(201).json({ message: "created user successfull", data: { id: signedUpUser._id, username: signedUpUser.username, email: signedUpUser.email, token: userToken } });
    }
    catch (error) {
        console.log("error signing up a user : ", error);
        return res.status(500).json({ error: `error signing up a user : ${error}` });
    }
};
exports.signupUser = signupUser;
