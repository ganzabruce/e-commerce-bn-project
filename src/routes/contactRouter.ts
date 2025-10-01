import express from "express";
import { createContact } from "../controllers/contactController";
const contactRouter = express.Router();
contactRouter.post("/save", createContact);
import { requestPasswordReset, resetPasswordWithOtp } from "../controllers/contactController";
import { registerUser } from "../controllers/contactController";



contactRouter.post("/auth/request", requestPasswordReset);
contactRouter.post("/auth/reset", resetPasswordWithOtp);
contactRouter.post("/register", registerUser);



export default contactRouter




