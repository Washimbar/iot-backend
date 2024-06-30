const mongoose = require("mongoose");

const adminActionSchema = new mongoose.Schema({
	adminId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	targetUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	actionType: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminAction", adminActionSchema);
