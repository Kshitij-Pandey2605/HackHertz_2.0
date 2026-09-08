import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await api.auth.forgotPassword(email);
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send reset instructions.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-edge shadow-card w-full">
      {isSuccess ? (
        <div className="text-center py-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">Check your inbox</h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
            We&apos;ve sent a password reset link to{' '}
            <span className="font-semibold text-ink">{email}</span>. Click the link in the email to set a new password.
          </p>
          <div className="space-y-3">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
            >
              Resend to a different email
            </Button>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-700 py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Reset password</h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Enter the email associated with your account and we&apos;ll send recovery instructions.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Send Reset Link
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
