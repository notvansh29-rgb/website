import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI client if GEMINI_API_KEY is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback curated questions for Demo / Exhibition Mode
const DEMO_QUIZZES: Record<string, Array<{
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}>> = {
  'Mathematics': [
    {
      question: 'What are the solutions to the quadratic equation x² - 5x + 6 = 0?',
      options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = -1 and x = 5'],
      correctAnswer: 0,
      explanation: 'Factor the quadratic: (x - 2)(x - 3) = 0. Setting each factor to zero gives x = 2 and x = 3.',
    },
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
      explanation: 'Using the power rule: d/dx(3x²) = 6x, d/dx(5x) = 5, and d/dx(-7) = 0. Thus, f\'(x) = 6x + 5.',
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
  ],
  'Physics': [
    {
      question: 'Which of Newton\'s laws states that every action has an equal and opposite reaction?',
      options: ['Third Law', 'First Law', 'Second Law', 'Law of Universal Gravitation'],
      correctAnswer: 0,
      explanation: 'Newton\'s Third Law states that when one body exerts a force on a second body, the second body simultaneously exerts a force equal in magnitude and opposite in direction on the first body.',
    },
    {
      question: 'What is the SI unit of electric potential difference (voltage)?',
      options: ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
      correctAnswer: 0,
      explanation: 'The Volt (V) is the SI unit of electrical potential difference. Ampere is current, Ohm is resistance, and Watt is power.',
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
      explanation: 'Refraction is the change in direction of a wave due to a change in its transmission medium and speed.',
    },
    {
      question: 'What is the work done when a force of 15 N moves an object 4 meters in the direction of the force?',
      options: ['60 Joules', '19 Joules', '3.75 Joules', '240 Joules'],
      correctAnswer: 0,
      explanation: 'Work = Force × Displacement = 15 N × 4 m = 60 Joules (J).',
    },
  ],
  'Biology': [
    {
      question: 'Which organelle is universally known as the powerhouse of the eukaryotic cell?',
      options: ['Mitochondria', 'Ribosome', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
      correctAnswer: 0,
      explanation: 'Mitochondria produce the vast majority of cellular energy in the form of Adenosine Triphosphate (ATP) via cellular respiration.',
    },
    {
      question: 'In genetics, what are different versions of the same gene called?',
      options: ['Alleles', 'Chromosomes', 'Nucleotides', 'Codons'],
      correctAnswer: 0,
      explanation: 'Alleles are variant forms of a specific gene located at the same position (locus) on a chromosome.',
    },
    {
      question: 'What is the green pigment responsible for absorbing sunlight during photosynthesis?',
      options: ['Chlorophyll', 'Carotenoid', 'Hemoglobin', 'Anthocyanin'],
      correctAnswer: 0,
      explanation: 'Chlorophyll is located in chloroplasts and absorbs blue and red wavelengths of light while reflecting green light.',
    },
    {
      question: 'Which blood vessels carry oxygenated blood away from the heart to the rest of the body?',
      options: ['Arteries', 'Veins', 'Capillaries', 'Venules'],
      correctAnswer: 0,
      explanation: 'Arteries carry blood away from the heart under high pressure. The aorta is the largest artery.',
    },
    {
      question: 'What is the process of cell division that results in four genetically distinct daughter cells with half the chromosomes?',
      options: ['Meiosis', 'Mitosis', 'Binary Fission', 'Budding'],
      correctAnswer: 0,
      explanation: 'Meiosis produces haploid gametes (sperm and egg cells) with half the chromosomal count and genetic recombination.',
    },
  ],
  'Chemistry': [
    {
      question: 'What is the pH value of pure distilled water at 25°C?',
      options: ['7.0 (Neutral)', '0.0 (Strong Acid)', '14.0 (Strong Base)', '5.5 (Slightly Acidic)'],
      correctAnswer: 0,
      explanation: 'Pure water has equal concentrations of H⁺ and OH⁻ ions at 25°C, resulting in a neutral pH of 7.0.',
    },
    {
      question: 'Which subatomic particle has a negative electrical charge?',
      options: ['Electron', 'Proton', 'Neutron', 'Positron'],
      correctAnswer: 0,
      explanation: 'Electrons carry a -1 elementary charge and orbit the nucleus containing protons (+1) and neutrons (0).',
    },
    {
      question: 'What type of chemical bond involves the sharing of electron pairs between atoms?',
      options: ['Covalent bond', 'Ionic bond', 'Hydrogen bond', 'Metallic bond'],
      correctAnswer: 0,
      explanation: 'A covalent bond forms when two nonmetal atoms share pairs of valence electrons to achieve stable octets.',
    },
    {
      question: 'Which gas is the most abundant in Earth\'s atmosphere?',
      options: ['Nitrogen (~78%)', 'Oxygen (~21%)', 'Carbon Dioxide (~0.04%)', 'Argon (~0.93%)'],
      correctAnswer: 0,
      explanation: 'Nitrogen gas (N₂) makes up approximately 78% of Earth\'s dry atmosphere, followed by oxygen at 21%.',
    },
    {
      question: 'What is the chemical formula for table salt?',
      options: ['NaCl', 'KCl', 'CaCl₂', 'NaHCO₃'],
      correctAnswer: 0,
      explanation: 'Common table salt is Sodium Chloride (NaCl), an ionic compound consisting of Na⁺ and Cl⁻ ions in a 1:1 ratio.',
    },
  ],
  'History': [
    {
      question: 'In which year did the Second World War end?',
      options: ['1945', '1939', '1918', '1941'],
      correctAnswer: 0,
      explanation: 'World War II concluded in 1945 following the surrender of Germany in May and Japan in August/September.',
    },
    {
      question: 'The Industrial Revolution initially began in which European country during the 18th century?',
      options: ['Great Britain', 'France', 'Germany', 'Italy'],
      correctAnswer: 0,
      explanation: 'Great Britain was the birthplace of the Industrial Revolution due to access to coal, iron, textile innovations, and maritime trade routes.',
    },
    {
      question: 'Which ancient civilization built the monumental pyramids of Giza?',
      options: ['Ancient Egypt', 'Mesopotamia', 'Ancient Greece', 'Mayan Empire'],
      correctAnswer: 0,
      explanation: 'The Pyramids of Giza were constructed during the Old Kingdom period of Ancient Egypt as royal tombs for pharaohs.',
    },
    {
      question: 'Who delivered the famous "I Have a Dream" speech during the 1963 March on Washington?',
      options: ['Martin Luther King Jr.', 'Malcolm X', 'John F. Kennedy', 'Rosa Parks'],
      correctAnswer: 0,
      explanation: 'Dr. Martin Luther King Jr. delivered the historic speech advocating for racial equality and civil rights on August 28, 1963.',
    },
    {
      question: 'Which document signed in 1215 limited the absolute power of the English monarchy?',
      options: ['Magna Carta', 'Bill of Rights', 'Treaty of Versailles', 'Declaration of Arbroath'],
      correctAnswer: 0,
      explanation: 'King John of England was forced to grant the Magna Carta at Runnymede in 1215, laying foundations for constitutional law.',
    },
  ],
  'Computer Science': [
    {
      question: 'What is the time complexity of binary search on a sorted array of size n?',
      options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'],
      correctAnswer: 0,
      explanation: 'Binary search divides the search interval in half at each step, yielding a logarithmic time complexity of O(log n).',
    },
    {
      question: 'Which data structure operates on a Last-In, First-Out (LIFO) principle?',
      options: ['Stack', 'Queue', 'Array', 'Linked List'],
      correctAnswer: 0,
      explanation: 'A Stack follows LIFO: the last element pushed onto the stack is the first one to be popped off.',
    },
    {
      question: 'In Python, which keyword is used to define a function?',
      options: ['def', 'func', 'function', 'lambda'],
      correctAnswer: 0,
      explanation: 'The `def` keyword introduces a function definition in Python followed by the function name and parameters.',
    },
    {
      question: 'What does "HTTP" stand for in web technology?',
      options: ['HyperText Transfer Protocol', 'High Technology Transfer Process', 'Hyperlink Text Transmission Protocol', 'Home Tool Transfer Program'],
      correctAnswer: 0,
      explanation: 'HTTP stands for HyperText Transfer Protocol, the foundational application protocol used for distributed hypermedia on the World Wide Web.',
    },
    {
      question: 'Which boolean operation yields TRUE only when both inputs are TRUE?',
      options: ['AND', 'OR', 'XOR', 'NOT'],
      correctAnswer: 0,
      explanation: 'The logical AND operation produces true if and only if all operands evaluate to true.',
    },
  ]
};

// Fallback explanations for Demo Mode
const DEMO_EXPLANATIONS: Record<string, { summary: string; analogy: string; keyPoints: string[]; example: string; takeaway: string }> = {
  'photosynthesis': {
    summary: 'Photosynthesis is the biochemical process where green plants, algae, and cyanobacteria transform sunlight, water, and carbon dioxide into glucose (energy-rich sugar) and oxygen.',
    analogy: 'Imagine a solar-powered kitchen inside every leaf! Sunlight is the electricity, carbon dioxide from the air and water from the soil are the raw ingredients, and the chef creates sweet glucose snacks while giving away fresh oxygen as a free gift to the planet.',
    keyPoints: [
      'Chemical equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂',
      'Occurs primarily in chloroplasts containing green chlorophyll pigment',
      'Comprises two main stages: Light-dependent reactions (in thylakoids) and the Calvin Cycle (in stroma)',
      'Provides the foundational energy source for nearly all food webs on Earth'
    ],
    example: 'A sunflower in your backyard turns sunlight hitting its leaves into the chemical energy it needs to grow 10 feet tall and produce hundreds of nutritious sunflower seeds.',
    takeaway: 'Photosynthesis converts solar radiant energy into stable chemical bonds, sustaining Earth\'s oxygen supply and biomass.'
  },
  'newtons laws': {
    summary: 'Sir Isaac Newton formulated three fundamental laws of motion that describe how physical objects interact with forces and move through space.',
    analogy: 'Think of a skateboard: it won\'t move until you kick it (1st Law). The harder you kick or the lighter your board, the faster you accelerate (2nd Law: F=ma). When you push backward against the ground, the ground pushes you forward with identical force (3rd Law).',
    keyPoints: [
      '1st Law (Inertia): An object remains at rest or in uniform motion unless acted on by an external net force.',
      '2nd Law (F = ma): Net Force equals mass times acceleration.',
      '3rd Law (Action-Reaction): For every action force, there is an equal and opposite reaction force.',
      'Forms the foundation of classical mechanics and aerospace engineering'
    ],
    example: 'When a rocket launches into space, burning propellant is forced downward out of the thrusters at high speed (action), driving the massive rocket upward into orbit (reaction).',
    takeaway: 'Forces never occur alone; motion changes strictly when unbalanced external forces act upon a mass.'
  },
  'pythagorean theorem': {
    summary: 'The Pythagorean Theorem states that in any right-angled triangle, the square of the hypotenuse (the longest side opposite the 90° angle) is equal to the sum of the squares of the other two sides.',
    analogy: 'If you built square tile patios along each of the three sides of a right triangle, the number of tiles needed to pave the two smaller patios combined would exactly equal the tiles needed for the giant patio on the longest side (a² + b² = c²).',
    keyPoints: [
      'Mathematical formula: a² + b² = c² (where c is the hypotenuse)',
      'Only applies to triangles with a 90-degree angle',
      'Common Pythagorean triples: (3, 4, 5), (5, 12, 13), (8, 15, 17)',
      'Essential for GPS navigation, construction, architecture, and computer graphics'
    ],
    example: 'If a ladder rests 6 feet away from the base of a wall and touches the wall 8 feet high, the ladder must be √(6² + 8²) = √(36 + 64) = √100 = 10 feet long.',
    takeaway: 'Connects the geometry of right angles directly to algebraic distances.'
  },
  'machine learning': {
    summary: 'Machine Learning (ML) is a branch of artificial intelligence where computer algorithms learn patterns directly from data and improve their performance automatically without being explicitly programmed with manual rules.',
    analogy: 'Instead of writing a 10,000-rule handbook telling a computer what every dog breed looks like, you show it 100,000 photos of dogs and cats. Over time, the model adjusts its internal mathematical dials until it can recognize dogs on its own.',
    keyPoints: [
      'Supervised Learning: Trained on labeled input-output pairs (e.g. email spam vs not spam)',
      'Unsupervised Learning: Discovers hidden groupings without predefined labels (e.g. customer segmentation)',
      'Reinforcement Learning: Learns through rewards and trial-and-error actions in an environment',
      'Powers recommendation systems, medical diagnostics, self-driving vehicles, and voice assistants'
    ],
    example: 'Streaming platforms like Spotify or Netflix analyze songs and shows you enjoyed in the past to recommend new songs you will likely love tonight.',
    takeaway: 'Traditional code follows fixed rules; machine learning builds the rules by discovering patterns in historical data.'
  }
};

// API Route: Status / Health check
app.get('/api/status', (_req, res) => {
  res.json({
    ok: true,
    hasGemini: Boolean(ai),
    model: 'gemini-3.5-flash',
    mode: ai ? 'live' : 'demo',
    timestamp: new Date().toISOString(),
  });
});

// API Route: Quiz Generator
app.post('/api/quiz', async (req, res) => {
  const { subject = 'General Science', topic = 'Core Concepts', difficulty = 'Medium' } = req.body || {};

  // If live Gemini client is configured, attempt real generation
  if (ai) {
    try {
      const prompt = `Create a 5-question multiple choice quiz for a high school or middle school student on the subject "${subject}" specifically on the topic "${topic}" at "${difficulty}" difficulty level.
Each question must test conceptual understanding. Provide 4 realistic options, specify the zero-indexed correct answer (0 for A, 1 for B, 2 for C, 3 for D), and provide a clear 1-2 sentence educational explanation for why that answer is correct and what concept it illustrates.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an inspiring, accurate high school science & academic teacher creating educational assessment quizzes. Output valid JSON adhering strictly to the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswer: {
                      type: Type.INTEGER,
                      description: 'Zero-based index of the correct option (0, 1, 2, or 3)',
                    },
                    explanation: { type: Type.STRING },
                  },
                  required: ['question', 'options', 'correctAnswer', 'explanation'],
                },
              },
            },
            required: ['subject', 'topic', 'questions'],
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.questions && parsed.questions.length >= 5) {
          // Ensure IDs exist
          parsed.questions = parsed.questions.slice(0, 5).map((q: any, i: number) => ({
            ...q,
            id: q.id || `q_${Date.now()}_${i + 1}`,
          }));
          return res.json({
            ok: true,
            source: 'gemini',
            subject: parsed.subject || subject,
            topic: parsed.topic || topic,
            difficulty,
            questions: parsed.questions,
          });
        }
      }
    } catch (err) {
      console.error('Gemini quiz generation error, falling back to curated questions:', err);
    }
  }

  // Fallback: Pick curated questions matching subject, or provide dynamic subject variation
  const matchedSubject = Object.keys(DEMO_QUIZZES).find(s => s.toLowerCase() === (subject || '').toLowerCase()) || 'Physics';
  const rawList = DEMO_QUIZZES[matchedSubject] || DEMO_QUIZZES['Physics'];

  // Add random variation or shuffle options slightly to make demo interactive
  const fallbackQuestions = rawList.map((item, idx) => ({
    id: `demo_${idx + 1}`,
    question: item.question,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
  }));

  return res.json({
    ok: true,
    source: ai ? 'gemini_fallback' : 'demo',
    subject: subject || matchedSubject,
    topic: topic || 'Core Fundamentals',
    difficulty,
    questions: fallbackQuestions,
  });
});

// API Route: AI Tutor Explanation
app.post('/api/explain', async (req, res) => {
  const { topic = '', subject = 'General', style = 'ELI5', grade = 'Grade 10' } = req.body || {};

  if (!topic.trim()) {
    return res.status(400).json({ ok: false, error: 'Topic is required' });
  }

  if (ai) {
    try {
      const styleGuides: Record<string, string> = {
        'ELI5': 'Explain like I am 10 years old with fun, relatable everyday metaphors and zero academic jargon.',
        'Step-by-step': 'Provide a logical step-by-step breakdown with clear progression from first principles.',
        'Exam Prep': 'Focus on high-yield exam points, key formulas/definitions, and common student misconceptions.',
        'Socratic': 'Engage the student with guiding insights, key "aha!" questions, and intuitive connections.',
      };
      const styleGuide = (typeof style === 'string' && styleGuides[style]) ? styleGuides[style] : 'Explain clearly and engagingly for a secondary school student.';

      const prompt = `Topic to explain: "${topic}" (Subject: ${subject}, Target Level: ${grade}).
Tone & Style: ${styleGuide}

Structure your response into:
1. "summary": A crisp 2-3 sentence core overview of what it is.
2. "analogy": A memorable real-world analogy or metaphor that makes the concept click instantly.
3. "keyPoints": An array of 4 concise bullet points highlighting key mechanisms, rules, or formulas.
4. "example": A concrete practical example showing where this appears in daily life or real-world science.
5. "takeaway": One punchy golden rule or memory hook to remember for tests.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are StudyBuddy AI, an award-winning, supportive and enthusiastic tutor helping students understand difficult academic topics for a school exhibition.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              analogy: { type: Type.STRING },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              example: { type: Type.STRING },
              takeaway: { type: Type.STRING },
            },
            required: ['summary', 'analogy', 'keyPoints', 'example', 'takeaway'],
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({
          ok: true,
          source: 'gemini',
          topic,
          subject,
          style,
          explanation: parsed,
        });
      }
    } catch (err) {
      console.error('Gemini explanation error, falling back to curated explanations:', err);
    }
  }

  // Demo fallback
  const normalized = topic.toLowerCase();
  let matchedKey = Object.keys(DEMO_EXPLANATIONS).find(k => normalized.includes(k));
  if (!matchedKey) {
    matchedKey = 'photosynthesis';
  }
  const fallback = DEMO_EXPLANATIONS[matchedKey];

  return res.json({
    ok: true,
    source: ai ? 'gemini_fallback' : 'demo',
    topic,
    subject,
    style,
    explanation: {
      summary: fallback.summary,
      analogy: fallback.analogy,
      keyPoints: fallback.keyPoints,
      example: fallback.example,
      takeaway: fallback.takeaway,
    },
  });
});

