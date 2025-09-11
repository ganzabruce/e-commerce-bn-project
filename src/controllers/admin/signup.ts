import Admin from "../../model/adminModel"
import { Request,Response } from "express"
import bcrypt  from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const secret = process.env.JWT_SECRET
dotenv.config()

const generateToken = (id:string): string =>{
    return jwt.sign({id},String(secret),{expiresIn: "3d"})
}
export const signupAdmin = async (req:Request,res:Response) =>{
    try {
        const { email, password } = req.body ;
        if(!email || !password){
            return res.status(400).json({error: "please fill all required fields"})
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({error:'Email not valid'})
        }
        
        const emailExists = await Admin.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: "That email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const signedUpadmin = await Admin.create({email,password:hashedPassword})
        const adminToken = generateToken(String(signedUpadmin._id))
        console.log("signed up a admin")
        return res.status(201).json({message: "created admin successfull", data: {id:signedUpadmin._id,email:signedUpadmin.email,token: adminToken}})
    } catch (error) {
        console.log("error signing up a admin : ",error)
        return res.status(500).json({error: `error signing up a admin : ${error}`})
    }
}