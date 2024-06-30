const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const roomRoutes = require("./routes/rooms");
const deviceRoutes = require("./routes/devices");
const connectDB = require("./connection/connectDB");

dotenv.config();
const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/devices", deviceRoutes);

// app.listen(3000, () => {
// 	console.log("Server is running on port 3000");
// });

const start = async () => {
	try {;
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server is running at http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = start;