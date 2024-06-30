const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerSetup = require("./swagger");

dotenv.config();
const PORT = process.env.PORT || 3005;

const app = express();
app.use(express.json());

// Setup Swagger
swaggerSetup(app);

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const roomRoutes = require("./routes/rooms");
const deviceRoutes = require("./routes/devices");
const connectDB = require("./connection/connectDB");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/devices", deviceRoutes);


// Connect to MongoDB

const start = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server is running at http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = start;
