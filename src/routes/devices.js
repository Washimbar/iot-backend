const express = require("express");
const Device = require("../models/Device");
const router = express.Router();

// Get all devices
router.get("/", async (req, res) => {
	const devices = await Device.find().populate("roomId");
	res.send(devices);
});

// Get device by ID
router.get("/:id", async (req, res) => {
	const device = await Device.findById(req.params.id).populate("roomId");
	if (!device) return res.status(404).send("Device not found");
	res.send(device);
});

// Create new device
router.post("/", async (req, res) => {
	const { deviceName, roomId, deviceType, isEnabled } = req.body;
	const device = new Device({ deviceName, roomId, deviceType, isEnabled });
	await device.save();
	res.send(device);
});

// Update device
router.put("/:id", async (req, res) => {
	const { deviceName, roomId, deviceType, isEnabled } = req.body;
	const device = await Device.findById(req.params.id);
	if (!device) return res.status(404).send("Device not found");

	if (deviceName) device.deviceName = deviceName;
	if (roomId) device.roomId = roomId;
	if (deviceType) device.deviceType = deviceType;
	if (isEnabled !== undefined) device.isEnabled = isEnabled;

	await device.save();
	res.send(device);
});

// Delete device
router.delete("/:id", async (req, res) => {
	const device = await Device.findById(req.params.id);
	if (!device) return res.status(404).send("Device not found");

	await device.remove();
	res.send("Device deleted");
});

module.exports = router;
