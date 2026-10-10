import {
  StudentProfile,
  HomeworkItem,
  TimetableSlot,
  TestMark,
  QuizResult,
  StudyDayStat,
  FlashcardDeck,
  StudyNote,
  Workspace,
  AppNotification,
} from '../types';

export const INITIAL_PROFILE: StudentProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@oakridgeschool.edu',
  grade: 'Grade 10 • Section A',
  school: 'Oakridge Science & Tech Academy',
  streakDays: 7,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  weeklyTargetHours: 25,
  tier: 'Pro',
  workspaceName: 'Alex’s Honors Workspace',
};

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Alex’s Honors Workspace',
    type: 'Personal',
    membersCount: 1,
    isCurrent: true,
  },
  {
    id: 'ws-2',
    name: 'Grade 10 STEM Study Circle',
    type: 'Study Group',
    membersCount: 4,
    isCurrent: false,
  },
  {
    id: 'ws-3',
    name: 'Oakridge Science Exhibition Team',
    type: 'Classroom',
    membersCount: 12,
    isCurrent: false,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Study Streak Record! 🔥',
    message: 'You have logged 7 consecutive days of active study sessions. Top 5% in your class!',
    timestamp: '10 mins ago',
    read: false,
    type: 'streak',
  },
  {
    id: 'notif-2',
    title: 'Assignment Due Tomorrow',
    message: 'Calculus: Quadratic Optimization Problems is due in less than 24 hours.',
    timestamp: '2 hours ago',
    read: false,
    type: 'assignment',
  },
  {
    id: 'notif-3',
    title: 'Quiz Recommendation',
    message: 'Your Physics dynamics quiz score was 84%. Practice Newton’s 2nd Law flashcards to level up.',
    timestamp: 'Yesterday',
    read: true,
    type: 'quiz',
  },
];

