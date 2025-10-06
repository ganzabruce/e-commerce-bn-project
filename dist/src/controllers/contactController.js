"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.resetPasswordWithOtp = exports.requestPasswordReset = exports.createContact = void 0;
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const contactModel_1 = __importDefault(require("../model/contactModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ message: "Name ,Email and message are required " });
            return;
        }
        const newContact = new contactModel_1.default({ name, email, phone, message });
        await newContact.save();
        //admin notification
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            await (0, sendMail_1.default)(adminEmail, "i have registered now , give me my marks😂", `
                <h3>New Message Received</h3>
                <p><strong>Name:</strong> ${name}</strong></p>
                <p><strong>Email:</strong> ${email}</strong></p>
                <p><strong>Phone:</strong> ${phone}</strong></p>
                <p><strong>Message:</strong> ${message}</strong></p>
                `);
        }
        await (0, sendMail_1.default)(email, "thank you for contacting us", `
            <h3>hello ${name}</h3>
            <p>thank you for reaching out ! we have received your message</p>
            <p>our team will get back to you shortly</p>
            <br />
            <p>best regards</p>
            <p><strong>K Lab Team</strong></p>
            `);
        return res.status(201).json({ message: "emails are sent succcessfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
};
exports.createContact = createContact;
// ================================
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const testUser_1 = __importDefault(require("../model/testUser"));
// Generate a simple 6-digit OTP
function generateOtp() {
    return crypto_1.default.randomInt(100000, 999999).toString();
}
// STEP 1: User requests password reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        // Find user by email
        const user = await testUser_1.default.findOne({ email });
        if (!user) {
            // Don't reveal user doesn't exist (security reason)
            return res.status(200).json({ message: "If the email exists, OTP was sent." });
        }
        // Create OTP
        const otp = generateOtp();
        const hashedOtp = await bcrypt_1.default.hash(otp, 10);
        // Save OTP + expiry (15 minutes)
        user.resetOtp = hashedOtp;
        user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        // Send OTP to user’s email
        await (0, sendMail_1.default)(user.email, "Password Reset OTP", `<p>Hello ${user.username},</p>
       <p>Your OTP is <b>${otp}</b>. It will expire in 15 minutes.</p>`);
        return res.status(200).json({ message: "If the email exists, OTP was sent." });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.requestPasswordReset = requestPasswordReset;
// STEP 2: User submits OTP + new password
const resetPasswordWithOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }
        const user = await testUser_1.default.findOne({ email });
        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        // Check expiry
        if (user.resetOtpExpiry.getTime() < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        // Compare OTP
        const isValidOtp = await bcrypt_1.default.compare(otp, user.resetOtp);
        if (!isValidOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Hash and update new password
        user.password = await bcrypt_1.default.hash(newPassword, 10);
        // Clear OTP fields
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.resetPasswordWithOtp = resetPasswordWithOtp;
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await testUser_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new testUser_1.default({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.registerUser = registerUser;
