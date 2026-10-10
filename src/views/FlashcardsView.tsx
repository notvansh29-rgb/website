import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  RotateCw,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  X,
  Play,
} from 'lucide-react';
import { FlashcardDeck, Flashcard } from '../types';
import { triggerConfetti } from '../utils/confetti';
import { generateFlashcardsService } from '../services/aiService';

interface FlashcardsViewProps {
  decks: FlashcardDeck[];
  onSaveDeck: (deck: FlashcardDeck) => void;
  onDeleteDeck: (id: string) => void;
  onUpdateDeckCards: (deckId: string, cards: Flashcard[]) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  decks,
  onSaveDeck,
  onDeleteDeck,
  onUpdateDeckCards,
}) => {
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Deck Creator Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createSubject, setCreateSubject] = useState('Physics');
  const [createTopic, setCreateTopic] = useState('Newtonian Dynamics');
  const [isGenerating, setIsGenerating] = useState(false);

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
  ];

  const activeDeck = decks.find((d) => d.id === activeDeckId) || null;

  const handleStartStudy = (deckId: string) => {
    setActiveDeckId(deckId);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkCard = (mastered: boolean) => {
    if (!activeDeck) return;
    const currentCard = activeDeck.cards[currentCardIndex];
    const updatedCards = activeDeck.cards.map((c, i) =>
      i === currentCardIndex ? { ...c, mastered } : c
    );

    onUpdateDeckCards(activeDeck.id, updatedCards);

    // Go to next card or finish
    if (currentCardIndex < activeDeck.cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    } else {
      // Completed deck!
      triggerConfetti();
      setIsFlipped(false);
      setShowHint(false);
      setCurrentCardIndex(activeDeck.cards.length); // End screen
    }
  };

  const handleGenerateAiDeck = async () => {
    if (!createTopic.trim()) return;
    setIsGenerating(true);

    try {
      const result = await generateFlashcardsService(createSubject, createTopic, 6);
      if (result.ok && result.cards) {
        const newDeck: FlashcardDeck = {
          id: `deck_${Date.now()}`,
          title: result.deckTitle || `${createSubject}: ${createTopic}`,
          subject: createSubject,
          topic: createTopic,
          createdAt: new Date().toISOString(),
          cards: result.cards.map((c: any) => ({ ...c, mastered: false })),
        };
        onSaveDeck(newDeck);
        setIsCreateModalOpen(false);
        triggerConfetti();
        handleStartStudy(newDeck.id);
      }
    } catch (err) {
      console.error('Error generating flashcards:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl flex items-center gap-2">
            <span>Spaced Repetition Flashcards</span>
            <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              SaaS Study Decks
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Train active recall and long-term memory with 3D flip study decks and automated AI generation.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate AI Deck</span>
        </button>
      </div>

      {/* Main Flashcards Area: Active Study vs Decks Grid */}
      {activeDeck ? (
        // STUDY PLAYER VIEW
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Study Progress Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
            <button
              onClick={() => setActiveDeckId(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Decks
            </button>

            <span className="text-xs font-bold text-indigo-700">
              {activeDeck.title}
            </span>

            <span className="text-xs text-slate-500 font-medium">
              {Math.min(currentCardIndex + 1, activeDeck.cards.length)} / {activeDeck.cards.length}
            </span>
          </div>

          {currentCardIndex < activeDeck.cards.length ? (
            (() => {
              const card = activeDeck.cards[currentCardIndex];
              return (
                <div className="space-y-6">
                  {/* Interactive Flip Card (Perspective Container) */}
                  <div
                    onClick={handleFlip}
                    className="group relative h-80 w-full cursor-pointer rounded-3xl border border-indigo-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl flex flex-col justify-between select-none"
                    style={{ perspective: '1000px' }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700">
                        {isFlipped ? 'Answer / Concept' : 'Question / Term'}
                      </span>
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <RotateCw className="h-3.5 w-3.5" /> Click to Flip
                      </span>
                    </div>

                    <div className="my-auto text-center">
                      <p
                        className={`font-black text-slate-900 transition-all ${
                          isFlipped ? 'text-lg sm:text-xl font-medium' : 'text-xl sm:text-2xl'
                        }`}
                      >
                        {isFlipped ? card.back : card.front}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(!showHint);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        <span>{showHint ? 'Hide Mnemonic' : 'Show Memory Hint'}</span>
                      </button>

                      <span className="text-[11px] text-slate-400">
                        {card.mastered ? '⭐ Mastered' : '🔄 Reviewing'}
                      </span>
                    </div>

                    {showHint && card.hint && (
                      <div className="absolute bottom-16 left-6 right-6 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                        💡 <span className="font-semibold">Memory Trick:</span> {card.hint}
                      </div>
                    )}
                  </div>

                  {/* Study Rating Actions */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleMarkCard(false)}
                      className="flex-1 rounded-2xl border border-rose-200 bg-rose-50/70 py-3.5 text-xs sm:text-sm font-bold text-rose-700 hover:bg-rose-100 transition-all shadow-2xs"
                    >
                      Needs Practice ❌
                    </button>

                    <button
                      onClick={() => handleMarkCard(true)}
                      className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50/70 py-3.5 text-xs sm:text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-all shadow-2xs"
                    >
                      Mastered! ✅
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            // Deck Completion Screen
            <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-md space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-2">
                <Award className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-black text-slate-900">Deck Session Completed!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You've reviewed all cards in <span className="font-bold text-slate-800">{activeDeck.title}</span>.
              </p>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Restart Deck
                </button>
                <button
                  onClick={() => setActiveDeckId(null)}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
                >
                  Back to All Decks
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // DECKS GRID OVERVIEW
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => {
            const total = deck.cards.length;
            const mastered = deck.cards.filter((c) => c.mastered).length;
            const masteryPct = total ? Math.round((mastered / total) * 100) : 0;

            return (
              <div
                key={deck.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                      {deck.subject}
                    </span>
                    <button
                      onClick={() => onDeleteDeck(deck.id)}
                      className="rounded-lg p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete deck"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {deck.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Topic: <span className="font-medium text-slate-700">{deck.topic}</span>
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Mastery Progress</span>
                      <span className="font-bold text-slate-800">{masteryPct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${masteryPct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {mastered} of {total} cards mastered
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleStartStudy(deck.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Study Deck ({total} cards)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generate AI Deck Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Generate AI Flashcard Deck</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Subject
                </label>
                <select
                  value={createSubject}
                  onChange={(e) => setCreateSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
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
                  Topic or Key Concept
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cellular Respiration, Electric Potential, Calculus Derivatives"
                  value={createTopic}
                  onChange={(e) => setCreateTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="rounded-xl bg-indigo-50/60 p-3 text-xs text-indigo-900 border border-indigo-100">
                ✨ Gemini 3.5 Flash will generate 6 structured spaced-repetition cards with conceptual questions, accurate answers, and memory mnemonics.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateAiDeck}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>Generate Deck</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
