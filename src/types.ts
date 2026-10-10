export type ActiveTab =
  | 'dashboard'
  | 'quiz'
  | 'planner'
  | 'homework'
  | 'marks'
  | 'tutor'
  | 'flashcards'
  | 'notes'
  | 'settings';

export type SubscriptionTier = 'Free' | 'Pro' | 'Campus';

export interface StudentProfile {
  name: string;
  email: string;
  grade: string;
  school: string;
  streakDays: number;
  avatarUrl: string;
  weeklyTargetHours: number;
  tier: SubscriptionTier;
  workspaceName: string;
}

export interface Workspace {
  id: string;
  name: string;
  type: 'Personal' | 'Study Group' | 'Classroom';
  membersCount: number;
  isCurrent: boolean;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  priority: 'High' | 'Medium' | 'Low';
  estimatedMinutes: number;
  completed: boolean;
  notes?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "16:00"
  endTime: string;   // e.g. "17:30"
  subject: string;
  topic: string;
  roomOrType: 'Self Study' | 'Revision' | 'Problem Practice' | 'Online Lecture' | 'Lab Work';
  completed: boolean;
}

export interface TestMark {
  id: string;
  subject: string;
  testName: string;
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  category: 'Midterm' | 'Unit Test' | 'Quiz' | 'Final Exam' | 'Assignment';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
}

export interface QuizResult {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  questions: QuizQuestion[];
  userAnswers: number[]; // index of chosen answers
}

export interface TopicExplanation {
  topic: string;
  subject: string;
  style: string;
  summary: string;
  analogy: string;
  keyPoints: string[];
  example: string;
  takeaway: string;
}

export interface StudyDayStat {
  day: string;
  shortDay: string;
  hours: number;
  targetHours: number;
  subject: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint: string;
  mastered?: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  topic: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface NoteAnalysis {
  summary: string;
  keyTakeaways: string[];
  keyFormulasOrTerms: string[];
  examPitfalls: string[];
}

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  content: string;
  updatedAt: string;
  analysis?: NoteAnalysis;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'streak' | 'quiz' | 'system';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}
