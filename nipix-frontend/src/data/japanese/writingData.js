// Nipix Japanese Writing System Curriculum
// Stroke order tracing, Kana handwriting, and practical sentence translation writing exercises

export const WRITING_EXERCISES = [
  {
    id: 'jp-write-1',
    category: 'Hiragana Basics',
    title: 'Vowels Stroke Writing: あ, い, う, え, お',
    instruction: 'Practice the balance, stroke order, and curvature of the fundamental 5 Japanese vowels.',
    points: 15,
    characters: [
      { char: 'あ', romaji: 'a', strokes: 3, guide: 'Stroke 1: Horizontal line left-to-right. Stroke 2: Vertical crossing line downwards. Stroke 3: Smooth loop starting from upper-right, circling around and looping to bottom.' },
      { char: 'い', romaji: 'i', strokes: 2, guide: 'Stroke 1: Left downward curve with a small tick upward. Stroke 2: Shorter parallel right curve.' },
      { char: 'う', romaji: 'u', strokes: 2, guide: 'Stroke 1: Short angled diagonal mark at top. Stroke 2: Large sweeping curved arc beneath.' },
      { char: 'え', romaji: 'e', strokes: 2, guide: 'Stroke 1: Short top diagonal stroke. Stroke 2: Z-shaped downward angle flowing into a soft right wave.' },
      { char: 'お', romaji: 'o', strokes: 3, guide: 'Stroke 1: Horizontal bar. Stroke 2: Vertical line bending into a wide loop. Stroke 3: Separate diagonal accent dot on right.' }
    ]
  },
  {
    id: 'jp-write-2',
    category: 'Katakana Loanwords',
    title: 'Tech Loanwords: コンピュータ & プログラミング',
    instruction: 'Practice stroke angles for sharp Katakana characters commonly used in modern technology.',
    points: 20,
    characters: [
      { char: 'コ', romaji: 'ko', strokes: 2, guide: 'Horizontal bar then vertical down; bottom horizontal line.' },
      { char: 'ン', romaji: 'n', strokes: 2, guide: 'Lower left dot, upward sweeping stroke from bottom-left to top-right.' },
      { char: 'プ', romaji: 'pu', strokes: 3, guide: 'Katakana フ plus handakuten circle (半濁点).' }
    ]
  },
  {
    id: 'jp-write-3',
    category: 'Sentence Writing & Translation',
    title: 'Writing Self-Introduction (自己紹介)',
    instruction: 'Translate the English sentences into accurate Japanese using appropriate particles は, です, and よろしくおねがいします.',
    points: 25,
    prompts: [
      {
        prompt: 'Translate into Japanese: "Nice to meet you. I am an engineering student."',
        target: 'はじめまして。私は工学部の学生です。',
        romaji: 'Hajimemashite. Watashi wa kougakubu no gakusei desu.',
        keywords: ['はじめまして', '私', '学生', 'です']
      },
      {
        prompt: 'Translate into Japanese: "Please treat me favorably (Pleased to meet you)."',
        target: 'どうぞよろしくお願いします。',
        romaji: 'Douzo yoroshiku onegai shimasu.',
        keywords: ['どうぞ', 'よろしく', 'お願いします']
      }
    ]
  }
];
