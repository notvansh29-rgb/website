import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerConfetti } from '../utils/confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    currentUser,
    authError,
    clearError,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    logout,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const user = await signInWithGoogle();
    setIsSubmitting(false);
    if (user) {
      triggerConfetti();
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    let user;
    if (mode === 'signin') {
      user = await signInWithEmail(email, password);
    } else {
      user = await signUpWithEmail(email, password, displayName || 'Student');
    }
    setIsSubmitting(false);

    if (user) {
      triggerConfetti();
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    const user = await signInAsGuest();
    setIsSubmitting(false);
    if (user) {
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white text-center">
          <button
            onClick={() => {
              clearError();
              onClose();
            }}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold text-blue-200 border border-blue-400/30">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
            <span>Firebase Authentication</span>
          </div>

          <h3 className="mt-2 text-xl sm:text-2xl font-black text-white">
            {currentUser ? 'Your Firebase Account' : mode === 'signin' ? 'Welcome Back!' : 'Create Student Account'}
          </h3>
          <p className="mt-1 text-xs text-blue-200/90">
            Project: <span className="font-mono font-bold text-white">studybuddy-da3b4</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {currentUser ? (
            // Signed In View
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-md overflow-hidden">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || ''} className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-8 w-8" />
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {currentUser.displayName || 'StudyBuddy Student'}
                </h4>
                <p className="text-xs text-slate-500">{currentUser.email || 'Anonymous Guest'}</p>
                <p className="mt-1 font-mono text-[10px] text-slate-400">UID: {currentUser.uid}</p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Connected to Firebase & Cloud Firestore</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                Sign Out of Firebase
              </button>
            </div>
          ) : (
            // Sign In / Register Form
            <div className="space-y-4">
              {authError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-snug">{authError}</div>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white py-3 px-4 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-98 disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-bold uppercase text-slate-400">
                  Or use Email & Password
                </span>
              </div>

              {/* Mode Switch Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    clearError();
                  }}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    mode === 'signin' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    clearError();
                  }}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    mode === 'signup' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Student Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Rivera"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="student@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : mode === 'signin' ? (
                    'Sign In with Firebase'
                  ) : (
                    'Create Firebase Account'
                  )}
                </button>
              </form>

              {/* Guest / Anonymous fallback */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                >
                  Or continue as Anonymous Guest
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
