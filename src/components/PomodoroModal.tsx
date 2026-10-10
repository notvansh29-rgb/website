import React, { useState, useEffect } from 'react';
import { Timer, X, Play, Pause, RotateCcw, Coffee, Bell } from 'lucide-react';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer finished, play sound chime
      playChime();
      setIsRunning(false);
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const setTimerMode = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Study Focus Timer</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="my-4 flex justify-center gap-2 rounded-xl bg-slate-100 p-1.5">
          <button
            onClick={() => setTimerMode('focus')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mode === 'focus'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Timer className="h-3.5 w-3.5" />
            25m Focus Session
          </button>
          <button
            onClick={() => setTimerMode('break')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mode === 'break'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coffee className="h-3.5 w-3.5" />
            5m Refresh Break
          </button>
        </div>

        {/* Digital Clock Display */}
        <div className="my-6 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-blue-50/30 p-6 border border-indigo-100/60">
          <span className="font-mono text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            {formattedTime}
          </span>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {mode === 'focus' ? 'Keep distractions away & focus!' : 'Rest your eyes & stretch!'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-bold text-white shadow-md transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
            }`}
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
            {isRunning ? 'Pause' : 'Start Focus'}
          </button>

          <button
            onClick={resetTimer}
            className="rounded-2xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            title="Reset timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-400">
          Built using the Pomodoro technique to maximize student memory retention.
        </p>
      </div>
    </div>
  );
};
