import React, { useEffect } from 'react';
import { Flame, Sparkles, X } from 'lucide-react';
import { fireBigCelebration } from '../utils/confetti';
import { sound } from '../utils/audio';

interface StreakCelebrationProps {
  streak: number;
  onDismiss: () => void;
}

// Curated collection of cheerful celebration dance animated GIFs / SVG badges
const STREAK_DANCES = [
  {
    title: '¡En Llamas! 🔥',
    subtitle: '¡Racha Imparable! El claustro está asombrado.',
    // Carlton dance / celebration
    gifUrl: 'https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif',
    fallbackEmoji: '🕺'
  },
  {
    title: '¡Ritmo Maestro! 💃',
    subtitle: '¡Dominando la LOPIVI con maestría!',
    // Happy celebration dance
    gifUrl: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    fallbackEmoji: '💃'
  },
  {
    title: '¡Cerebro Supremo! 🌟',
    subtitle: '¡Racha colosal de respuestas correctas!',
    // Celebration
    gifUrl: 'https://media.giphy.com/media/3o7qDSOvfaCO9b3MlO/giphy.gif',
    fallbackEmoji: '🎉'
  }
];

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({ streak, onDismiss }) => {
  const danceIdx = (Math.floor(streak / 3) - 1) % STREAK_DANCES.length;
  const currentDance = STREAK_DANCES[Math.max(0, danceIdx)];

  useEffect(() => {
    sound.playStreak();
    fireBigCelebration();

    // Auto dismiss after 2.8 seconds so it doesn't block the quiz flow
    const timer = setTimeout(() => {
      onDismiss();
    }, 2800);

    return () => clearTimeout(timer);
  }, [streak, onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xs sm:max-w-sm bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 border-2 border-purple-400/60 rounded-3xl p-5 text-center shadow-2xl shadow-purple-600/50 scale-100 animate-bounceOnce overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/30 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-900/80 border border-purple-500/40 text-purple-200 flex items-center justify-center hover:bg-purple-800 transition-colors"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Streak badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-extrabold text-xs mb-3 shadow-lg">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse fill-amber-400" />
          <span>¡RACHA X{streak} DE ACIERTOS!</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
          {currentDance.title}
        </h3>
        <p className="text-xs text-purple-200/90 mb-3 font-medium">
          {currentDance.subtitle}
        </p>

        {/* Dance GIF with animated frame */}
        <div className="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-2xl overflow-hidden border-2 border-purple-400/40 shadow-xl bg-slate-900 relative flex items-center justify-center group">
          <img
            src={currentDance.gifUrl}
            alt="Baile de celebración"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to stylized animated emoji card if GIF fails to load
              (e.target as HTMLElement).style.display = 'none';
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'text-7xl animate-bounce';
                fallback.innerText = currentDance.fallbackEmoji;
                parent.appendChild(fallback);
              }
            }}
          />
        </div>

        <div className="mt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 px-3 py-1 rounded-lg border border-purple-500/30">
            Multiplicador de puntos activado ⚡
          </span>
        </div>
      </div>
    </div>
  );
};
