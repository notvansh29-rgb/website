// AI Service supporting Full-Stack Express Server & 100% Static GitHub Pages Hosting
// Seamlessly uses Gemini 3.5 Flash on server or client-side, with rich curriculum fallbacks!

import { QuizQuestion as BaseQuizQuestion, NoteAnalysis as BaseNoteAnalysis } from '../types';

export type QuizQuestion = BaseQuizQuestion;
export type NoteAnalysis = BaseNoteAnalysis;

export interface ExplanationResult {
  topic: string;
  subject: string;
  style: string;
  summary: string;
  analogy: string;
  keyPoints: string[];
  example: string;
  takeaway: string;
}

export interface FlashcardItem {
  id?: string;
  front: string;
  back: string;
  hint: string;
  mastered?: boolean;
}

const STORAGE_KEY_GEMINI = 'studybuddy_client_gemini_key';

export function getClientGeminiKey(): string {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(STORAGE_KEY_GEMINI) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    ''
  );
}

export function setClientGeminiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key.trim()) {
    localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_GEMINI);
  }
}

export function isGitHubPagesHost(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname.includes('github.io') ||
    window.location.protocol === 'file:'
  );
}

// Built-in Curated Educational Engine for guaranteed static offline compatibility
const CURATED_QUIZZES: Record<string, Omit<QuizQuestion, 'id'>[]> = {
  Mathematics: [
    {
      question: 'In a right-angled triangle, if legs a = 6 and b = 8, what is the length of the hypotenuse c?',
      options: ['10', '14', '12', '9.5'],
      correctAnswer: 0,
      explanation: 'By the Pythagorean theorem: c² = 6² + 8² = 36 + 64 = 100, so c = √100 = 10.',
    },
    {
      question: 'What is the derivative of f(x) = 3x² + 5x - 7 with respect to x?',
      options: ['6x + 5', '3x + 5', '6x² + 5', '6x - 7'],
      correctAnswer: 0,
      explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(5x) = 5, and d/dx(-7) = 0. Thus, f'(x) = 6x + 5.",
    },
    {
      question: 'If log₁₀(x) = 3, what is the value of x?',
      options: ['1000', '30', '100', '300'],
      correctAnswer: 0,
      explanation: 'By logarithmic definition, log₁₀(x) = 3 implies x = 10³ = 1000.',
    },
    {
      question: 'What is the sum of interior angles in any hexagon (6-sided polygon)?',
      options: ['720°', '540°', '360°', '900°'],
      correctAnswer: 0,
      explanation: 'The formula for sum of interior angles is (n - 2) × 180°. For n = 6: (6 - 2) × 180° = 4 × 180° = 720°.',
    },
    {
      question: 'What is the solution to 2x + 7 = 19?',
      options: ['x = 6', 'x = 12', 'x = 5', 'x = 8'],
      correctAnswer: 0,
      explanation: 'Subtract 7 from both sides: 2x = 12. Divide by 2: x = 6.',
    },
  ],
  Physics: [
    {
      question: "Which of Newton's laws states that every action has an equal and opposite reaction?",
      options: ['Third Law', 'First Law', 'Second Law', 'Law of Universal Gravitation'],
      correctAnswer: 0,
      explanation: 'Newton’s Third Law states that every action force produces an equal and opposite reaction force.',
    },
    {
      question: 'What is the SI unit of electric potential difference (voltage)?',
      options: ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
      correctAnswer: 0,
      explanation: 'The Volt (V) is the SI unit of electrical potential difference.',
    },
    {
      question: 'If a car accelerates uniformly from rest to 20 m/s in 4 seconds, what is its acceleration?',
      options: ['5 m/s²', '80 m/s²', '2.5 m/s²', '10 m/s²'],
      correctAnswer: 0,
      explanation: 'Acceleration a = (v - u) / t = (20 - 0) / 4 = 5 m/s².',
    },
    {
      question: 'What phenomenon causes light to bend as it transitions from air into glass?',
      options: ['Refraction', 'Diffraction', 'Reflection', 'Dispersion'],
      correctAnswer: 0,
      explanation: 'Refraction is the change in direction of a wave due to change in medium transmission velocity.',
    },
    {
      question: 'What is the work done when a force of 15 N moves an object 4 meters in the direction of the force?',
      options: ['60 Joules', '19 Joules', '3.75 Joules', '240 Joules'],
      correctAnswer: 0,
      explanation: 'Work = Force × Displacement = 15 N × 4 m = 60 Joules (J).',
    },
  ],
  Chemistry: [
    {
      question: 'What is the pH value of pure distilled water at 25°C?',
      options: ['7.0 (Neutral)', '0.0 (Strong Acid)', '14.0 (Strong Base)', '5.5 (Slightly Acidic)'],
      correctAnswer: 0,
      explanation: 'Pure water has equal concentrations of H⁺ and OH⁻ ions at 25°C, yielding pH 7.0.',
    },
    {
      question: 'Which subatomic particle has a negative electrical charge?',
      options: ['Electron', 'Proton', 'Neutron', 'Positron'],
      correctAnswer: 0,
      explanation: 'Electrons carry a -1 elementary charge and orbit the nucleus.',
    },
    {
      question: 'What type of chemical bond involves the sharing of electron pairs between atoms?',
      options: ['Covalent bond', 'Ionic bond', 'Hydrogen bond', 'Metallic bond'],
      correctAnswer: 0,
      explanation: 'A covalent bond forms when two nonmetal atoms share pairs of valence electrons.',
    },
    {
      question: "Which gas is the most abundant in Earth's atmosphere?",
      options: ['Nitrogen (~78%)', 'Oxygen (~21%)', 'Carbon Dioxide (~0.04%)', 'Argon (~0.93%)'],
      correctAnswer: 0,
      explanation: 'Nitrogen gas (N₂) constitutes approximately 78% of dry atmosphere.',
    },
    {
      question: 'What is the chemical formula for table salt?',
      options: ['NaCl', 'KCl', 'CaCl₂', 'NaHCO₃'],
      correctAnswer: 0,
      explanation: 'Common table salt is Sodium Chloride (NaCl).',
    },
  ],
  Biology: [
    {
      question: 'Which organelle is universally known as the powerhouse of the eukaryotic cell?',
      options: ['Mitochondria', 'Ribosome', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
      correctAnswer: 0,
      explanation: 'Mitochondria generate the majority of cellular ATP via cellular respiration.',
    },
    {
      question: 'In genetics, what are different versions of the same gene called?',
      options: ['Alleles', 'Chromosomes', 'Nucleotides', 'Codons'],
      correctAnswer: 0,
      explanation: 'Alleles are variant forms of a specific gene situated at the same locus.',
    },
    {
      question: 'What is the green pigment responsible for absorbing sunlight during photosynthesis?',
      options: ['Chlorophyll', 'Carotenoid', 'Hemoglobin', 'Anthocyanin'],
      correctAnswer: 0,
      explanation: 'Chlorophyll in chloroplasts absorbs solar photons.',
    },
    {
      question: 'Which blood vessels carry oxygenated blood away from the heart to the rest of the body?',
      options: ['Arteries', 'Veins', 'Capillaries', 'Venules'],
      correctAnswer: 0,
      explanation: 'Arteries transport oxygenated blood under arterial pressure away from the heart.',
    },
    {
      question: 'What is the process of cell division that results in four genetically distinct daughter cells with half the chromosomes?',
      options: ['Meiosis', 'Mitosis', 'Binary Fission', 'Budding'],
      correctAnswer: 0,
      explanation: 'Meiosis produces haploid gametes with genetic recombination.',
    },
  ],
  'Computer Science': [
    {
      question: 'What is the time complexity of binary search on a sorted array of size n?',
      options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'],
      correctAnswer: 0,
      explanation: 'Binary search halves the search space each step, giving O(log n) efficiency.',
    },
    {
      question: 'Which data structure operates on a Last-In, First-Out (LIFO) principle?',
      options: ['Stack', 'Queue', 'Array', 'Linked List'],
      correctAnswer: 0,
      explanation: 'A Stack follows LIFO: the newest element pushed is the first popped.',
    },
    {
      question: 'In Python, which keyword is used to define a function?',
      options: ['def', 'func', 'function', 'lambda'],
      correctAnswer: 0,
      explanation: 'The `def` keyword introduces a function header in Python.',
    },
    {
      question: 'What does "HTTP" stand for in web technology?',
      options: ['HyperText Transfer Protocol', 'High Technology Transfer Process', 'Hyperlink Text Transmission Protocol', 'Home Tool Transfer Program'],
      correctAnswer: 0,
      explanation: 'HTTP stands for HyperText Transfer Protocol.',
    },
    {
      question: 'Which boolean operation yields TRUE only when both inputs are TRUE?',
      options: ['AND', 'OR', 'XOR', 'NOT'],
      correctAnswer: 0,
      explanation: 'The logical AND operation produces true if and only if all inputs are true.',
    },
  ],
  History: [
    {
      question: 'In which year did the Second World War end?',
      options: ['1945', '1939', '1918', '1941'],
      correctAnswer: 0,
      explanation: 'World War II concluded in 1945 with Allied victory.',
    },
    {
      question: 'The Industrial Revolution initially began in which European country during the 18th century?',
      options: ['Great Britain', 'France', 'Germany', 'Italy'],
      correctAnswer: 0,
      explanation: 'Great Britain was the birthplace of the industrial era due to coal and mechanization.',
    },
    {
      question: 'Which ancient civilization built the monumental pyramids of Giza?',
      options: ['Ancient Egypt', 'Mesopotamia', 'Ancient Greece', 'Mayan Empire'],
      correctAnswer: 0,
      explanation: 'The Pyramids of Giza were built during Egypt’s Old Kingdom.',
    },
    {
      question: 'Who delivered the famous "I Have a Dream" speech during the 1963 March on Washington?',
      options: ['Martin Luther King Jr.', 'Malcolm X', 'John F. Kennedy', 'Rosa Parks'],
      correctAnswer: 0,
      explanation: 'Dr. Martin Luther King Jr. delivered the historic civil rights address.',
    },
    {
      question: 'Which document signed in 1215 limited the absolute power of the English monarchy?',
      options: ['Magna Carta', 'Bill of Rights', 'Treaty of Versailles', 'Declaration of Arbroath'],
      correctAnswer: 0,
      explanation: 'King John granted the Magna Carta at Runnymede in 1215.',
    },
  ],
};

const CURATED_EXPLANATIONS: Record<string, Omit<ExplanationResult, 'topic' | 'subject' | 'style'>> = {
  photosynthesis: {
    summary: 'Photosynthesis is the biological process where plants transform sunlight, water, and carbon dioxide into glucose and oxygen.',
    analogy: 'Imagine a solar kitchen inside leaves! Sunlight is the clean power, CO₂ and soil water are the pantry ingredients, and the chef creates glucose sugar while venting fresh oxygen for us to breathe.',
    keyPoints: [
      'Chemical equation: 6CO₂ + 6H₂O + Solar Energy → C₆H₁₂O₆ + 6O₂',
      'Occurs inside chloroplasts containing green chlorophyll pigment',
      'Two phases: Light-dependent reactions (thylakoids) and the Calvin Cycle (stroma)',
      'Foundation of Earth’s biological food chain and atmospheric oxygen',
    ],
    example: 'A sunflower absorbs morning sunlight, turning radiant light into cellular chemical energy to grow taller.',
    takeaway: 'Solar energy converts into chemical bonds that feed almost all life on Earth.',
  },
  "newton's laws": {
    summary: 'Sir Isaac Newton formulated three fundamental laws of motion governing how physical masses move and interact with forces.',
    analogy: 'A skateboard remains stopped until kicked (1st Law: Inertia). Kicking harder accelerates it faster (2nd Law: F = ma). Pushing backward against asphalt propels you forward (3rd Law: Action & Reaction).',
    keyPoints: [
      '1st Law (Inertia): An object remains in uniform velocity unless acted upon by a net external force.',
      '2nd Law: Net Force = mass × acceleration (F = ma).',
      '3rd Law: For every action, there is an equal and opposite reaction force.',
      'Underpins classical mechanics, satellite orbits, and automotive safety engineering.',
    ],
    example: 'Rocket nozzles blast burning exhaust gas downward, pushing the spacecraft skyward into orbit.',
    takeaway: 'Motion changes exclusively when unbalanced external net forces act upon matter.',
  },
  'pythagorean theorem': {
    summary: 'The Pythagorean Theorem states that in any right-angled triangle, the hypotenuse squared equals the sum of squares of the other two sides: a² + b² = c².',
    analogy: 'If you tiled square patios along all three sides of a right triangle, the tiles from the two smaller patios combined would perfectly tile the giant hypotenuse patio.',
    keyPoints: [
      'Mathematical equation: a² + b² = c² (c is the longest side opposite 90°)',
      'Only valid for right-angled triangles',
      'Famous Pythagorean triples: 3-4-5, 5-12-13, 8-15-17',
      'Essential for GPS mapping, architecture, physics vectors, and 3D graphics rendering',
    ],
    example: 'A ladder placed 6 feet from a wall reaching 8 feet high must be √(36 + 64) = 10 feet long.',
    takeaway: 'Bridges algebraic coordinate distances directly with geometric shapes.',
  },
  'machine learning': {
    summary: 'Machine Learning (ML) is an AI discipline where computer algorithms discover patterns directly from data to make predictions without hardcoded rules.',
    analogy: 'Rather than writing a million rules describing every cat, you show a neural network thousands of animal photos until it tunes its internal math to recognize cats reliably.',
    keyPoints: [
      'Supervised Learning: Trained on labeled input-output examples',
      'Unsupervised Learning: Uncovers hidden structures without labels',
      'Reinforcement Learning: Learns through rewards and trial-and-error actions',
      'Powers modern language models, computer vision, robotics, and medical scans',
    ],
    example: 'Music streaming apps analyze songs you repeat to recommend customized weekly playlists you love.',
    takeaway: 'Traditional code executes fixed rules; machine learning builds the rules by finding data patterns.',
  },
};

// Client-side direct call to Gemini 3.5 Flash via REST API (works on static GitHub Pages!)
async function callClientGemini(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini API error (${res.status}): ${errText || res.statusText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned empty response.');
  }
  return text;
}

// 1. Check Service Status
export async function checkAiStatus(): Promise<{
  ok: boolean;
  hasGemini: boolean;
  model: string;
  mode: 'server' | 'client-gemini' | 'static-curated';
  isStaticHost: boolean;
}> {
  // If we have a client key, test or declare client-gemini capability
  const clientKey = getClientGeminiKey();

  try {
    const res = await fetch('/api/status', { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok) {
        return {
          ok: true,
          hasGemini: Boolean(data.hasGemini || clientKey),
          model: 'gemini-3.5-flash',
          mode: data.hasGemini ? 'server' : clientKey ? 'client-gemini' : 'static-curated',
          isStaticHost: false,
        };
      }
    }
  } catch {
    // Backend server is not running (e.g. GitHub Pages static hosting!)
  }

  return {
    ok: true,
    hasGemini: Boolean(clientKey),
    model: 'gemini-3.5-flash',
    mode: clientKey ? 'client-gemini' : 'static-curated',
    isStaticHost: true,
  };
}

function formatQuizQuestions(questions: any[]): QuizQuestion[] {
  return questions.map((q, idx) => ({
    id: q.id || `q_${Date.now()}_${idx}`,
    question: q.question || '',
    options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
    explanation: q.explanation || '',
  }));
}

// 2. Generate Quiz
export async function generateQuizService(
  subject: string,
  topic: string,
  difficulty: string
): Promise<{ ok: boolean; questions: QuizQuestion[]; source: string }> {
  // Try server first
  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic, difficulty }),
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.questions && data.questions.length > 0) {
        return { ok: true, questions: formatQuizQuestions(data.questions), source: 'server' };
      }
    }
  } catch {
    // Server not available, fallback to client / static
  }

  // Check for client Gemini key
  const clientKey = getClientGeminiKey();
  if (clientKey) {
    try {
      const prompt = `You are a high school & university teacher. Generate a 5-question multiple choice quiz for Subject: "${subject}", Topic: "${topic}", Difficulty: "${difficulty}".
Output strictly valid JSON with this exact schema:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Clear explanation of why this answer is correct."
  }
]
Do not include markdown backticks around the json if possible, or use standard \`\`\`json.`;

      const responseText = await callClientGemini(prompt, clientKey);
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { ok: true, questions: formatQuizQuestions(parsed), source: 'client-gemini' };
      }
    } catch (err) {
      console.warn('Client Gemini quiz generation failed, using curated fallback:', err);
    }
  }

  // Curated Fallback
  const list = CURATED_QUIZZES[subject] || CURATED_QUIZZES['Mathematics'];
  // Customize topic into questions if different
  const customized = list.map((q, idx) => ({
    ...q,
    question: idx === 0 && topic ? `[${topic}] ${q.question}` : q.question,
  }));

  return { ok: true, questions: formatQuizQuestions(customized), source: 'static-curated' };
}

