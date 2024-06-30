const express = require("express");
const Room = require("../models/Room");
const router = express.Router();

// Get all rooms
router.get("/", async (req, res) => {
	const rooms = await Room.find().populate("userId");
	res.send(rooms);
});

// Get room by ID
router.get("/:id", async (req, res) => {
	const room = await Room.findById(req.params.id).populate("userId");
	if (!room) return res.status(404).send("Room not found");
	res.send(room);
});

// Create new room
router.post("/", async (req, res) => {
	const { roomName, userId, isEnabled } = req.body;
	const room = new Room({ roomName, userId, isEnabled });
	await room.save();
	res.send(room);
});

// Update room
router.put("/:id", async (req, res) => {
	const { roomName, userId, isEnabled } = req.body;
	const room = await Room.findById(req.params.id);
	if (!room) return res.status(404).send("Room not found");

	if (roomName) room.roomName = roomName;
	if (userId) room.userId = userId;
	if (isEnabled !== undefined) room.isEnabled = isEnabled;

	await room.save();
	res.send(room);
});

// Delete room
router.delete("/:id", async (req, res) => {
	const room = await Room.findById(req.params.id);
	if (!room) return res.status(404).send("Room not found");

	await room.remove();
	res.send("Room deleted");
});

module.exports = router;
