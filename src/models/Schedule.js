const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
	outputDeviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "OutputDevice",
		required: true,
	},
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	repeatPattern: { type: String, required: true },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
