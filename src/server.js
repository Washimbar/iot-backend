require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const connectDB = require("./connection/connectDB");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

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