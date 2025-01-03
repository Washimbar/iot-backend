const mongoose = require('mongoose');

const switchSchema = new mongoose.Schema({
  switchId: { type: Number, required: true },
  state: { type: Boolean, default: false }, // true for ON, false for OFF
});

const Switch = mongoose.model('Switch', switchSchema);

module.exports = Switch;