// Fallback curated flashcard decks
const DEMO_FLASHCARDS: Record<string, Array<{ front: string; back: string; hint: string }>> = {
  'Mathematics': [
    { front: 'Quadratic Formula', back: 'x = (-b ± √(b² - 4ac)) / (2a)', hint: 'Used when factoring ax² + bx + c = 0 is difficult.' },
    { front: 'Discriminant (Δ = b² - 4ac)', back: 'Δ > 0: 2 real roots\nΔ = 0: 1 repeated root\nΔ < 0: 2 complex roots', hint: 'The term underneath the radical.' },
    { front: 'Pythagorean Identity', back: 'sin²(θ) + cos²(θ) = 1', hint: 'Fundamental identity derived from the unit circle.' },
    { front: 'Derivative of ln(x)', back: '1 / x (for x > 0)', hint: 'Rate of change of natural logarithm.' },
    { front: 'Sum of Arithmetic Series', back: 'S_n = n/2 · (2a + (n - 1)d) or n/2 · (a + L)', hint: 'Multiply number of pairs by the average of first and last terms.' },
    { front: 'Volume of a Sphere', back: 'V = (4/3) · π · r³', hint: 'Three-dimensional counterpart to circle area πr².' }
  ],
  'Physics': [
    { front: 'Newton’s 2nd Law of Motion', back: 'Net Force = Mass × Acceleration (F = ma)', hint: 'SI unit of force is the Newton (kg·m/s²).' },
    { front: 'Kinetic Energy Formula', back: 'KE = ½ · m · v²', hint: 'Doubling speed quadruples energy.' },
    { front: 'Ohm’s Law', back: 'Voltage = Current × Resistance (V = I · R)', hint: 'Relates volts, amperes, and ohms.' },
    { front: 'Gravitational Potential Energy', back: 'PE = m · g · h', hint: 'Near Earth\'s surface where g ≈ 9.8 m/s².' },
    { front: 'Momentum Conservation', back: 'Total initial momentum = Total final momentum in isolated system (p = mv)', hint: 'Crucial for analyzing collisions and rocket propulsion.' },
    { front: 'Snell’s Law of Refraction', back: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)', hint: 'Governs light ray bending across medium boundaries.' }
  ],
  'Biology': [
    { front: 'Mitochondria function', back: 'Powerhouse of the eukaryotic cell; generates ATP via aerobic respiration.', hint: 'Contains inner folded cristae.' },
    { front: 'DNA Base Pairing Rules', back: 'Adenine (A) pairs with Thymine (T) via 2 hydrogen bonds; Cytosine (C) pairs with Guanine (G) via 3 bonds.', hint: 'Chargaff\'s rule.' },
    { front: 'Mitosis vs Meiosis', back: 'Mitosis: 2 diploid identical cells for growth/repair.\nMeiosis: 4 haploid diverse gametes for reproduction.', hint: 'Chromosome count is halved in meiosis.' },
    { front: 'Photosynthesis equation', back: '6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂', hint: 'Occurs in chloroplasts containing chlorophyll.' },
    { front: 'Enzyme Active Site', back: 'The specific catalytic region where substrate molecules bind and undergo reaction.', hint: 'Lock-and-key / Induced fit model.' },
    { front: 'Ribosome Role', back: 'Translates mRNA genetic sequence into polypeptide chains (proteins).', hint: 'Composed of rRNA and protein subunits.' }
  ]
};

