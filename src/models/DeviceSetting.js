const mongoose = require("mongoose");

const deviceSettingSchema = new mongoose.Schema({
	deviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Device",
		required: true,
	},
	settingType: { type: String, required: true },
	onTime: { type: Date, required: false },
	offTime: { type: Date, required: false },
});

module.exports = mongoose.model("DeviceSetting", deviceSettingSchema);
