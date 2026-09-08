import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { signup, loginWithGoogle } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { label: 'Empty', color: 'bg-gray-200', textColor: 'text-gray-400', percent: 0, isAcceptable: false };
    
    const hasMinLength = pass.length >= 8;
    const hasLengthBonus = pass.length >= 12;
    const hasUpperAndLower = /[A-Z]/.test(pass) && /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    if (hasMinLength) score += 1;
    if (hasUpperAndLower) score += 1;
    if (hasNumber && hasSpecial) score += 1;
    if (hasLengthBonus && score >= 2) score += 1;

    switch (score) {
      case 1:
        return { label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600', percent: 25, isAcceptable: false };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600', percent: 50, isAcceptable: false };
      case 3:
        return { label: 'Good', color: 'bg-brand-500', textColor: 'text-brand-600', percent: 75, isAcceptable: true };
      case 4:
      default:
        return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600', percent: 100, isAcceptable: true };
    }
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!strength.isAcceptable) {
      newErrors.password = 'Password is too weak. Please include uppercase, lowercase, numbers, and symbols to make a strong password.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms and Privacy Policy.';
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
      await signup(name, email, password);
      setSignupSuccess(true);
      success('Account created successfully! Welcome to PreMind AI.', 'Welcome');
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      setServerError(msg);
      toastError(msg, 'Registration Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setServerError(null);
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Supabase OAuth redirects to Google sign-in
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to initialize Google authentication.';
      setServerError(msg);
      toastError(msg, 'Google Sign-In Error');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-edge shadow-card w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink">Create your account</h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Turn your notes into exam-ready retention in minutes
        </p>
      </div>

      {serverError && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{serverError}</span>
        </div>
      )}

      {signupSuccess && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>Account created! Redirecting to dashboard...</span>
        </div>
      )}

      {/* Google Signup Button */}
      <button
        type="button"
        disabled={isGoogleLoading || isSubmitting}
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-edge rounded-xl text-sm font-medium text-ink bg-white hover:bg-gray-50 transition-colors shadow-subtle mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? (
          <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
        )}
        <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
      </button>

      <div className="relative flex items-center justify-center mb-5">
        <div className="border-t border-edge w-full" />
        <span className="bg-white px-3 text-[11px] font-medium text-ink-muted uppercase tracking-wider absolute">
          or with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex Chen"
          error={errors.name}
          leftIcon={<UserIcon className="w-4 h-4" />}
          autoComplete="name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="alex.chen@university.edu"
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
            autoComplete="new-password"
            required
          />

          {/* Password strength indicator */}
          {password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ink-muted">Password strength:</span>
                <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
              {!strength.isAcceptable ? (
                <p className="text-[11px] text-amber-600 font-medium leading-tight">
                  Must be Good or Strong (at least 8 characters with letters, numbers & symbols)
                </p>
              ) : (
                <p className="text-[11px] text-emerald-600 font-medium leading-tight">
                  ✓ Strong password
                </p>
              )}
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          isPassword
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.confirmPassword}
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
        />

        {/* Terms and conditions */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-ink-secondary">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-edge text-brand-600 focus:ring-brand-500"
            />
            <span>
              I agree to the{' '}
              <a href="#" className="text-brand-600 underline hover:text-brand-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand-600 underline hover:text-brand-700">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-rose-600 font-medium mt-1">{errors.terms}</p>}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full mt-2"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-xs text-ink-muted mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};