// 3. Explain Topic
export async function explainTopicService(
  topic: string,
  subject: string,
  style: string,
  grade: string
): Promise<{ ok: boolean; explanation: ExplanationResult; source: string }> {
  // Try server first
  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, subject, style, grade }),
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.explanation) {
        return {
          ok: true,
          explanation: {
            topic: data.topic || topic,
            subject: data.subject || subject,
            style: data.style || style,
            ...data.explanation,
          },
          source: 'server',
        };
      }
    }
  } catch {
    // Server not available
  }

  // Client Gemini key
  const clientKey = getClientGeminiKey();
  if (clientKey) {
    try {
      const prompt = `You are StudyBuddy AI, an encouraging academic tutor. Explain "${topic}" in ${subject} for Grade Level "${grade}" in the teaching style "${style}".
Output strictly valid JSON with this schema:
{
  "summary": "2-3 sentence clear summary",
  "analogy": "Memorable real-world analogy",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
  "example": "Practical worked example",
  "takeaway": "Single sentence takeaway to memorize for exams"
}`;

      const text = await callClientGemini(prompt, clientKey);
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        ok: true,
        explanation: {
          topic,
          subject,
          style,
          ...parsed,
        },
        source: 'client-gemini',
      };
    } catch (err) {
      console.warn('Client Gemini explanation failed, using curated fallback:', err);
    }
  }

  // Curated Fallback
  const key = topic.toLowerCase().trim();
  const match = Object.keys(CURATED_EXPLANATIONS).find((k) => key.includes(k) || k.includes(key));
  const base = match
    ? CURATED_EXPLANATIONS[match]
    : {
        summary: `${topic} is a core principle in ${subject}. It provides the theoretical framework for analyzing how forces, systems, and patterns operate in harmony.`,
        analogy: `Think of ${topic} like an orchestra conductor coordinating instruments: each variable must be tuned in balance for the entire system to produce music.`,
        keyPoints: [
          `Fundamental equation & core definitions of ${topic}`,
          `Practical applications in modern science and industry`,
          `Common exam pitfalls and typical mistakes to avoid`,
          `How it links to broader ${subject} curriculum themes`,
        ],
        example: `When examining ${topic} under test conditions, identify the known variables first, isolate the core formula, and double check units.`,
        takeaway: `Mastering ${topic} unlocks fundamental problem-solving confidence across ${subject}.`,
      };

  return {
    ok: true,
    explanation: {
      topic,
      subject,
      style,
      ...base,
    },
    source: 'static-curated',
  };
}

