const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Register a new user with Supabase Auth
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and sufficiently strong',
      });
    }

    if (!supabase) {
      // Graceful fallback for mock mode if Supabase credentials are missing
      const mockUser = {
        id: `usr_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };
      return res.status(201).json({
        success: true,
        message: 'User registered successfully (Local mode)',
        user: mockUser,
        token: `mock_jwt_token_${Date.now()}`,
      });
    }

    // Sign up with Supabase Auth
    let data;
    let error;

    const signupResult = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || '',
          name: name || '',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        },
      },
    });

    data = signupResult.data;
    error = signupResult.error;

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // If no session created because Supabase requires email confirmation, attempt admin auto-confirm if admin client is available
    if (!data.session && supabaseAdmin?.auth?.admin) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
          email_confirm: true,
        });
        // Now sign in to generate active session
        const loginRes = await supabase.auth.signInWithPassword({ email, password });
        if (!loginRes.error) {
          data.session = loginRes.data.session;
        }
      } catch (adminErr) {
        // Continue if admin auto-confirm is not permitted with anon key
      }
    }

    const user = data.user;
    const session = data.session;

    const formattedUser = {
      id: user?.id,
      email: user?.email,
      name: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0],
      avatarUrl: user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    };

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: formattedUser,
      session: session ? {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      } : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Authenticate user with Email & Password
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (!supabase) {
      // Mock mode fallback
      const mockUser = {
        id: `usr_${Date.now()}`,
        email,
        name: email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully (Local mode)',
        user: mockUser,
        token: `mock_jwt_token_${Date.now()}`,
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    const user = data.user;
    const session = data.session;

    const formattedUser = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
      avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: formattedUser,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const formattedUser = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
      avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'user')}`,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
    };

    return res.status(200).json({
      success: true,
      user: formattedUser,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Logout user session
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && supabase) {
      const token = authHeader.split(' ')[1];
      if (token) {
        await supabase.auth.admin?.signOut?.(token).catch(() => {});
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Google OAuth Configuration & Redirect URL
 * GET /api/auth/google/config
 */
const getGoogleAuthConfig = async (req, res, next) => {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
    const isConfigured = Boolean(googleClientId && googleClientId.includes('googleusercontent.com'));

    return res.status(200).json({
      success: true,
      isConfigured,
      clientId: googleClientId,
      provider: 'google',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  getGoogleAuthConfig,
};
