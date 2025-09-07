import User from "../../model/userModel"
import { Request,Response } from "express"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const secret = process.env.JWT_SECRET


const generateToken = (id:string): string =>{
    return jwt.sign({id},String(secret),{expiresIn: "3d"})
}
export const signinUser = async (req:Request,res:Response) => {
    try {
        const {email ,password} = req.body
        if(!email || !password){
            return res.status(400).json({error: "please send both password and email"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({error: "user email not found , please signup first"})
        }
        const isMatched = await bcrypt.compare(password, user.password)
        if(!isMatched){
            return res.status(500).json({error: "incorrect password"})
        }
        const userToken = generateToken(String(user._id))
        console.log("logged in a user")
        return res.status(200).json({
            message: "successfully logged in",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                token:userToken
            }
        })
    } catch (error) {
        console.log("error signing in a user : ",error)
        return res.status(500).json({error: `error signing in a user : ${error}`})
    }
}