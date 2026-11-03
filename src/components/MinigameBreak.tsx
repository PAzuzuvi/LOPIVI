import React, { useState } from 'react';
import { Coffee, Sparkles, CheckCircle2, ArrowRight, Smile, Heart, Flame } from 'lucide-react';
import { sound } from '../utils/audio';
import { fireBigCelebration } from '../utils/confetti';

interface MinigameBreakProps {
  breakNumber: 1 | 2;
  onContinue: (bonusPoints: number) => void;
}

export const MinigameBreak: React.FC<MinigameBreakProps> = ({ breakNumber, onContinue }) => {
  const [selectedBonusAnswer, setSelectedBonusAnswer] = useState<number | null>(null);
  const [answeredBonus, setAnsweredBonus] = useState(false);
  const [bonusAwarded, setBonusAwarded] = useState(0);

  const breakData = breakNumber === 1 ? {
    title: '☕ Pausa de Claustro: Café Pedagógico',
    subtitle: 'Nivel 1 Superado (10/30) • ¡Recarga de energía!',
    claustroJoke: '«En el claustro de hoy se debatió durante 45 minutos si las actas se enviaban en Arial 11 o Times New Roman... pero la LOPIVI nos recuerda lo verdaderamente primordial: la protección activa y el bienestar superior del menor.» 😉',
    reflection: 'La docencia y la intervención social son profesiones con un fuerte impacto emocional. Cuidar de nosotros y del equipo docente es el primer paso para proteger eficazmente al alumnado.',
    bonusQuestion: 'Minijuego Flash (+500 pts): Según la LOPIVI, cuando detectamos indicios de violencia sobre un menor...',
    options: [
      { text: 'A) Debemos esperar a tener pruebas periciales incontestables.', isCorrect: false },
      { text: 'B) Basta con advertir indicios para tener el deber de comunicar.', isCorrect: true },
      { text: 'C) Solo se comunica si el menor lo solicita por escrito.', isCorrect: false }
    ],
    bonusFeedback: '¡Correcto! En la LOPIVI basta con la sospecha fundada o indicios racionales para activar la protección.'
  } : {
    title: '🧘 Pausa Anti-Estrés: Mitos vs Realidad',
    subtitle: 'Nivel 2 Superado (20/30) • ¡Entrando en la recta final!',
    claustroJoke: '«Leyenda escolar: "Quien logre entender a la primera todos los anexos de la memoria anual de centro, convalida tres másteres de golpe"... ¡Respira hondo, estira los hombros, ya casi lo tienes!» 🚀',
    reflection: 'Desmontar los mitos sobre la violencia sexual (como pensar que casi siempre es un agresor desconocido) es el escudo más potente que podemos enseñar a nuestros adolescentes.',
    bonusQuestion: 'Minijuego Flash (+500 pts): Sobre el perfil del agresor sexual a menores en España...',
    options: [
      { text: 'A) La gran mayoría (casi 81%) pertenece al círculo cercano o de confianza.', isCorrect: true },
      { text: 'B) Más del 90% son desconocidos que abordan al menor en la calle.', isCorrect: false },
      { text: 'C) Siempre tienen un diagnóstico clínico psiquiátrico grave.', isCorrect: false }
    ],
    bonusFeedback: '¡Exacto! El estudio ANAR confirma que casi el 81% pertenece al entorno cercano o familiar.'
  };

  const handleSelectBonus = (idx: number) => {
    if (answeredBonus) return;
    setSelectedBonusAnswer(idx);
    setAnsweredBonus(true);
    const isCorrect = breakData.options[idx].isCorrect;
    if (isCorrect) {
      sound.playCorrect();
      fireBigCelebration();
      setBonusAwarded(500);
    } else {
      sound.playWrong();
      setBonusAwarded(100); // Friendly effort bonus
    }
  };

  const handleFinishBreak = () => {
    sound.playClick();
    onContinue(bonusAwarded);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 min-h-[85vh] flex flex-col justify-center">
      <div className="bg-gradient-to-b from-slate-900/95 via-purple-950/80 to-slate-950 border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Pausa Pedagógica & Descompresión</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-100 to-pink-200">
            {breakData.title}
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">{breakData.subtitle}</p>
        </div>

        {/* Claustro Joke / Anécdota Card */}
        <div className="bg-slate-950/70 border border-purple-500/20 rounded-2xl p-4 mb-4 relative">
          <div className="flex items-start gap-3">
            <div className="text-2xl">☕</div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1.5">
                <span>Anécdota de Claustro</span>
                <Smile className="w-3.5 h-3.5 text-amber-400" />
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                {breakData.claustroJoke}
              </p>
            </div>
          </div>
        </div>

        {/* Context reflection */}
        <div className="bg-purple-950/30 border border-purple-500/10 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
          <Heart className="w-4 h-4 text-pink-400 shrink-0" />
          <p className="text-xs text-purple-200/90 leading-tight">
            {breakData.reflection}
          </p>
        </div>

        {/* Mini Bonus Question */}
        <div className="bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bonus Extra de Puntos</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white mb-3">
            {breakData.bonusQuestion}
          </p>

          <div className="space-y-2">
            {breakData.options.map((opt, idx) => {
              const isSelected = selectedBonusAnswer === idx;
              let btnClass = 'bg-slate-900 border-purple-900/40 text-slate-200 hover:bg-slate-800 hover:border-purple-500/50';
              if (answeredBonus) {
                if (opt.isCorrect) {
                  btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500';
                } else if (isSelected) {
                  btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else {
                  btnClass = 'bg-slate-950/50 border-slate-900 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectBonus(idx)}
                  disabled={answeredBonus}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt.text}</span>
                  {answeredBonus && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {answeredBonus && (
            <div className="mt-3 pt-2.5 border-t border-purple-900/40 flex items-center justify-between text-xs animate-fadeIn">
              <span className="text-purple-300">{breakData.bonusFeedback}</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> +{bonusAwarded} pts
              </span>
            </div>
          )}
        </div>

        {/* Continue button */}
        <button
          onClick={handleFinishBreak}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 group cursor-pointer active:scale-95 transition-all"
        >
          <span>Continuar el Quiz</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
