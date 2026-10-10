import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
  X,
  FileText,
} from 'lucide-react';
import { HomeworkItem } from '../types';
import { triggerConfetti } from '../utils/confetti';

interface HomeworkViewProps {
  homework: HomeworkItem[];
  onAddHomework: (item: Omit<HomeworkItem, 'id'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteHomework: (id: string) => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  homework,
  onAddHomework,
  onToggleComplete,
  onDeleteHomework,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    subject: string;
    topic: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    estimatedMinutes: number;
    notes: string;
  }>({
    title: '',
    subject: 'Mathematics',
    topic: '',
    dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
    priority: 'Medium',
    estimatedMinutes: 45,
    notes: '',
  });

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
    'English',
  ];

  const handleToggle = (id: string, currentState: boolean) => {
    onToggleComplete(id);
    if (!currentState) {
      // Trigger celebrating confetti when finishing homework!
      triggerConfetti();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddHomework({
      ...formData,
      completed: false,
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      subject: 'Mathematics',
      topic: '',
      dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
      priority: 'Medium',
      estimatedMinutes: 45,
      notes: '',
    });
  };

  // Filter logic
  const filteredHomework = homework.filter((item) => {
    if (filterStatus === 'Pending' && item.completed) return false;
    if (filterStatus === 'Completed' && !item.completed) return false;
    if (filterSubject !== 'All' && item.subject !== filterSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubj = item.subject.toLowerCase().includes(q);
      const matchTopic = item.topic.toLowerCase().includes(q);
      if (!matchTitle && !matchSubj && !matchTopic) return false;
    }
    return true;
  });

  const pendingCount = homework.filter((h) => !h.completed).length;
  const completedCount = homework.filter((h) => h.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl flex items-center gap-2">
            <span>Homework & Assignments</span>
            <span className="rounded-lg bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
              {pendingCount} Pending
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Keep track of upcoming deadlines, lab reports, and problem sets.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Homework</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5">
          {(['All', 'Pending', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                filterStatus === tab
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}{' '}
              {tab === 'Pending'
                ? `(${pendingCount})`
                : tab === 'Completed'
                ? `(${completedCount})`
                : `(${homework.length})`}
            </button>
          ))}
        </div>

        {/* Subject Filter & Search Input */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="All">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search homework..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Homework Cards List */}
      <div className="space-y-3">
        {filteredHomework.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <CheckSquare className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <h4 className="font-bold text-slate-700">No homework found</h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your filter or add a new assignment above!
            </p>
          </div>
        ) : (
          filteredHomework.map((item) => {
            const isDueSoon =
              !item.completed &&
              new Date(item.dueDate).getTime() - Date.now() < 36 * 3600 * 1000;

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center ${
                  item.completed
                    ? 'border-emerald-200 bg-emerald-50/20 text-slate-500'
                    : 'border-slate-200 bg-white hover:border-amber-200 hover:shadow-xs'
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggle(item.id, item.completed)}
                    className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border text-white transition-colors ${
                      item.completed
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-slate-300 bg-white hover:border-amber-500'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          item.completed
                            ? 'text-slate-500 line-through'
                            : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                        {item.subject}
                      </span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Topic: <span className="font-semibold text-slate-700">{item.topic}</span>
                      {item.notes && (
                        <span className="ml-2 italic text-slate-400">"{item.notes}"</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Due Date, Est time, Delete */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2 sm:border-t-0 sm:pt-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {item.estimatedMinutes}m
                    </span>

                    <span
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 font-bold ${
                        item.completed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDueSoon
                          ? 'bg-rose-100 text-rose-700 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Due {item.dueDate}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteHomework(item.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Delete homework"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Homework Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Add Homework Assignment</h3>
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
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Chapter 5 Friction Exercises"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-hidden"
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
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
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
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as 'High' | 'Medium' | 'Low',
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Topic / Subtopic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kinetic Friction, Quadratic Roots"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    step="5"
                    value={formData.estimatedMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value, 10) || 30 })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bring physical worksheet to period 3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-hidden"
                />
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
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
