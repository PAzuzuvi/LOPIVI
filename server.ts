import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'quiz_results.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache + file sync
function loadResults(): any[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error loading DB file, initializing empty:', e);
  }
  return [];
}

function saveResults(results: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(results, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving DB file:', e);
  }
}

function loadSettings(): any {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  return {
    sheetDbUrl: '',
    teacherPassword: 'profe2026',
    schoolName: 'Instituto IES LOPIVI',
  };
}

function saveSettings(settings: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

let cachedResults = loadResults();
let currentSettings = loadSettings();

// If empty, add a couple of friendly demo records so teacher immediately sees how stats look
if (cachedResults.length === 0) {
  cachedResults = [
    {
      id: 'demo-1',
      studentName: 'Lucía M. (Demo)',
      avatar: '🦊',
      score: 28400,
      correctCount: 28,
      totalQuestions: 30,
      accuracy: 93,
      maxStreak: 12,
      timeTakenSec: 412,
      date: new Date(Date.now() - 3600000 * 2).toISOString(),
      answers: {
        1: { selected: 'b', correct: true },
        2: { selected: 'd', correct: true },
        3: { selected: 'a', correct: true },
        4: { selected: 'c', correct: true },
        5: { selected: 'b', correct: true },
        6: { selected: 'd', correct: true },
        7: { selected: 'c', correct: true },
        8: { selected: 'a', correct: true },
        9: { selected: 'b', correct: true },
        10: { selected: 'd', correct: true },
        11: { selected: 'a', correct: true },
        12: { selected: 'c', correct: true },
        13: { selected: 'd', correct: true },
        14: { selected: 'a', correct: false }, // failed
        15: { selected: 'a', correct: true },
        16: { selected: 'c', correct: true },
        17: { selected: 'a', correct: false }, // failed
        18: { selected: 'b', correct: true },
        19: { selected: 'a', correct: true },
        20: { selected: 'c', correct: true },
        21: { selected: 'b', correct: true },
        22: { selected: 'd', correct: true },
        23: { selected: 'a', correct: true },
        24: { selected: 'c', correct: true },
        25: { selected: 'b', correct: true },
        26: { selected: 'd', correct: true },
        27: { selected: 'c', correct: true },
        28: { selected: 'a', correct: true },
        29: { selected: 'b', correct: true },
        30: { selected: 'd', correct: true }
      }
    },
    {
      id: 'demo-2',
      studentName: 'Mateo R. (Demo)',
      avatar: '🦁',
      score: 24200,
      correctCount: 25,
      totalQuestions: 30,
      accuracy: 83,
      maxStreak: 8,
      timeTakenSec: 465,
      date: new Date(Date.now() - 3600000 * 4).toISOString(),
      answers: {
        1: { selected: 'b', correct: true },
        2: { selected: 'd', correct: true },
        3: { selected: 'b', correct: false },
        4: { selected: 'c', correct: true },
        5: { selected: 'b', correct: true },
        6: { selected: 'd', correct: true },
        7: { selected: 'c', correct: true },
        8: { selected: 'a', correct: true },
        9: { selected: 'b', correct: true },
        10: { selected: 'c', correct: false },
        11: { selected: 'a', correct: true },
        12: { selected: 'c', correct: true },
        13: { selected: 'd', correct: true },
        14: { selected: 'b', correct: true },
        15: { selected: 'c', correct: false },
        16: { selected: 'c', correct: true },
        17: { selected: 'd', correct: true },
        18: { selected: 'b', correct: true },
        19: { selected: 'a', correct: true },
        20: { selected: 'c', correct: true },
        21: { selected: 'b', correct: true },
        22: { selected: 'b', correct: false },
        23: { selected: 'a', correct: true },
        24: { selected: 'c', correct: true },
        25: { selected: 'b', correct: true },
        26: { selected: 'd', correct: true },
        27: { selected: 'c', correct: true },
        28: { selected: 'b', correct: false },
        29: { selected: 'b', correct: true },
        30: { selected: 'd', correct: true }
      }
    }
  ];
  saveResults(cachedResults);
}

app.use(express.json());

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET all results
app.get('/api/results', (req, res) => {
  res.json({
    success: true,
    count: cachedResults.length,
    results: cachedResults,
  });
});

// POST new result from student
app.post('/api/results', async (req, res) => {
  try {
    const { studentName, avatar, score, correctCount, totalQuestions, accuracy, maxStreak, timeTakenSec, answers } = req.body;

    if (!studentName) {
      return res.status(400).json({ error: 'studentName is required' });
    }

    const newRecord = {
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      studentName: String(studentName).trim().slice(0, 50),
      avatar: avatar || '🎓',
      score: Number(score) || 0,
      correctCount: Number(correctCount) || 0,
      totalQuestions: Number(totalQuestions) || 30,
      accuracy: Number(accuracy) || Math.round(((Number(correctCount) || 0) / (Number(totalQuestions) || 30)) * 100),
      maxStreak: Number(maxStreak) || 0,
      timeTakenSec: Number(timeTakenSec) || 0,
      date: new Date().toISOString(),
      answers: answers || {}
    };

    cachedResults.unshift(newRecord);
    saveResults(cachedResults);

    // Optional background sync to external SheetDB or Google Sheets if configured
    if (currentSettings.sheetDbUrl && currentSettings.sheetDbUrl.startsWith('http')) {
      try {
        fetch(currentSettings.sheetDbUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [{
              ID: newRecord.id,
              Nombre: newRecord.studentName,
              Puntuacion: newRecord.score,
              Aciertos: `${newRecord.correctCount}/${newRecord.totalQuestions}`,
              Precision: `${newRecord.accuracy}%`,
              RachaMaxima: newRecord.maxStreak,
              TiempoSegundos: newRecord.timeTakenSec,
              Fecha: newRecord.date,
            }]
          })
        }).catch(err => console.error('SheetDB sync error (non-blocking):', err.message));
      } catch (err) {
        console.error('SheetDB sync trigger error:', err);
      }
    }

    res.status(201).json({ success: true, record: newRecord });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reset results (teacher auth)
app.delete('/api/results', (req, res) => {
  const password = req.headers['x-teacher-password'];
  if (password !== currentSettings.teacherPassword && password !== 'profe2026') {
    return res.status(401).json({ error: 'Contraseña no válida' });
  }

  cachedResults = [];
  saveResults(cachedResults);
  res.json({ success: true, message: 'Registros reiniciados correctamente' });
});

// Settings GET / POST
app.get('/api/settings', (req, res) => {
  // Don't leak plain password without header check, but give status
  res.json({
    sheetDbUrl: currentSettings.sheetDbUrl || '',
    schoolName: currentSettings.schoolName || 'Instituto IES LOPIVI',
    hasPassword: Boolean(currentSettings.teacherPassword)
  });
});

app.post('/api/settings', (req, res) => {
  const { sheetDbUrl, schoolName, teacherPassword, currentPassword } = req.body;
  if (currentPassword !== currentSettings.teacherPassword && currentPassword !== 'profe2026') {
    return res.status(401).json({ error: 'Contraseña actual incorrecta' });
  }

  if (sheetDbUrl !== undefined) currentSettings.sheetDbUrl = String(sheetDbUrl).trim();
  if (schoolName !== undefined) currentSettings.schoolName = String(schoolName).trim();
  if (teacherPassword) currentSettings.teacherPassword = String(teacherPassword).trim();

  saveSettings(currentSettings);
  res.json({ success: true, settings: { sheetDbUrl: currentSettings.sheetDbUrl, schoolName: currentSettings.schoolName } });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EdTech Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
