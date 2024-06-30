const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
	roomName: { type: String, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	isEnabled: { type: Boolean, default: true },
});

module.exports = mongoose.model("Room", roomSchema);