export const INITIAL_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    title: 'Physics: Classical Mechanics & Vectors',
    subject: 'Physics',
    topic: 'Newtonian Dynamics',
    createdAt: '2026-10-06T14:00:00Z',
    cards: [
      {
        id: 'c-1',
        front: 'Newton’s 2nd Law of Motion',
        back: 'Net Force = Mass × Acceleration (F = ma). Net force is directly proportional to acceleration and inversely proportional to mass.',
        hint: 'Unit of force: Newton (N = kg·m/s²)',
        mastered: true,
      },
      {
        id: 'c-2',
        front: 'Kinetic Energy Formula',
        back: 'KE = ½ · m · v². Notice that velocity is squared, so doubling speed quadruples kinetic energy.',
        hint: 'Derived from work done W = F · d',
        mastered: false,
      },
      {
        id: 'c-3',
        front: 'Gravitational Potential Energy (near surface)',
        back: 'PE = m · g · h, where g ≈ 9.8 m/s² on Earth, m is mass in kg, and h is vertical displacement.',
        hint: 'Reference level h=0 can be chosen arbitrarily.',
        mastered: true,
      },
      {
        id: 'c-4',
        front: 'Static vs Kinetic Friction',
        back: 'Static friction (f_s ≤ μ_s · N) opposes impending motion and is generally greater than kinetic friction (f_k = μ_k · N) during sliding.',
        hint: 'μ_s > μ_k for almost all everyday materials.',
        mastered: false,
      },
      {
        id: 'c-5',
        front: 'Conservation of Linear Momentum',
        back: 'In an isolated system with no external net forces, total initial momentum equals total final momentum (p_total = constant).',
        hint: 'p = m · v',
        mastered: false,
      },
      {
        id: 'c-6',
        front: 'Centripetal Acceleration',
        back: 'a_c = v² / r, directed strictly toward the center of circular curvature.',
        hint: 'Produces directional velocity change, not speed change.',
        mastered: true,
      },
    ],
  },
  {
    id: 'deck-2',
    title: 'Mathematics: Quadratic & Polynomial Roots',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    createdAt: '2026-10-07T11:20:00Z',
    cards: [
      {
        id: 'cm-1',
        front: 'Quadratic Formula',
        back: 'x = (-b ± √(b² - 4ac)) / (2a) for solving any equation in standard form ax² + bx + c = 0.',
        hint: 'Derived by completing the square.',
        mastered: true,
      },
      {
        id: 'cm-2',
        front: 'Discriminant Interpretation (Δ = b² - 4ac)',
        back: 'Δ > 0: 2 distinct real roots\nΔ = 0: 1 real repeated root\nΔ < 0: 2 complex conjugate roots',
        hint: 'The expression inside the square root.',
        mastered: true,
      },
      {
        id: 'cm-3',
        front: 'Vertex of Parabola (x-coordinate)',
        back: 'x_vertex = -b / (2a). It also defines the axis of symmetry.',
        hint: 'The midpoint between the two quadratic roots.',
        mastered: false,
      },
      {
        id: 'cm-4',
        front: 'Vieta’s Formulas for Quadratic (Roots r₁ & r₂)',
        back: 'Sum of roots: r₁ + r₂ = -b/a\nProduct of roots: r₁ · r₂ = c/a',
        hint: 'Allows factoring without computing radicals.',
        mastered: false,
      },
    ],
  },
  {
    id: 'deck-3',
    title: 'Biology: Cellular Respiration & Enzymes',
    subject: 'Biology',
    topic: 'Cellular Energetics',
    createdAt: '2026-10-08T09:15:00Z',
    cards: [
      {
        id: 'cb-1',
        front: 'Mitochondrial Cristae Purpose',
        back: 'Extensive inner membrane foldings that maximize surface area for Electron Transport Chain protein complexes and ATP synthase enzymes.',
        hint: 'Structure directly enables high ATP synthesis.',
        mastered: true,
      },
      {
        id: 'cb-2',
        front: 'Net ATP yield from Glycolysis',
        back: '2 net ATP molecules and 2 NADH per molecule of glucose, occurring anaerobically in the cytosol.',
        hint: '4 ATP produced minus 2 ATP invested.',
        mastered: true,
      },
      {
        id: 'cb-3',
        front: 'Role of Oxygen in Aerobic Respiration',
        back: 'Oxygen serves as the terminal electron acceptor at the end of the electron transport chain, forming H₂O.',
        hint: 'Without oxygen, electrons back up and ATP synthase halts.',
        mastered: false,
      },
    ],
  },
];

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: 'Calculus Optimization & Critical Points',
    subject: 'Mathematics',
    content: `Chapter 4 Lecture Notes:
- To find local extrema of a continuous function f(x):
  1. Compute first derivative f'(x).
  2. Set f'(x) = 0 and solve for critical values c, or find where f'(x) is undefined.
  3. Apply First Derivative Test (sign change of f') or Second Derivative Test (sign of f''(c)).
- Second Derivative Test:
  - If f''(c) > 0, the graph is concave up -> local minimum.
  - If f''(c) < 0, the graph is concave down -> local maximum.
  - If f''(c) = 0, the test is inconclusive.
- Real-world application: Maximizing box volume given a fixed sheet of cardboard, minimizing material cost for cylinder cans.`,
    updatedAt: '2026-10-08T15:30:00Z',
    analysis: {
      summary: 'Optimization leverages derivatives to determine maximum efficiency, revenue, or minimum resource cost.',
      keyTakeaways: [
        'Critical points occur where f\'(x) = 0 or f\'(x) does not exist.',
        'Always verify endpoint boundary values in closed-interval optimization.',
        'Use the Second Derivative Test: f\'\'(c) < 0 signifies a relative maximum.',
      ],
      keyFormulasOrTerms: [
        'f\'(x) = 0 (Stationary condition)',
        'f\'\'(x) > 0 (Concave up / Minimum)',
        'Domain constraints: x ∈ [a, b]',
      ],
      examPitfalls: [
        'Forgetting to test domain endpoints [a, b] for absolute global extrema.',
        'Assuming f\'(c) = 0 guarantees an extremum without checking for inflection points.',
      ],
    },
  },
  {
    id: 'note-2',
    title: 'Newtonian Dynamics & Free Body Diagrams',
    subject: 'Physics',
    content: `Physics Lab & Class Synthesis:
- Free Body Diagrams (FBD): Always isolate the object of interest. Do not include forces exerted BY the object on the surroundings.
- Inclined planes:
  - Weight force mg splits into:
    - Parallel component: mg · sin(θ) acting down the ramp.
    - Perpendicular component: mg · cos(θ) counterbalanced by normal force N.
  - Kinetic friction f_k = μ_k · N = μ_k · mg · cos(θ).
- Pulleys & Atwood Machines:
  - Total accelerating force / total mass of system = system acceleration.`,
    updatedAt: '2026-10-07T18:45:00Z',
    analysis: {
      summary: 'Accurate force resolution on tilted axes simplifies complex multi-body Newtonian mechanics.',
      keyTakeaways: [
        'Rotate the coordinate system so the x-axis aligns with the ramp direction.',
        'Normal force on an incline is N = mg · cos(θ), NOT simply mg.',
        'Action-reaction pairs act on two DIFFERENT objects and never cancel each other out on a single FBD.',
      ],
      keyFormulasOrTerms: [
        'F_parallel = mg · sin(θ)',
        'N = mg · cos(θ)',
        'f_k = μ_k · N',
      ],
      examPitfalls: [
        'Switching sine and cosine when resolving inclined gravity components.',
        'Drawing centrifugal force on an inertial frame diagram.',
      ],
    },
  },
];

