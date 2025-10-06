"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signin_1 = require("../controllers/auth/signin");
const signup_1 = require("../controllers/auth/signup");
// import { signinAdmin } from "../controllers/admin/signin"
// import { signupAdmin } from "../controllers/admin/signup"
const authRouter = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignup:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username for the user
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password (min 8 chars, max 30)
 *       example:
 *         username: john_doe
 *         email: john@example.com
 *         password: password123
 *
 *     UserSignin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Registered user email
 *         password:
 *           type: string
 *           description: User password
 *       example:
 *         email: john@example.com
 *         password: password123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             token:
 *               type: string
 *       example:
 *         message: successfully logged in
 *         data:
 *           id: 64a8c123f9d0b812cd89f123
 *           username: john_doe
 *           email: john@example.com
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing fields, invalid email, or user already exists
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignin'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing fields
 *       404:
 *         description: Email not registered
 *       500:
 *         description: Incorrect password or internal server error
 */
authRouter.post("/signup", signup_1.signupUser);
authRouter.post("/login", signin_1.signinUser);
// authRouter.post("/admin/signup",signupAdmin)
// authRouter.post("/admin/login",signinAdmin)
exports.default = authRouter;
