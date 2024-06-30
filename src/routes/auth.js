const express = require("express");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

async function sendOtp(email) {
	const otp = otpGenerator.generate(6, {
		upperCase: false,
		specialChars: false,
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Your OTP Code",
		text: `Your OTP code is ${otp}`,
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
	const otp = await sendOtp(email);
	user.otp = otp;
	user.otpExpires = Date.now() + 3600000; // 1 hour
	await user.save();

	res.send("OTP sent to your email");
});

router.post("/verify-otp", async (req, res) => {
	const { email, otp } = req.body;
	const user = await User.findOne({ email });

	if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
		return res.status(400).send("Invalid OTP");
	}

	user.otp = undefined;
	user.otpExpires = undefined;
	await user.save();

	res.send("User verified and signed up successfully");
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(400).send("Invalid credentials");
	}

	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
	res.send({ token });
});

router.post("/forgot-password", async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).send("User not found");
	}

	const otp = await sendOtp(email);
	user.otp = otp;
	user.otpExpires = Date.now() + 3600000; // 1 hour
	await user.save();

	res.send("OTP sent to your email");
});

router.post("/reset-password", async (req, res) => {
	const { email, otp, newPassword } = req.body;
	const user = await User.findOne({ email });

	if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
		return res.status(400).send("Invalid OTP");
	}

	user.password = newPassword;
	user.otp = undefined;
	user.otpExpires = undefined;
	await user.save();

	res.send("Password reset successfully");
});

module.exports = router;
