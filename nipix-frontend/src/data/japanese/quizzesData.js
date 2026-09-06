/**
 * Japanese Interactive Quizzes Dataset
 * Multi-category question banks covering Kana, Kanji meaning & reading,
 * Vocabulary, Grammar, Translation, Sentence ordering, and JLPT simulation.
 */

export const QUIZ_CATEGORIES = [
  'All Quizzes',
  'Hiragana & Katakana',
  'Kanji Meaning & Reading',
  'Vocabulary',
  'Grammar & Particles',
  'JLPT Practice'
];

export const QUIZ_QUESTIONS = [
  // --- Hiragana & Katakana ---
  {
    id: 'q-1',
    category: 'Hiragana & Katakana',
    type: 'Kana Identification',
    question: 'Which romaji sound corresponds to the Hiragana: 「さ」?',
    options: ['sa', 'chi', 'ki', 'ta'],
    correctIndex: 0,
    explanation: '「さ」 is read as "sa" (part of the S-row: さ sa, し shi, す su, せ se, そ so).'
  },
  {
    id: 'q-2',
    category: 'Hiragana & Katakana',
    type: 'Kana Identification',
    question: 'Identify the Katakana for "Computer":',
    options: ['コンピュータ', 'コンピュタ', 'コンピータ', 'コンピュター'],
    correctIndex: 0,
    explanation: 'コンピュータ (Konpyūta) is the standard Japanese katakana loanword for computer.'
  },
  {
    id: 'q-3',
    category: 'Hiragana & Katakana',
    type: 'Sound Rules',
    question: 'What effect does the small 「っ」 (Sokuon) have in the word 「がっこう」?',
    options: [
      'It creates a double consonant stop before the "k" sound (Gakkou).',
      'It makes the vowel sound extra long.',
      'It changes "ga" into "ka".',
      'It is completely silent with no acoustic pause.'
    ],
    correctIndex: 0,
    explanation: 'The small っ acts as a glottal stop / pause that doubles the upcoming consonant (がっこう = gak-kou).'
  },

  // --- Kanji Meaning & Reading ---
  {
    id: 'q-4',
    category: 'Kanji Meaning & Reading',
    type: 'Kanji Reading',
    question: 'What is the On\'yomi reading of the Kanji 「学」 in the word 「学生」?',
    options: ['ガク (Gaku)', 'まな (Mana)', 'カク (Kaku)', 'サイ (Sai)'],
    correctIndex: 0,
    explanation: '「学生」 is read as がくせい (Gakusei). The On\'yomi of 学 is ガク (Gaku).'
  },
  {
    id: 'q-5',
    category: 'Kanji Meaning & Reading',
    type: 'Kanji Meaning',
    question: 'What does the Kanji compound 「日本語」 mean?',
    options: [
      'Japanese language',
      'Japanese food',
      'Japan travel',
      'Japanese book'
    ],
    correctIndex: 0,
    explanation: '日 (sun/day) + 本 (origin/book) = 日本 (Japan) + 語 (language/speech) = Japanese language.'
  },
  {
    id: 'q-6',
    category: 'Kanji Meaning & Reading',
    type: 'Kanji Strokes',
    question: 'How many strokes does the Kanji 「日」 (Sun / Day) have?',
    options: ['4 strokes', '3 strokes', '5 strokes', '6 strokes'],
    correctIndex: 0,
    explanation: '「日」 consists of 4 strokes: left vertical (1), top-right corner (2), inner horizontal (3), bottom closing horizontal (4).'
  },

  // --- Vocabulary ---
  {
    id: 'q-7',
    category: 'Vocabulary',
    type: 'Translation',
    question: 'How do you say "Thank you very much" politely in Japanese?',
    options: [
      'ありがとうございます (Arigatou gozaimasu)',
      'おはようございます (Ohayou gozaimasu)',
      'すみません (Sumimasen)',
      'ごちそうさまでした (Gochisousama deshita)'
    ],
    correctIndex: 0,
    explanation: '「ありがとうございます」 is the polite and universally accepted expression for "Thank you very much".'
  },
  {
    id: 'q-8',
    category: 'Vocabulary',
    type: 'Vocabulary Recall',
    question: 'What is the Japanese word for "Artificial Intelligence"?',
    options: [
      '人工知能 (じんこうちのう - Jinkouchinou)',
      '電子機器 (でんしきき - Denshikiki)',
      '情報通信 (じょうほうつうしん - Jouhoutsuushin)',
      '応用科学 (おうようかがく - Ouyoukagaku)'
    ],
    correctIndex: 0,
    explanation: '人工 (man-made / artificial) + 知能 (intelligence / intellect) = 人工知能 (AI).'
  },

  // --- Grammar & Particles ---
  {
    id: 'q-9',
    category: 'Grammar & Particles',
    type: 'Fill in the blank',
    question: 'Choose the correct particle: 「わたしは 図書館 ___ 勉強します。」',
    options: ['で', 'に', 'へ', 'を'],
    correctIndex: 0,
    explanation: '勉強する (to study) is an active verb, so the location where the action occurs takes で.'
  },
  {
    id: 'q-10',
    category: 'Grammar & Particles',
    type: 'Particle Selection',
    question: 'Which particle marks the direct object of the verb in: 「朝ご飯 ___ 食べました」?',
    options: ['を', 'は', 'が', 'で'],
    correctIndex: 0,
    explanation: 'The particle を marks the direct object receiving the action of 食べました (ate).'
  },
  {
    id: 'q-11',
    category: 'Grammar & Particles',
    type: 'Conjugation',
    question: 'What is the polite negative past form of the copula 「です」?',
    options: [
      'ではありませんでした / じゃありませんでした',
      'でした',
      'ではありません',
      'ないでした'
    ],
    correctIndex: 0,
    explanation: '「ではありませんでした」 (or conversational 「じゃありませんでした」) is the polite past negative form of です.'
  },

  // --- JLPT Practice ---
  {
    id: 'q-12',
    category: 'JLPT Practice',
    type: 'JLPT N5 Question',
    question: 'きのうは 雨でした___、きょうは とても いい天気です。',
    options: ['が', 'から', 'ので', 'でも'],
    correctIndex: 0,
    explanation: '〜が connects two contrasting clauses within a single sentence: "Yesterday it was rainy, BUT today the weather is very nice."'
  },
  {
    id: 'q-13',
    category: 'JLPT Practice',
    type: 'JLPT N4 Question',
    question: 'この本は 字が 大きくて ___。',
    options: ['読みやすいです', '読むやすいです', '読まやすいです', '読み難いです'],
    correctIndex: 0,
    explanation: 'Verb stem (読み) + やすい expresses that something is easy to do: 読みやすい (easy to read).'
  },
  {
    id: 'q-14',
    category: 'JLPT Practice',
    type: 'JLPT N3 Question',
    question: 'レポートを 提出する 前に、もう一度 よく 確認する___ してください。',
    options: ['ように', 'ために', 'とおりに', 'そうに'],
    correctIndex: 0,
    explanation: 'Verb (dictionary form) + ようにする means to make a conscious ongoing effort / make sure to do something.'
  }
];
