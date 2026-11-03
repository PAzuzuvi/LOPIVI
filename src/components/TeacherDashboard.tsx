import React, { useState, useEffect } from 'react';
import { StudentResult, TeacherSettings } from '../types/quiz';
import { QUIZ_QUESTIONS } from '../data/questions';
import { 
  fetchAllResults, 
  clearAllResults, 
  exportResultsToCsv, 
  getLocalSettings, 
  saveLocalSettings 
} from '../utils/storage';
import { downloadStandaloneHtmlFile } from './StandaloneExport';
import { sound } from '../utils/audio';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Trophy, 
  Search, 
  Download, 
  Trash2, 
  RefreshCw, 
  LogOut, 
  ExternalLink, 
  CheckCircle2, 
  FileSpreadsheet, 
  Cloud, 
  BookOpen, 
  Flame, 
  Clock, 
  ArrowUpDown, 
  HelpCircle,
  Eye,
  X,
  FileCode2
} from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ranking' | 'errors' | 'cloud' | 'export'>('ranking');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'accuracy' | 'date'>('score');
  
  // Inspection modal for an individual student's answers
  const [inspectStudent, setInspectStudent] = useState<StudentResult | null>(null);
  
  // Cloud settings
  const [settings, setSettings] = useState<TeacherSettings>(getLocalSettings());
  const [sheetUrlInput, setSheetUrlInput] = useState(settings.sheetDbUrl);
  const [sheetSaveStatus, setSheetSaveStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [sheetFeedback, setSheetFeedback] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllResults();
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 12 seconds in case students are completing simultaneously on their phones
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleClearData = async () => {
    if (confirm('¿Estás seguro/a de que deseas borrar todos los registros de alumnos de la clase?')) {
      const ok = await clearAllResults('profe2026');
      if (ok) {
        sound.playClick();
        setResults([]);
        setInspectStudent(null);
      }
    }
  };

  const handleSaveSheetDb = async (e: React.FormEvent) => {
    e.preventDefault();
    setSheetSaveStatus('testing');
    setSheetFeedback('Probando conexión con SheetDB / Google Sheets...');

    const newSettings: TeacherSettings = {
      ...settings,
      sheetDbUrl: sheetUrlInput.trim(),
    };

    if (!newSettings.sheetDbUrl) {
      await saveLocalSettings(newSettings);
      setSettings(newSettings);
      setSheetSaveStatus('success');
      setSheetFeedback('Configuración guardada (Modo almacenamiento local/servidor activo).');
      return;
    }

    try {
      // Test ping to the sheetdb url
      const res = await fetch(newSettings.sheetDbUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            ID: 'TEST-PING',
            Nombre: 'Comprobación Docente',
            Puntuacion: 1000,
            Aciertos: '30/30',
            Porcentaje: '100%',
            RachaMaxima: 10,
            TiempoSegundos: 10,
            Fecha: new Date().toLocaleString('es-ES')
          }]
        })
      });

      if (res.ok) {
        await saveLocalSettings(newSettings);
        setSettings(newSettings);
        setSheetSaveStatus('success');
        setSheetFeedback('¡Conexión establecida con éxito! Se ha enviado una fila de prueba a tu hoja de Google Sheets.');
      } else {
        throw new Error('El servicio respondió con un código ' + res.status);
      }
    } catch (err: any) {
      setSheetSaveStatus('error');
      setSheetFeedback('Error al conectar con la URL: ' + (err.message || 'Verifica el enlace'));
    }
  };

  // Calculations for KPI Cards
  const totalStudents = results.length;
  const avgScore = totalStudents > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / totalStudents) : 0;
  const avgAccuracy = totalStudents > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / totalStudents) : 0;
  const maxScore = totalStudents > 0 ? Math.max(...results.map(r => r.score)) : 0;

  // Question error analysis across all completed students
  const questionErrorStats = QUIZ_QUESTIONS.map(q => {
    let totalAttempts = 0;
    let failedAttempts = 0;
    const choicesCount: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };

    results.forEach(r => {
      if (r.answers && r.answers[q.id]) {
        totalAttempts++;
        const chosen = r.answers[q.id].selected;
        if (choicesCount[chosen] !== undefined) choicesCount[chosen]++;
        if (!r.answers[q.id].correct) {
          failedAttempts++;
        }
      }
    });

    const failureRate = totalAttempts > 0 ? Math.round((failedAttempts / totalAttempts) * 100) : 0;

    return {
      question: q,
      totalAttempts,
      failedAttempts,
      failureRate,
      choicesCount
    };
  }).sort((a, b) => b.failureRate - a.failureRate);

  // Filtered and sorted students
  const filteredStudents = results
    .filter(r => r.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Panel Docente Activo • LOPIVI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Dashboard Analítico del Aula
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/80 mt-0.5">
            Seguimiento en tiempo real de alumnos, puntuaciones y diagnóstico de dudas
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={loadData}
            className="px-3.5 py-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/70 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Recargar datos de la nube"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={() => exportResultsToCsv(results)}
            disabled={results.length === 0}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
            title="Descargar datos en formato CSV compatible con Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-purple-300/70 text-xs mb-1">
            <span>Alumnos Evaluados</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalStudents}
          </div>
          <div className="text-[11px] text-purple-400/80 mt-0.5">
            {totalStudents > 0 ? 'Conectados desde móvil' : 'Esperando participantes'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-purple-300/70 text-xs mb-1">
            <span>Precisión Media</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {avgAccuracy}%
          </div>
          <div className="text-[11px] text-purple-400/80 mt-0.5">
            Media de aciertos de la clase
          </div>
        </div>

        <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-purple-300/70 text-xs mb-1">
            <span>Puntuación Media</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300">
            {avgScore.toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-400/80 mt-0.5">
            Máx individual: {maxScore.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-purple-300/70 text-xs mb-1">
            <span>Pregunta Más Fallada</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">
            {questionErrorStats[0]?.failureRate > 0 ? `Q#${questionErrorStats[0]?.question.id}` : 'Ninguna'}
          </div>
          <div className="text-[11px] text-purple-400/80 mt-0.5 truncate">
            {questionErrorStats[0]?.failureRate > 0 ? `${questionErrorStats[0].failureRate}% fallos en clase` : '100% aciertos'}
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-purple-900/50 mb-5 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'ranking'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Alumnos y Ranking ({totalStudents})</span>
        </button>

        <button
          onClick={() => setActiveTab('errors')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'errors'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-300" />
          <span>Radiografía de Errores (Dudas Frecuentes)</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'cloud'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
          }`}
        >
          <Cloud className="w-4 h-4 text-cyan-300" />
          <span>Base de Datos & Google Sheets</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'export'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Descargar & Exportar</span>
        </button>
      </div>

      {/* TAB 1: RANKING Y LISTA DE ALUMNOS */}
      {activeTab === 'ranking' && (
        <div className="bg-slate-900/80 border border-purple-500/20 rounded-3xl p-5 shadow-xl">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar alumno por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950/90 border border-purple-500/30 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-purple-300"
              />
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-purple-300">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Ordenar por:</span>
              <button
                onClick={() => setSortBy('score')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                  sortBy === 'score' ? 'bg-purple-600 border-purple-400 text-white' : 'border-purple-900/60 bg-slate-950 text-purple-300'
                }`}
              >
                Puntos
              </button>
              <button
                onClick={() => setSortBy('accuracy')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                  sortBy === 'accuracy' ? 'bg-purple-600 border-purple-400 text-white' : 'border-purple-900/60 bg-slate-950 text-purple-300'
                }`}
              >
                % Aciertos
              </button>
              <button
                onClick={() => setSortBy('date')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                  sortBy === 'date' ? 'bg-purple-600 border-purple-400 text-white' : 'border-purple-900/60 bg-slate-950 text-purple-300'
                }`}
              >
                Fecha
              </button>
            </div>
          </div>

          {/* Student Table */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-10 h-10 mx-auto text-purple-500/40 mb-2" />
              <p className="text-sm font-semibold">No se han encontrado alumnos registrados</p>
              <p className="text-xs text-purple-400/60 mt-1">Los alumnos que jueguen en sus móviles aparecerán aquí automáticamente en tiempo real.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-purple-900/50 text-purple-300/80 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Alumno</th>
                    <th className="py-3 px-3 text-right">Puntuación</th>
                    <th className="py-3 px-3 text-center">Aciertos</th>
                    <th className="py-3 px-3 text-center">Precisión</th>
                    <th className="py-3 px-3 text-center">Racha Máx</th>
                    <th className="py-3 px-3 text-right">Fecha</th>
                    <th className="py-3 px-3 text-center">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30">
                  {filteredStudents.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3 px-3 font-bold text-purple-400">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </td>
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        <span className="text-lg">{st.avatar}</span>
                        <span>{st.studentName}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-amber-300">
                        {st.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-300">
                        {st.correctCount}/{st.totalQuestions}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          st.accuracy >= 80 ? 'bg-emerald-500/20 text-emerald-300' : st.accuracy >= 60 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {st.accuracy}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-amber-400 font-bold">
                        🔥 {st.maxStreak}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                        {new Date(st.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setInspectStudent(st)}
                          className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-500/30 text-purple-200 text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RADIOGRAFÍA DE ERRORES (PREGUNTAS MÁS FALLADAS) */}
      {activeTab === 'errors' && (
        <div className="space-y-4">
          <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4 text-xs text-purple-200 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">Diagnóstico Pedagógico de Dudas en el Aula</p>
              <p className="text-purple-300/80 leading-relaxed">
                Esta sección ordena las 30 preguntas de mayor a menor tasa de fallos de los alumnos. Permite al profesorado detectar de inmediato conceptos críticos (como la diferencia entre victimización secundaria/terciaria o límites de contención) y repasarlos en común con la explicación legal.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {questionErrorStats.map((item, rank) => {
              const q = item.question;
              return (
                <div
                  key={q.id}
                  className="bg-slate-900/90 border border-purple-500/20 rounded-2xl p-4 sm:p-5 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-center">
                        #{q.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-purple-900 text-purple-300 text-[11px] font-medium">
                        {q.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {item.failedAttempts} fallos de {item.totalAttempts} respuestas
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                        item.failureRate >= 50
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : item.failureRate >= 25
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {item.failureRate}% Fallos
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-3">
                    {q.question}
                  </h3>

                  {/* Options breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    {(['a', 'b', 'c', 'd'] as const).map(k => {
                      const isCorrect = k === q.correctAnswer;
                      const count = item.choicesCount[k] || 0;
                      const pct = item.totalAttempts > 0 ? Math.round((count / item.totalAttempts) * 100) : 0;

                      return (
                        <div
                          key={k}
                          className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                              : count > 0
                              ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                              : 'bg-slate-950/50 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div>
                            <span className="font-bold uppercase mr-1">{k})</span>
                            <span>{q.options[k]}</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-purple-900 shrink-0">
                            {count} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Didactic Solution Card */}
                  <div className="p-3 bg-purple-950/50 border border-purple-500/20 rounded-xl text-xs text-purple-200/90 leading-relaxed">
                    <span className="font-bold text-purple-200 flex items-center gap-1 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Fundamentación Didáctica para la Clase:
                    </span>
                    {q.didacticExplanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CONEXIÓN CLOUD (SHEETDB / GOOGLE SHEETS) */}
      {activeTab === 'cloud' && (
        <div className="bg-slate-900/80 border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Base de Datos Ultra-Simple en la Nube</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Sincronización con Google Sheets (SheetDB)
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
              Como las docentes no necesitan conocimientos avanzados de programación, la aplicación guarda las respuestas en el servidor y puede enviar cada partida directamente a tu propia hoja de cálculo de Google.
            </p>
          </div>

          {/* Step by step guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            <div className="bg-slate-950/70 border border-purple-900/40 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-xl bg-purple-900/60 text-purple-300 font-bold flex items-center justify-center mb-2">
                1
              </div>
              <h4 className="font-bold text-white mb-1">Crea tu Google Sheet</h4>
              <p className="text-slate-400 leading-relaxed">
                Crea una hoja en blanco en Google Drive con las cabeceras: <br />
                <code className="text-[11px] text-purple-300 font-mono">ID, Nombre, Puntuacion, Aciertos, Precision, Fecha</code>
              </p>
            </div>

            <div className="bg-slate-950/70 border border-purple-900/40 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-xl bg-purple-900/60 text-purple-300 font-bold flex items-center justify-center mb-2">
                2
              </div>
              <h4 className="font-bold text-white mb-1">Obtén tu API en SheetDB</h4>
              <p className="text-slate-400 leading-relaxed">
                Entra gratis en <a href="https://sheetdb.io" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">sheetdb.io</a>, pega el link de tu hoja de cálculo y copia la URL generada.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-purple-900/40 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-xl bg-purple-900/60 text-purple-300 font-bold flex items-center justify-center mb-2">
                3
              </div>
              <h4 className="font-bold text-white mb-1">Pégala y Listo</h4>
              <p className="text-slate-400 leading-relaxed">
                Pega la URL abajo y haz clic en Guardar y Probar. Los datos de los móviles viajarán automáticamente a tu Google Drive.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveSheetDb} className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                URL de la API de SheetDB o Webhook
              </label>
              <input
                type="url"
                value={sheetUrlInput}
                onChange={(e) => setSheetUrlInput(e.target.value)}
                placeholder="https://sheetdb.io/api/v1/tu-identificador..."
                className="w-full px-4 py-3 bg-slate-900 border border-purple-500/30 rounded-xl text-white text-xs sm:text-sm font-mono placeholder-slate-600 outline-none focus:border-cyan-400 transition-all"
              />
              <p className="text-[11px] text-purple-400/60 mt-1.5">
                (Si se deja vacío, la app continuará usando la base de datos interna rápida del servidor).
              </p>
            </div>

            {sheetFeedback && (
              <div className={`p-3 rounded-xl text-xs font-medium ${
                sheetSaveStatus === 'success' ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' :
                sheetSaveStatus === 'error' ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200' :
                'bg-indigo-950/60 border border-indigo-500/40 text-indigo-200'
              }`}>
                {sheetFeedback}
              </div>
            )}

            <button
              type="submit"
              disabled={sheetSaveStatus === 'testing'}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <Cloud className="w-4 h-4" />
              <span>{sheetSaveStatus === 'testing' ? 'Comprobando conexión...' : 'Guardar y Probar Conexión'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: DESCARGAR & EXPORTAR */}
      {activeTab === 'export' && (
        <div className="bg-slate-900/80 border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Exportación de Datos y Modos de Entrega
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/80">
              Opciones de descarga directa para archivo docente, evaluaciones académicas o uso sin conexión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CSV Export Card */}
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  <span>Hoja de Cálculo CSV (Excel)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Descarga un archivo CSV con las calificaciones de todos los alumnos ({results.length} registros actuales), con desglose de puntos, precisión porcentual, aciertos y fecha exacta.
                </p>
              </div>

              <button
                onClick={() => exportResultsToCsv(results)}
                disabled={results.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Resultados (.CSV)</span>
              </button>
            </div>

            {/* Single Portable HTML Card */}
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm mb-2">
                  <FileCode2 className="w-5 h-5 text-purple-400" />
                  <span>Archivo Único Autocontenido (.HTML)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Tal como solicitaste en el pliego: genera un archivo HTML5 único con Tailwind vía CDN y las 30 preguntas integradas, que funciona haciendo doble clic en cualquier ordenador o móvil sin necesidad de servidor.
                </p>
              </div>

              <button
                onClick={downloadStandaloneHtmlFile}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Versión Autocontenida (.html)</span>
              </button>
            </div>
          </div>

          {/* Reset database section */}
          <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-rose-300">Zona de Mantenimiento</h4>
              <p className="text-[11px] text-slate-400">¿Quieres reiniciar el contador de la clase para un nuevo grupo de alumnos?</p>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar Datos de Clase</span>
            </button>
          </div>
        </div>
      )}

      {/* STUDENT EXAM INSPECTION MODAL */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-purple-950/90 to-slate-950 border border-purple-500/40 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <button
              onClick={() => setInspectStudent(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-950/80 text-purple-300 hover:text-white flex items-center justify-center border border-purple-500/20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 pr-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{inspectStudent.avatar}</span>
                <h3 className="text-lg font-black text-white">{inspectStudent.studentName}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/40">
                  {inspectStudent.score.toLocaleString()} pts
                </span>
              </div>
              <p className="text-xs text-purple-300/80">
                Aciertos: {inspectStudent.correctCount}/30 ({inspectStudent.accuracy}%) • Racha Máxima: {inspectStudent.maxStreak} • Fecha: {new Date(inspectStudent.date).toLocaleString('es-ES')}
              </p>
            </div>

            <div className="overflow-y-auto pr-2 space-y-3 flex-1 text-xs">
              {QUIZ_QUESTIONS.map(q => {
                const answer = inspectStudent.answers ? inspectStudent.answers[q.id] : null;
                const isCorrect = answer ? answer.correct : false;
                const selectedKey = answer ? answer.selected : '-';

                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-2xl border ${
                      isCorrect ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-rose-950/30 border-rose-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-bold text-white">#{q.id}. {q.question}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {isCorrect ? '✓ Acierto' : '✕ Fallo'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] mb-1.5">
                      <div className="text-slate-300">
                        Respuesta marcada: <span className="font-bold uppercase text-white">{selectedKey}) {q.options[selectedKey as 'a'|'b'|'c'|'d'] || 'No respondida'}</span>
                      </div>
                      <div className="text-emerald-300">
                        Opción correcta: <span className="font-bold uppercase">{q.correctAnswer}) {q.options[q.correctAnswer]}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/60 text-purple-200/90 text-[10px] leading-relaxed border border-purple-900/30">
                      <span className="font-bold text-purple-300">Didáctica: </span>
                      {q.didacticExplanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
