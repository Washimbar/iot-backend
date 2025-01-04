const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerSetup = require("./swagger");
const authMiddleware = require("./middlewares/authMiddleware");

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
const deviceCategoriesRoutes = require("./routes/outputDeviceCategories");
const connectDB = require("./connection/connectDB");

// Use routes
app.use("/api/auth", authRoutes); // Public route
app.use("/api/users", authMiddleware, userRoutes); // Authenticated route
app.use("/api/rooms", authMiddleware, roomRoutes); // Authenticated route
app.use("/api/devices", authMiddleware, deviceRoutes); // Authenticated route
app.use("/api/device-categories", authMiddleware, deviceCategoriesRoutes); // Authenticated route

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
