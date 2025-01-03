const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.userType !== "admin") {
      return res.status(403).json({ error: "Permission denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = isAdmin;
