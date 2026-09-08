const express = require('express');
const cors = require('cors');
const { supabase, isSupabaseConfigured } = require('./config/supabase');

// Initialize Express application
const app = express();

// ==========================================
// Middleware Configuration
// ==========================================

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// ==========================================
// Routes
// ==========================================

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

  res.status(200).json({
    success: true,
    message: 'PreMindAI Backend API is running',
    database: 'supabase',
    supabase: supabaseStatus,
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PreMindAI Backend API (Powered by Supabase & Gemini)',
  });
});

// Mount application API routes
try {
  const apiRoutes = require('./routes');
  app.use('/api', apiRoutes);
} catch (error) {
  console.error('Failed to load API routes:', error.message);
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
