const mongoose = require("mongoose");

const userSettingSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	selectedRoomId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Room",
		required: true,
	},
});

module.exports = mongoose.model("UserSetting", userSettingSchema);
