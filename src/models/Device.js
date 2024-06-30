const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
	deviceName: { type: String, required: true },
	roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
	deviceType: { type: String, required: true },
	isEnabled: { type: Boolean, default: true },
});

module.exports = mongoose.model("Device", deviceSchema);
