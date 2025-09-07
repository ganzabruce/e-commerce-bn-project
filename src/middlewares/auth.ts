import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken"
import User from "../../model/userModel"

const authMiddleware = async (req:Request,res:Response,next:NextFunction) =>{
    const {authorization } = req.headers
    if(!authorization){
        return res.status(401).json({error: "the authorization token should be provided"})
    }
    const token = authorization.split(" ")[1]
    try {
        const {id} = jwt.verify(token , process.env.JWT_SECRET)
        req.userId = await User.findById(token).select('_id')
        next();
    } catch (error) {
        console.log("auth error: ",error)
        res.status(500).json({error})
    }
}