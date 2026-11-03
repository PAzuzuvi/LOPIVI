export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  didacticExplanation: string;
  category: string;
  icon?: string;
}

export interface StudentAnswerRecord {
  selected: 'a' | 'b' | 'c' | 'd';
  isCorrect: boolean;
  timeSpentSec: number;
}

export interface StudentResult {
  id: string;
  studentName: string;
  avatar: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  maxStreak: number;
  timeTakenSec: number;
  date: string;
  answers: Record<number, { selected: 'a' | 'b' | 'c' | 'd'; correct: boolean }>;
}

export interface TeacherSettings {
  sheetDbUrl: string;
  schoolName: string;
}
