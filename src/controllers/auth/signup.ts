import User from "../../model/userModel"
import { Request,Response } from "express"
import bcrypt  from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
const secret = "supersecret"
const generateToken = (id:string): string =>{
    return jwt.sign({id},secret,{expiresIn: "3d"})
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
        const usernameExists = await User.find({username})
        if(usernameExists){
            return res.status(400).json({error: "that username already exists please use another username"})
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
        return res.status(400).json({ error: "That email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const signedUpUser = await User.create({username,email,password:hashedPassword})
        const userToken = generateToken(String(signedUpUser._id))
        return res.
            status(201)
            .json({
                message: "created user successfull", 
                data: {
                    id:signedUpUser._id,
                    username:signedUpUser.username,
                    email:signedUpUser.email,
                    token: userToken
                }})

    } catch (error) {
        console.log("error signing up a user : ",error)
        return res.status(500).json({error: `error signing up a user : ${error}`})
    }
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