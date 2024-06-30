const mongoose = require("mongoose");

const inputDeviceSchema = new mongoose.Schema({
	deviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Device",
		required: true,
	},
	sensorType: { type: String, required: true },
});

module.exports = mongoose.model("InputDevice", inputDeviceSchema);