export const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw-1',
    title: 'Calculus: Quadratic Optimization Problems',
    subject: 'Mathematics',
    topic: 'Quadratic Equations & Maxima',
    dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0], // Tomorrow
    priority: 'High',
    estimatedMinutes: 60,
    completed: false,
    notes: 'Solve exercises 4.2 to 4.7 from Chapter 4 textbook.',
  },
  {
    id: 'hw-2',
    title: 'Newtonian Dynamics Lab Report',
    subject: 'Physics',
    topic: 'Friction & Newton’s 2nd Law',
    dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0], // In 2 days
    priority: 'High',
    estimatedMinutes: 75,
    completed: false,
    notes: 'Include acceleration vs force scatter plot and error margin calculation.',
  },
  {
    id: 'hw-3',
    title: 'Cellular Respiration Diagram & Summary',
    subject: 'Biology',
    topic: 'Mitochondria & ATP Cycle',
    dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0], // In 3 days
    priority: 'Medium',
    estimatedMinutes: 45,
    completed: false,
    notes: 'Label outer membrane, cristae, and ATP synthase complexes.',
  },
  {
    id: 'hw-4',
    title: 'Stoichiometry & Chemical Equations Worksheet',
    subject: 'Chemistry',
    topic: 'Mole Concept & Reactions',
    dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
    priority: 'Medium',
    estimatedMinutes: 50,
    completed: true,
    notes: 'Completed in library study hall on Wednesday.',
  },
  {
    id: 'hw-5',
    title: 'WWII Allied Strategy Comparative Essay',
    subject: 'History',
    topic: 'European Theatre & Normandy',
    dueDate: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0],
    priority: 'Low',
    estimatedMinutes: 90,
    completed: false,
    notes: 'Draft 800 words comparing Operation Overlord logistics.',
  },
  {
    id: 'hw-6',
    title: 'Python Binary Search Implementation',
    subject: 'Computer Science',
    topic: 'Algorithms & Time Complexity',
    dueDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0], // Completed yesterday
    priority: 'Medium',
    estimatedMinutes: 40,
    completed: true,
    notes: 'Implemented recursive and iterative solutions with O(log n) analysis.',
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  {
    id: 'tt-1',
    day: 'Monday',
    startTime: '16:00',
    endTime: '17:30',
    subject: 'Mathematics',
    topic: 'Quadratic Curves & Parabola Graphing',
    roomOrType: 'Problem Practice',
    completed: true,
  },
  {
    id: 'tt-2',
    day: 'Monday',
    startTime: '17:45',
    endTime: '19:00',
    subject: 'Physics',
    topic: 'Kinematics Formulas & Free Fall',
    roomOrType: 'Revision',
    completed: true,
  },
  // Tuesday
  {
    id: 'tt-3',
    day: 'Tuesday',
    startTime: '16:30',
    endTime: '18:00',
    subject: 'Chemistry',
    topic: 'Ionic vs Covalent Bonding Models',
    roomOrType: 'Self Study',
    completed: true,
  },
  {
    id: 'tt-4',
    day: 'Tuesday',
    startTime: '18:30',
    endTime: '19:45',
    subject: 'Computer Science',
    topic: 'Recursion & Sorting Algorithms',
    roomOrType: 'Lab Work',
    completed: true,
  },
  // Wednesday
  {
    id: 'tt-5',
    day: 'Wednesday',
    startTime: '16:00',
    endTime: '17:30',
    subject: 'Biology',
    topic: 'Cell Division: Mitosis vs Meiosis',
    roomOrType: 'Revision',
    completed: true,
  },
  {
    id: 'tt-6',
    day: 'Wednesday',
    startTime: '18:00',
    endTime: '19:30',
    subject: 'Mathematics',
    topic: 'Trigonometric Identities & Sine Rule',
    roomOrType: 'Problem Practice',
    completed: true,
  },
  // Thursday
  {
    id: 'tt-7',
    day: 'Thursday',
    startTime: '16:15',
    endTime: '17:45',
    subject: 'Physics',
    topic: 'Newton’s Laws of Motion & Friction',
    roomOrType: 'Lab Work',
    completed: true,
  },
  {
    id: 'tt-8',
    day: 'Thursday',
    startTime: '18:00',
    endTime: '19:15',
    subject: 'History',
    topic: 'Industrial Revolution Social Impact',
    roomOrType: 'Self Study',
    completed: true,
  },
  // Friday (Today)
  {
    id: 'tt-9',
    day: 'Friday',
    startTime: '16:00',
    endTime: '17:30',
    subject: 'Mathematics',
    topic: 'Calculus Optimization Review',
    roomOrType: 'Problem Practice',
    completed: false,
  },
  {
    id: 'tt-10',
    day: 'Friday',
    startTime: '17:45',
    endTime: '19:00',
    subject: 'Physics',
    topic: 'Work, Energy & Conservation Principle',
    roomOrType: 'Revision',
    completed: false,
  },
  // Saturday
  {
    id: 'tt-11',
    day: 'Saturday',
    startTime: '10:00',
    endTime: '12:00',
    subject: 'Computer Science',
    topic: 'Data Structures: Stacks, Queues & Trees',
    roomOrType: 'Problem Practice',
    completed: false,
  },
  {
    id: 'tt-12',
    day: 'Saturday',
    startTime: '14:00',
    endTime: '16:00',
    subject: 'Chemistry',
    topic: 'Acid-Base Titration & pH Calculations',
    roomOrType: 'Revision',
    completed: false,
  },
  // Sunday
  {
    id: 'tt-13',
    day: 'Sunday',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'Biology',
    topic: 'Genetics, Punnett Squares & Pedigrees',
    roomOrType: 'Self Study',
    completed: false,
  },
];

