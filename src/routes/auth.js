require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send OTP via email
async function sendOtp(email, name) {
    const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your One-Time Password (OTP)",
        text: `Hello, ${name}
        
We received a request to access your account. Please use the following One-Time Password (OTP) to proceed:

OTP: ${otp}

This OTP is valid for the next 1 hour. If you did not request this, please ignore this email or contact support.

Thank you,
The Team`,
    };

    await transporter.sendMail(mailOptions);
    return otp;
}

// Signup route
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).send("User already exists");
    }

    user = new User({ name, email, password });
    const otp = await sendOtp(email, name);
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000; // OTP valid for 1 hour
    await user.save();

    res.send("OTP sent to your email");
});

// OTP verification route
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Clear OTP fields
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;
        await user.save();

        res.json({ message: "User verified and signed up successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        const isPasswordCorrect = user && (await bcrypt.compare(password, user.password));

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: "User is not verified" });
        }

        const accessToken = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Generate a refresh token with a longer expiration time
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "30d" } // Refresh token expires in 7 days
        );

        // Store refresh token in an HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: "Login successful", accessToken , refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Refresh token route
router.post("/refresh-token", (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ accessToken });
    });
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).send("If the email exists, an OTP will be sent.");
    }

    const otp = await sendOtp(email);
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000; // OTP valid for 1 hour
    await user.save();

    res.status(200).send("If the email exists, an OTP will be sent.");
});

// Reset password route
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Invalid request. Please provide all required fields." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Unable to process your request. Please try again." });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Unable to process your request. Please try again." });
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Your password has been reset successfully." });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});

// Logout route
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
