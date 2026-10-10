import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Lightbulb,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowRight,
  HelpCircle,
  Award,
  Layers,
  Flame,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { TopicExplanation } from '../types';
import { explainTopicService } from '../services/aiService';

interface TutorViewProps {
  onQuizFromTopic: (subject: string, topic: string) => void;
  aiMode: 'live' | 'demo' | 'checking';
  initialTopic?: string;
  initialSubject?: string;
}

const EXHIBITION_TOPICS = [
  {
    topic: 'Photosynthesis',
    subject: 'Biology',
    teaser: 'How leaves convert solar radiant energy into sweet glucose snacks and fresh oxygen.',
  },
  {
    topic: 'Newton’s Laws of Motion',
    subject: 'Physics',
    teaser: 'Inertia, F=ma, and why skateboard kicks propel you across the sidewalk.',
  },
  {
    topic: 'Pythagorean Theorem',
    subject: 'Mathematics',
    teaser: 'Right triangles, patio tile geometry, and how a² + b² = c² calculates true distance.',
  },
  {
    topic: 'Machine Learning',
    subject: 'Computer Science',
    teaser: 'How computers spot patterns in thousands of pictures rather than memorizing rigid rules.',
  },
  {
    topic: 'Chemical Bonding & Electronegativity',
    subject: 'Chemistry',
    teaser: 'Why nonmetal atoms share valence electrons to build stable octets.',
  },
  {
    topic: 'Mitochondria & ATP Cycle',
    subject: 'Biology',
    teaser: 'The microscopic cellular battery factory powering eukaryotic life.',
  },
];

