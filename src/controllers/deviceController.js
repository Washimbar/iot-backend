const Switch = require('../models/switchModel');
const Fan = require('../models/fanModel');
const RGB = require('../models/rgbModel');

// Control Fan
exports.controlFan = async (req, res) => {
  const { fanId, state, speed } = req.body;
  try {
    const fan = await Fan.findOne({ fanId });
    if (fan) {
      fan.state = state;
      fan.speed = speed || fan.speed;
      await fan.save();
      res.status(200).json({ message: 'Fan controlled successfully', fan });
    } else {
      const newFan = new Fan({ fanId, state, speed });
      await newFan.save();
      res.status(201).json({ message: 'Fan created and controlled successfully', newFan });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Control RGB Light
exports.controlRGB = async (req, res) => {
  const { rgbId, state, color } = req.body;
  try {
    const rgb = await RGB.findOne({ rgbId });
    if (rgb) {
      rgb.state = state;
      rgb.color = color || rgb.color;
      await rgb.save();
      res.status(200).json({ message: 'RGB controlled successfully', rgb });
    } else {
      const newRGB = new RGB({ rgbId, state, color });
      await newRGB.save();
      res.status(201).json({ message: 'RGB light created and controlled successfully', newRGB });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Control Switches
exports.controlSwitch = async (req, res) => {
  const { switchId, state } = req.body;
  try {
    const switchDevice = await Switch.findOne({ switchId });
    if (switchDevice) {
      switchDevice.state = state;
      await switchDevice.save();
      res.status(200).json({ message: 'Switch controlled successfully', switchDevice });
    } else {
      const newSwitch = new Switch({ switchId, state });
      await newSwitch.save();
      res.status(201).json({ message: 'Switch created and controlled successfully', newSwitch });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
