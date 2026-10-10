import React, { useState } from 'react';
import { Check, Sparkles, X, Zap, Shield, Crown, Building2, CreditCard } from 'lucide-react';
import { SubscriptionTier } from '../types';
import { triggerConfetti } from '../utils/confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  onUpgradeTier: (tier: SubscriptionTier) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onUpgradeTier,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectTier = (tier: SubscriptionTier) => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpgradeTier(tier);
      setIsProcessing(false);
      triggerConfetti();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200 border border-blue-400/30">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            StudyBuddy AI SaaS Plans
          </span>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Supercharge Your Academic Performance
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-blue-200/90 max-w-xl mx-auto">
            Unlock unlimited Gemini 3.5 Flash quiz generation, automated spaced repetition flashcards, and AI cheatsheet extraction.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex items-center rounded-xl bg-white/10 p-1 backdrop-blur-md border border-white/15">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-md bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-slate-900">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-3 bg-slate-50/50">
          {/* Plan 1: Free Tier */}
          <div
            className={`flex flex-col justify-between rounded-3xl border p-6 transition-all ${
              currentTier === 'Free'
                ? 'border-slate-300 bg-white ring-2 ring-slate-400/30 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  Basic
                </span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Free Student</h3>
              <p className="mt-1 text-xs text-slate-500">For casual homework tracking</p>

              <div className="my-5">
                <span className="text-3xl font-black text-slate-900">$0</span>
                <span className="text-xs text-slate-500"> / forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>5 AI Quizzes / day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Homework & timetable tracker</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Basic marks log</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="h-4 w-4 text-slate-300 shrink-0" />
                  <span>Spaced repetition flashcards</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="h-4 w-4 text-slate-300 shrink-0" />
                  <span>AI lecture note summarizer</span>
                </li>
              </ul>
            </div>

            <button
              disabled={currentTier === 'Free' || isProcessing}
              onClick={() => handleSelectTier('Free')}
              className="mt-6 w-full rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {currentTier === 'Free' ? 'Current Plan' : 'Downgrade to Free'}
            </button>
          </div>

          {/* Plan 2: Pro Tier (Featured) */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-blue-600 bg-white p-6 shadow-xl shadow-blue-500/10 scale-102">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-0.5 text-[11px] font-black tracking-wider text-white uppercase shadow-sm">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Pro Student
                </span>
                <span className="rounded-lg bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  Unlimited AI
                </span>
              </div>
              <h3 className="mt-2 text-xl font-black text-slate-900">Honor Roll Pro</h3>
              <p className="mt-1 text-xs text-slate-500">For serious high school & college students</p>

              <div className="my-5">
                <span className="text-3xl font-black text-slate-900">
                  {billingCycle === 'annual' ? '$4.99' : '$6.99'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
                {billingCycle === 'annual' && (
                  <p className="text-[10px] text-emerald-600 font-semibold">$59 billed annually</p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Unlimited Gemini 3.5 Flash Quizzes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Deep mistake rationale & explanations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Spaced repetition 3D flashcard decks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>AI note cheatsheet & formula extractor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Text-to-speech audio explanations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Full PDF & JSON backup export</span>
                </li>
              </ul>
            </div>

            <button
              disabled={currentTier === 'Pro' || isProcessing}
              onClick={() => handleSelectTier('Pro')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:scale-102 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Zap className="h-4 w-4 fill-white" />
              )}
              <span>{currentTier === 'Pro' ? 'Current Active Plan ✓' : 'Upgrade to Pro'}</span>
            </button>
          </div>

          {/* Plan 3: Campus Tier */}
          <div
            className={`flex flex-col justify-between rounded-3xl border p-6 transition-all ${
              currentTier === 'Campus'
                ? 'border-indigo-400 bg-white ring-2 ring-indigo-500/30 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Campus & Cohort
                </span>
                <span className="rounded-lg bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  Multi-User
                </span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Study Group / Class</h3>
              <p className="mt-1 text-xs text-slate-500">For exhibition teams & study circles</p>

              <div className="my-5">
                <span className="text-3xl font-black text-slate-900">
                  {billingCycle === 'annual' ? '$14.99' : '$18.99'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Everything in Pro Plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Up to 15 student workspace members</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Shared homework & flashcard decks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Cohort analytics & leaderboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Priority API response times</span>
                </li>
              </ul>
            </div>

            <button
              disabled={currentTier === 'Campus' || isProcessing}
              onClick={() => handleSelectTier('Campus')}
              className="mt-6 w-full rounded-xl border border-indigo-300 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-colors"
            >
              {currentTier === 'Campus' ? 'Current Plan ✓' : 'Switch to Campus'}
            </button>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="border-t border-slate-100 bg-white p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-600" />
            30-Day Money-Back Guarantee
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-blue-600" />
            Instant Activation & Cancel Anytime
          </span>
        </div>
      </div>
    </div>
  );
};