export const TutorView: React.FC<TutorViewProps> = ({
  onQuizFromTopic,
  aiMode,
  initialTopic = 'Photosynthesis',
  initialSubject = 'Biology',
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [style, setStyle] = useState<'ELI5' | 'Step-by-step' | 'Exam Prep' | 'Socratic'>('ELI5');
  const [grade, setGrade] = useState('Grade 10');

  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<TopicExplanation | null>({
    topic: 'Photosynthesis',
    subject: 'Biology',
    style: 'ELI5',
    summary:
      'Photosynthesis is the biochemical process where green plants, algae, and cyanobacteria transform sunlight, water, and carbon dioxide into glucose (energy-rich sugar) and oxygen.',
    analogy:
      'Imagine a solar-powered kitchen inside every leaf! Sunlight is the electricity, carbon dioxide from the air and water from the soil are the raw ingredients, and the plant chef creates sweet glucose snacks while giving away fresh oxygen as a free gift to the planet.',
    keyPoints: [
      'Chemical equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂',
      'Occurs primarily in chloroplasts containing green chlorophyll pigment',
      'Comprises two main stages: Light-dependent reactions (in thylakoids) and the Calvin Cycle (in stroma)',
      'Provides the foundational energy source for nearly all food webs on Earth',
    ],
    example:
      'A sunflower in your backyard turns sunlight hitting its leaves into the chemical energy it needs to grow 10 feet tall and produce hundreds of nutritious sunflower seeds.',
    takeaway:
      'Photosynthesis converts solar radiant energy into stable chemical bonds, sustaining Earth\'s oxygen supply and biomass.',
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const styles = [
    { id: 'ELI5', label: '🧒 Explain Like I’m 10', desc: 'Fun metaphors & zero jargon' },
    { id: 'Step-by-step', label: '🪜 Step-by-Step', desc: 'Logical progressive breakdown' },
    { id: 'Exam Prep', label: '🎯 Exam High-Yield', desc: 'Formulas, definitions & pitfalls' },
    { id: 'Socratic', label: '💡 Socratic Insight', desc: 'Intuitive guiding questions' },
  ];

  const handleFetchExplanation = async (targetTopic?: string, targetSubject?: string) => {
    const qTopic = targetTopic || topic;
    const qSubj = targetSubject || subject;

    if (!qTopic.trim()) return;

    setIsLoading(true);
    stopSpeech();

    try {
      const result = await explainTopicService(qTopic, qSubj, style, grade);
      if (result.ok && result.explanation) {
        setExplanation({
          topic: result.explanation.topic,
          subject: result.explanation.subject,
          style: result.explanation.style,
          summary: result.explanation.summary,
          analogy: result.explanation.analogy,
          keyPoints: result.explanation.keyPoints,
          example: result.explanation.example,
          takeaway: result.explanation.takeaway,
        });
      }
    } catch (err) {
      console.error('Error fetching explanation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof EXHIBITION_TOPICS[0]) => {
    setTopic(preset.topic);
    setSubject(preset.subject);
    handleFetchExplanation(preset.topic, preset.subject);
  };

  // Text to speech narration for exhibition
  const toggleSpeech = () => {
    if (!explanation) return;

    if (isSpeaking) {
      stopSpeech();
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToRead = `${explanation.topic}. ${explanation.summary} Here is a helpful analogy: ${explanation.analogy}. Key points to remember: ${explanation.keyPoints.join('. ')}. And the main takeaway: ${explanation.takeaway}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleCopy = () => {
    if (!explanation) return;
    const content = `${explanation.topic} (${explanation.subject})\n\nSummary:\n${explanation.summary}\n\nAnalogy:\n${explanation.analogy}\n\nKey Points:\n${explanation.keyPoints.map(k => '• ' + k).join('\n')}\n\nExample:\n${explanation.example}\n\nExam Takeaway:\n${explanation.takeaway}`;
    navigator.clipboard.writeText(content);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl flex items-center gap-2">
            <span>AI Tutor: Concept Explainer</span>
            <span className="rounded-lg bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">
              Adaptive Learning
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Deconstruct complex scientific and mathematical concepts into crystal-clear analogies and exam takeaways.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            {aiMode === 'live' ? 'Gemini 3.5 Flash' : 'Curated Exhibition Explanations'}
          </span>
        </div>
      </div>

      {/* Input & Style Configuration Box */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Enter any difficult topic or concept
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, Newton’s 3rd Law, Quantum Superposition, Doppler Effect..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-violet-100"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleFetchExplanation()}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-violet-500/20 hover:scale-102 transition-all disabled:opacity-50 shrink-0"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span>Explain Topic</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Target Level
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-800 focus:border-violet-500 focus:bg-white focus:outline-hidden"
            >
              <option value="Grade 8">Grade 8 (Junior High)</option>
              <option value="Grade 10">Grade 10 (Secondary School)</option>
              <option value="Grade 12">Grade 12 (Advanced / AP)</option>
              <option value="College">College / Undergraduate</option>
            </select>
          </div>
        </div>

        {/* Style Selector Chips */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
            Teaching Mode
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {styles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id as any)}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  style === s.id
                    ? 'border-violet-600 bg-violet-50/80 shadow-xs ring-1 ring-violet-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-900">{s.label}</p>
                <p className="text-[10px] text-slate-500">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Exhibition Fast Presets */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Try Popular Exhibition Demonstrations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {EXHIBITION_TOPICS.map((item) => (
              <button
                key={item.topic}
                type="button"
                onClick={() => handleSelectPreset(item)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-300 hover:bg-violet-50/60 transition-all shadow-2xs"
              >
                <span className="font-semibold text-slate-900">{item.topic}</span>
                <span className="ml-1 text-[10px] text-violet-600">({item.subject})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Explanation Results Display */}
      {explanation && (
        <div className="space-y-5">
          {/* Action Ribbon: Read Aloud + Copy + Quiz Me */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50/50 p-3.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">
                {explanation.subject}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {explanation.topic}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Text-to-Speech narration */}
              <button
                type="button"
                onClick={toggleSpeech}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-2xs ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isSpeaking ? <Pause className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-violet-600" />}
                <span>{isSpeaking ? 'Pause Audio Narration' : 'Listen with Audio (TTS)'}</span>
              </button>

              {/* Copy Explanation */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                <span>{hasCopied ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              {/* Instant Quiz Me button */}
              <button
                type="button"
                onClick={() => onQuizFromTopic(explanation.subject, explanation.topic)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Test Me with 5-Q Quiz 🚀</span>
              </button>
            </div>
          </div>

          {/* Cards Layout */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* 1. Core Summary Card (Full width top) */}
            <div className="lg:col-span-3 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">Core Concept Overview</h4>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {explanation.summary}
              </p>
            </div>

            {/* 2. Real-World Analogy Card */}
            <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-2xs">
                    <Lightbulb className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Mental Analogy</h4>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {explanation.analogy}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] font-semibold text-amber-800">
                💡 Why this sticks: Analogies bridge abstract formulas to sensory memory.
              </div>
            </div>

            {/* 3. 4 Key Mechanisms / Points (Span 2) */}
            <div className="lg:col-span-2 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-2xs">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Key Mechanisms & Rules</h4>
              </div>

              <div className="mt-3 space-y-2.5">
                {explanation.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl bg-indigo-50/50 p-3.5 border border-indigo-100/60"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-snug">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Real-World Practical Example */}
            <div className="lg:col-span-2 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                  <CheckCircle className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Real-World Application</h4>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {explanation.example}
              </p>
            </div>

            {/* 5. Golden Exam Takeaway Card */}
            <div className="rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50/70 via-white to-indigo-50/40 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white shadow-2xs">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Exam Golden Rule</h4>
                </div>
                <p className="mt-2 text-xs sm:text-sm font-semibold text-violet-950 leading-relaxed">
                  "{explanation.takeaway}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-violet-100 text-[11px] text-slate-500">
                Write this memory hook at the top of your test sheet for instant recall!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
