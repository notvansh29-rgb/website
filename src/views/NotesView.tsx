import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Brain,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { StudyNote } from '../types';
import { triggerConfetti } from '../utils/confetti';
import { summarizeNoteService } from '../services/aiService';

interface NotesViewProps {
  notes: StudyNote[];
  onSaveNote: (note: StudyNote) => void;
  onDeleteNote: (id: string) => void;
  onTurnIntoQuiz: (subject: string, topic: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onTurnIntoQuiz,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes.length ? notes[0].id : null
  );

  const [activeTitle, setActiveTitle] = useState('');
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [activeContent, setActiveContent] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  // Sync editor fields when note selected
  React.useEffect(() => {
    if (selectedNote) {
      setActiveTitle(selectedNote.title);
      setActiveSubject(selectedNote.subject);
      setActiveContent(selectedNote.content);
    }
  }, [selectedNoteId]);

  const handleCreateNewNote = () => {
    const newNote: StudyNote = {
      id: `note_${Date.now()}`,
      title: 'Untitled Study Note',
      subject: 'Physics',
      content: 'Write your lecture notes, equations, and observations here...',
      updatedAt: new Date().toISOString(),
    };
    onSaveNote(newNote);
    setSelectedNoteId(newNote.id);
  };

  const handleSaveCurrent = () => {
    if (!selectedNoteId) return;
    const updated: StudyNote = {
      id: selectedNoteId,
      title: activeTitle || 'Untitled Note',
      subject: activeSubject,
      content: activeContent,
      updatedAt: new Date().toISOString(),
      analysis: selectedNote?.analysis,
    };
    onSaveNote(updated);
  };

  const handleAiSummarize = async () => {
    if (!activeContent.trim() || !selectedNoteId) return;
    setIsSummarizing(true);

    try {
      const result = await summarizeNoteService(activeTitle, activeSubject, activeContent);

      if (result.ok && result.analysis) {
        const updated: StudyNote = {
          id: selectedNoteId,
          title: activeTitle,
          subject: activeSubject,
          content: activeContent,
          updatedAt: new Date().toISOString(),
          analysis: result.analysis,
        };
        onSaveNote(updated);
        triggerConfetti();
      }
    } catch (err) {
      console.error('Error generating summary:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl flex items-center gap-2">
            <span>Smart Notebook & AI Cheatsheet</span>
            <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800">
              Exam Summarizer
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Write your class notes and let Gemini 3.5 Flash automatically distill formulas, key takeaways, and test pitfalls.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main 2-Panel Layout: Sidebar of Notes + Main Editor/Cheatsheet */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Notes List (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
            <span>All Notebooks ({notes.length})</span>
          </div>

          <div className="max-h-[580px] overflow-y-auto space-y-2">
            {notes.map((note) => {
              const isSelected = note.id === selectedNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`flex flex-col justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                      : 'border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                      {note.subject}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="rounded-md p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-2 text-xs font-bold text-slate-900 line-clamp-1">{note.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{note.content}</p>

                  {note.analysis && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                      <Sparkles className="h-3 w-3" /> Cheatsheet Ready
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Editor & Cheatsheet (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedNote ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              {/* Note Header Inputs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={activeTitle}
                  onChange={(e) => setActiveTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="flex-1 rounded-xl border border-slate-200 p-2.5 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />

                <select
                  value={activeSubject}
                  onChange={(e) => setActiveSubject(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-hidden"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSaveCurrent}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Save className="h-3.5 w-3.5" /> Save
                </button>
              </div>

              {/* Note Content Textarea */}
              <div>
                <textarea
                  rows={8}
                  value={activeContent}
                  onChange={(e) => setActiveContent(e.target.value)}
                  placeholder="Paste or type lecture notes, key formulas, lab experiments..."
                  className="w-full rounded-2xl border border-slate-200 p-3.5 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* AI Summarize Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSummarizing}
                  onClick={handleAiSummarize}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:scale-102 transition-all disabled:opacity-50"
                >
                  {isSummarizing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>Extract Exam Cheatsheet with AI</span>
                </button>

                <button
                  onClick={() => onTurnIntoQuiz(activeSubject, activeTitle)}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Quiz Me on This Note</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Cheatsheet Output Display */}
              {selectedNote.analysis && (
                <div className="mt-6 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <h4 className="font-bold text-slate-900">AI Exam Cheatsheet Analysis</h4>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-2xl border border-indigo-100/60">
                    {selectedNote.analysis.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Key takeaways */}
                    <div className="rounded-2xl bg-white p-4 border border-slate-200/80">
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Key Takeaways
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {selectedNote.analysis.keyTakeaways.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Formulas / terms */}
                    <div className="rounded-2xl bg-white p-4 border border-slate-200/80">
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" /> High-Yield Formulas & Terms
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {selectedNote.analysis.keyFormulasOrTerms.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-500">•</span>
                            <span className="font-medium text-slate-800">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Exam Pitfalls */}
                  {selectedNote.analysis.examPitfalls && (
                    <div className="rounded-2xl bg-rose-50/80 p-3.5 border border-rose-200/60">
                      <p className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-rose-600" /> Common Exam Misconceptions to Avoid
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-rose-800">
                        {selectedNote.analysis.examPitfalls.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span>⚠️</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <FileText className="mx-auto h-10 w-10 text-slate-300 mb-2" />
              <h4 className="font-bold text-slate-700">No Note Selected</h4>
              <p className="text-xs text-slate-400 mt-1">Select an existing note or click "+ New Note".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
