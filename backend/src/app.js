const express = require('express');
const cors = require('cors');
<<<<<<< HEAD

// ==========================================
// 1. Import Route Modules
// ==========================================
const uploadRoutes = require('./routes/upload.routes');
const documentRoutes = require('./routes/document.routes');
const summaryRoutes = require('./routes/summary.routes');
const flashcardRoutes = require('./routes/flashcard.routes');
const quizRoutes = require('./routes/quiz.routes');
=======
const { supabase, isSupabaseConfigured } = require('./config/supabase');
>>>>>>> 797fcb9639b1f191de2421a6f8225afb8a3d4976

// Initialize Express application
const app = express();

// ==========================================
// 2. Middleware Configuration
// ==========================================

<<<<<<< HEAD
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
=======
// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
>>>>>>> 797fcb9639b1f191de2421a6f8225afb8a3d4976

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// ==========================================
// 3. Health Check & Root Routes
// ==========================================

<<<<<<< HEAD
// Health check endpoint
app.get('/api/health', (req, res) => {
=======
// Health check route — checks server and Supabase status
app.get('/api/health', async (req, res) => {
  const configured = isSupabaseConfigured();
  let supabaseStatus = configured ? 'connected' : 'unconfigured';

  if (configured && supabase) {
    try {
      const { error } = await supabase.from('documents').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        supabaseStatus = `connected (query check: ${error.message})`;
      }
    } catch (err) {
      supabaseStatus = `error: ${err.message}`;
    }
  }

>>>>>>> 797fcb9639b1f191de2421a6f8225afb8a3d4976
  res.status(200).json({
    success: true,
    message: 'PreMindAI Backend API is running',
    database: 'supabase',
    supabase: supabaseStatus,
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PreMindAI Backend API (Powered by Supabase & Gemini)',
  });
});

<<<<<<< HEAD
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
=======
// Mount application API routes
try {
  const apiRoutes = require('./routes');
  app.use('/api', apiRoutes);
} catch (error) {
  console.error('Failed to load API routes:', error.message);
}

// 404 Route Handler
>>>>>>> 797fcb9639b1f191de2421a6f8225afb8a3d4976
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
