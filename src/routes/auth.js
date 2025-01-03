require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const transporter = nodemailer.createTransport({
	service: "gmail",
	// secure: true,
	// port: 465,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

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

router.post("/signup", async (req, res) => {
	const { name, email, password } = req.body;
	let user = await User.findOne({ email });
	if (user) {
		return res.status(400).send("User already exists");
	}

	user = new User({ name, email, password });
	const otp = await sendOtp(email, name);
	user.otp = otp;
	user.otpExpires = Date.now() + 3600000; // 1 hour
	await user.save();

	res.send("OTP sent to your email");
});

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        // Find the user and verify OTP
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

        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).send("If the email exists, an OTP will be sent.");
    }

    const otp = await sendOtp(email);
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    res.status(200).send("If the email exists, an OTP will be sent.");
});


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

module.exports = router;
