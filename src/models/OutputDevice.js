const mongoose = require("mongoose");

const outputDeviceSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  outputType: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    required: false,
    default: false,
  },
  OutputDeviceCategories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OutputDeviceCategories",
    required: true,
  },
});

module.exports = mongoose.model("OutputDevice", outputDeviceSchema);
