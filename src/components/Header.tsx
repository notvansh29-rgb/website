import React from 'react';
import {
  Search,
  Calendar,
  Menu,
  Timer,
  RotateCcw,
  Sparkles,
  Bell,
  Crown,
  Building2,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  profile: StudentProfile;
  unreadNotificationsCount: number;
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
  onOpenPomodoro: () => void;
  onOpenNotifications: () => void;
  onOpenSubscriptionModal: () => void;
  onOpenAuthModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  unreadNotificationsCount,
  onOpenMobileNav,
  onOpenSearch,
  onOpenPomodoro,
  onOpenNotifications,
  onOpenSubscriptionModal,
  onOpenAuthModal,
  onResetData,
}) => {
  const { currentUser } = useAuth();

  const currentDate = new Date();
  const dateFormatted = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = currentUser?.displayName || profile.name;
  const avatarUrl = currentUser?.photoURL || profile.avatarUrl;

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile Nav toggle + Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-xs hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>
              {getGreeting()}, <span className="text-blue-600">{displayName.split(' ')[0]}</span>!
            </span>
            <span className="hidden sm:inline-block">🚀</span>
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            {profile.workspaceName} • Focus mode active
          </p>
        </div>
      </div>

      {/* Middle/Right: Search Bar, Notifications, Upgrade, Firebase Auth, Timer, Profile */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-2.5">
        {/* Interactive Search Bar */}
        <button
          onClick={onOpenSearch}
          className="flex h-9 w-full max-w-[200px] items-center gap-2 rounded-xl border border-blue-200/80 bg-blue-50/50 px-3 text-xs text-slate-500 shadow-2xs transition-all hover:border-blue-300 hover:bg-white sm:w-56"
        >
          <Search className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <span className="truncate">Search study cockpit...</span>
          <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-xs border border-slate-200 md:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Date Display */}
        <div className="hidden items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs xl:flex">
          <Calendar className="h-3.5 w-3.5 text-blue-600" />
          <span>{dateFormatted}</span>
        </div>

        {/* Firebase Authentication Button */}
        <button
          onClick={onOpenAuthModal}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-2xs ${
            currentUser
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
          }`}
          title={currentUser ? `Signed in as ${currentUser.email}` : 'Sign in to Firebase'}
        >
          {currentUser ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Firebase Connected</span>
            </>
          ) : (
            <>
              <LogIn className="h-3.5 w-3.5" />
              <span>Firebase Login</span>
            </>
          )}
        </button>

        {/* SaaS Upgrade CTA */}
        <button
          onClick={onOpenSubscriptionModal}
          className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:from-amber-600 hover:to-orange-600 transition-all"
        >
          <Crown className="h-3.5 w-3.5 fill-white" />
          <span className="hidden md:inline">{profile.tier === 'Free' ? 'Upgrade Pro' : 'Pro Tier'}</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Pomodoro Focus Button */}
        <button
          onClick={onOpenPomodoro}
          title="Open Focus Timer"
          className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs transition-colors hover:bg-indigo-100"
        >
          <Timer className="h-3.5 w-3.5 text-indigo-600" />
          <span className="hidden sm:inline">25m</span>
        </button>

        {/* Student Profile Badge */}
        <div
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-85"
        >
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/20 shadow-xs"
          />
          <div className="hidden 2xl:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">{displayName}</p>
            <p className="text-[10px] text-blue-600 font-medium leading-tight">
              {currentUser ? 'Firebase Account' : profile.grade}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
