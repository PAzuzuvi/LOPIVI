import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onSuccess: (password: string) => void;
  onClose: () => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Introduce la contraseña docente');
      return;
    }

    // Default password 'profe2026'
    if (password === 'profe2026' || password === 'profe2025') {
      sound.playCorrect();
      setError('');
      onSuccess(password);
    } else {
      sound.playWrong();
      setError('Contraseña incorrecta. (Clave por defecto: profe2026)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-purple-950/90 to-slate-950 border border-purple-500/40 rounded-3xl p-6 shadow-2xl shadow-purple-950/60 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-950/80 text-purple-300 hover:text-white flex items-center justify-center border border-purple-500/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner mb-3">
            <Lock className="w-6 h-6 text-purple-300" />
          </div>
          <h2 className="text-xl font-black text-white">Acceso al Panel Docente</h2>
          <p className="text-xs text-purple-300/80 mt-1">
            Espacio reservado para profesorado y dinamizadores
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Escribe la clave docente..."
                className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-purple-500/40 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-white placeholder-slate-500 text-sm font-medium outline-none transition-all shadow-inner"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error ? (
              <p className="text-xs text-rose-400 mt-2 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {error}
              </p>
            ) : (
              <p className="text-[11px] text-purple-400/70 mt-1.5">
                💡 Clave por defecto configurada: <span className="text-purple-200 font-mono font-bold">profe2026</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>Desbloquear Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
