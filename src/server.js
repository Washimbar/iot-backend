require("dotenv").config();
// const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");


const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const swaggerConfig = require('./swagger/swaggerConfig');
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3005;

const app = express();


// Swagger setup
const swaggerDocs = swaggerJSDoc(swaggerConfig);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());  // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);

// Database Connection
// mongoose.connect('mongodb://localhost:27017/iot', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to the database'))
//   .catch(err => console.error('Database connection error:', err));

// // Server Listen
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
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