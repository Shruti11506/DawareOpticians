import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Glasses
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your authorized username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(username, password, rememberMe);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Only store owner Shruti Daware is authorized.');
      }
    } catch (err) {
      setErrorMessage('Login failed. Please check your network and credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-graphite-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Decorative Sunshine Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sunshine-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sunshine-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-graphite-800/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Card */}
        <div className="bg-graphite-900/90 border border-graphite-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Header with Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-graphite-850 border border-graphite-750 shadow-inner mb-1">
              <img
                src="/logo-sunshine.png"
                alt="DAWARE OPTICIANS"
                className="h-10 w-auto object-contain drop-shadow"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sunshine-400/15 text-sunshine-300 border border-sunshine-400/30 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-sunshine-400" />
                <span>Store Management Portal</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Sign In to Dashboard
              </h1>
              <p className="text-xs text-graphite-400 mt-1">
                Authorized access for store owner & licensed optometrist
              </p>
            </div>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-xs animate-in fade-in zoom-in-95">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-graphite-300 uppercase tracking-wider">
                Store Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-sunshine-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                  className="w-full bg-graphite-800 border border-graphite-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-graphite-500 focus:outline-none focus:ring-2 focus:ring-sunshine-400 focus:border-sunshine-400 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-graphite-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-sunshine-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-graphite-800 border border-graphite-700 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-graphite-500 focus:outline-none focus:ring-2 focus:ring-sunshine-400 focus:border-sunshine-400 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-graphite-400 hover:text-white p-1 transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-graphite-800 border-graphite-700 text-sunshine-400 focus:ring-sunshine-400 focus:ring-offset-graphite-900"
                />
                <span className="text-xs text-graphite-300 font-medium">Keep me signed in</span>
              </label>

              <span className="text-[11px] text-graphite-500 font-mono">
                Store ID: #OPT-001
              </span>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-graphite-950 bg-sunshine-400 hover:bg-sunshine-500 active:bg-sunshine-600 shadow-sunshine transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-graphite-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-graphite-950" />
                </>
              )}
            </button>
          </form>

          {/* Security Info Footer */}
          <div className="pt-4 border-t border-graphite-800 text-center space-y-1">
            <p className="text-[11px] text-graphite-400 flex items-center justify-center gap-1.5">
              <Glasses className="w-3.5 h-3.5 text-sunshine-400" />
              <span>DAWARE OPTICIANS • Bandra Flagship</span>
            </p>
            <p className="text-[10px] text-graphite-500">
              Only authorized store personnel can access customer records & database.
            </p>
          </div>

        </div>

        {/* Footer Credit */}
        <p className="text-center text-xs text-graphite-500 mt-6">
          © {new Date().getFullYear()} DAWARE OPTICIANS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

