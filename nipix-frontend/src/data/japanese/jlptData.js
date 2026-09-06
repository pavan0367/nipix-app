/**
 * JLPT (Japanese Language Proficiency Test) Structured Syllabus & Prep
 * Comprehensive tracks for N5, N4, N3, N2, and N1.
 */

export const JLPT_LEVELS_DATA = [
  {
    level: 'N5',
    tagline: 'Basic Japanese (Beginner)',
    summary: 'Ability to understand basic Japanese including Hiragana, Katakana, and everyday basic kanji used in daily life.',
    stats: {
      kanjiCount: '~100 Kanji',
      vocabCount: '~800 Words',
      studyHours: '150 - 300 Hours',
      passingScore: '80 / 180 (44%)'
    },
    keyTopics: [
      'Hiragana and Katakana fluency',
      'Basic particles: は, が, を, に, で, と, も, へ, から, まで',
      'です / ます affirmative, negative, past conjugations',
      'Telling time, calendar, family, directions, shopping, ordering at restaurants'
    ],
    sampleKanji: ['日', '一', '国', '会', '人', '年', '大', '十', '二', '本', '中', '長', '出', '三', '同', '時', '政', '事', '自', '行'],
    sampleGrammar: [
      { pattern: 'A は B です', meaning: 'A is B' },
      { pattern: '〜てください', meaning: 'Please do...' },
      { pattern: '〜てもいいです', meaning: 'You may do...' },
      { pattern: '〜てはいけません', meaning: 'You must not do...' },
      { pattern: '〜から〜まで', meaning: 'From... until...' }
    ],
    listeningTips: [
      'Focus on question words at the start: だれ (who), いつ (when), どこ (where), なに (what).',
      'Listen for directional verbs: 行きます (go), 来ます (come), 帰ります (return).'
    ],
    readingStrategies: [
      'Identify the main topic marked by は first before deciphering the rest.',
      'Check sentence-ending verbs to determine whether the statement is affirmative, negative, or past.'
    ],
    practiceTest: [
      {
        question: 'あした 友達___ えいがを 見ます。',
        options: ['と', 'に', 'で', 'を'],
        answer: 0,
        explanation: 'Noun + と indicates performing an action "together with" someone.'
      },
      {
        question: '「毎朝 何時に 起きますか。」 「六時半___ 起きます。」',
        options: ['で', 'に', 'を', 'は'],
        answer: 1,
        explanation: 'Specific time points take the particle に.'
      }
    ]
  },
  {
    level: 'N4',
    tagline: 'Elementary Japanese',
    summary: 'Ability to understand basic Japanese used in daily life and slightly broader situations, with compound sentences and verb forms.',
    stats: {
      kanjiCount: '~300 Kanji',
      vocabCount: '~1,500 Words',
      studyHours: '300 - 600 Hours',
      passingScore: '90 / 180 (50%)'
    },
    keyTopics: [
      'Potential form (〜ができる / 〜られる)',
      'Volitional form (〜(よ)う)',
      'Conditionals (〜たら, 〜ば, 〜なら, 〜と)',
      'Giving and receiving verbs (あげる, もらう, くれる)',
      'Experience (〜たことがある) and simultaneous actions (〜ながら)'
    ],
    sampleKanji: ['引', '羽', '雲', '園', '遠', '何', '科', '夏', '家', '歌', '画', '会', '回', '海', '絵', '外', '角', '楽', '活', '間'],
    sampleGrammar: [
      { pattern: '〜たことがある', meaning: 'Have the past experience of...' },
      { pattern: '〜ながら', meaning: 'While doing X, doing Y' },
      { pattern: '〜たらどうですか', meaning: 'Why don\'t you... (suggestion)' },
      { pattern: '〜やすい / 〜にくい', meaning: 'Easy to do / hard to do' },
      { pattern: '〜てみる', meaning: 'Try doing to see what happens' }
    ],
    listeningTips: [
      'Pay attention to conditional cues (たら, なら) for decisions made in dialogues.',
      'Differentiate between あげる (give to other) and くれる (someone gives to me).'
    ],
    readingStrategies: [
      'Notice connective conjunctions: でも / しかし (however), だから (therefore), それから (and then).',
      'Group relative clauses modifying a head noun together.'
    ],
    practiceTest: [
      {
        question: '富士山に 登ったこと___ ありますか。',
        options: ['が', 'を', 'に', 'で'],
        answer: 0,
        explanation: 'The pattern for past experience is Verb-たこと + が + あります.'
      },
      {
        question: '音楽を 聞き___ 勉強するのが 好きです。',
        options: ['ながら', 'てから', 'まえに', 'あとで'],
        answer: 0,
        explanation: 'Verb stem + ながら indicates doing two actions simultaneously.'
      }
    ]
  },
  {
    level: 'N3',
    tagline: 'Bridging Intermediate Japanese',
    summary: 'Ability to understand Japanese used in everyday situations to a certain degree, including newspaper headlines and natural-speed conversations.',
    stats: {
      kanjiCount: '~650 Kanji',
      vocabCount: '~3,750 Words',
      studyHours: '450 - 900 Hours',
      passingScore: '95 / 180 (53%)'
    },
    keyTopics: [
      'Passive (〜れる/られる) and Causative (〜せる/させる) forms',
      'Expressing appearances and conjectures (〜そう, 〜よう, 〜らしい)',
      'Modality: 〜はずだ (should be), 〜わけだ (naturally so), 〜にちがいない (undoubtedly)',
      'Everyday business communication basics'
    ],
    sampleKanji: ['政', '治', '経', '済', '歴', '史', '育', '化', '技', '術', '研', '究', '情', '報', '関', '係', '制', '度', '現', '実'],
    sampleGrammar: [
      { pattern: '〜ようにする', meaning: 'Make an effort to...' },
      { pattern: '〜はずがない', meaning: 'There is no way that...' },
      { pattern: '〜わけにはいかない', meaning: 'Cannot afford to out of duty' },
      { pattern: '〜にかぎらず', meaning: 'Not limited to...' },
      { pattern: '〜を通して (をとおして)', meaning: 'Through / via...' }
    ],
    listeningTips: [
      'Follow speaker tone shifts: indirect refusals usually end with soft hedges like 「ちょっと...」.',
      'Identify what the speaker will do next vs. what another person was tasked to do.'
    ],
    readingStrategies: [
      'Skim paragraphs for topic sentences before reading all supporting examples.',
      'Check author opinion markers: 〜と思う (I think), 〜のではないだろうか (isn\'t it the case that).'
    ],
    practiceTest: [
      {
        question: '健康のために、毎朝野菜ジュースを飲む___ しています。',
        options: ['ように', 'ために', 'とおりに', 'ままに'],
        answer: 0,
        explanation: 'Verb (dictionary) + ようにする means to make a conscious ongoing effort.'
      },
      {
        question: '約束の時間に遅れる___、早めに家を出ました。',
        options: ['ないように', 'るように', 'ないために', 'るために'],
        answer: 0,
        explanation: 'Verb-ない + ように means "so that X does not happen".'
      }
    ]
  },
  {
    level: 'N2',
    tagline: 'Upper Intermediate / Business Ready',
    summary: 'Ability to understand Japanese in a variety of everyday and broader academic/workplace situations, including clear articles, commentary, and media.',
    stats: {
      kanjiCount: '~1,000 Kanji',
      vocabCount: '~6,000 Words',
      studyHours: '600 - 1,200 Hours',
      passingScore: '90 / 180 (50%)'
    },
    keyTopics: [
      'Advanced honorifics (Sonkeigo and Kenjougo fluency)',
      'Nuanced nuance connectors (〜に伴って, 〜に反して, 〜を契機に)',
      'Formal news editorial language and debate terminology',
      'Complex abstract essays and technical workplace writing'
    ],
    sampleKanji: ['企', '業', '識', '構', '造', '緻', '密', '契', '約', '妥', '協', '範', '囲', '顕', '著', '概', '念', '推', '移', '論'],
    sampleGrammar: [
      { pattern: '〜に際して (にさいして)', meaning: 'Upon / on the occasion of...' },
      { pattern: '〜をはじめ (として)', meaning: 'Starting with / above all...' },
      { pattern: '〜にほかならない', meaning: 'Nothing other than / precisely...' },
      { pattern: '〜ざるを得ない', meaning: 'Cannot help but / compelled to...' },
      { pattern: '〜にすぎない', meaning: 'Merely / nothing more than...' }
    ],
    listeningTips: [
      'Listen for the speaker\'s real intent tucked behind polite formal qualifiers.',
      'Track fast turn-taking in team deliberations and broadcast interviews.'
    ],
    readingStrategies: [
      'Pay close attention to contrasts: Aであるのに対してBは... (In contrast to A, B is...).',
      'Distinguish between facts reported and the author\'s subjective critique.'
    ],
    practiceTest: [
      {
        question: '今回のプロジェクトの成功は、チーム全員の努力の結晶に___。',
        options: ['ほかならない', 'かぎらない', 'すぎない', 'およばない'],
        answer: 0,
        explanation: '〜にほかならない expresses "is nothing other than / is purely".'
      }
    ]
  },
  {
    level: 'N1',
    tagline: 'Advanced / Native Equivalence',
    summary: 'Ability to understand Japanese used in an extensive variety of complex circumstances, academic publications, technical treatises, and deep cultural discourse.',
    stats: {
      kanjiCount: '~2,136+ Kanji',
      vocabCount: '~10,000+ Words',
      studyHours: '900 - 2,000+ Hours',
      passingScore: '100 / 180 (56%)'
    },
    keyTopics: [
      'Literary, archaic, and high-register grammatical patterns',
      'Advanced metaphorical expressions and sophisticated idioms (四字熟語 - Yojijukugo)',
      'Rapid-fire natural lectures, negotiations, and intellectual panels',
      'Philosophical argumentation and academic peer critique'
    ],
    sampleKanji: ['鬱', '曖', '昧', '緻', '諮', '乖', '離', '傲', '慢', '苛', '酷', '嘲', '笑', '躊', '躇', '凌', '駕', '蹂', '躙', '叛'],
    sampleGrammar: [
      { pattern: '〜であれ〜であれ', meaning: 'Be it A or B...' },
      { pattern: '〜を皮切りに (をかわきりに)', meaning: 'Starting with / triggered by...' },
      { pattern: '〜余儀なくされる (よぎなくされる)', meaning: 'Forced / compelled unavoidably to...' },
      { pattern: '〜極まりない (きわまりない)', meaning: 'Extremely / boundless in...' },
      { pattern: '〜と相まって (とあいまって)', meaning: 'Combined together with...' }
    ],
    listeningTips: [
      'Discern subtle understatements, rhetorical questions, and nuanced sarcastic twists in academic dialogue.',
      'Map multi-speaker consensus in high-stakes boardroom negotiations.'
    ],
    readingStrategies: [
      'Analyze the philosophical trajectory: thesis, counter-thesis (antithesis), and synthesis.',
      'Quickly decode archaic kanji compounds and rare Sino-Japanese collocations from context.'
    ],
    practiceTest: [
      {
        question: '悪天候のため、航空会社は全便の欠航を___。',
        options: ['余儀なくされた', '余儀なくさせた', '余儀なくなった', '余儀なしとした'],
        answer: 0,
        explanation: '〜を余儀なくされる expresses being forced/compelled into an unavoidable outcome.'
      }
    ]
  }
];
