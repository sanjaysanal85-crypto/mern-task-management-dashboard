const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const seedDatabase = require('./utils/seedData');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Healthcheck Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Task Manager API Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

startServer();
