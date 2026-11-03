import React, { useState } from 'react';
import { Sparkles, Trophy, Shield, ArrowRight, User, Clock, Zap, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface StudentRegisterProps {
  onStartQuiz: (studentName: string, avatar: string, timedMode: boolean) => void;
  onGoHome: () => void;
}

const AVATARS = ['🎓', '🦊', '🦁', '🦉', '⚡', '🚀', '🌟', '🛡️', '💜', '🦄', '🐼', '🐯'];

export const StudentRegister: React.FC<StudentRegisterProps> = ({ onStartQuiz, onGoHome }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [timedMode, setTimedMode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Por favor, introduce tu nombre o alias para comenzar');
      return;
    }
    sound.playClick();
    onStartQuiz(cleanName, selectedAvatar, timedMode);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 sm:py-8 flex flex-col justify-center min-h-[85vh]">
      {/* Header Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold mb-3 backdrop-blur-md shadow-inner">
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>EdTech LOPIVI • Mobile Learning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-100 to-blue-200 tracking-tight">
          Desafío de Conocimiento
        </h1>
        <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
          Ley Orgánica 8/2021 y Protección Integral a la Infancia y Adolescencia
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/80 border border-purple-500/20 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow backdrop decorative */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Name input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
              Tu Nombre o Alias
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                maxLength={30}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ej. Paula García, Alex..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/70 border border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-2xl text-white placeholder-slate-500 text-base font-medium outline-none transition-all shadow-inner"
                autoFocus
              />
              <User className="w-5 h-5 text-purple-400/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1.5 font-medium animate-pulse">{error}</p>}
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
              Elige tu Avatar de Jugador
            </label>
            <div className="grid grid-cols-6 gap-2 bg-slate-950/50 p-2.5 rounded-2xl border border-purple-900/40">
              {AVATARS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => {
                    setSelectedAvatar(emoji);
                    sound.playClick();
                  }}
                  className={`w-11 h-11 text-2xl flex items-center justify-center rounded-xl transition-all ${
                    selectedAvatar === emoji
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/40 scale-110 ring-2 ring-purple-300'
                      : 'hover:bg-slate-800/80 opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz mode toggles */}
          <div className="pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
              Modo de Juego
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setTimedMode(false);
                  sound.playClick();
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  !timedMode
                    ? 'bg-gradient-to-br from-purple-950 to-indigo-950/80 border-purple-500/60 shadow-md ring-1 ring-purple-400'
                    : 'bg-slate-950/50 border-slate-800 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Modo Reflexión</span>
                </div>
                <p className="text-[11px] text-purple-300/70 leading-tight">Sin prisas. Ideal para leer explicaciones didácticas.</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimedMode(true);
                  sound.playClick();
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  timedMode
                    ? 'bg-gradient-to-br from-indigo-950 to-purple-950/80 border-indigo-500/60 shadow-md ring-1 ring-indigo-400'
                    : 'bg-slate-950/50 border-slate-800 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Modo Kahoot</span>
                </div>
                <p className="text-[11px] text-purple-300/70 leading-tight">30s por pregunta con bonus extra de velocidad.</p>
              </button>
            </div>
          </div>

          {/* Start button */}
          <button
            type="submit"
            className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transform active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Entrar al Desafío</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Back button */}
        <div className="mt-4 pt-3 border-t border-purple-900/30 text-center">
          <button
            type="button"
            onClick={onGoHome}
            className="text-xs text-purple-300/70 hover:text-purple-200 transition-colors"
          >
            ← Volver a la pantalla principal
          </button>
        </div>
      </div>

      {/* Gamified Features Preview */}
      <div className="grid grid-cols-3 gap-2 mt-5 text-center">
        <div className="bg-slate-900/40 border border-purple-900/30 rounded-2xl p-2.5">
          <div className="text-base mb-0.5">🔥</div>
          <div className="text-[11px] font-bold text-purple-200">Rachas</div>
          <div className="text-[10px] text-purple-400/70">Multiplicadores x2 y x3</div>
        </div>
        <div className="bg-slate-900/40 border border-purple-900/30 rounded-2xl p-2.5">
          <div className="text-base mb-0.5">💡</div>
          <div className="text-[11px] font-bold text-purple-200">Explicaciones</div>
          <div className="text-[10px] text-purple-400/70">Fundamentos didácticos</div>
        </div>
        <div className="bg-slate-900/40 border border-purple-900/30 rounded-2xl p-2.5">
          <div className="text-base mb-0.5">☕</div>
          <div className="text-[11px] font-bold text-purple-200">Pausas Activas</div>
          <div className="text-[10px] text-purple-400/70">Chistes de claustro & bonus</div>
        </div>
      </div>
    </div>
  );
};