// 4. Generate Flashcards
export async function generateFlashcardsService(
  subject: string,
  topic: string,
  count: number = 6
): Promise<{ ok: boolean; deckTitle: string; cards: FlashcardItem[]; source: string }> {
  // Try server first
  try {
    const res = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic, count }),
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.cards) {
        return {
          ok: true,
          deckTitle: data.deckTitle || `${subject}: ${topic}`,
          cards: data.cards,
          source: 'server',
        };
      }
    }
  } catch {
    // Server not available
  }

  // Client Gemini key
  const clientKey = getClientGeminiKey();
  if (clientKey) {
    try {
      const prompt = `Create ${count} high-retention spaced repetition flashcards for Subject: "${subject}", Topic: "${topic}".
Output strictly valid JSON with this schema:
{
  "deckTitle": "${subject}: ${topic}",
  "cards": [
    {
      "front": "Prompt or Question",
      "back": "Clear concise answer",
      "hint": "Optional memory trigger"
    }
  ]
}`;
      const text = await callClientGemini(prompt, clientKey);
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.cards && Array.isArray(parsed.cards)) {
        return {
          ok: true,
          deckTitle: parsed.deckTitle || `${subject}: ${topic}`,
          cards: parsed.cards,
          source: 'client-gemini',
        };
      }
    } catch (err) {
      console.warn('Client Gemini flashcard generation failed, using curated fallback:', err);
    }
  }

  // Curated Fallback Cards
  const cards: FlashcardItem[] = [
    {
      front: `What is the core definition of ${topic}?`,
      back: `The fundamental principle in ${subject} governing relationships between key variables and system behavior.`,
      hint: `Recall the foundational chapter theorem in ${subject}.`,
    },
    {
      front: `What is the standard formula / rule associated with ${topic}?`,
      back: `Identify primary inputs, isolate the target unknown, and ensure SI unit consistency.`,
      hint: 'Check units and dimensional consistency.',
    },
    {
      front: `What is the most common test mistake students make with ${topic}?`,
      back: 'Confusing sign conventions, rushing through unit conversions, or skipping boundary conditions.',
      hint: 'Pay attention to signs (+ / -).',
    },
    {
      front: `Give a real-world technological application of ${topic}.`,
      back: `Used by engineers and scientists to optimize performance, predict outcomes, and design resilient systems.`,
      hint: 'Think modern technology and everyday life.',
    },
    {
      front: `How does ${topic} connect to adjacent concepts in ${subject}?`,
      back: 'It acts as a building block for advanced derivations and multi-step exam problems.',
      hint: 'Recall the overarching syllabus map.',
    },
    {
      front: `Quick memory anchor for ${topic}:`,
      back: 'Break problem into 3 steps: 1. State knowns, 2. Select equation, 3. Validate answer plausibility.',
      hint: 'Active recall summary.',
    },
  ];

  return {
    ok: true,
    deckTitle: `${subject}: ${topic}`,
    cards,
    source: 'static-curated',
  };
}

