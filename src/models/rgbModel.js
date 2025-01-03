const mongoose = require('mongoose');

const rgbSchema = new mongoose.Schema({
  rgbId: { type: Number, required: true },
  state: { type: Boolean, default: false }, // true for ON, false for OFF
  color: { type: String, default: 'white' }, // Color of the RGB light
});

const RGB = mongoose.model('RGB', rgbSchema);

module.exports = RGB;
