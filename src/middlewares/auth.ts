import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/userModel";
import dotenv from "dotenv";
import Admin from "../model/adminModel";
dotenv.config();

const secret = process.env.JWT_SECRET as string;

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  console.log("Authorization header:", authorization);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & { id: string };

    const user = await User.findById(decoded.id).select("_id");
    const admin = await Admin.findById(decoded.id).select("_id")
    if (!user && !admin) {
      return res.status(401).json({ error: "User not found" });
    }
    if(user){
      req.userId = String(user?._id);
      return next();
    }
    if(admin){
      req.userId = String(admin?._id);
      return next();
    }
    return res.status(401).json({ error: "User or Admin not found" });
  } catch (error) {
    console.error("auth error: ", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
export default authMiddleware;