function formatNoteAnalysis(data: any, title: string, subject: string): NoteAnalysis {
  const takeaways: string[] = Array.isArray(data?.keyTakeaways) ? data.keyTakeaways : [];
  const formulas: string[] = Array.isArray(data?.keyFormulasOrTerms)
    ? data.keyFormulasOrTerms
    : Array.isArray(data?.formulasOrDefinitions)
    ? data.formulasOrDefinitions
    : [
        `Key Principle: ${title} establishes foundational rules in ${subject}.`,
        `Core Terminology: High-yield definitions to review for examinations.`,
      ];
  const pitfalls: string[] = Array.isArray(data?.examPitfalls)
    ? data.examPitfalls
    : ['Skipping boundary conditions or mixing up units under test pressure.'];
  const summary: string =
    typeof data?.summary === 'string' && data.summary.trim()
      ? data.summary
      : takeaways.length > 0
      ? takeaways[0]
      : `High-yield revision points and active recall definitions for ${title} in ${subject}.`;

  return {
    summary,
    keyTakeaways: takeaways.length > 0 ? takeaways : [`Key study concept for ${title} in ${subject}.`],
    keyFormulasOrTerms: formulas,
    examPitfalls: pitfalls,
  };
}

// 5. Summarize Notes
export async function summarizeNoteService(
  title: string,
  subject: string,
  content: string
): Promise<{ ok: boolean; analysis: NoteAnalysis; source: string }> {
  // Try server first
  try {
    const res = await fetch('/api/notes/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, content }),
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.analysis) {
        return { ok: true, analysis: formatNoteAnalysis(data.analysis, title, subject), source: 'server' };
      }
    }
  } catch {
    // Server not available
  }

  // Client Gemini key
  const clientKey = getClientGeminiKey();
  if (clientKey) {
    try {
      const prompt = `Analyze these student study notes for Title: "${title}", Subject: "${subject}".
Notes content:
${content}

Extract high-yield revision summaries. Output strictly valid JSON with this schema:
{
  "summary": "1-2 sentence overview of the note",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "keyFormulasOrTerms": ["formula or term 1", "formula or term 2"],
  "examPitfalls": ["pitfall 1", "pitfall 2"]
}`;

      const text = await callClientGemini(prompt, clientKey);
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return { ok: true, analysis: formatNoteAnalysis(parsed, title, subject), source: 'client-gemini' };
    } catch (err) {
      console.warn('Client Gemini note analysis failed, using curated fallback:', err);
    }
  }

  // Dynamic Content-Aware Static Analysis
  const sentences = content
    .split(/[.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  const keyTakeaways = sentences.slice(0, 3);
  if (keyTakeaways.length === 0) {
    keyTakeaways.push(
      `Mastering "${title}" requires disciplined review of fundamental principles in ${subject}.`,
      `Synthesizing concepts into active recall questions drastically improves test score performance.`
    );
  }

  return {
    ok: true,
    analysis: formatNoteAnalysis(
      {
        summary: `Synthesized key formulas, takeaways, and exam pitfalls for ${title}.`,
        keyTakeaways,
        keyFormulasOrTerms: [
          `Key Principle: ${title} establishes the baseline rules for problem-solving in ${subject}.`,
          `Core Terminology: Ensure precise definitions are memorized for upcoming midterm evaluations.`,
        ],
        examPitfalls: [
          'Skipping unit validations or misreading problem constraints under test time pressure.',
          'Memorizing steps without conceptual intuition for variable relationships.',
        ],
      },
      title,
      subject
    ),
    source: 'static-curated',
  };
}
