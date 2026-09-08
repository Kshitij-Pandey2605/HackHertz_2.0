const express = require('express');
const cors = require('cors');

// ==========================================
// 1. Import Route Modules
// ==========================================
const uploadRoutes = require('./routes/upload.routes');
const documentRoutes = require('./routes/document.routes');
const summaryRoutes = require('./routes/summary.routes');
const flashcardRoutes = require('./routes/flashcard.routes');
const quizRoutes = require('./routes/quiz.routes');

// Initialize Express application
const app = express();

// ==========================================
// 2. Middleware Configuration
// ==========================================

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// ==========================================
// 3. Health Check & Root Routes
// ==========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PreMindAI Backend API',
  });
});

// ==========================================
// 4. Register API Routes
// ==========================================
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/quiz', quizRoutes);

// ==========================================
// 5. Global 404 Not Found Handler
// ==========================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ==========================================
// 6. Global Error Handling Middleware
// ==========================================
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Export configured Express app
module.exports = app;
