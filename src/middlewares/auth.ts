import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/userModel"
import dotenv from "dotenv"

const secret = process.env.JWT_SECRET



declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token is required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, String(secret)) as JwtPayload & { id: string };
    const user = await User.findById(decoded.id).select("_id");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.userId = String(user._id);
    next();
  } catch (error) {
    console.error("auth error: ", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
