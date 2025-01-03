const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	userType: {
		type: String,
		enum: ["admin", "member", "guest"],
		default: "guest",
	},
	isVerified: { type: Boolean, default: false },
	otp: { type: String, required: false },
	otpExpires: { type: Date, required: false },
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

module.exports = mongoose.model("User", userSchema);
