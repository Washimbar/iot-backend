const mongoose = require("mongoose");

const timerSchema = new mongoose.Schema({
	outputDeviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "OutputDevice",
		required: true,
	},
	onTime: { type: Date, required: true },
	offTime: { type: Date, required: true },
});

module.exports = mongoose.model("Timer", timerSchema);
