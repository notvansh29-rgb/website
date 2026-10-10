import React, { useState } from 'react';
import {
  Sparkles,
  CheckSquare,
  GraduationCap,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Brain,
  Timer,
  PlusCircle,
  Flame,
  TrendingUp,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import {
  ActiveTab,
  HomeworkItem,
  TimetableSlot,
  TestMark,
  QuizResult,
  StudentProfile,
  StudyDayStat,
} from '../types';
import { WEEKLY_STUDY_STATS } from '../data/initialData';

interface DashboardViewProps {
  profile: StudentProfile;
  homework: HomeworkItem[];
  timetable: TimetableSlot[];
  testMarks: TestMark[];
  quizHistory: QuizResult[];
  setActiveTab: (tab: ActiveTab) => void;
  onToggleHomework: (id: string) => void;
  onToggleTimetable: (id: string) => void;
  onOpenPomodoro: () => void;
  onQuickStartQuiz: (subject: string, topic: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  homework,
  timetable,
  testMarks,
  quizHistory,
  setActiveTab,
  onToggleHomework,
  onToggleTimetable,
  onOpenPomodoro,
  onQuickStartQuiz,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Friday');

  // Computed statistics
  const pendingHomework = homework.filter((h) => !h.completed);
  const urgentHomework = pendingHomework.filter((h) => h.priority === 'High');

  const averageMark = testMarks.length
    ? Math.round(
        (testMarks.reduce((acc, m) => acc + m.percentage, 0) / testMarks.length) * 10
      ) / 10
    : 88.5;

  const totalStudyHours = WEEKLY_STUDY_STATS.reduce((acc, d) => acc + d.hours, 0);

  // Today's timetable slots (default Friday for demonstration)
  const todaysSlots = timetable.filter((s) => s.day === selectedDay);

  // Upcoming homework sorted by due date
  const upcomingHomework = [...pendingHomework]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const maxHours = Math.max(...WEEKLY_STUDY_STATS.map((d) => d.hours), 6);

  return (
    <div className="space-y-6">
      {/* Exhibition Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/10 border border-blue-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 -mb-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-400/30">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Oakridge Science & Tech Exhibition 2026</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              Supercharge your study workflow with StudyBuddy AI
            </h2>
            <p className="text-sm text-blue-200/90 leading-relaxed">
              Generate instant 5-question curriculum quizzes with feedback, monitor weekly progress, track upcoming deadlines, and clarify tough topics with an adaptive AI tutor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-102 hover:shadow-blue-500/40 active:scale-98"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch AI Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('tutor')}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20"
            >
              <Brain className="h-4 w-4 text-blue-300" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Quizzes Completed */}
        <div
          onClick={() => setActiveTab('quiz')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quizzes Completed
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110 shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{quizHistory.length}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +3 this week
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Average accuracy: <span className="font-semibold text-slate-700">89%</span> across all subjects
          </p>
        </div>

        {/* Stat 2: Homework Pending */}
        <div
          onClick={() => setActiveTab('homework')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-amber-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Homework Pending
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110 shadow-2xs">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingHomework.length}</span>
            {urgentHomework.length > 0 && (
              <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[11px] font-bold text-rose-700">
                {urgentHomework.length} High Priority
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Next deadline in <span className="font-semibold text-slate-700">24 hours</span>
          </p>
        </div>

        {/* Stat 3: Average Marks */}
        <div
          onClick={() => setActiveTab('marks')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Marks
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110 shadow-2xs">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{averageMark}%</span>
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
              Grade A
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            <span className="text-emerald-600 font-semibold">+4.2%</span> improvement from midterms
          </p>
        </div>

        {/* Stat 4: Study Hours */}
        <div
          onClick={() => setActiveTab('planner')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-sky-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Weekly Study Hours
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-transform group-hover:scale-110 shadow-2xs">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalStudyHours} hrs</span>
            <span className="text-xs font-semibold text-sky-700">
              Goal: {profile.weeklyTargetHours}h
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            <span className="font-semibold text-emerald-600">106%</span> of target achieved
          </p>
        </div>
      </div>

      {/* Large Weekly Study Progress Chart */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Weekly Study Progress & Focus Time</h3>
            </div>
            <p className="text-xs text-slate-500">
              Track daily hours spent vs the 3.5 hrs/day goal. Mon-Sun breakdown.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-blue-600" />
              <span className="text-slate-600">Actual Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-indigo-400 border-t border-dashed border-indigo-400" />
              <span className="text-slate-600">Target (3.5h)</span>
            </div>
            <div className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              {totalStudyHours} hrs Total
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-6">
          <div className="relative h-56 w-full">
            {/* Target line across chart (3.5h mark) */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-indigo-300 z-10 pointer-events-none"
              style={{ bottom: `${(3.5 / maxHours) * 100}%` }}
            >
              <span className="absolute right-0 -top-4 rounded-sm bg-indigo-50 px-1 text-[10px] font-semibold text-indigo-600">
                Goal: 3.5 hrs
              </span>
            </div>

            {/* Bars for Mon - Sun */}
            <div className="grid h-full grid-cols-7 items-end gap-2 sm:gap-6 px-2">
              {WEEKLY_STUDY_STATS.map((stat) => {
                const heightPercent = Math.min(100, (stat.hours / maxHours) * 100);
                const isOverTarget = stat.hours >= stat.targetHours;

                return (
                  <div key={stat.day} className="group relative flex h-full flex-col justify-end items-center">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 z-20 hidden rounded-lg bg-slate-900 px-2.5 py-1 text-center text-xs text-white shadow-md group-hover:block whitespace-nowrap">
                      <p className="font-bold">{stat.hours} hours</p>
                      <p className="text-[10px] text-slate-300">{stat.subject}</p>
                    </div>

                    {/* Bar */}
                    <div className="relative w-full max-w-[42px] overflow-hidden rounded-t-xl bg-slate-100 transition-all duration-300">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          isOverTarget
                            ? 'bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400'
                            : 'bg-gradient-to-t from-sky-400 to-blue-400'
                        }`}
                        style={{ height: `${heightPercent}%`, minHeight: '12px' }}
                      />
                    </div>

                    {/* Day label */}
                    <div className="mt-2 text-center">
                      <p className="text-xs font-bold text-slate-700">{stat.shortDay}</p>
                      <p className="text-[10px] text-slate-400">{stat.hours}h</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Today's Timetable and Upcoming Homework */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Study Timetable */}
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-600" />
              <div>
                <h3 className="font-bold text-slate-900">Today's Timetable</h3>
                <p className="text-xs text-slate-500">Scheduled study blocks for today</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Full Planner <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todaysSlots.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No sessions scheduled for today. Enjoy your free time or add one!
              </div>
            ) : (
              todaysSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all ${
                    slot.completed
                      ? 'border-emerald-200 bg-emerald-50/40 text-slate-500'
                      : 'border-slate-200 bg-slate-50/70 hover:border-blue-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleTimetable(slot.id)}
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                        slot.completed
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 bg-white hover:border-blue-500'
                      }`}
                    >
                      {slot.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          {slot.subject}
                        </span>
                        <span className="rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {slot.roomOrType}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{slot.topic}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold ${
                      slot.completed ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {slot.completed ? 'Done' : 'Upcoming'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Homework */}
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-slate-900">Upcoming Homework</h3>
                <p className="text-xs text-slate-500">Assignments & lab reports due soon</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('homework')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              All Assignments <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingHomework.length === 0 ? (
              <div className="py-8 text-center text-xs text-emerald-600">
                🎉 All homework is caught up! Excellent work.
              </div>
            ) : (
              upcomingHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 transition-all hover:border-amber-200 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleHomework(hw.id)}
                      className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white hover:border-emerald-500"
                    >
                      {hw.completed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{hw.title}</span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            hw.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : hw.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {hw.priority}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {hw.subject} • Est. {hw.estimatedMinutes} mins
                      </p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800">
                    Due {hw.dueDate}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Colourful Quick Actions Section */}
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/40 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900">Colourful Quick Actions</h3>
          <p className="text-xs text-slate-500">
            One-click shortcuts to explore StudyBuddy AI features during the exhibition
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {/* Action 1: Generate Quiz */}
          <button
            onClick={() => setActiveTab('quiz')}
            className="flex flex-col items-center justify-center rounded-2xl border border-indigo-100 bg-white p-3.5 text-center shadow-2xs transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xs group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">AI Quiz</span>
            <span className="text-[10px] text-slate-400">5-Q Test</span>
          </button>

          {/* Action 2: Flashcards */}
          <button
            onClick={() => setActiveTab('flashcards')}
            className="flex flex-col items-center justify-center rounded-2xl border border-purple-100 bg-white p-3.5 text-center shadow-2xs transition-all hover:-translate-y-1 hover:border-purple-200 hover:shadow-md group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-xs group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">Flashcards</span>
            <span className="text-[10px] text-slate-400">3D Flip Decks</span>
          </button>

          {/* Action 3: Ask AI Tutor */}
          <button
            onClick={() => setActiveTab('tutor')}
            className="flex flex-col items-center justify-center rounded-2xl border border-violet-100 bg-white p-3.5 text-center shadow-2xs transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-md group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-purple-500 text-white shadow-xs group-hover:scale-110 transition-transform">
              <Brain className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">AI Tutor</span>
            <span className="text-[10px] text-slate-400">Explainer & Audio</span>
          </button>

          {/* Action 4: Smart Notes */}
          <button
            onClick={() => setActiveTab('notes')}
            className="flex flex-col items-center justify-center rounded-2xl border border-teal-100 bg-white p-3.5 text-center shadow-2xs transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-md group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-xs group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">Smart Notes</span>
            <span className="text-[10px] text-slate-400">AI Cheatsheets</span>
          </button>

          {/* Action 5: Add Homework */}
          <button
            onClick={() => setActiveTab('homework')}
            className="flex flex-col items-center justify-center rounded-2xl border border-amber-100 bg-white p-3.5 text-center shadow-2xs transition-all hover:-translate-y-1 hover:border-amber-200 hover:shadow-md group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs group-hover:scale-110 transition-transform">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">Homework</span>
            <span className="text-[10px] text-slate-400">Deadlines</span>
          </button>

          {/* Action 6: Log Test Mark */}
          <button
            onClick={() => setActiveTab('marks')}
            className="flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-white p-3.5 text-center shadow-2xs transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">Log Marks</span>
            <span className="text-[10px] text-slate-400">Track GPA</span>
          </button>

          {/* Action 7: 25m Focus Timer */}
          <button
            onClick={onOpenPomodoro}
            className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white p-3.5 text-center shadow-2xs transition-all hover:-translate-y-1 hover:border-rose-200 hover:shadow-md group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-red-400 text-white shadow-xs group-hover:scale-110 transition-transform">
              <Timer className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">25m Focus</span>
            <span className="text-[10px] text-slate-400">Pomodoro</span>
          </button>

          {/* Action 8: Quick Physics Demo */}
          <button
            onClick={() => onQuickStartQuiz('Physics', 'Newton’s Laws of Motion')}
            className="flex flex-col items-center justify-center rounded-2xl border border-sky-100 bg-white p-3.5 text-center shadow-2xs transition-all hover:-translate-y-1 hover:border-sky-200 hover:shadow-md group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-xs group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">Demo Quiz</span>
            <span className="text-[10px] text-slate-400">Physics Core</span>
          </button>
        </div>
      </div>
    </div>
  );
};
