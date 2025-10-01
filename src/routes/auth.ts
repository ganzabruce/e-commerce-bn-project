import express from "express"
import { signinUser } from "../controllers/auth/signin"
import { signupUser } from "../controllers/auth/signup"
// import { signinAdmin } from "../controllers/admin/signin"
// import { signupAdmin } from "../controllers/admin/signup"

const authRouter = express.Router()


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

authRouter.post("/signup",signupUser)
authRouter.post("/login",signinUser)
// authRouter.post("/admin/signup",signupAdmin)
// authRouter.post("/admin/login",signinAdmin)


export default authRouter