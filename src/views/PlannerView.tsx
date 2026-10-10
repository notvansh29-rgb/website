import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Clock,
  Printer,
  BookOpen,
  Filter,
  Check,
  X,
} from 'lucide-react';
import { TimetableSlot } from '../types';

interface PlannerViewProps {
  timetable: TimetableSlot[];
  onAddSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  onUpdateSlot: (slot: TimetableSlot) => void;
  onDeleteSlot: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onGenerateAiSchedule: () => void;
}

const DAYS: Array<TimetableSlot['day']> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const PlannerView: React.FC<PlannerViewProps> = ({
  timetable,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  onToggleComplete,
  onGenerateAiSchedule,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    day: TimetableSlot['day'];
    startTime: string;
    endTime: string;
    subject: string;
    topic: string;
    roomOrType: TimetableSlot['roomOrType'];
  }>({
    day: 'Monday',
    startTime: '16:00',
    endTime: '17:30',
    subject: 'Mathematics',
    topic: 'Algebra Review',
    roomOrType: 'Problem Practice',
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

  const types: Array<TimetableSlot['roomOrType']> = [
    'Problem Practice',
    'Revision',
    'Self Study',
    'Lab Work',
    'Online Lecture',
  ];

  const handleOpenAdd = (defaultDay?: TimetableSlot['day']) => {
    setEditingSlot(null);
    setFormData({
      day: defaultDay || 'Monday',
      startTime: '16:00',
      endTime: '17:30',
      subject: 'Mathematics',
      topic: '',
      roomOrType: 'Problem Practice',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormData({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subject: slot.subject,
      topic: slot.topic,
      roomOrType: slot.roomOrType,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;

    if (editingSlot) {
      onUpdateSlot({
        ...editingSlot,
        ...formData,
      });
    } else {
      onAddSlot({
        ...formData,
        completed: false,
      });
    }
    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter slots
  const filteredSlots = timetable.filter((slot) => {
    if (selectedDayFilter === 'All') return true;
    return slot.day === selectedDayFilter;
  });

  // Calculate stats
  const totalSessions = timetable.length;
  const completedSessions = timetable.filter((s) => s.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl flex items-center gap-2">
            <span>Weekly Study Planner</span>
            <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-700">
              Timetable
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Structure your study sessions Monday through Sunday to maintain peak retention.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onGenerateAiSchedule}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>AI Auto-Balance</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Print Timetable</span>
          </button>

          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Study Session</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Sessions</p>
          <p className="text-xl font-black text-slate-900">{totalSessions}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase text-emerald-700">Completed Sessions</p>
          <p className="text-xl font-black text-emerald-800">{completedSessions}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase text-sky-700">Adherence Rate</p>
          <p className="text-xl font-black text-sky-800">
            {totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0}%
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold uppercase text-indigo-700">Days Covered</p>
          <p className="text-xl font-black text-indigo-800">7 Days (Full Week)</p>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDayFilter('All')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
            selectedDayFilter === 'All'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Week (Full Grid)
        </button>

        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDayFilter(day)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              selectedDayFilter === day
                ? 'bg-blue-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Grid or List of Timetable Sessions */}
      {selectedDayFilter === 'All' ? (
        // Full Week View (Grouped by Day)
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DAYS.map((day) => {
            const daySlots = timetable
              .filter((s) => s.day === day)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-900">{day}</span>
                    <button
                      onClick={() => handleOpenAdd(day)}
                      className="rounded-lg p-1 text-blue-600 hover:bg-blue-50"
                      title={`Add session to ${day}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {daySlots.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">
                        No sessions planned
                      </p>
                    ) : (
                      daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`rounded-2xl border p-3 transition-all ${
                            slot.completed
                              ? 'border-emerald-200 bg-emerald-50/30'
                              : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => onToggleComplete(slot.id)}
                                className={`mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-md border text-white transition-colors ${
                                  slot.completed
                                    ? 'border-emerald-500 bg-emerald-500'
                                    : 'border-slate-300 bg-white hover:border-emerald-500'
                                }`}
                              >
                                {slot.completed && <Check className="h-3 w-3" />}
                              </button>
                              <div>
                                <span className="text-[11px] font-bold text-slate-700">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <p className="text-xs font-bold text-slate-900 leading-snug">
                                  {slot.subject}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(slot)}
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteSlot(slot.id)}
                                className="rounded-md p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                            {slot.topic}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="rounded-md bg-blue-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">
                              {slot.roomOrType}
                            </span>
                            <span
                              className={`text-[10px] font-bold ${
                                slot.completed ? 'text-emerald-600' : 'text-slate-400'
                              }`}
                            >
                              {slot.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAdd(day)}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 py-1.5 text-xs font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Slot
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        // Single Day Filter View
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">{selectedDayFilter} Schedule</h3>
            <button
              onClick={() => handleOpenAdd(selectedDayFilter as TimetableSlot['day'])}
              className="flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add to {selectedDayFilter}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {filteredSlots.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No study sessions scheduled for {selectedDayFilter}.
              </div>
            ) : (
              filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                    slot.completed
                      ? 'border-emerald-200 bg-emerald-50/40 text-slate-500'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleComplete(slot.id)}
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border text-white transition-colors ${
                        slot.completed
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-300 bg-white hover:border-emerald-500'
                      }`}
                    >
                      {slot.completed && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          {slot.subject}
                        </span>
                        <span className="rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {slot.roomOrType}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-700">{slot.topic}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(slot)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSlot(slot.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Session Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">
                {editingSlot ? 'Edit Study Session' : 'Add New Study Session'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-4 space-y-3.5">
              {/* Day selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Day of Week</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value as TimetableSlot['day'] })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Topic / Study Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parabola Graphing, Newton’s 2nd Law Practice"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Study Type */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Session Type</label>
                <select
                  value={formData.roomOrType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roomOrType: e.target.value as TimetableSlot['roomOrType'],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  {editingSlot ? 'Save Changes' : 'Add Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
