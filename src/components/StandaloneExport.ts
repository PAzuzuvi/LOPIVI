import { QUIZ_QUESTIONS } from '../data/questions';

export function downloadStandaloneHtmlFile() {
  const jsonQuestions = JSON.stringify(QUIZ_QUESTIONS, null, 2);

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Quizizz LOPIVI - Violencia Sexual y Adolescente</title>
  <!-- Tailwind CSS vía CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-purple-500 selection:text-white">
  <!-- 
    =======================================================================
    APLICACIÓN AUTOCONTENIDA: QUIZIZZ LOPIVI & PREVENCIÓN VIOLENCIA SEXUAL
    =======================================================================
    Arquitectura de Almacenamiento:
    1. Persistencia Local: Los resultados de cada alumno se guardan en localStorage
       del navegador de forma instantánea y resistente.
    2. Conexión Cloud (SheetDB / Google Sheets): Si configuras tu URL de SheetDB en el
       Panel Docente, cada respuesta viaja automáticamente a tu hoja de cálculo de Google.
    Clave de acceso Docente por defecto: profe2026
  -->
  <div id="app" class="max-w-2xl mx-auto p-4 min-h-screen flex flex-col justify-center">
    <!-- El contenido interactivo se renderiza dinámicamente -->
  </div>

  <script>
    // BANCO COMPLETO DE 30 PREGUNTAS LOPIVI
    const QUESTIONS = ${jsonQuestions};

    // Estado de la app
    let state = {
      view: 'home', // 'home', 'register', 'quiz', 'finished', 'teacher'
      studentName: '',
      avatar: '🎓',
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      selectedAnswer: null,
      hasAnswered: false,
      answers: {},
      teacherPassword: 'profe2026',
      sheetDbUrl: localStorage.getItem('sheetdb_url') || ''
    };

    // Audio sintetizado nativo
    const playChime = (type) => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === 'correct') {
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
          osc.start(); osc.stop(ctx.currentTime + 0.25);
        } else if (type === 'wrong') {
          osc.frequency.setValueAtTime(180, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
          osc.start(); osc.stop(ctx.currentTime + 0.25);
        }
      } catch (e) {}
    };

    function render() {
      const app = document.getElementById('app');
      if (state.view === 'home') {
        app.innerHTML = \`
          <div class="text-center p-6 bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl backdrop-blur-xl">
            <div class="text-5xl mb-3">🛡️</div>
            <h1 class="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-100 to-blue-200">
              Quizizz LOPIVI
            </h1>
            <p class="text-xs sm:text-sm text-purple-300/80 mt-1 mb-6">
              Violencia Sexual y Adolescente • Gamificación Educativa
            </p>
            <div class="space-y-3">
              <button onclick="state.view = 'register'; render();" class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 font-bold text-white shadow-lg shadow-purple-600/30">
                🎮 Modo Alumno (Jugar)
              </button>
              <button onclick="promptTeacher();" class="w-full py-3.5 px-6 rounded-2xl bg-slate-950 border border-purple-500/30 text-purple-200 font-bold hover:bg-slate-900">
                🔒 Panel Docente (Estadísticas)
              </button>
            </div>
          </div>
        \`;
      } else if (state.view === 'register') {
        app.innerHTML = \`
          <div class="p-6 bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl">
            <h2 class="text-xl font-bold text-white mb-2">Registro de Alumno</h2>
            <input id="nameInput" type="text" placeholder="Tu nombre o alias..." class="w-full p-3.5 bg-slate-950 border border-purple-500/40 rounded-xl text-white mb-4 outline-none focus:border-purple-300" />
            <button onclick="startQuiz();" class="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">Comenzar Quiz ➜</button>
            <button onclick="state.view = 'home'; render();" class="w-full mt-2 text-xs text-purple-300 underline">← Volver</button>
          </div>
        \`;
      } else if (state.view === 'quiz') {
        const q = QUESTIONS[state.currentIndex];
        const hasAns = state.hasAnswered;
        app.innerHTML = \`
          <div class="p-5 bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl">
            <div class="flex justify-between items-center text-xs text-purple-300 mb-2">
              <span>\${state.avatar} \${state.studentName}</span>
              <span>Pregunta \${state.currentIndex + 1} de \${QUESTIONS.length}</span>
              <span class="font-bold text-amber-300">Puntos: \${state.score}</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-white mb-4">\${q.question}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              \${['a','b','c','d'].map(k => {
                let cls = "p-3 rounded-xl border text-left text-xs sm:text-sm ";
                if (hasAns) {
                  if (k === q.correctAnswer) cls += "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold";
                  else if (k === state.selectedAnswer) cls += "bg-rose-950 border-rose-500 text-rose-200";
                  else cls += "bg-slate-950/50 border-slate-900 text-slate-600 opacity-40";
                } else {
                  cls += "bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-500/30 hover:border-purple-300 cursor-pointer text-white";
                }
                return \`<button onclick="pickAnswer('\${k}')" \${hasAns ? 'disabled' : ''} class="\${cls}">\${k.toUpperCase()}) \${q.options[k]}</button>\`;
              }).join('')}
            </div>

            \${hasAns ? \`
              <div class="p-3.5 bg-purple-950/80 border border-purple-400/40 rounded-xl mb-3 text-xs leading-relaxed fade-in">
                <div class="font-bold text-purple-200 mb-1">💡 Explicación Didáctica:</div>
                <div class="text-purple-100">\${q.didacticExplanation}</div>
              </div>
              <button onclick="nextQuestion()" class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold">
                \${state.currentIndex < QUESTIONS.length - 1 ? 'Siguiente Pregunta ➜' : 'Ver Resultados Finales 🏆'}
              </button>
            \` : ''}
          </div>
        \`;
      } else if (state.view === 'finished') {
        const accuracy = Math.round((state.correctCount / QUESTIONS.length) * 100);
        app.innerHTML = \`
          <div class="text-center p-6 bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl">
            <div class="text-5xl mb-2">🏆</div>
            <h2 class="text-2xl font-black text-white">¡Desafío Completado!</h2>
            <p class="text-sm text-purple-300 mb-4">Excelente trabajo, \${state.studentName}</p>
            <div class="grid grid-cols-3 gap-2 mb-6">
              <div class="p-3 bg-slate-950 rounded-xl border border-purple-900"><div class="text-xs text-purple-400">Puntos</div><div class="text-lg font-bold text-amber-300">\${state.score}</div></div>
              <div class="p-3 bg-slate-950 rounded-xl border border-purple-900"><div class="text-xs text-purple-400">Aciertos</div><div class="text-lg font-bold text-emerald-300">\${state.correctCount}/\${QUESTIONS.length}</div></div>
              <div class="p-3 bg-slate-950 rounded-xl border border-purple-900"><div class="text-xs text-purple-400">Precisión</div><div class="text-lg font-bold text-purple-200">\${accuracy}%</div></div>
            </div>
            <button onclick="state.view = 'home'; render();" class="w-full py-3.5 rounded-xl bg-purple-600 text-white font-bold">Volver al Inicio</button>
          </div>
        \`;
      } else if (state.view === 'teacher') {
        const results = JSON.parse(localStorage.getItem('lopivi_quiz_results_v1') || '[]');
        app.innerHTML = \`
          <div class="p-5 bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-white">Panel Docente (Resultados)</h2>
              <button onclick="state.view = 'home'; render();" class="text-xs text-purple-300 underline">Salir</button>
            </div>
            <div class="text-xs text-purple-300 mb-3">Total alumnos registrados: <b>\${results.length}</b></div>
            <div class="max-h-60 overflow-y-auto space-y-2 mb-4">
              \${results.length === 0 ? '<p class="text-xs text-slate-500">Aún no hay alumnos que hayan finalizado.</p>' : results.map(r => \`
                <div class="p-2.5 bg-slate-950 rounded-xl border border-purple-900/40 text-xs flex justify-between items-center">
                  <div><b>\${r.studentName}</b> - \${r.score} pts</div>
                  <div class="text-emerald-400 font-bold">\${r.correctCount}/\${r.totalQuestions} (\${r.accuracy}%)</div>
                </div>
              \`).join('')}
            </div>
            <button onclick="localStorage.removeItem('lopivi_quiz_results_v1'); render();" class="w-full py-2 bg-rose-950 border border-rose-600 text-rose-200 rounded-xl text-xs">Borrar Datos</button>
          </div>
        \`;
      }
    }

    window.promptTeacher = () => {
      const pass = prompt('Introduce la contraseña docente:');
      if (pass === state.teacherPassword) {
        state.view = 'teacher';
        render();
      } else if (pass !== null) {
        alert('Contraseña incorrecta. Por defecto es: profe2026');
      }
    };

    window.startQuiz = () => {
      const name = document.getElementById('nameInput').value.trim();
      if (!name) return alert('Por favor, indica tu nombre');
      state.studentName = name;
      state.currentIndex = 0;
      state.score = 0;
      state.streak = 0;
      state.correctCount = 0;
      state.hasAnswered = false;
      state.selectedAnswer = null;
      state.view = 'quiz';
      render();
    };

    window.pickAnswer = (k) => {
      if (state.hasAnswered) return;
      state.selectedAnswer = k;
      state.hasAnswered = true;
      const q = QUESTIONS[state.currentIndex];
      const isCorrect = k === q.correctAnswer;
      if (isCorrect) {
        playChime('correct');
        if (window.confetti) confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
        state.streak += 1;
        state.correctCount += 1;
        state.score += 1000 * (state.streak >= 3 ? 1.5 : 1);
      } else {
        playChime('wrong');
        state.streak = 0;
      }
      state.answers[q.id] = { selected: k, correct: isCorrect };
      render();
    };

    window.nextQuestion = () => {
      if (state.currentIndex < QUESTIONS.length - 1) {
        state.currentIndex += 1;
        state.hasAnswered = false;
        state.selectedAnswer = null;
        render();
      } else {
        // Guardar resultado
        const results = JSON.parse(localStorage.getItem('lopivi_quiz_results_v1') || '[]');
        const newRecord = {
          id: 'res-' + Date.now(),
          studentName: state.studentName,
          score: state.score,
          correctCount: state.correctCount,
          totalQuestions: QUESTIONS.length,
          accuracy: Math.round((state.correctCount / QUESTIONS.length) * 100),
          date: new Date().toISOString()
        };
        results.unshift(newRecord);
        localStorage.setItem('lopivi_quiz_results_v1', JSON.stringify(results));

        if (state.sheetDbUrl) {
          fetch(state.sheetDbUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [newRecord] })
          }).catch(e => console.log('SheetDB push:', e));
        }

        state.view = 'finished';
        render();
      }
    };

    render();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Quizizz_LOPIVI_Portable.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
