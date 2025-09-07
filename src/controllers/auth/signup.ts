import User from "../../model/userModel"
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
export const signupUser = async (req:Request,res:Response) =>{
    try {
        const { username, email, password } = req.body ;
        if(!username || !email || !password){
            return res.status(400).json({error: "please fill all required fields"})
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({error:'Email not valid'})
        }
        const usernameExists = await User.findOne({username})
        if(usernameExists){
            console.log("alredy exists")
            return res.status(400).json({error: "that username already exists please use another username"})
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ error: "That email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const signedUpUser = await User.create({username,email,password:hashedPassword})
        const userToken = generateToken(String(signedUpUser._id))
        console.log("signed up a user")
        return res.status(201).json({message: "created user successfull", data: {id:signedUpUser._id,username:signedUpUser.username,email:signedUpUser.email,token: userToken}})
    } catch (error) {
        console.log("error signing up a user : ",error)
        return res.status(500).json({error: `error signing up a user : ${error}`})
    }
}