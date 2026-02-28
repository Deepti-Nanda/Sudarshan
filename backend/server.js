require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const startTime = Date.now();
const packageJson = require('./package.json');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI not set. Using mock data fallback.');
      return false;
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    console.warn('⚠️  Continuing with mock data fallback');
    return false;
  }
};

// Initialize DB connection
connectDB();

// Routes
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/notify', require('./routes/notify'));
app.use('/api/admin', require('./routes/admin'));

// Health endpoint
app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    status: 'ok',
    uptime: `${uptime}s`,
    version: packageJson.version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Sanjeevni Emergency Hospital Finder API',
    endpoints: {
      hospitals: '/api/hospitals',
      notify: '/api/notify',
      admin: '/api/admin',
      health: '/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🏥 Sanjeevni Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