// API Route: Flashcards Generator
app.post('/api/flashcards', async (req, res) => {
  const { subject = 'Mathematics', topic = 'Core Principles', count = 6 } = req.body || {};

  if (ai) {
    try {
      const prompt = `Create ${count} high-yield study flashcards for a high school or college student on "${subject}: ${topic}".
Each flashcard must have:
- "front": a clear question, term, formula, or concept.
- "back": a concise, accurate definition, solution, or explanation (2-3 sentences max).
- "hint": a helpful memory trick, mnemonic, or context clue.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert educational flashcard creator designing spaced repetition decks. Return JSON adhering to schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              deckTitle: { type: Type.STRING },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    front: { type: Type.STRING },
                    back: { type: Type.STRING },
                    hint: { type: Type.STRING },
                  },
                  required: ['front', 'back', 'hint'],
                },
              },
            },
            required: ['deckTitle', 'cards'],
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.cards && parsed.cards.length > 0) {
          const cardsWithIds = parsed.cards.map((c: any, i: number) => ({
            ...c,
            id: c.id || `card_${Date.now()}_${i + 1}`,
          }));
          return res.json({
            ok: true,
            source: 'gemini',
            deckTitle: parsed.deckTitle || `${subject}: ${topic}`,
            cards: cardsWithIds,
          });
        }
      }
    } catch (err) {
      console.error('Gemini flashcard generation error, using fallback:', err);
    }
  }

  // Fallback
  const matched = DEMO_FLASHCARDS[subject] || DEMO_FLASHCARDS['Mathematics'];
  const fallbackCards = matched.map((c, i) => ({
    id: `demo_card_${i + 1}`,
    front: c.front,
    back: c.back,
    hint: c.hint,
  }));

  return res.json({
    ok: true,
    source: ai ? 'gemini_fallback' : 'demo',
    deckTitle: `${subject}: ${topic}`,
    cards: fallbackCards,
  });
});

// API Route: AI Notes Summarizer & Cheat Sheet Extractor
app.post('/api/notes/summarize', async (req, res) => {
  const { title = 'Lecture Notes', content = '', subject = 'General' } = req.body || {};

  if (!content.trim()) {
    return res.status(400).json({ ok: false, error: 'Note content is required.' });
  }

  if (ai) {
    try {
      const prompt = `Analyze these student study notes on "${title}" (Subject: ${subject}):
---
${content}
---

Generate an executive study cheatsheet:
1. "summary": A crisp 2-3 sentence executive synopsis.
2. "keyTakeaways": 4-5 bullet points capturing the most crucial facts, principles, or rules.
3. "keyFormulasOrTerms": 3-5 high-yield equations, definitions, or vocabulary words.
4. "examPitfalls": 2-3 common misconceptions or traps students make on tests regarding this topic.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an academic honors tutor creating high-yield revision sheets. Output valid JSON adhering to schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              keyFormulasOrTerms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              examPitfalls: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['summary', 'keyTakeaways', 'keyFormulasOrTerms', 'examPitfalls'],
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({
          ok: true,
          source: 'gemini',
          analysis: parsed,
        });
      }
    } catch (err) {
      console.error('Gemini notes summarization error, using fallback:', err);
    }
  }

  // Fallback analysis
  return res.json({
    ok: true,
    source: 'demo',
    analysis: {
      summary: `These study notes provide foundational coverage of ${title}, emphasizing core mechanisms, mathematical definitions, and practical problem-solving.`,
      keyTakeaways: [
        'Review the foundational laws and their corresponding boundary conditions.',
        'Always verify units and coordinate directions before computing final answers.',
        'Connect algebraic expressions to graphical representations for intuitive understanding.',
        'Practice timed multi-step exercises to build exam confidence.',
      ],
      keyFormulasOrTerms: [
        'Core Principle: Input variables directly determine output states.',
        'Conservation Law: Total invariant quantity is conserved in isolated systems.',
        'Rate of Change: dy/dx models instantaneous velocity or growth.',
      ],
      examPitfalls: [
        'Forgetting sign conventions (+ vs -) when resolving vectors or factoring polynomials.',
        'Confusing correlation with direct causation during experimental analysis.',
      ],
    },
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`StudyBuddy AI full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
