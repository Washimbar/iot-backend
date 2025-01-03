require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dataBase = await mongoose.connect(process.env.MONGO_URI);
        if (dataBase.STATES.connected) {
            console.log('Data base connected successfully');
        }
    } catch (error) {
        throw new Error(`Error connecting to: ${error.message}`);
    }
}

module.exports = connectDB;
