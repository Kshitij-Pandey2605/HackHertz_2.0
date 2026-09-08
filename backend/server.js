const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Import configured Express app
const app = require('./src/app');

// Read PORT from environment variables with 5000 as fallback
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log('==============================================');
  console.log(`🚀 Server is running on port: ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📡 Health check URL: http://localhost:${PORT}/api/health`);
  console.log('==============================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
