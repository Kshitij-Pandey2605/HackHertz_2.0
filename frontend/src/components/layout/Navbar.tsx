import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-edge/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <img src="/logo.png" alt="PreMind AI Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-ink flex items-center gap-1.5">
              PreMind <span className="text-brand-600 text-xs font-semibold px-1.5 py-0.5 rounded-md bg-brand-50 border border-brand-200">AI</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary">
          <a href="#how-it-works" className="hover:text-brand-600 transition-colors">
            How It Works
          </a>
          <a href="#levels" className="hover:text-brand-600 transition-colors">
            Adaptive Levels
          </a>
          <a href="#features" className="hover:text-brand-600 transition-colors">
            Features
          </a>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
