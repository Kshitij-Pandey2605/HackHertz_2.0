const { supabase } = require('../config/supabase');

/**
 * Middleware to authenticate requests using Supabase Auth JWT
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid authorization token'
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired token'
      });
    }

    // Attach authenticated user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error: ' + err.message
    });
  }
};

module.exports = {
  requireAuth
};
