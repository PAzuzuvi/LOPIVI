import React, { useEffect, useState } from 'react';
import { StudentResult } from '../types/quiz';
import { QUIZ_QUESTIONS } from '../data/questions';
import { Trophy, Flame, CheckCircle, XCircle, Clock, RotateCcw, Home, BookOpen, Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import { fireBigCelebration } from '../utils/confetti';
import { sound } from '../utils/audio';

interface QuizFinishedProps {
  result: StudentResult;
  syncedWithCloud: boolean;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const QuizFinished: React.FC<QuizFinishedProps> = ({
  result,
  syncedWithCloud,
  onPlayAgain,
  onGoHome,
}) => {
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    sound.playFinish();
    fireBigCelebration();
  }, []);

  // Performance assessment
  let rankTitle = '¡Gran Esfuerzo!';
  let rankBadge = '🥉';
  let rankColor = 'from-amber-600 to-amber-800';

  if (result.accuracy >= 90) {
    rankTitle = '¡Experto/a en LOPIVI y Protección!';
    rankBadge = '🥇';
    rankColor = 'from-amber-400 via-yellow-300 to-amber-500';
  } else if (result.accuracy >= 70) {
    rankTitle = '¡Notable Dominio Didáctico!';
    rankBadge = '🥈';
    rankColor = 'from-slate-300 via-purple-300 to-indigo-400';
  }

  const formatMinutes = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}m ${remainder}s`;
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 min-h-[85vh] flex flex-col justify-center animate-fadeIn">
      {/* Result Card */}
      <div className="bg-gradient-to-b from-slate-900 via-purple-950/70 to-slate-950 border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Podium Top */}
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl mb-2 animate-bounce">
            {rankBadge}
          </div>
          <span className="text-xs uppercase tracking-widest font-black text-purple-300">
            ¡Desafío Finalizado!
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-100 to-blue-200 mt-1">
            {rankTitle}
          </h1>
          <p className="text-sm text-purple-300/80 mt-1 flex items-center justify-center gap-1.5">
            <span>{result.avatar}</span>
            <span className="font-bold text-white">{result.studentName}</span>
          </p>
        </div>

        {/* Cloud sync banner */}
        <div className="mb-5 p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-200">
            <Cloud className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Datos guardados en la base de datos de la docente</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
            Sincronizado ✓
          </span>
        </div>

        {/* Score KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-center">
          <div className="bg-slate-950/70 border border-purple-900/40 rounded-2xl p-3">
            <div className="text-xs text-purple-300/70 mb-0.5">Puntuación</div>
            <div className="text-lg sm:text-xl font-black text-amber-300 flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{result.score.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-purple-900/40 rounded-2xl p-3">
            <div className="text-xs text-purple-300/70 mb-0.5">Aciertos</div>
            <div className="text-lg sm:text-xl font-black text-emerald-300">
              {result.correctCount}/{result.totalQuestions}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-purple-900/40 rounded-2xl p-3">
            <div className="text-xs text-purple-300/70 mb-0.5">Precisión</div>
            <div className="text-lg sm:text-xl font-black text-purple-200">
              {result.accuracy}%
            </div>
          </div>

          <div className="bg-slate-950/70 border border-purple-900/40 rounded-2xl p-3">
            <div className="text-xs text-purple-300/70 mb-0.5">Racha Máx</div>
            <div className="text-lg sm:text-xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{result.maxStreak}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jugar de Nuevo</span>
          </button>

          <button
            onClick={onGoHome}
            className="py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Pantalla Principal</span>
          </button>
        </div>

        {/* Review Toggle Button */}
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full py-2.5 px-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{showReview ? 'Ocultar repaso didáctico' : 'Repasar las 30 preguntas y explicaciones'}</span>
          {showReview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Full Question Review Accordion */}
        {showReview && (
          <div className="mt-4 pt-4 border-t border-purple-900/40 space-y-3 max-h-96 overflow-y-auto pr-1">
            {QUIZ_QUESTIONS.map((q) => {
              const studentChoice = result.answers[q.id];
              const isCorrect = studentChoice ? studentChoice.correct : false;
              const selectedKey = studentChoice ? studentChoice.selected : '-';

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border text-xs ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/30'
                      : 'bg-rose-950/30 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-bold text-white">
                      #{q.id}. {q.question}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                      isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {isCorrect ? '✓ Correcta' : '✕ Fallada'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] mb-2 text-slate-300">
                    <div>
                      Tu respuesta: <span className="font-bold uppercase text-white">{selectedKey}) {q.options[selectedKey as 'a'|'b'|'c'|'d'] || 'No respondida'}</span>
                    </div>
                    <div>
                      Correcta: <span className="font-bold uppercase text-emerald-300">{q.correctAnswer}) {q.options[q.correctAnswer]}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 text-purple-200/90 text-[11px] leading-relaxed border border-purple-900/30">
                    <span className="font-bold text-purple-300">💡 Didáctica: </span>
                    {q.didacticExplanation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
