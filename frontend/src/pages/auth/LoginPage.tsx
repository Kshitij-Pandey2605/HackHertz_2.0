import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alex.chen@university.edu');
  const [password, setPassword] = useState('DemoPassword123!');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      setLoginSuccess(true);
      success('Welcome back to PreMind AI!', 'Authentication Successful');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setServerError(msg);
      toastError(msg, 'Login Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-edge shadow-card w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink">Welcome back</h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Log in to continue transforming your study materials
        </p>
      </div>

      {serverError && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{serverError}</span>
        </div>
      )}

      {loginSuccess && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>Login verified! Redirecting to workspace...</span>
        </div>
      )}

      {/* Google Login Placeholder */}
      <button
        type="button"
        onClick={() => {
          // Integration ready
          setEmail('alex.chen@university.edu');
          setPassword('GoogleOAuthDemo!');
          setTimeout(() => {
            handleSubmit({ preventDefault: () => {} } as React.FormEvent);
          }, 200);
        }}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-edge rounded-xl text-sm font-medium text-ink bg-white hover:bg-gray-50 transition-colors shadow-subtle mb-5 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="relative flex items-center justify-center mb-5">
        <div className="border-t border-edge w-full" />
        <span className="bg-white px-3 text-[11px] font-medium text-ink-muted uppercase tracking-wider absolute">
          or with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@university.edu"
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />

        <div>
          <Input
            label="Password"
            isPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
            required
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full mt-2"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-xs text-ink-muted mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
};
