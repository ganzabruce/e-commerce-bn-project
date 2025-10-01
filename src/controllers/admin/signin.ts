import Admin from "../../model/adminModel"
import { Request,Response } from "express"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET

const generateToken = (id:string): string =>{
    return jwt.sign({id},String(secret),{expiresIn: "3d"})
}
export const signinAdmin = async (req:Request,res:Response) => {
    console.log(secret)
    try {
        console.log(req.body)
        const {email ,password} = req.body
        if(!email || !password){
            return res.status(400).json({error: "please send both password and email"})
        }
        const admin = await Admin.findOne({email})
        if(!admin){
            return res.status(404).json({error: "admin email not found , please signup first"})
        }
        const isMatched = await bcrypt.compare(password, admin.password)
        if(!isMatched){
            return res.status(500).json({error: "incorrect password"})
        }
        const adminToken = generateToken(String(admin._id))
        console.log("logged in a admin")
        return res.status(200).json({
            message: "successfully logged in",
            data: {
                id: admin._id,
                email: admin.email,
                token:adminToken
            }
        })
    } catch (error) {
        console.log("error signing in a admin : ",error)
        return res.status(500).json({error: `error signing in a admin : ${error}`})
    }
}