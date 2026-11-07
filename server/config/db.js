const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
  
  try {
    // Set short timeout to quickly attempt real MongoDB connection
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ Connected to local/specified MongoDB database');
  } catch (err) {
    console.log('⚠️ Could not connect to local MongoDB server. Initializing MongoDB Memory Server...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB Memory Server (in-memory backend active)');
    } catch (memErr) {
      console.error('❌ MongoDB Memory Server connection error:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
