const express = require("express");
const Room = require("../models/Room");
const isAdmin = require("../middlewares/isAdmin"); // Import the middleware
const router = express.Router();

// Error handling middleware (generic)
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
};

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const rooms = await Room.find({ userId }).populate("userId");

    if (rooms.length === 0) {
      return res
        .status(404)
        .json({ error: "No rooms found for the given user ID" });
    }

    res.send(rooms);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Get room by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    const room = await Room.findById(id).populate("userId");

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.send(room);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Create new room (Admin only)
router.post("/", isAdmin, async (req, res) => {
  try {
    const { roomName, userId, isEnabled } = req.body;
    if (!roomName || !userId) {
      return res
        .status(400)
        .json({ error: "Room name and user ID are required" });
    }

    const room = new Room({ roomName, userId, isEnabled });
    await room.save();

    res.status(201).json(room);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Update room (Admin only)
router.put("/:roomId", isAdmin, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { roomName, userId, isEnabled } = req.body;

    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (roomName) room.roomName = roomName;
    if (userId) room.userId = userId;
    if (isEnabled !== undefined) room.isEnabled = isEnabled;

    await room.save();

    res.json(room);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Delete room (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    await room.remove();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.use(errorHandler);

module.exports = router;
