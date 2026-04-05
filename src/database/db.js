const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      connectTimeoutMS: 15000, // 15 second timeout
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    console.log('MongoDB Connected:', conn.connection.host);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
