const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
	const users = await User.find();
	res.send(users);
});

// Get user by ID
router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).send("User not found");
	res.send(user);
});

// Create new user
router.post("/", async (req, res) => {
	const { name, email, password, userType } = req.body;
	let user = await User.findOne({ email });
	if (user) return res.status(400).send("User already exists");

	user = new User({ name, email, password, userType });
	await user.save();
	res.send(user);
});

// Update user
router.put("/:id", async (req, res) => {
	const { name, email, password, userType } = req.body;
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).send("User not found");

	if (name) user.name = name;
	if (email) user.email = email;
	if (password) user.password = password;
	if (userType) user.userType = userType;

	await user.save();
	res.send(user);
});

// Delete user
router.delete("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).send("User not found");

	await user.remove();
	res.send("User deleted");
});

module.exports = router;