export const INITIAL_TEST_MARKS: TestMark[] = [
  {
    id: 'mark-1',
    subject: 'Mathematics',
    testName: 'Midterm Calculus & Algebra Exam',
    date: '2026-09-28',
    score: 95,
    maxScore: 100,
    percentage: 95,
    grade: 'A+',
    category: 'Midterm',
  },
  {
    id: 'mark-2',
    subject: 'Computer Science',
    testName: 'Algorithms & Data Structures Practical',
    date: '2026-10-02',
    score: 48,
    maxScore: 50,
    percentage: 96,
    grade: 'A+',
    category: 'Unit Test',
  },
  {
    id: 'mark-3',
    subject: 'Biology',
    testName: 'Cellular Biology & Genetics Unit Test',
    date: '2026-09-22',
    score: 91,
    maxScore: 100,
    percentage: 91,
    grade: 'A',
    category: 'Unit Test',
  },
  {
    id: 'mark-4',
    subject: 'Physics',
    testName: 'Classical Mechanics & Vectors Quiz',
    date: '2026-10-05',
    score: 42,
    maxScore: 50,
    percentage: 84,
    grade: 'B+',
    category: 'Quiz',
  },
  {
    id: 'mark-5',
    subject: 'Chemistry',
    testName: 'Periodic Trends & Chemical Bonding',
    date: '2026-09-15',
    score: 83,
    maxScore: 100,
    percentage: 83,
    grade: 'B+',
    category: 'Midterm',
  },
  {
    id: 'mark-6',
    subject: 'History',
    testName: '20th Century Global Conflicts Assessment',
    date: '2026-09-10',
    score: 41,
    maxScore: 50,
    percentage: 82,
    grade: 'B',
    category: 'Quiz',
  },
];

