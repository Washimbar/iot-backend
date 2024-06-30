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
const connectDB = require("./connection/connectDB");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB
// mongoose
// 	.connect(process.env.MONGO_URI, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 	})
// 	.then(() => console.log("MongoDB connected"))
// 	.catch((err) => console.log(err));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`);
// });

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
