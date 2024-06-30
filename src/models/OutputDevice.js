const mongoose = require("mongoose");

const outputDeviceSchema = new mongoose.Schema({
	deviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Device",
		required: true,
	},
	outputType: { type: String, required: true },
});

module.exports = mongoose.model("OutputDevice", outputDeviceSchema);
