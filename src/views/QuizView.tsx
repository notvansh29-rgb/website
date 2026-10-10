import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Award,
  Zap,
  Clock,
  CheckSquare,
  AlertTriangle,
  Brain,
  Save,
} from 'lucide-react';
import { QuizQuestion, QuizResult } from '../types';
import { PRESET_TOPICS } from '../data/initialData';
import { triggerConfetti } from '../utils/confetti';
import { generateQuizService } from '../services/aiService';

interface QuizViewProps {
  quizHistory: QuizResult[];
  onSaveQuizResult: (result: QuizResult) => void;
  onLogMarkFromQuiz: (subject: string, topic: string, score: number, maxScore: number) => void;
  aiMode: 'live' | 'demo' | 'checking';
  initialSubject?: string;
  initialTopic?: string;
  onNavigateToTutor?: (topic: string, subject: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizHistory,
  onSaveQuizResult,
  onLogMarkFromQuiz,
  aiMode,
  initialSubject = 'Mathematics',
  initialTopic = 'Quadratic Equations & Roots',
  onNavigateToTutor,
}) => {
  // Generator form state
  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Active quiz session state
  const [quizState, setQuizState] = useState<'config' | 'taking' | 'results'>('config');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [activeResult, setActiveResult] = useState<QuizResult | null>(null);
  const [hasSavedMark, setHasSavedMark] = useState(false);

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
  ];

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setGenerationError('Please specify a topic for the quiz.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const result = await generateQuizService(subject, topic, difficulty);

      if (!result.ok || !result.questions || result.questions.length === 0) {
        throw new Error('Failed to generate quiz questions.');
      }

      setCurrentQuestions(result.questions);
      setSelectedAnswers(new Array(result.questions.length).fill(-1));
      setCurrentQuestionIndex(0);
      setQuizState('taking');
      setHasSavedMark(false);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setGenerationError(err.message || 'Error communicating with quiz service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleSubmitQuiz = () => {
    // Check if unanswered
    const unansweredCount = selectedAnswers.filter((a) => a === -1).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to finish now?`
      );
      if (!confirmSubmit) return;
    }

    // Calculate score
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / currentQuestions.length) * 100);

    const result: QuizResult = {
      id: `qres_${Date.now()}`,
      subject,
      topic,
      difficulty,
      score,
      totalQuestions: currentQuestions.length,
      percentage,
      completedAt: new Date().toISOString(),
      questions: currentQuestions,
      userAnswers: selectedAnswers,
    };

    setActiveResult(result);
    onSaveQuizResult(result);
    setQuizState('results');

    // Trigger confetti celebration if high score!
    if (percentage >= 80) {
      triggerConfetti();
    }
  };

  const handleSaveToMarks = () => {
    if (!activeResult || hasSavedMark) return;
    onLogMarkFromQuiz(
      activeResult.subject,
      `${activeResult.topic} (AI Quiz)`,
      activeResult.score,
      activeResult.totalQuestions
    );
    setHasSavedMark(true);
  };

  const handleRetake = () => {
    setSelectedAnswers(new Array(currentQuestions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setQuizState('taking');
    setHasSavedMark(false);
  };

  const handleNewQuiz = () => {
    setQuizState('config');
    setActiveResult(null);
    setCurrentQuestions([]);
    setSelectedAnswers([]);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl flex items-center gap-2">
            <span>AI Quiz Generator</span>
            <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              5 Questions
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Generate custom curriculum multiple-choice quizzes with instant grading and detailed explanations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Engine:</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              aiMode === 'live'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                aiMode === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            {aiMode === 'live' ? 'Gemini 3.5 Flash' : 'Exhibition Demo Mode'}
          </span>
        </div>
      </div>

      {/* STATE 1: QUIZ GENERATOR FORM */}
      {quizState === 'config' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Config Form */}
          <div className="lg:col-span-2 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
              Configure Your Quiz
            </h3>

            {generationError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Select Subject */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  1. Select Subject
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {subjects.map((subj) => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => {
                        setSubject(subj);
                        const matchedPreset = PRESET_TOPICS.find((p) => p.subject === subj);
                        if (matchedPreset) setTopic(matchedPreset.topic);
                      }}
                      className={`rounded-xl border p-3 text-left text-xs font-semibold transition-all ${
                        subject === subj
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enter Topic */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  2. Enter Topic or Concept
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Newton’s Laws of Motion, Quadratic Equations, Mitosis..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                />

                {/* Popular Exhibition Topic Pills */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">Suggestions:</span>
                  {PRESET_TOPICS.filter((p) => p.subject === subject)
                    .slice(0, 3)
                    .map((p) => (
                      <button
                        key={p.topic}
                        type="button"
                        onClick={() => setTopic(p.topic)}
                        className="rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        {p.topic}
                      </button>
                    ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  3. Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`rounded-xl border py-2 text-center text-xs font-bold transition-all ${
                        difficulty === diff
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateQuiz}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:scale-101 hover:shadow-lg disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Generating 5 Questions with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate 5-Question Quiz 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Exhibition Info & Fast Preset Card */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900">Exhibition Preset Quizzes</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrate the instant AI evaluation capability with these ready-to-test curriculum topics:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSubject('Physics');
                  setTopic('Newton’s Laws of Motion');
                  setDifficulty('Medium');
                }}
                className="w-full text-left rounded-xl bg-white p-3 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-2xs"
              >
                <p className="text-xs font-bold text-indigo-900">Physics: Newton's Laws</p>
                <p className="text-[11px] text-slate-500">Forces, inertia, F=ma, and action-reaction</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubject('Mathematics');
                  setTopic('Quadratic Equations & Roots');
                  setDifficulty('Medium');
                }}
                className="w-full text-left rounded-xl bg-white p-3 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-2xs"
              >
                <p className="text-xs font-bold text-indigo-900">Mathematics: Quadratics</p>
                <p className="text-[11px] text-slate-500">Factoring, quadratic formula & roots</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubject('Biology');
                  setTopic('Cell Structure & Mitochondria');
                  setDifficulty('Medium');
                }}
                className="w-full text-left rounded-xl bg-white p-3 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-2xs"
              >
                <p className="text-xs font-bold text-indigo-900">Biology: Cellular Energy</p>
                <p className="text-[11px] text-slate-500">ATP, organelles, and respiration</p>
              </button>
            </div>

            <div className="rounded-xl bg-blue-100/60 p-3 text-xs text-blue-900">
              💡 <span className="font-semibold">Exhibition Tip:</span> Each quiz automatically calculates your score, highlights mistaken options, and explains why answers are right.
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: ACTIVE QUIZ TAKING INTERFACE */}
      {quizState === 'taking' && currentQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress Header */}
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {subject} • {topic}
              </span>
              <span className="text-xs text-slate-500">
                Question <span className="font-bold text-slate-900">{currentQuestionIndex + 1}</span> of{' '}
                {currentQuestions.length}
              </span>
            </div>

            {/* Stepper dots */}
            <div className="flex items-center gap-1.5">
              {currentQuestions.map((_, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = selectedAnswers[idx] !== -1;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      isCurrent
                        ? 'w-7 bg-indigo-600'
                        : isAnswered
                        ? 'w-2.5 bg-blue-400'
                        : 'w-2.5 bg-slate-200'
                    }`}
                    title={`Question ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Current Question Card */}
          {(() => {
            const currentQ = currentQuestions[currentQuestionIndex];
            const currentSelected = selectedAnswers[currentQuestionIndex];

            return (
              <div className="rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 shadow-md">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-slate-900 sm:text-lg leading-relaxed">
                    {currentQ.question}
                  </h3>
                </div>

                {/* 4 Multiple Choice Options */}
                <div className="mt-6 space-y-3">
                  {currentQ.options.map((optionText, optIdx) => {
                    const isOptionSelected = currentSelected === optIdx;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                          isOptionSelected
                            ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-200'
                            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                            isOptionSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {letter}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                          {optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex < currentQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Submit Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* STATE 3: DETAILED RESULTS & MISTAKE EXPLANATIONS */}
      {quizState === 'results' && activeResult && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Result Score Banner */}
          <div className="rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 shadow-md text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 mb-4">
              <Award className="h-10 w-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Quiz Completed!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeResult.subject} • {activeResult.topic} ({activeResult.difficulty})
            </p>

            {/* Score Ring / Pill */}
            <div className="my-5 inline-flex items-center gap-4 rounded-2xl bg-slate-50 px-6 py-3 border border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Score</p>
                <p className="text-2xl font-black text-slate-900">
                  {activeResult.score} / {activeResult.totalQuestions}
                </p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Percentage</p>
                <p
                  className={`text-2xl font-black ${
                    activeResult.percentage >= 80
                      ? 'text-emerald-600'
                      : activeResult.percentage >= 60
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {activeResult.percentage}%
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveToMarks}
                disabled={hasSavedMark}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500"
              >
                <Save className="h-4 w-4" />
                <span>{hasSavedMark ? 'Saved to Marks & Progress ✓' : 'Save Score to Marks'}</span>
              </button>

              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Quiz</span>
              </button>

              <button
                type="button"
                onClick={handleNewQuiz}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create New Quiz</span>
              </button>

              {onNavigateToTutor && (
                <button
                  type="button"
                  onClick={() => onNavigateToTutor(activeResult.topic, activeResult.subject)}
                  className="flex items-center gap-1.5 rounded-xl bg-violet-50 border border-violet-200 px-4 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-100"
                >
                  <Brain className="h-4 w-4 text-violet-600" />
                  <span>Explain This Topic in AI Tutor</span>
                </button>
              )}
            </div>
          </div>

          {/* Deep Question-by-Question Mistake Analysis */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              Detailed Answers & Explanations
            </h4>

            {activeResult.questions.map((q, qIdx) => {
              const userAnswer = activeResult.userAnswers[qIdx];
              const isCorrect = userAnswer === q.correctAnswer;
              const hasAnswered = userAnswer !== -1;

              return (
                <div
                  key={q.id || qIdx}
                  className={`rounded-2xl border p-5 transition-all ${
                    isCorrect
                      ? 'border-emerald-200 bg-white'
                      : 'border-rose-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {qIdx + 1}
                      </span>
                      <h5 className="font-bold text-slate-900 text-sm">{q.question}</h5>
                    </div>

                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle className="h-3.5 w-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                          <XCircle className="h-3.5 w-3.5" />
                          {hasAnswered ? 'Incorrect' : 'Skipped'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {q.options.map((optText, optIdx) => {
                      const isUserChoice = userAnswer === optIdx;
                      const isTargetCorrect = q.correctAnswer === optIdx;

                      let badgeClass = 'border-slate-200 bg-slate-50/50 text-slate-600';
                      if (isTargetCorrect) {
                        badgeClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-300';
                      } else if (isUserChoice && !isCorrect) {
                        badgeClass = 'border-rose-500 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-300';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs ${badgeClass}`}
                        >
                          <span className="font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="flex-1">{optText}</span>
                          {isTargetCorrect && (
                            <span className="rounded bg-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                              Correct Answer
                            </span>
                          )}
                          {isUserChoice && !isCorrect && (
                            <span className="rounded bg-rose-200 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation card */}
                  <div className="mt-3.5 rounded-xl bg-blue-50/70 p-3.5 border border-blue-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span>Explanation:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {q.explanation}
                    </p>
                    {!isCorrect && hasAnswered && (
                      <p className="mt-2 text-xs font-medium text-rose-700">
                        ⚠️ Why your choice was incorrect: Review the core concept of{' '}
                        {activeResult.topic} to ensure precision on exam day!
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Quiz History Section (When on Config screen) */}
      {quizState === 'config' && quizHistory.length > 0 && (
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h4 className="font-bold text-slate-900">Recent Completed Quizzes</h4>
            <span className="text-xs text-slate-500">{quizHistory.length} total completed</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {quizHistory.slice(0, 4).map((hist) => (
              <div
                key={hist.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-white hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white ${
                      hist.percentage >= 80 ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}
                  >
                    {hist.percentage}%
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {hist.subject}: {hist.topic}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Score: {hist.score}/{hist.totalQuestions} • {hist.difficulty} •{' '}
                      {new Date(hist.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveResult(hist);
                    setQuizState('results');
                  }}
                  className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
