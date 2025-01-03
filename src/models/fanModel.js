const mongoose = require('mongoose');

const fanSchema = new mongoose.Schema({
  fanId: { type: Number, required: true },
  state: { type: Boolean, default: false }, // true for ON, false for OFF
  speed: { type: Number, default: 0 }, // Speed in percentage (0 to 100)
});

const Fan = mongoose.model('Fan', fanSchema);

module.exports = Fan;
