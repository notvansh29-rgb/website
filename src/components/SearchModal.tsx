import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  CheckSquare,
  Calendar,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  ActiveTab,
  HomeworkItem,
  TimetableSlot,
  TestMark,
  QuizResult,
} from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  homework: HomeworkItem[];
  timetable: TimetableSlot[];
  testMarks: TestMark[];
  quizHistory: QuizResult[];
  onSelectTab: (tab: ActiveTab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  homework,
  timetable,
  testMarks,
  quizHistory,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredHomework = homework.filter(
    (h) => h.title.toLowerCase().includes(q) || h.subject.toLowerCase().includes(q) || h.topic.toLowerCase().includes(q)
  );

  const filteredTimetable = timetable.filter(
    (t) => t.subject.toLowerCase().includes(q) || t.topic.toLowerCase().includes(q) || t.day.toLowerCase().includes(q)
  );

  const filteredMarks = testMarks.filter(
    (m) => m.subject.toLowerCase().includes(q) || m.testName.toLowerCase().includes(q)
  );

  const filteredQuizzes = quizHistory.filter(
    (qz) => qz.subject.toLowerCase().includes(q) || qz.topic.toLowerCase().includes(q)
  );

  const totalResults =
    filteredHomework.length +
    filteredTimetable.length +
    filteredMarks.length +
    filteredQuizzes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-4 pt-16 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="relative flex items-center border-b border-slate-100 px-4 py-3">
          <Search className="h-5 w-5 text-blue-500 mr-3" />
          <input
            type="text"
            placeholder="Search subjects, assignments, quizzes, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded-full p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {totalResults === 0 && query && (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching study materials found for "<span className="font-semibold">{query}</span>"
            </div>
          )}

          {!query && (
            <div className="py-6 text-center text-xs text-slate-400">
              Start typing to search homework, study sessions, past tests, or quizzes...
            </div>
          )}

          {/* Homework Results */}
          {filteredHomework.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-amber-500" />
                Homework ({filteredHomework.length})
              </p>
              <div className="space-y-1.5">
                {filteredHomework.slice(0, 3).map((hw) => (
                  <button
                    key={hw.id}
                    onClick={() => {
                      onSelectTab('homework');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-2.5 text-left transition-colors hover:bg-blue-50/80 group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                        {hw.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {hw.subject} • Due {hw.dueDate} {hw.completed ? '• Completed' : '• Pending'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timetable Results */}
          {filteredTimetable.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-sky-500" />
                Timetable Sessions ({filteredTimetable.length})
              </p>
              <div className="space-y-1.5">
                {filteredTimetable.slice(0, 3).map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => {
                      onSelectTab('planner');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-2.5 text-left transition-colors hover:bg-blue-50/80 group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                        {slot.subject}: {slot.topic}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {slot.day} • {slot.startTime} - {slot.endTime} ({slot.roomOrType})
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Test Marks Results */}
          {filteredMarks.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
                Test Marks ({filteredMarks.length})
              </p>
              <div className="space-y-1.5">
                {filteredMarks.slice(0, 3).map((mark) => (
                  <button
                    key={mark.id}
                    onClick={() => {
                      onSelectTab('marks');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-2.5 text-left transition-colors hover:bg-blue-50/80 group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                        {mark.subject}: {mark.testName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Score: {mark.score}/{mark.maxScore} ({mark.percentage}%) • Grade {mark.grade}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes Results */}
          {filteredQuizzes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Completed Quizzes ({filteredQuizzes.length})
              </p>
              <div className="space-y-1.5">
                {filteredQuizzes.slice(0, 2).map((qz) => (
                  <button
                    key={qz.id}
                    onClick={() => {
                      onSelectTab('quiz');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-2.5 text-left transition-colors hover:bg-blue-50/80 group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                        {qz.subject} - {qz.topic}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Score: {qz.score}/{qz.totalQuestions} ({qz.percentage}%) • {qz.difficulty}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-400">
          <span>Tip: Click any item to jump directly to that section</span>
          <span>StudyBuddy AI Exhibition Search</span>
        </div>
      </div>
    </div>
  );
};
