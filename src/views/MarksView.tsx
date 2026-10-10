import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  BarChart,
  BarChart2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  X,
  Target,
} from 'lucide-react';
import { TestMark } from '../types';

interface MarksViewProps {
  testMarks: TestMark[];
  onAddTestMark: (mark: Omit<TestMark, 'id' | 'percentage' | 'grade'>) => void;
  onDeleteTestMark: (id: string) => void;
}

export const MarksView: React.FC<MarksViewProps> = ({
  testMarks,
  onAddTestMark,
  onDeleteTestMark,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  // Form State
  const [formData, setFormData] = useState<{
    subject: string;
    testName: string;
    date: string;
    score: number;
    maxScore: number;
    category: TestMark['category'];
  }>({
    subject: 'Mathematics',
    testName: '',
    date: new Date().toISOString().split('T')[0],
    score: 45,
    maxScore: 50,
    category: 'Unit Test',
  });

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
  ];

  const categories: Array<TestMark['category']> = [
    'Unit Test',
    'Midterm',
    'Quiz',
    'Final Exam',
    'Assignment',
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.testName.trim()) return;

    onAddTestMark({
      subject: formData.subject,
      testName: formData.testName,
      date: formData.date,
      score: formData.score,
      maxScore: formData.maxScore,
      category: formData.category,
    });

    setIsAddModalOpen(false);
    setFormData({
      subject: 'Mathematics',
      testName: '',
      date: new Date().toISOString().split('T')[0],
      score: 45,
      maxScore: 50,
      category: 'Unit Test',
    });
  };

  // Calculations
  const averagePercentage = testMarks.length
    ? Math.round(
        (testMarks.reduce((acc, m) => acc + m.percentage, 0) / testMarks.length) * 10
      ) / 10
    : 0;

  const highestMark = testMarks.length
    ? Math.max(...testMarks.map((m) => m.percentage))
    : 0;

  // Subject averages
  const subjectStats: Record<string, { totalPct: number; count: number }> = {};
  testMarks.forEach((m) => {
    if (!subjectStats[m.subject]) {
      subjectStats[m.subject] = { totalPct: 0, count: 0 };
    }
    subjectStats[m.subject].totalPct += m.percentage;
    subjectStats[m.subject].count += 1;
  });

  const subjectAverages = Object.entries(subjectStats).map(([subj, stats]) => ({
    subject: subj,
    avg: Math.round(stats.totalPct / stats.count),
    count: stats.count,
  }));

  // Find lowest subject for AI advice
  const sortedSubjects = [...subjectAverages].sort((a, b) => a.avg - b.avg);
  const lowestSubject = sortedSubjects.length ? sortedSubjects[0] : null;

  const filteredMarks = testMarks.filter((m) => {
    if (selectedSubjectFilter !== 'All' && m.subject !== selectedSubjectFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl flex items-center gap-2">
            <span>Marks & Academic Progress</span>
            <span className="rounded-lg bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              GPA Analytics
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Log exam scores, compare subject performance, and visualize grade progression.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Enter Test Mark</span>
        </button>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Average
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{averagePercentage}%</span>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              {averagePercentage >= 90
                ? 'Grade A+'
                : averagePercentage >= 80
                ? 'Grade A'
                : averagePercentage >= 70
                ? 'Grade B'
                : 'Grade C'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Across {testMarks.length} recorded tests</p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Highest Score
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{highestMark}%</span>
            <span className="text-xs font-semibold text-indigo-600">Top Performance</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Computer Science & Calculus</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Grade Trend
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">+4.2%</span>
            <span className="text-xs font-semibold text-slate-600">since midterms</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Consistent upward trajectory</p>
        </div>
      </div>

      {/* Subject Performance Breakdown & AI Advisory Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Subject Comparison Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Subject Mastery Breakdown</h3>
              <p className="text-xs text-slate-500">Average percentage achieved by subject</p>
            </div>
            <BarChart2 className="h-5 w-5 text-blue-600" />
          </div>

          <div className="mt-5 space-y-4">
            {subjectAverages.map((item) => {
              const isStrong = item.avg >= 90;
              const isModerate = item.avg >= 80;

              return (
                <div key={item.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.subject}</span>
                    <span className="font-extrabold text-slate-900">{item.avg}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isStrong
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : isModerate
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-400'
                      }`}
                      style={{ width: `${item.avg}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Academic Advisor Card */}
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900">AI Academic Insight</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Based on your recent scores, you are excelling strongly in{' '}
              <span className="font-bold text-indigo-900">Computer Science (96%)</span> and{' '}
              <span className="font-bold text-indigo-900">Mathematics (95%)</span>.
            </p>

            {lowestSubject && (
              <div className="mt-4 rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200/70">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-amber-600" /> Growth Area: {lowestSubject.subject}
                </p>
                <p className="mt-1 text-xs text-amber-800 leading-snug">
                  Current score is {lowestSubject.avg}%. We recommend scheduling 2 weekly revision blocks
                  and taking a 5-question AI quiz on {lowestSubject.subject} to elevate your final grade to A+.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-100 text-[11px] text-slate-500">
            📊 Predictive Model: On track for 92%+ Honor Roll in final term examinations.
          </div>
        </div>
      </div>

      {/* Test Marks Log Table */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recorded Test Scores Log</h3>
            <p className="text-xs text-slate-500">History of unit tests, midterms, and pop quizzes</p>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Subject & Assessment</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Raw Score</th>
                <th className="pb-3">Percentage</th>
                <th className="pb-3">Grade</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMarks.map((mark) => (
                <tr key={mark.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <p className="font-bold text-slate-900">{mark.testName}</p>
                    <p className="text-[11px] text-blue-600 font-medium">{mark.subject}</p>
                  </td>
                  <td className="py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {mark.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-500">{mark.date}</td>
                  <td className="py-3.5 font-semibold text-slate-700">
                    {mark.score} / {mark.maxScore}
                  </td>
                  <td className="py-3.5">
                    <span className="font-black text-slate-900">{mark.percentage}%</span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                        mark.grade.startsWith('A')
                          ? 'bg-emerald-100 text-emerald-800'
                          : mark.grade.startsWith('B')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {mark.grade}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <button
                      onClick={() => onDeleteTestMark(mark.id)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enter Test Mark Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Enter Test Score</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Assessment Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Kinetics Exam"
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as TestMark['category'],
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Score Achieved
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={formData.score}
                    onChange={(e) =>
                      setFormData({ ...formData, score: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.maxScore}
                    onChange={(e) =>
                      setFormData({ ...formData, maxScore: parseFloat(e.target.value) || 100 })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Date of Exam
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
                <span className="text-slate-500">Calculated Percentage: </span>
                <span className="font-bold text-slate-900">
                  {formData.maxScore > 0
                    ? Math.round((formData.score / formData.maxScore) * 100)
                    : 0}
                  %
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
