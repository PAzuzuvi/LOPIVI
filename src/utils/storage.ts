import { StudentResult, TeacherSettings } from '../types/quiz';

const LOCAL_STORAGE_KEY = 'lopivi_quiz_results_v1';
const SETTINGS_KEY = 'lopivi_quiz_settings_v1';

export async function submitQuizResult(result: StudentResult): Promise<{ success: boolean; syncedWithCloud: boolean }> {
  let syncedWithCloud = false;

  // 1. Always save in localStorage for instant resilience
  try {
    const existing = getLocalResults();
    const updated = [result, ...existing.filter(r => r.id !== result.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }

  // 2. Submit to server API
  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
    if (res.ok) {
      syncedWithCloud = true;
    }
  } catch (err) {
    console.warn('Backend server not reachable, cached in local store:', err);
  }

  // 3. Direct SheetDB / Google Sheets webhook if configured in client settings
  try {
    const settings = getLocalSettings();
    if (settings.sheetDbUrl && settings.sheetDbUrl.startsWith('http')) {
      fetch(settings.sheetDbUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            ID: result.id,
            Nombre: result.studentName,
            Puntuacion: result.score,
            Aciertos: `${result.correctCount}/${result.totalQuestions}`,
            Porcentaje: `${result.accuracy}%`,
            RachaMaxima: result.maxStreak,
            TiempoSegundos: result.timeTakenSec,
            Fecha: new Date(result.date).toLocaleString('es-ES'),
          }]
        })
      }).catch(e => console.warn('SheetDB direct sync notice:', e));
    }
  } catch (err) {}

  return { success: true, syncedWithCloud };
}

export function getLocalResults(): StudentResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function fetchAllResults(): Promise<StudentResult[]> {
  try {
    const res = await fetch('/api/results');
    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        // Merge with local results ensuring no duplicates
        const serverResults: StudentResult[] = data.results;
        const localResults = getLocalResults();
        const map = new Map<string, StudentResult>();
        serverResults.forEach(r => map.set(r.id, r));
        localResults.forEach(r => {
          if (!map.has(r.id)) map.set(r.id, r);
        });
        const combined = Array.from(map.values()).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return combined;
      }
    }
  } catch (e) {
    console.warn('Fetching from server failed, using local fallback:', e);
  }
  return getLocalResults();
}

export async function clearAllResults(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/results', {
      method: 'DELETE',
      headers: { 'x-teacher-password': password }
    });
    if (res.ok) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return true;
    }
  } catch (e) {}

  if (password === 'profe2026') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return true;
  }
  return false;
}

export function getLocalSettings(): TeacherSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    sheetDbUrl: '',
    schoolName: 'Instituto IES LOPIVI'
  };
}

export async function saveLocalSettings(settings: TeacherSettings, currentPassword = 'profe2026'): Promise<boolean> {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, currentPassword })
    });
    return true;
  } catch (e) {
    return true; // Still saved in localStorage
  }
}

export function exportResultsToCsv(results: StudentResult[]) {
  if (results.length === 0) return;
  const headers = ['ID', 'Nombre', 'Avatar', 'Puntuación', 'Aciertos', 'Total Preguntas', 'Precisión %', 'Racha Máxima', 'Tiempo (s)', 'Fecha y Hora'];
  const rows = results.map(r => [
    `"${r.id}"`,
    `"${r.studentName.replace(/"/g, '""')}"`,
    `"${r.avatar}"`,
    r.score,
    r.correctCount,
    r.totalQuestions,
    `${r.accuracy}%`,
    r.maxStreak,
    r.timeTakenSec,
    `"${new Date(r.date).toLocaleString('es-ES')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(row => row.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Resultados_LOPIVI_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
