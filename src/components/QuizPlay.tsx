import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, StudentResult } from '../types/quiz';
import { QUIZ_QUESTIONS } from '../data/questions';
import { StreakCelebration } from './StreakCelebration';
import { MinigameBreak } from './MinigameBreak';
import { sound } from '../utils/audio';
import { fireSmallConfetti } from '../utils/confetti';
import { 
  Flame, 
  Trophy, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  ShieldCheck,
  Award
} from 'lucide-react';

interface QuizPlayProps {
  studentName: string;
  avatar: string;
  timedMode: boolean;
  onFinishQuiz: (result: StudentResult) => void;
  onExit: () => void;
}

export const QuizPlay: React.FC<QuizPlayProps> = ({
  studentName,
  avatar,
  timedMode,
  onFinishQuiz,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answersMap, setAnswersMap] = useState<Record<number, { selected: 'a' | 'b' | 'c' | 'd'; correct: boolean }>>({});
  
  // Timer & celebration state
  const [timeLeft, setTimeLeft] = useState(30);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakModalValue, setStreakModalValue] = useState(0);
  const [activeBreak, setActiveBreak] = useState<1 | 2 | null>(null);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  
  const startTimeRef = useRef(Date.now());
  const questionStartTimeRef = useRef(Date.now());
  const timerRef = useRef<any>(null);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  // Countdown timer for timed mode
  useEffect(() => {
    if (!timedMode || hasAnswered || activeBreak !== null) return;

    setTimeLeft(30);
    questionStartTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, timedMode, hasAnswered, activeBreak]);

  const handleTimeOut = () => {
    if (hasAnswered) return;
    // Timeout counts as incorrect answer
    sound.playWrong();
    setHasAnswered(true);
    setSelectedAnswer(null);
    setStreak(0);
    setAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: { selected: 'a', correct: false },
    }));
  };

  const handleOptionSelect = (optionKey: 'a' | 'b' | 'c' | 'd') => {
    if (hasAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = optionKey === currentQ.correctAnswer;
    setSelectedAnswer(optionKey);
    setHasAnswered(true);

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));

    // Calculate score
    if (isCorrect) {
      sound.playCorrect();
      fireSmallConfetti();

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectCount((prev) => prev + 1);

      // Point calculation: base 1000 + streak multiplier + speed bonus
      const streakMultiplier = newStreak >= 5 ? 1.5 : newStreak >= 3 ? 1.25 : 1.0;
      const speedBonus = timedMode ? Math.max(0, (30 - timeSpent) * 15) : 100;
      const pointsGained = Math.round((1000 + speedBonus) * streakMultiplier);

      setScore((prev) => prev + pointsGained);

      // Streak celebration triggers on 3, 5, 8, 10, 15, 20, 25, 30
      if ([3, 5, 8, 10, 15, 20, 25, 30].includes(newStreak)) {
        setStreakModalValue(newStreak);
        setShowStreakModal(true);
      }
    } else {
      sound.playWrong();
      setStreak(0);
    }

    setAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: { selected: optionKey, correct: isCorrect },
    }));
  };

  const handleNext = () => {
    sound.playClick();

    // Check if next is break 1 (after question 10, index 9) or break 2 (after question 20, index 19)
    if (currentIndex === 9 && activeBreak === null) {
      setActiveBreak(1);
      return;
    }
    if (currentIndex === 19 && activeBreak === null) {
      setActiveBreak(2);
      return;
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
      questionStartTimeRef.current = Date.now();
    } else {
      finishQuiz();
    }
  };

  const handleBreakComplete = (bonusPoints: number) => {
    setScore((prev) => prev + bonusPoints);
    setActiveBreak(null);
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setHasAnswered(false);
    questionStartTimeRef.current = Date.now();
  };

  const finishQuiz = () => {
    const totalTimeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    const finalAccuracy = Math.round((correctCount / totalQuestions) * 100);

    const result: StudentResult = {
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      studentName,
      avatar,
      score,
      correctCount,
      totalQuestions,
      accuracy: finalAccuracy,
      maxStreak,
      timeTakenSec: totalTimeSec,
      date: new Date().toISOString(),
      answers: answersMap,
    };

    onFinishQuiz(result);
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // If currently in a break
  if (activeBreak !== null) {
    return <MinigameBreak breakNumber={activeBreak} onContinue={handleBreakComplete} />;
  }

  // Quizizz style color definitions for options
  const optionThemes = {
    a: {
      color: 'from-violet-600 to-purple-800 border-violet-500/50 hover:border-violet-400',
      tagBg: 'bg-violet-900/60 text-violet-200 border-violet-400/40',
      label: 'A',
      symbol: '▲'
    },
    b: {
      color: 'from-blue-600 to-indigo-800 border-blue-500/50 hover:border-blue-400',
      tagBg: 'bg-blue-900/60 text-blue-200 border-blue-400/40',
      label: 'B',
      symbol: '◆'
    },
    c: {
      color: 'from-cyan-600 to-teal-800 border-cyan-500/50 hover:border-cyan-400',
      tagBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-400/40',
      label: 'C',
      symbol: '●'
    },
    d: {
      color: 'from-amber-600 to-orange-800 border-amber-500/50 hover:border-amber-400',
      tagBg: 'bg-amber-900/60 text-amber-200 border-amber-400/40',
      label: 'D',
      symbol: '■'
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 min-h-[90vh] flex flex-col justify-between">
      {/* Top Mobile Bar: Player info, Score, Streak, Sound */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-3 sm:p-3.5 backdrop-blur-md shadow-xl mb-3 flex items-center justify-between">
        {/* Student Avatar & Name */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-xl shadow-inner">
            {avatar}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white leading-tight truncate max-w-[120px] sm:max-w-[180px]">
              {studentName}
            </div>
            <div className="text-[10px] text-purple-300/80 font-medium">
              Pregunta {currentIndex + 1} de {totalQuestions}
            </div>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Badge */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{streak}</span>
            </div>
          )}

          {/* Points */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 font-extrabold text-xs sm:text-sm shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{score.toLocaleString()}</span>
          </div>

          {/* Timed Mode Clock */}
          {timedMode && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-bold ${
              timeLeft <= 5 ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-bounce' : 'bg-slate-950/80 border-slate-700 text-slate-300'
            }`}>
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{timeLeft}s</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-xl bg-slate-950/60 border border-purple-500/30 text-purple-300 hover:text-white flex items-center justify-center transition-colors"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900/60 rounded-full h-2 mb-3.5 border border-purple-900/40 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 via-indigo-400 to-pink-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-gradient-to-b from-slate-900/95 via-purple-950/40 to-slate-950 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative flex-1 flex flex-col justify-between">
        <div>
          {/* Question Category & Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-400/30 text-purple-200 text-xs font-semibold">
              <span>{currentQ.icon || '⚖️'}</span>
              <span>{currentQ.category}</span>
            </span>
            <span className="text-xs font-bold text-purple-300/60">
              #{currentQ.id}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug mb-5">
            {currentQ.question}
          </h2>

          {/* Options Grid (A, B, C, D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4">
            {(['a', 'b', 'c', 'd'] as const).map((key) => {
              const text = currentQ.options[key];
              const isSelected = selectedAnswer === key;
              const isCorrectAnswer = key === currentQ.correctAnswer;
              const theme = optionThemes[key];

              let cardStyles = `bg-gradient-to-br ${theme.color} text-white shadow-md active:scale-[0.98]`;

              if (hasAnswered) {
                if (isCorrectAnswer) {
                  cardStyles = 'bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-300 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400 animate-pulse';
                } else if (isSelected) {
                  cardStyles = 'bg-gradient-to-br from-rose-700 to-red-900 border-2 border-rose-400 text-white shadow-lg shadow-rose-600/30';
                } else {
                  cardStyles = 'bg-slate-900/60 border border-slate-800/80 text-slate-400 opacity-40';
                }
              }

              return (
                <button
                  key={key}
                  onClick={() => handleOptionSelect(key)}
                  disabled={hasAnswered}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${cardStyles}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                    hasAnswered && isCorrectAnswer
                      ? 'bg-emerald-400 text-emerald-950 border-white'
                      : hasAnswered && isSelected
                      ? 'bg-rose-400 text-rose-950 border-white'
                      : theme.tagBg
                  }`}>
                    {hasAnswered && isCorrectAnswer ? '✓' : hasAnswered && isSelected ? '✕' : theme.label}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold leading-snug pt-1 flex-1">
                    {text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DIDACTIC EXPLANATION (CRITICAL REQUIREMENT: strictly hidden until an option is selected!) */}
        {hasAnswered && (
          <div className="mt-3 bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border border-purple-400/40 rounded-2xl p-4 sm:p-4.5 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-300" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-200">
                  Explicación Didáctica
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                selectedAnswer === currentQ.correctAnswer
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {selectedAnswer === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> ¡Respuesta Correcta!
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" /> Respuesta Incorrecta
                  </>
                )}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              {currentQ.didacticExplanation}
            </p>

            {/* Next Question CTA Button */}
            <div className="mt-3 pt-3 border-t border-purple-800/40 flex justify-end">
              <button
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>
                  {currentIndex < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Finalizar y Ver Resultados'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Exit link */}
        <div className="mt-3 flex justify-between items-center text-[11px] text-purple-400/60 pt-2 border-t border-purple-900/30">
          <span>{correctCount} aciertos • Racha máxima: {maxStreak}</span>
          <button
            onClick={onExit}
            className="hover:text-purple-300 underline transition-colors"
          >
            Abandonar quiz
          </button>
        </div>
      </div>

      {/* Streak celebration pop-up */}
      {showStreakModal && (
        <StreakCelebration
          streak={streakModalValue}
          onDismiss={() => setShowStreakModal(false)}
        />
      )}
    </div>
  );
};
