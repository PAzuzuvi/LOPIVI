import React, { useState } from 'react';
import { StudentRegister } from './components/StudentRegister';
import { QuizPlay } from './components/QuizPlay';
import { QuizFinished } from './components/QuizFinished';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentResult } from './types/quiz';
import { submitQuizResult } from './utils/storage';
import { sound } from './utils/audio';
import { 
  Shield, 
  GraduationCap, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  BarChart3, 
  HeartHandshake, 
  Flame, 
  Scale,
  Users,
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { downloadStandaloneHtmlFile } from './components/StandaloneExport';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'student-register' | 'student-play' | 'student-finished' | 'teacher-dashboard'>('home');
  const [studentInfo, setStudentInfo] = useState<{ name: string; avatar: string; timedMode: boolean } | null>(null);
  const [lastResult, setLastResult] = useState<StudentResult | null>(null);
  const [syncedWithCloud, setSyncedWithCloud] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // Student flow handlers
  const handleStartQuiz = (name: string, avatar: string, timedMode: boolean) => {
    setStudentInfo({ name, avatar, timedMode });
    setCurrentView('student-play');
  };

  const handleFinishQuiz = async (result: StudentResult) => {
    setLastResult(result);
    setCurrentView('student-finished');
    const { syncedWithCloud } = await submitQuizResult(result);
    setSyncedWithCloud(syncedWithCloud);
  };

  const handlePlayAgain = () => {
    sound.playClick();
    if (studentInfo) {
      setCurrentView('student-play');
    } else {
      setCurrentView('student-register');
    }
  };

  const handleGoHome = () => {
    sound.playClick();
    setCurrentView('home');
  };

  // Teacher flow handlers
  const handleTeacherSuccess = (password: string) => {
    setIsTeacherModalOpen(false);
    setCurrentView('teacher-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/70 to-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Decorative ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main navigation / view router */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        {currentView === 'home' && (
          <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
            {/* Top Brand Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-semibold mb-6 shadow-inner backdrop-blur-md">
              <Scale className="w-4 h-4 text-purple-400" />
              <span>LOPIVI • Ley Orgánica 8/2021 de Protección Integral</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>

            {/* Hero Heading */}
            <h1 className="text-3xl sm:text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-100 to-pink-200 tracking-tight leading-tight max-w-2xl mb-4">
              Quizizz LOPIVI &amp; Prevención de Violencia
            </h1>
            <p className="text-sm sm:text-base text-purple-200/80 text-center max-w-xl mb-8 font-medium">
              Aplicación web educativa gamificada orientada a móviles y aulas. Diseñada para evaluar conocimientos, afianzar el buen trato y registrar resultados en tiempo real.
            </p>

            {/* Profile Selection Cards (Modo Alumno vs Panel Docente) */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Option 1: Modo Alumno */}
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentView('student-register');
                }}
                className="group relative p-6 rounded-3xl bg-gradient-to-b from-purple-900/70 via-indigo-950/60 to-slate-900/80 border-2 border-purple-500/40 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-600/30 text-left transition-all duration-200 cursor-pointer active:scale-95 flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4 text-3xl">🎮</div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-600/40">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-purple-300">
                    Perfil Estudiante
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5 mb-2">
                    Modo Alumno
                  </h3>
                  <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                    Juega el test de 30 preguntas, compite con rachas de aciertos, desbloquea pausas activas y recibe explicaciones didácticas inmediatas.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 group-hover:text-white transition-colors">
                  <span>Comenzar Desafío</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Panel Docente */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsTeacherModalOpen(true);
                }}
                className="group relative p-6 rounded-3xl bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-900/80 border-2 border-indigo-500/30 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-600/30 text-left transition-all duration-200 cursor-pointer active:scale-95 flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4 text-3xl">📊</div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-600/40">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-indigo-300">
                    Profesorado & Dinamización
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5 mb-2">
                    Panel Docente
                  </h3>
                  <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                    Acceso privado con contraseña. Consulta clasificaciones en vivo, radiografía de preguntas más falladas y exporta a Excel/Google Sheets.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 group-hover:text-white transition-colors">
                  <span>Acceso Protegido (profe2026)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Quick badges of features */}
            <div className="w-full max-w-2xl bg-slate-900/50 border border-purple-900/40 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="flex flex-col items-center">
                <Shield className="w-4 h-4 text-purple-400 mb-1" />
                <span className="font-bold text-purple-200">30 Preguntas</span>
                <span className="text-[10px] text-purple-400/70">LOPIVI & CP</span>
              </div>
              <div className="flex flex-col items-center">
                <BookOpen className="w-4 h-4 text-indigo-400 mb-1" />
                <span className="font-bold text-purple-200">Didáctica</span>
                <span className="text-[10px] text-purple-400/70">Feedback guiado</span>
              </div>
              <div className="flex flex-col items-center">
                <Flame className="w-4 h-4 text-amber-400 mb-1" />
                <span className="font-bold text-purple-200">Rachas & Baile</span>
                <span className="text-[10px] text-purple-400/70">Efectos animados</span>
              </div>
              <div className="flex flex-col items-center">
                <BarChart3 className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="font-bold text-purple-200">Nube & Sheets</span>
                <span className="text-[10px] text-purple-400/70">Analítica en vivo</span>
              </div>
            </div>

            {/* One click portable download button */}
            <div className="mt-6 text-center">
              <button
                onClick={downloadStandaloneHtmlFile}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 text-purple-300 text-xs font-medium transition-colors cursor-pointer"
                title="Descargar archivo único HTML con todas las 30 preguntas y código integrado"
              >
                <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Descargar versión portable en 1 solo archivo (.html)</span>
              </button>
            </div>
          </div>
        )}

        {currentView === 'student-register' && (
          <StudentRegister
            onStartQuiz={handleStartQuiz}
            onGoHome={handleGoHome}
          />
        )}

        {currentView === 'student-play' && studentInfo && (
          <QuizPlay
            studentName={studentInfo.name}
            avatar={studentInfo.avatar}
            timedMode={studentInfo.timedMode}
            onFinishQuiz={handleFinishQuiz}
            onExit={handleGoHome}
          />
        )}

        {currentView === 'student-finished' && lastResult && (
          <QuizFinished
            result={lastResult}
            syncedWithCloud={syncedWithCloud}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        )}

        {currentView === 'teacher-dashboard' && (
          <TeacherDashboard
            onLogout={handleGoHome}
          />
        )}
      </main>

      {/* Teacher Password Modal */}
      <TeacherAuthModal
        isOpen={isTeacherModalOpen}
        onSuccess={handleTeacherSuccess}
        onClose={() => setIsTeacherModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full py-4 px-4 text-center text-[11px] text-purple-400/60 border-t border-purple-950/40">
        <p>Herramienta EdTech de Sensibilización y Protección a la Infancia • Ley Orgánica 8/2021 (LOPIVI)</p>
      </footer>
    </div>
  );
}
export default App;
