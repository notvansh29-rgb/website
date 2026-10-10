import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { PomodoroModal } from './components/PomodoroModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { WorkspaceModal } from './components/WorkspaceModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { useAuth } from './context/AuthContext';
import { DashboardView } from './views/DashboardView';
import { QuizView } from './views/QuizView';
import { PlannerView } from './views/PlannerView';
import { HomeworkView } from './views/HomeworkView';
import { MarksView } from './views/MarksView';
import { TutorView } from './views/TutorView';
import { FlashcardsView } from './views/FlashcardsView';
import { NotesView } from './views/NotesView';
import { SettingsView } from './views/SettingsView';
import {
  ActiveTab,
  StudentProfile,
  HomeworkItem,
  TimetableSlot,
  TestMark,
  QuizResult,
  Workspace,
  AppNotification,
  FlashcardDeck,
  StudyNote,
  Flashcard,
  SubscriptionTier,
  ToastMessage,
} from './types';
import { storage } from './utils/storage';
import { triggerConfetti } from './utils/confetti';
import { checkAiStatus } from './services/aiService';

export default function App() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Core Persistent State
  const [profile, setProfile] = useState<StudentProfile>(() => storage.getProfile());

  // Synchronize profile with Firebase currentUser
  useEffect(() => {
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        name: currentUser.displayName || prev.name,
        email: currentUser.email || prev.email,
        avatarUrl: currentUser.photoURL || prev.avatarUrl,
      }));
    }
  }, [currentUser]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => storage.getWorkspaces());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storage.getNotifications());
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(() => storage.getFlashcards());
  const [notes, setNotes] = useState<StudyNote[]>(() => storage.getNotes());
  const [homework, setHomework] = useState<HomeworkItem[]>(() => storage.getHomework());
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => storage.getTimetable());
  const [testMarks, setTestMarks] = useState<TestMark[]>(() => storage.getTestMarks());
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => storage.getQuizHistory());

  // Toast Queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // AI Connection State
  const [aiMode, setAiMode] = useState<'live' | 'demo' | 'checking'>('checking');

  // Shared Quiz / Tutor transition state
  const [quizInitialSubject, setQuizInitialSubject] = useState('Mathematics');
  const [quizInitialTopic, setQuizInitialTopic] = useState('Quadratic Equations & Roots');
  const [tutorInitialTopic, setTutorInitialTopic] = useState('Photosynthesis');
  const [tutorInitialSubject, setTutorInitialSubject] = useState('Biology');

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Check Gemini status on mount (supports Full-Stack server & GitHub Pages static mode)
  useEffect(() => {
    checkAiStatus()
      .then((status) => {
        if (status.hasGemini) {
          setAiMode('live');
        } else {
          setAiMode('demo');
        }
      })
      .catch(() => {
        setAiMode('demo');
      });
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    storage.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    storage.saveWorkspaces(workspaces);
  }, [workspaces]);

  useEffect(() => {
    storage.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    storage.saveFlashcards(flashcardDecks);
  }, [flashcardDecks]);

  useEffect(() => {
    storage.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    storage.saveHomework(homework);
  }, [homework]);

  useEffect(() => {
    storage.saveTimetable(timetable);
  }, [timetable]);

  useEffect(() => {
    storage.saveTestMarks(testMarks);
  }, [testMarks]);

  useEffect(() => {
    storage.saveQuizHistory(quizHistory);
  }, [quizHistory]);

  // Homework actions
  const handleAddHomework = (item: Omit<HomeworkItem, 'id'>) => {
    const newItem: HomeworkItem = {
      ...item,
      id: `hw_${Date.now()}`,
    };
    setHomework((prev) => [newItem, ...prev]);
    showToast(`Added assignment: ${item.title}`, 'success');
  };

  const handleToggleHomework = (id: string) => {
    setHomework((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          if (nextState) showToast(`Completed "${item.title}"! 🎉`, 'success');
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  const handleDeleteHomework = (id: string) => {
    setHomework((prev) => prev.filter((item) => item.id !== id));
    showToast('Assignment deleted', 'info');
  };

  // Timetable actions
  const handleAddTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slot,
      id: `tt_${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newSlot]);
    showToast('New study session scheduled', 'success');
  };

  const handleUpdateTimetableSlot = (slot: TimetableSlot) => {
    setTimetable((prev) => prev.map((s) => (s.id === slot.id ? slot : s)));
    showToast('Study session updated', 'success');
  };

  const handleDeleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((s) => s.id !== id));
    showToast('Session removed', 'info');
  };

  const handleToggleTimetableComplete = (id: string) => {
    setTimetable((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, completed: !slot.completed } : slot))
    );
  };

  const handleGenerateAiSchedule = () => {
    const balancedSessions: TimetableSlot[] = [
      {
        id: `tt_bal_1`,
        day: 'Monday',
        startTime: '16:00',
        endTime: '17:30',
        subject: 'Mathematics',
        topic: 'Calculus Optimization Review',
        roomOrType: 'Problem Practice',
        completed: false,
      },
      {
        id: `tt_bal_2`,
        day: 'Tuesday',
        startTime: '16:30',
        endTime: '18:00',
        subject: 'Physics',
        topic: 'Newton’s Laws of Motion & Friction',
        roomOrType: 'Revision',
        completed: false,
      },
      {
        id: `tt_bal_3`,
        day: 'Wednesday',
        startTime: '16:00',
        endTime: '17:30',
        subject: 'Chemistry',
        topic: 'Periodic Bonding & Molecular Orbitals',
        roomOrType: 'Self Study',
        completed: false,
      },
      {
        id: `tt_bal_4`,
        day: 'Thursday',
        startTime: '17:00',
        endTime: '18:30',
        subject: 'Biology',
        topic: 'Photosynthesis Light Reactions',
        roomOrType: 'Revision',
        completed: false,
      },
      {
        id: `tt_bal_5`,
        day: 'Friday',
        startTime: '16:00',
        endTime: '17:30',
        subject: 'Computer Science',
        topic: 'Binary Search & Big-O Complexity',
        roomOrType: 'Lab Work',
        completed: false,
      },
      {
        id: `tt_bal_6`,
        day: 'Saturday',
        startTime: '10:00',
        endTime: '12:00',
        subject: 'Mathematics',
        topic: 'Past Exam Paper Sprint',
        roomOrType: 'Problem Practice',
        completed: false,
      },
      {
        id: `tt_bal_7`,
        day: 'Sunday',
        startTime: '14:00',
        endTime: '16:00',
        subject: 'History',
        topic: 'WWII Allied Strategy Synthesis',
        roomOrType: 'Revision',
        completed: false,
      },
    ];

    setTimetable(balancedSessions);
    triggerConfetti();
    showToast('AI Study Schedule generated and balanced!', 'success');
  };

  // Test marks actions
  const handleAddTestMark = (mark: Omit<TestMark, 'id' | 'percentage' | 'grade'>) => {
    const percentage =
      mark.maxScore > 0 ? Math.round((mark.score / mark.maxScore) * 100) : 0;

    let grade = 'C';
    if (percentage >= 95) grade = 'A+';
    else if (percentage >= 88) grade = 'A';
    else if (percentage >= 80) grade = 'B+';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';

    const newMark: TestMark = {
      ...mark,
      id: `mark_${Date.now()}`,
      percentage,
      grade,
    };
    setTestMarks((prev) => [newMark, ...prev]);
    showToast(`Logged score for ${mark.testName}: ${percentage}%`, 'success');
  };

  const handleDeleteTestMark = (id: string) => {
    setTestMarks((prev) => prev.filter((m) => m.id !== id));
    showToast('Test score deleted', 'info');
  };

  const handleLogMarkFromQuiz = (
    subject: string,
    topicName: string,
    score: number,
    maxScore: number
  ) => {
    handleAddTestMark({
      subject,
      testName: topicName,
      date: new Date().toISOString().split('T')[0],
      score,
      maxScore,
      category: 'Quiz',
    });
  };

  // Quiz actions
  const handleSaveQuizResult = (result: QuizResult) => {
    setQuizHistory((prev) => [result, ...prev]);
  };

  const handleQuickStartQuiz = (subject: string, topic: string) => {
    setQuizInitialSubject(subject);
    setQuizInitialTopic(topic);
    setActiveTab('quiz');
  };

  const handleNavigateToTutor = (topic: string, subject: string) => {
    setTutorInitialTopic(topic);
    setTutorInitialSubject(subject);
    setActiveTab('tutor');
  };

  // Flashcards actions
  const handleSaveDeck = (deck: FlashcardDeck) => {
    setFlashcardDecks((prev) => [deck, ...prev]);
    showToast(`Created flashcard deck: ${deck.title}`, 'success');
  };

  const handleDeleteDeck = (id: string) => {
    setFlashcardDecks((prev) => prev.filter((d) => d.id !== id));
    showToast('Flashcard deck deleted', 'info');
  };

  const handleUpdateDeckCards = (deckId: string, cards: Flashcard[]) => {
    setFlashcardDecks((prev) =>
      prev.map((d) => (d.id === deckId ? { ...d, cards } : d))
    );
  };

  // Notes actions
  const handleSaveNote = (note: StudyNote) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      if (exists) {
        return prev.map((n) => (n.id === note.id ? note : n));
      }
      return [note, ...prev];
    });
    showToast(`Saved note: ${note.title}`, 'success');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note deleted', 'info');
  };

  // Workspace actions
  const handleSelectWorkspace = (id: string) => {
    const ws = workspaces.find((w) => w.id === id);
    if (!ws) return;
    setWorkspaces((prev) => prev.map((w) => ({ ...w, isCurrent: w.id === id })));
    setProfile((prev) => ({ ...prev, workspaceName: ws.name }));
    showToast(`Switched workspace to "${ws.name}"`, 'info');
  };

  const handleCreateWorkspace = (name: string, type: Workspace['type']) => {
    const newWs: Workspace = {
      id: `ws_${Date.now()}`,
      name,
      type,
      membersCount: 1,
      isCurrent: true,
    };
    setWorkspaces((prev) => [newWs, ...prev.map((w) => ({ ...w, isCurrent: false }))]);
    setProfile((prev) => ({ ...prev, workspaceName: name }));
    showToast(`Created new workspace: "${name}"`, 'success');
    triggerConfetti();
  };

  // Subscription action
  const handleUpgradeTier = (tier: SubscriptionTier) => {
    setProfile((prev) => ({ ...prev, tier }));
    showToast(`Congratulations! Upgraded to StudyBuddy ${tier} Tier! 🚀`, 'success');
  };

  // Notifications actions
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast('Cleared all notifications', 'info');
  };

  // Reset Exhibition Demo Data
  const handleResetData = () => {
    const confirmed = window.confirm(
      'Reset all data back to the clean Exhibition Demo state with sample assignments, scores, and quizzes?'
    );
    if (!confirmed) return;

    storage.resetAll();
    setProfile(storage.getProfile());
    setWorkspaces(storage.getWorkspaces());
    setNotifications(storage.getNotifications());
    setFlashcardDecks(storage.getFlashcards());
    setNotes(storage.getNotes());
    setHomework(storage.getHomework());
    setTimetable(storage.getTimetable());
    setTestMarks(storage.getTestMarks());
    setQuizHistory(storage.getQuizHistory());
    setActiveTab('dashboard');
    triggerConfetti();
    showToast('Reset all study data to exhibition defaults', 'info');
  };

  const pendingHomeworkCount = homework.filter((h) => !h.completed).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-[#f0f7ff] text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingHomeworkCount={pendingHomeworkCount}
        profile={profile}
        isOpenMobile={isOpenMobileNav}
        setIsOpenMobile={setIsOpenMobileNav}
        aiMode={aiMode}
        onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        {/* Sticky Header */}
        <Header
          profile={profile}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenMobileNav={() => setIsOpenMobileNav(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenPomodoro={() => setIsPomodoroOpen(true)}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onResetData={handleResetData}
        />

        {/* Tab Views Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              homework={homework}
              timetable={timetable}
              testMarks={testMarks}
              quizHistory={quizHistory}
              setActiveTab={setActiveTab}
              onToggleHomework={handleToggleHomework}
              onToggleTimetable={handleToggleTimetableComplete}
              onOpenPomodoro={() => setIsPomodoroOpen(true)}
              onQuickStartQuiz={handleQuickStartQuiz}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              quizHistory={quizHistory}
              onSaveQuizResult={handleSaveQuizResult}
              onLogMarkFromQuiz={handleLogMarkFromQuiz}
              aiMode={aiMode}
              initialSubject={quizInitialSubject}
              initialTopic={quizInitialTopic}
              onNavigateToTutor={handleNavigateToTutor}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              decks={flashcardDecks}
              onSaveDeck={handleSaveDeck}
              onDeleteDeck={handleDeleteDeck}
              onUpdateDeckCards={handleUpdateDeckCards}
            />
          )}

          {activeTab === 'planner' && (
            <PlannerView
              timetable={timetable}
              onAddSlot={handleAddTimetableSlot}
              onUpdateSlot={handleUpdateTimetableSlot}
              onDeleteSlot={handleDeleteTimetableSlot}
              onToggleComplete={handleToggleTimetableComplete}
              onGenerateAiSchedule={handleGenerateAiSchedule}
            />
          )}

          {activeTab === 'homework' && (
            <HomeworkView
              homework={homework}
              onAddHomework={handleAddHomework}
              onToggleComplete={handleToggleHomework}
              onDeleteHomework={handleDeleteHomework}
            />
          )}

          {activeTab === 'marks' && (
            <MarksView
              testMarks={testMarks}
              onAddTestMark={handleAddTestMark}
              onDeleteTestMark={handleDeleteTestMark}
            />
          )}

          {activeTab === 'tutor' && (
            <TutorView
              onQuizFromTopic={handleQuickStartQuiz}
              aiMode={aiMode}
              initialTopic={tutorInitialTopic}
              initialSubject={tutorInitialSubject}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              notes={notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onTurnIntoQuiz={handleQuickStartQuiz}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={(updated) => setProfile(updated)}
              onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onResetAllData={handleResetData}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals & Flyouts */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        homework={homework}
        timetable={timetable}
        testMarks={testMarks}
        quizHistory={quizHistory}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      <PomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentTier={profile.tier}
        onUpgradeTier={handleUpgradeTier}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearAllNotifications}
      />

      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        workspaces={workspaces}
        onSelectWorkspace={handleSelectWorkspace}
        onCreateWorkspace={handleCreateWorkspace}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => showToast('Authenticated with Firebase! 🚀', 'success')}
      />

      {/* Global Toast Floating Notifications */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
