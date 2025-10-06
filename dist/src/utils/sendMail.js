"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a Nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
// Function to send email
const mailerSender = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent, // Use 'html' for HTML content
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
        return true;
    }
    catch (error) {
        console.error("Error sending email: ", error.message);
        return false;
    }
};
exports.default = mailerSender;