export const INITIAL_QUIZ_HISTORY: QuizResult[] = [
  {
    id: 'qres-1',
    subject: 'Physics',
    topic: 'Newton’s Laws of Motion',
    difficulty: 'Medium',
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    completedAt: '2026-10-08T18:40:00Z',
    questions: [
      {
        id: 'q1',
        question: 'Which of Newton\'s laws states that every action has an equal and opposite reaction?',
        options: ['Third Law', 'First Law', 'Second Law', 'Law of Universal Gravitation'],
        correctAnswer: 0,
        explanation: 'Newton\'s Third Law states that every action force generates an equal and opposite reaction force.',
      },
      {
        id: 'q2',
        question: 'What is the SI unit of electric potential difference?',
        options: ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
        correctAnswer: 0,
        explanation: 'The Volt (V) represents electrical potential difference.',
      },
      {
        id: 'q3',
        question: 'If a car accelerates uniformly from rest to 20 m/s in 4 seconds, what is its acceleration?',
        options: ['5 m/s²', '80 m/s²', '2.5 m/s²', '10 m/s²'],
        correctAnswer: 0,
        explanation: 'Acceleration = (20 - 0) / 4 = 5 m/s².',
      },
      {
        id: 'q4',
        question: 'What phenomenon causes light to bend as it transitions from air into glass?',
        options: ['Refraction', 'Diffraction', 'Reflection', 'Dispersion'],
        correctAnswer: 0,
        explanation: 'Refraction occurs because light changes speed when entering a denser medium.',
      },
      {
        id: 'q5',
        question: 'What is the work done when a force of 15 N moves an object 4 meters in the direction of the force?',
        options: ['60 Joules', '19 Joules', '3.75 Joules', '240 Joules'],
        correctAnswer: 0,
        explanation: 'Work = Force × Distance = 15 N × 4 m = 60 Joules.',
      },
    ],
    userAnswers: [0, 0, 0, 0, 0],
  },
  {
    id: 'qres-2',
    subject: 'Mathematics',
    topic: 'Quadratic Equations & Roots',
    difficulty: 'Medium',
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    completedAt: '2026-10-07T16:15:00Z',
    questions: [
      {
        id: 'q1',
        question: 'What are the solutions to x² - 5x + 6 = 0?',
        options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = -1 and x = 5'],
        correctAnswer: 0,
        explanation: 'Factoring: (x - 2)(x - 3) = 0, so x = 2 and x = 3.',
      },
      {
        id: 'q2',
        question: 'What is the value of the discriminant for 2x² + 4x + 2 = 0?',
        options: ['0', '16', '8', '-4'],
        correctAnswer: 0,
        explanation: 'b² - 4ac = 16 - 4(2)(2) = 16 - 16 = 0.',
      },
      {
        id: 'q3',
        question: 'In a right-angled triangle with legs 6 and 8, what is the hypotenuse?',
        options: ['10', '14', '12', '9.5'],
        correctAnswer: 0,
        explanation: 'c = √(6² + 8²) = 10.',
      },
      {
        id: 'q4',
        question: 'What is the derivative of f(x) = 3x² + 5x - 7?',
        options: ['6x + 5', '3x + 5', '6x² + 5', '6x - 7'],
        correctAnswer: 0,
        explanation: 'By power rule, f\'(x) = 6x + 5.',
      },
      {
        id: 'q5',
        question: 'If log₁₀(x) = 3, what is x?',
        options: ['1000', '30', '100', '300'],
        correctAnswer: 0,
        explanation: '10³ = 1000.',
      },
    ],
    userAnswers: [0, 1, 0, 0, 0],
  },
];

export const WEEKLY_STUDY_STATS: StudyDayStat[] = [
  { day: 'Monday', shortDay: 'Mon', hours: 3.5, targetHours: 3.5, subject: 'Math & Physics' },
  { day: 'Tuesday', shortDay: 'Tue', hours: 4.0, targetHours: 3.5, subject: 'Chemistry & CS' },
  { day: 'Wednesday', shortDay: 'Wed', hours: 3.2, targetHours: 3.5, subject: 'Biology & Math' },
  { day: 'Thursday', shortDay: 'Thu', hours: 4.5, targetHours: 3.5, subject: 'Physics & History' },
  { day: 'Friday', shortDay: 'Fri', hours: 3.8, targetHours: 3.5, subject: 'Math Review' },
  { day: 'Saturday', shortDay: 'Sat', hours: 5.0, targetHours: 4.0, subject: 'CS & Chemistry' },
  { day: 'Sunday', shortDay: 'Sun', hours: 2.5, targetHours: 3.0, subject: 'Weekly Prep' },
];

export const PRESET_TOPICS = [
  { subject: 'Mathematics', topic: 'Quadratic Equations & Roots' },
  { subject: 'Mathematics', topic: 'Pythagorean Theorem & Geometry' },
  { subject: 'Physics', topic: 'Newton’s Laws of Motion' },
  { subject: 'Physics', topic: 'Kinematics & Acceleration' },
  { subject: 'Chemistry', topic: 'Periodic Table & Chemical Bonding' },
  { subject: 'Chemistry', topic: 'Acids, Bases and pH Scale' },
  { subject: 'Biology', topic: 'Cell Structure & Mitochondria' },
  { subject: 'Biology', topic: 'Photosynthesis & Light Reactions' },
  { subject: 'Computer Science', topic: 'Binary Search & Algorithms' },
  { subject: 'History', topic: 'World War II Allied Strategy' },
];
