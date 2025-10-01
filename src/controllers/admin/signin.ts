import Admin from "../../model/adminModel"
import { Request,Response } from "express"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"
const secret = process.env.JWT_SECRET


const generateToken = (id:string): string =>{
    return jwt.sign({id},String(secret),{expiresIn: "3d"})
}
