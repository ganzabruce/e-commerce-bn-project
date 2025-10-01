import { Request,Response } from "express";
import mailerSender from "../utils/sendMail";
import Contact from "../model/contactModel";
import dotenv from "dotenv"
dotenv.config()


export const createContact = async(req:Request,res:Response)=>{
    try {
        const {name, email, phone , message} = req.body


        if(!name || !email || !message){
            res.status(400).json({message:"Name ,Email and message are required "})
            return;
        }
        const newContact  = new Contact({name , email,phone,message})
        await newContact.save()

        //admin notification

        const adminEmail = process.env.ADMIN_EMAIL;
        if(adminEmail){
            await mailerSender(
                adminEmail,
                "i have registered now , give me my marks😂",
                `
                <h3>New Message Received</h3>
                <p><strong>Name:</strong> ${name}</strong></p>
                <p><strong>Email:</strong> ${email}</strong></p>
                <p><strong>Phone:</strong> ${phone}</strong></p>
                <p><strong>Message:</strong> ${message}</strong></p>
                `
            )
        }

        await mailerSender(
            email,
            "thank you for contacting us",
            `
            <h3>hello ${name}</h3>
            <p>thank you for reaching out ! we have received your message</p>
            <p>our team will get back to you shortly</p>
            <br />
            <p>best regards</p>
            <p><strong>K Lab Team</strong></p>
            `
        )


        return res.status(201).json({message:"emails are sent succcessfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error})
    }
}







// ================================

import bcrypt from "bcrypt";
import crypto from "crypto";
import TestUser from "../model/testUser";

// Generate a simple 6-digit OTP
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// STEP 1: User requests password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await TestUser.findOne({ email });
    if (!user) {
      // Don't reveal user doesn't exist (security reason)
      return res.status(200).json({ message: "If the email exists, OTP was sent." });
    }

    // Create OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP + expiry (15 minutes)
    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Send OTP to user’s email
    await mailerSender(
      user.email,
      "Password Reset OTP",
      `<p>Hello ${user.username},</p>
       <p>Your OTP is <b>${otp}</b>. It will expire in 15 minutes.</p>`
    );

    return res.status(200).json({ message: "If the email exists, OTP was sent." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// STEP 2: User submits OTP + new password
export const resetPasswordWithOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await TestUser.findOne({ email });
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check expiry
    if (user.resetOtpExpiry.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Compare OTP
    const isValidOtp = await bcrypt.compare(otp, user.resetOtp);
    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};







export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await TestUser.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new TestUser({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
