const express = require('express');
const cors = require('cors');

const { supabase, isSupabaseConfigured } = require('./config/supabase');

// ==========================================
// 1. Import Route Modules
// ==========================================
const uploadRoutes = require('./routes/upload.routes');
const documentRoutes = require('./routes/document.routes');
const summaryRoutes = require('./routes/summary.routes');
const flashcardRoutes = require('./routes/flashcard.routes');
const quizRoutes = require('./routes/quiz.routes');
const authRoutes = require('./routes/auth.routes');
const extractRoutes = require('./routes/extract.routes');

// Initialize Express application
const app = express();

// ==========================================
// 2. Middleware Configuration
// ==========================================

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

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
app.get('/api/health', async (req, res) => {
  const configured = typeof isSupabaseConfigured === 'function' ? isSupabaseConfigured() : Boolean(supabase);
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

  res.status(200).json({
    success: true,
    message: 'Server is running',
    database: 'supabase',
    supabase: supabaseStatus,
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
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/extract', extractRoutes);

// Mount any additional application API routes from routes/index.js if available
try {
  const apiRoutes = require('./routes');
  app.use('/api', apiRoutes);
} catch (error) {
  // Routes index optional
}

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
