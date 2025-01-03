const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a new user
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login and generate JWT tokens
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create JWT token
    const payload = { userId: user._id };
    const accessToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '7d' });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Refresh token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'No refresh token provided.' });
  }

  jwt.verify(refreshToken, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ accessToken: newAccessToken });
  });
};
