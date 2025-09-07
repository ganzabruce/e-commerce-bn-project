import express from "express"
import { signinUser } from "../controllers/auth/signin"
import { signupUser } from "../controllers/auth/signup"
const authRouter = express.Router()


authRouter.post("/signup",signupUser)
authRouter.post("/login",signinUser)


export default authRouter