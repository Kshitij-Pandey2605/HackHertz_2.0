const express = require('express');
const cors = require('cors');

// Import route modules
const summaryRoutes = require('./routes/summary.routes');
const flashcardRoutes = require('./routes/flashcard.routes');

// Initialize Express application
const app = express();

// ==========================================
// Middleware Configuration
// ==========================================

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder if available
app.use('/uploads', express.static('uploads'));

// ==========================================
// Routes
// ==========================================

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PreMindAI Backend API',
  });
});

// Mount dedicated feature routes
app.use('/api/summary', summaryRoutes);
app.use('/api/flashcards', flashcardRoutes);

// Mount all application API routes
try {
  const apiRoutes = require('./routes');
  app.use('/api', apiRoutes);
} catch (error) {
  // Routes index fallback
}

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Export Express app
module.exports = app;
