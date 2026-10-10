import {
  StudentProfile,
  HomeworkItem,
  TimetableSlot,
  TestMark,
  QuizResult,
  FlashcardDeck,
  StudyNote,
  Workspace,
  AppNotification,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_HOMEWORK,
  INITIAL_TIMETABLE,
  INITIAL_TEST_MARKS,
  INITIAL_QUIZ_HISTORY,
  INITIAL_WORKSPACES,
  INITIAL_NOTIFICATIONS,
  INITIAL_FLASHCARD_DECKS,
  INITIAL_NOTES,
} from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'studybuddy_profile_v1',
  HOMEWORK: 'studybuddy_homework_v1',
  TIMETABLE: 'studybuddy_timetable_v1',
  TEST_MARKS: 'studybuddy_test_marks_v1',
  QUIZ_HISTORY: 'studybuddy_quiz_history_v1',
  WORKSPACES: 'studybuddy_workspaces_v1',
  NOTIFICATIONS: 'studybuddy_notifications_v1',
  FLASHCARDS: 'studybuddy_flashcards_v1',
  NOTES: 'studybuddy_notes_v1',
};

export const storage = {
  getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  },
  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getWorkspaces(): Workspace[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
      return data ? JSON.parse(data) : INITIAL_WORKSPACES;
    } catch {
      return INITIAL_WORKSPACES;
    }
  },
  saveWorkspaces(workspaces: Workspace[]): void {
    localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces));
  },

  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  saveNotifications(notifs: AppNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  getFlashcards(): FlashcardDeck[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      return data ? JSON.parse(data) : INITIAL_FLASHCARD_DECKS;
    } catch {
      return INITIAL_FLASHCARD_DECKS;
    }
  },
  saveFlashcards(decks: FlashcardDeck[]): void {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(decks));
  },

  getNotes(): StudyNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  },
  saveNotes(notes: StudyNote[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getHomework(): HomeworkItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HOMEWORK);
      return data ? JSON.parse(data) : INITIAL_HOMEWORK;
    } catch {
      return INITIAL_HOMEWORK;
    }
  },
  saveHomework(homework: HomeworkItem[]): void {
    localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(homework));
  },

  getTimetable(): TimetableSlot[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
      return data ? JSON.parse(data) : INITIAL_TIMETABLE;
    } catch {
      return INITIAL_TIMETABLE;
    }
  },
  saveTimetable(timetable: TimetableSlot[]): void {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  },

  getTestMarks(): TestMark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEST_MARKS);
      return data ? JSON.parse(data) : INITIAL_TEST_MARKS;
    } catch {
      return INITIAL_TEST_MARKS;
    }
  },
  saveTestMarks(marks: TestMark[]): void {
    localStorage.setItem(STORAGE_KEYS.TEST_MARKS, JSON.stringify(marks));
  },

  getQuizHistory(): QuizResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      return data ? JSON.parse(data) : INITIAL_QUIZ_HISTORY;
    } catch {
      return INITIAL_QUIZ_HISTORY;
    }
  },
  saveQuizHistory(history: QuizResult[]): void {
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
  },

  exportFullBackup(): string {
    const fullData = {
      profile: this.getProfile(),
      workspaces: this.getWorkspaces(),
      notifications: this.getNotifications(),
      flashcards: this.getFlashcards(),
      notes: this.getNotes(),
      homework: this.getHomework(),
      timetable: this.getTimetable(),
      testMarks: this.getTestMarks(),
      quizHistory: this.getQuizHistory(),
      exportedAt: new Date().toISOString(),
      appVersion: 'StudyBuddy-SaaS-2.0',
    };
    return JSON.stringify(fullData, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (parsed.workspaces) this.saveWorkspaces(parsed.workspaces);
      if (parsed.notifications) this.saveNotifications(parsed.notifications);
      if (parsed.flashcards) this.saveFlashcards(parsed.flashcards);
      if (parsed.notes) this.saveNotes(parsed.notes);
      if (parsed.homework) this.saveHomework(parsed.homework);
      if (parsed.timetable) this.saveTimetable(parsed.timetable);
      if (parsed.testMarks) this.saveTestMarks(parsed.testMarks);
      if (parsed.quizHistory) this.saveQuizHistory(parsed.quizHistory);
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  },

  resetAll(): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(INITIAL_WORKSPACES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(INITIAL_FLASHCARD_DECKS));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(INITIAL_HOMEWORK));
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(INITIAL_TIMETABLE));
    localStorage.setItem(STORAGE_KEYS.TEST_MARKS, JSON.stringify(INITIAL_TEST_MARKS));
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(INITIAL_QUIZ_HISTORY));
  },
};
