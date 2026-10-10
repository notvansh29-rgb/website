import React from 'react';
import {
  LayoutDashboard,
  BrainCircuit,
  CalendarDays,
  CheckSquare,
  GraduationCap,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  X,
  Zap,
  Layers,
  FileText,
  Settings,
  Building2,
  ChevronDown,
  Crown,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingHomeworkCount: number;
  profile: StudentProfile;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  aiMode: 'live' | 'demo' | 'checking';
  onOpenWorkspaceModal: () => void;
  onOpenSubscriptionModal: () => void;
  onOpenAuthModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingHomeworkCount,
  profile,
  isOpenMobile,
  setIsOpenMobile,
  aiMode,
  onOpenWorkspaceModal,
  onOpenSubscriptionModal,
  onOpenAuthModal,
}) => {
  const { currentUser } = useAuth();
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      activeBg: 'bg-blue-50 text-blue-700 font-semibold shadow-xs',
    },
    {
      id: 'quiz' as ActiveTab,
      label: 'Quiz Generator',
      icon: Sparkles,
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs',
      badge: '5-Q AI',
    },
    {
      id: 'flashcards' as ActiveTab,
      label: 'Flashcards',
      icon: Layers,
      color: 'text-purple-600',
      activeBg: 'bg-purple-50 text-purple-700 font-semibold shadow-xs',
      badge: 'Spaced',
    },
    {
      id: 'planner' as ActiveTab,
      label: 'Study Planner',
      icon: CalendarDays,
      color: 'text-sky-600',
      activeBg: 'bg-sky-50 text-sky-700 font-semibold shadow-xs',
    },
    {
      id: 'homework' as ActiveTab,
      label: 'Homework',
      icon: CheckSquare,
      color: 'text-amber-600',
      activeBg: 'bg-amber-50 text-amber-700 font-semibold shadow-xs',
      badgeCount: pendingHomeworkCount,
    },
    {
      id: 'marks' as ActiveTab,
      label: 'Marks & Progress',
      icon: GraduationCap,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs',
    },
    {
      id: 'tutor' as ActiveTab,
      label: 'AI Tutor',
      icon: BrainCircuit,
      color: 'text-violet-600',
      activeBg: 'bg-violet-50 text-violet-700 font-semibold shadow-xs',
      badge: 'Audio',
    },
    {
      id: 'notes' as ActiveTab,
      label: 'Smart Notes',
      icon: FileText,
      color: 'text-teal-600',
      activeBg: 'bg-teal-50 text-teal-700 font-semibold shadow-xs',
    },
    {
      id: 'settings' as ActiveTab,
      label: 'SaaS Settings',
      icon: Settings,
      color: 'text-slate-600',
      activeBg: 'bg-slate-100 text-slate-800 font-semibold shadow-xs',
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-blue-100 bg-white/95 px-5 py-5 backdrop-blur-md transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto pr-1">
          {/* Logo & Header */}
          <div className="flex items-center justify-between pb-4 border-b border-blue-50">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white shadow-md shadow-blue-500/25">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    StudyBuddy<span className="text-blue-600"> AI</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    SaaS Edition
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpenMobile(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* SaaS Workspace Switcher Button */}
          <div className="mt-3.5">
            <button
              type="button"
              onClick={onOpenWorkspaceModal}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-200/90 bg-slate-50/70 px-3 py-2 text-left transition-all hover:border-blue-300 hover:bg-white shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-black text-white shrink-0">
                  {profile.workspaceName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Workspace
                  </p>
                  <p className="truncate text-xs font-bold text-slate-900">
                    {profile.workspaceName}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
            </button>
          </div>

          {/* SaaS Tier / Engine Status Badge */}
          <div className="mt-2.5 mb-2 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-bold text-slate-800">{profile.tier} Plan</span>
            </div>
            <button
              onClick={onOpenSubscriptionModal}
              className="text-[10px] font-bold text-blue-600 hover:underline"
            >
              Manage
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? item.activeBg
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${
                        isActive
                          ? 'bg-white shadow-xs'
                          : 'bg-slate-100/80 text-slate-600'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                      {item.badgeCount}
                    </span>
                  )}

                  {item.badge && (
                    <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Streak Widget */}
        <div className="pt-3 border-t border-blue-50 space-y-2.5">
          {/* Daily Streak Card */}
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-2.5 border border-amber-200/50">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                <Flame className="h-4.5 w-4.5 fill-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {profile.streakDays} Day Study Streak!
                </p>
                <p className="text-[10px] text-slate-500">Top 5% student rank 🔥</p>
              </div>
            </div>
          </div>

          {/* Student Profile Quick View / Firebase Sign In */}
          {currentUser ? (
            <div
              onClick={onOpenAuthModal}
              className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2 border border-slate-200/60 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <img
                src={currentUser.photoURL || profile.avatarUrl}
                alt={currentUser.displayName || profile.name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">
                  {currentUser.displayName || profile.name}
                </p>
                <p className="truncate text-[10px] text-emerald-600 font-semibold">Firebase Connected</p>
              </div>
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            </div>
          ) : (
            <div
              onClick={onOpenAuthModal}
              className="flex items-center gap-2.5 rounded-xl bg-blue-50/70 p-2 border border-blue-200 cursor-pointer hover:bg-blue-100/70 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
                <LogIn className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-blue-900">Firebase Sign In</p>
                <p className="truncate text-[10px] text-blue-700">Sync with cloud</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
