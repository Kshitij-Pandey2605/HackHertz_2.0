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
const analyticsRoutes = require('./routes/analytics.routes');

// Initialize Express application
const app = express();

// ==========================================
// 2. Middleware Configuration
// ==========================================

// Configure allowed CORS origins (clean trailing slashes)
const allowedOrigins = [
  'https://hack-hertz-2-0.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const cleaned = url.trim().replace(/\/+$/, '');
    if (cleaned && !allowedOrigins.includes(cleaned)) {
      allowedOrigins.push(cleaned);
    }
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, health checkers)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');

    if (
      process.env.CLIENT_URL === '*' ||
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    // Default allow dynamic origin to prevent browser blocking
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

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

const pdfSummaryRoutes = require('./routes/pdf.summary.routes');
const materialRoutes = require('./routes/material.routes');
const studyRoutes = require('./routes/study.routes');

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
app.use('/api/analytics', analyticsRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/pdf', pdfSummaryRoutes);
app.use('/api/study', studyRoutes);

app.use('/api/definitions', (req, res, next) => {
  req.url = '/definitions' + req.url;
  studyRoutes(req, res, next);
});
app.use('/api/formulas', (req, res, next) => {
  req.url = '/formulas' + req.url;
  studyRoutes(req, res, next);
});
app.use('/api/chapters', (req, res, next) => {
  req.url = '/chapters' + req.url;
  studyRoutes(req, res, next);
});
app.use('/api/keypoints', (req, res, next) => {
  req.url = '/keypoints' + req.url;
  studyRoutes(req, res, next);
});

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
