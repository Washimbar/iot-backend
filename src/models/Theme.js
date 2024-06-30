const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
	themeName: { type: String, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Theme", themeSchema);
