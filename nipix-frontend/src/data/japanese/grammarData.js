/**
 * Japanese Grammar Comprehensive Dataset
 * Covers Beginner (N5), Intermediate (N4-N3), and Advanced (N2-N1) grammar points
 * with explanations, Japanese examples, Romaji, English translations,
 * usage rules, common mistakes, and practice questions.
 */

export const GRAMMAR_LEVELS = ['Beginner (N5)', 'Intermediate (N4-N3)', 'Advanced (N2-N1)'];

export const GRAMMAR_DATA = [
  // ==========================================
  // BEGINNER GRAMMAR
  // ==========================================
  {
    id: 'g-1',
    level: 'Beginner (N5)',
    title: 'Topic Marker Particle: は (wa)',
    category: 'Particles',
    explanation: 'The particle は marks the topic of the sentence ("as for X...", "speaking of X..."). Written with the kana は, but pronounced "wa" when functioning as a particle.',
    usageRules: [
      'Noun + は + Predicate/Description.',
      'Establishes what the speaker wants to talk about.',
      'Pronounced "wa", never "ha", when used as a particle.'
    ],
    examples: [
      {
        jp: '私は学生です。',
        romaji: 'Watashi wa gakusei desu.',
        en: 'As for me, I am a student. (I am a student.)'
      },
      {
        jp: '今日は天気がいいです。',
        romaji: 'Kyou wa tenki ga ii desu.',
        en: 'As for today, the weather is nice.'
      },
      {
        jp: 'この本は面白いです。',
        romaji: 'Kono hon wa omoshiroi desu.',
        en: 'This book is interesting.'
      }
    ],
    commonMistakes: [
      'Typing or pronouncing "わ" instead of "は" for the particle.',
      'Confusing topic は (sets the conversation frame) with subject が (identifies who performs the specific action).'
    ],
    practiceQuestions: [
      {
        question: 'Complete: わたし ___ コンピュータサイエンスの学生です。',
        options: ['は', 'を', 'に', 'で'],
        answer: 0,
        explanation: 'は marks わたし (I) as the conversational topic.'
      }
    ]
  },
  {
    id: 'g-2',
    level: 'Beginner (N5)',
    title: 'Subject / Identifier Particle: が (ga)',
    category: 'Particles',
    explanation: 'が specifies the grammatical subject, especially when introducing new information or answering "who/which one" questions (exhaustive listing). Also used with verbs of potential and adjectives of desire/like.',
    usageRules: [
      'Subject + が + Verb / Adjective.',
      'Used with 好き (like), 嫌い (dislike), 欲しい (want), 分かる (understand), and できる (can do).',
      'In "Who did it?" questions, が answers the question (だれが来ましたか？ -> 田中さんが来ました).'
    ],
    examples: [
      {
        jp: '雨が降っています。',
        romaji: 'Ame ga futteimasu.',
        en: 'Rain is falling. (It is raining.)'
      },
      {
        jp: '私は猫が好きです。',
        romaji: 'Watashi wa neko ga suki desu.',
        en: 'I like cats (Cats are pleasing to me).'
      },
      {
        jp: 'だれが部屋の窓を開けましたか？',
        romaji: 'Dare ga heya no mado o akemashita ka?',
        en: 'Who opened the room window?'
      }
    ],
    commonMistakes: [
      'Using を with 好き (e.g. *猫を好き is grammatically ungrammatical in standard Japanese; use 猫が好き).'
    ],
    practiceQuestions: [
      {
        question: 'Which particle fits: 私は日本語の文法 ___ 好きです。',
        options: ['を', 'が', 'で', 'へ'],
        answer: 1,
        explanation: '好き (like) takes the particle が to mark the target of affection.'
      }
    ]
  },
  {
    id: 'g-3',
    level: 'Beginner (N5)',
    title: 'Direct Object Particle: を (o / wo)',
    category: 'Particles',
    explanation: 'を marks the direct object of a transitive verb (the noun receiving the action). Written with を, pronounced "o".',
    usageRules: [
      'Noun (Object) + を + Transitive Verb.',
      'Also marks places of motion through/along/out of (e.g. 公園を散歩する - walk through a park; 電車を降りる - get off a train).'
    ],
    examples: [
      {
        jp: '朝ご飯を食べます。',
        romaji: 'Asagohan o tabemasu.',
        en: 'I eat breakfast.'
      },
      {
        jp: '毎日日本語の単語を覚えます。',
        romaji: 'Mainichi nihongo no tango o oboemasu.',
        en: 'I memorize Japanese vocabulary every day.'
      },
      {
        jp: '空を鳥が飛んでいます。',
        romaji: 'Sora o tori ga tondeimasu.',
        en: 'Birds are flying across the sky.'
      }
    ],
    commonMistakes: [
      'Using お instead of を in writing. を is dedicated exclusively to grammatical particle usage.'
    ],
    practiceQuestions: [
      {
        question: '図書館で本 ___ 読みました。',
        options: ['に', 'を', 'で', 'と'],
        answer: 1,
        explanation: '本 (book) is the direct object of 読みました (read), so を is required.'
      }
    ]
  },
  {
    id: 'g-4',
    level: 'Beginner (N5)',
    title: 'Target, Time & Destination: に (ni)',
    category: 'Particles',
    explanation: 'に is one of the most versatile particles: it marks specific times, destinations, locations of existence (with いる/ある), and indirect objects/recipients.',
    usageRules: [
      'Specific time + に (7時に - at 7 o\'clock; 月曜日に - on Monday). Note: relative times like 今日, 明日 do NOT take に.',
      'Place + に + 行く / 来る / 帰る (Destination).',
      'Place + に + いる (animate) / ある (inanimate) (Location of existence).',
      'Person + に + 会う / あげる / 電話をかける (Recipient/target of interaction).'
    ],
    examples: [
      {
        jp: '朝七時に起きます。',
        romaji: 'Asa shichi-ji ni okimasu.',
        en: 'I wake up at 7:00 AM.'
      },
      {
        jp: '机の上にノートパソコンがあります。',
        romaji: 'Tsukue no ue ni nootopasokon ga arimasu.',
        en: 'There is a laptop on the desk.'
      },
      {
        jp: '明日友達に会います。',
        romaji: 'Ashita tomodachi ni aimasu.',
        en: 'I will meet my friend tomorrow.'
      }
    ],
    commonMistakes: [
      'Adding に after relative time words like *あしたに or *きょうに. These do not take に!'
    ],
    practiceQuestions: [
      {
        question: '日曜日 ___ 京都へ行きます。',
        options: ['に', 'を', 'で', 'が'],
        answer: 0,
        explanation: 'Specific days like 日曜日 take に.'
      }
    ]
  },
  {
    id: 'g-5',
    level: 'Beginner (N5)',
    title: 'Location of Action & Means: で (de)',
    category: 'Particles',
    explanation: 'で indicates where an active action occurs, or the method, instrument, tool, or language used to perform an action.',
    usageRules: [
      'Place + で + Action Verb (Library で study, Restaurant で eat).',
      'Tool/Means + で (Bus で go, Chopsticks で eat, Japanese で speak).'
    ],
    examples: [
      {
        jp: '図書館で静かに勉強します。',
        romaji: 'Toshokan de shizuka ni benkyou shimasu.',
        en: 'I study quietly at the library.'
      },
      {
        jp: '電車で大学へ通っています。',
        romaji: 'Densha de daigaku e kayotteimasu.',
        en: 'I commute to university by train.'
      },
      {
        jp: '日本語でメールを書きました。',
        romaji: 'Nihongo de meeru o kakimashita.',
        en: 'I wrote the email in Japanese.'
      }
    ],
    commonMistakes: [
      'Confusing で (location of action) with に (location of static existence like ある/いる).'
    ],
    practiceQuestions: [
      {
        question: 'レストラン ___ 美味しい料理を食べました。',
        options: ['に', 'で', 'へ', 'を'],
        answer: 1,
        explanation: '食べる is an action, so the place where it occurs takes で.'
      }
    ]
  },
  {
    id: 'g-6',
    level: 'Beginner (N5)',
    title: 'Copula & Politeness: です (desu) & ます (masu)',
    category: 'Basic Sentence Structure',
    explanation: 'です functions like the English verb "to be" in polite statements for nouns and adjectives. ます is attached to verb stems to make them polite present/future.',
    usageRules: [
      'Noun / な-adj + です (Affirmative polite: "is/are")',
      'Noun / な-adj + ではありません / じゃないです (Negative polite: "is not")',
      'Verb stem + ます (Affirmative polite)',
      'Verb stem + ません (Negative polite)',
      'Add か at the end of a sentence to turn it into a polite question (です -> ですか, ます -> ますか).'
    ],
    examples: [
      {
        jp: 'これは私のコンピュータです。',
        romaji: 'Kore wa watashi no konpyuuta desu.',
        en: 'This is my computer.'
      },
      {
        jp: '毎日三時間勉強します。',
        romaji: 'Mainichi san-jikan benkyou shimasu.',
        en: 'I study for three hours every day.'
      },
      {
        jp: '明日は学校へ行きません。',
        romaji: 'Ashita wa gakkou e ikimasen.',
        en: 'I will not go to school tomorrow.'
      }
    ],
    commonMistakes: [
      'Attaching です directly to a verb in present tense (e.g. *行きますです is wrong).'
    ],
    practiceQuestions: [
      {
        question: 'Make polite question: 「あなたはエンジニア ___」',
        options: ['ですか', 'ますか', 'でした', 'ません'],
        answer: 0,
        explanation: 'Noun + です + question particle か forms "Are you an engineer?".'
      }
    ]
  },

  // ==========================================
  // INTERMEDIATE GRAMMAR
  // ==========================================
  {
    id: 'g-7',
    level: 'Intermediate (N4-N3)',
    title: 'て-Form (Te-form) & 〜ている (Continuous State)',
    category: 'Verb Conjugation',
    explanation: 'The て-form connects clauses and acts as the foundation for numerous compound grammar patterns. 〜ている expresses ongoing actions (present continuous) or enduring states resultant from an action.',
    usageRules: [
      'Ongoing action: 今、本を読んでいる (I am reading a book now).',
      'Resultant state: 結婚している (is married), 知っている (knows), 住んでいる (lives/resides).',
      'Connecting actions in chronological sequence: 起きて、顔を洗って、朝食を食べた (Woke up, washed face, and ate breakfast).'
    ],
    examples: [
      {
        jp: '今、プログラミング言語の勉強をしています。',
        romaji: 'Ima, puroguramingu gengo no benkyou o shiteimasu.',
        en: 'I am currently studying a programming language.'
      },
      {
        jp: '私は東京に住んでいます。',
        romaji: 'Watashi wa Toukyou ni sundeimasu.',
        en: 'I live in Tokyo (state resulting from moving).'
      },
      {
        jp: '写真を撮って、SNSに投稿しました。',
        romaji: 'Shashin o totte, SNS ni toukou shimashita.',
        en: 'I took a photo and posted it to social media.'
      }
    ],
    commonMistakes: [
      'Using 知ります for "I know". In Japanese, knowing is a continuous state: 知っています (Shitteimasu). For negative, use 知りません (not *知っていません).'
    ],
    practiceQuestions: [
      {
        question: '「私は田中さんの連絡先を ___」 (I know Tanaka\'s contact info)',
        options: ['知っています', '知ります', '知るです', '知っていました'],
        answer: 0,
        explanation: 'Possessing knowledge is an enduring state expressed with 知っています.'
      }
    ]
  },
  {
    id: 'g-8',
    level: 'Intermediate (N4-N3)',
    title: 'Potential Form: 〜ことができる / 〜(ら)れる (Can do)',
    category: 'Verbal Capability',
    explanation: 'Expresses ability, skill, or possibility ("can do", "able to do").',
    usageRules: [
      'Dictionary verb + ことができる (Universal formal pattern).',
      'Group 1 Godan: change final "u" to "e" + る (話す -> 話せる, 行く -> 行ける).',
      'Group 2 Ichidan: drop る + られる (食べる -> 食べられる).',
      'Group 3 Irregular: する -> できる, くる -> こられる.',
      'The object particle を often changes to が with potential verbs.'
    ],
    examples: [
      {
        jp: '日本語で日常会話をすることができます。',
        romaji: 'Nihongo de nichijou kaiwa o suru koto ga dekimasu.',
        en: 'I can have everyday conversations in Japanese.'
      },
      {
        jp: '漢字をたくさん書けるようになりました。',
        romaji: 'Kanji o takusan kakeru you ni narimashita.',
        en: 'I have become able to write many kanji.'
      },
      {
        jp: '辛い料理が食べられますか？',
        romaji: 'Karai ryouri ga taberaremasu ka?',
        en: 'Can you eat spicy food?'
      }
    ],
    commonMistakes: [
      'Using を instead of が when highlighting the target capability (漢字が書ける is more natural than 漢字を書ける in standard grammar).'
    ],
    practiceQuestions: [
      {
        question: 'Potential form of 泳ぐ (to swim):',
        options: ['泳げる', '泳がれる', '泳ぎる', '泳ぐられる'],
        answer: 0,
        explanation: 'Godan verb 泳ぐ (oyogu) changes -u to -e: 泳げる (oyogeru).'
      }
    ]
  },
  {
    id: 'g-9',
    level: 'Intermediate (N4-N3)',
    title: 'Conditionals: 〜たら, 〜ば, 〜なら, 〜と (If / When)',
    category: 'Conditionals',
    explanation: 'Japanese has four distinct conditional forms, each with unique nuances and constraints.',
    usageRules: [
      '〜たら (Past stem + ら): Most versatile, sequential ("once X happens, then Y"), hypothetical.',
      '〜ば: Logical conditional ("if X, then definitely Y").',
      '〜なら: Contextual / conversational ("if that\'s the case / if it\'s X you\'re talking about").',
      '〜と: Natural / inevitable consequence ("whenever X happens, Y always follows automatically", e.g. turn right and the bank is there).'
    ],
    examples: [
      {
        jp: '東京駅に着いたら、すぐに連絡してください。',
        romaji: 'Toukyou-eki ni tsuitara, sugu ni renraku shite kudasai.',
        en: 'Once you arrive at Tokyo Station, please contact me immediately.'
      },
      {
        jp: '春になると、公園の桜が咲きます。',
        romaji: 'Haru ni naru to, kouen no sakura ga sakimasu.',
        en: 'When spring comes, the park\'s cherry blossoms bloom (natural consequence).'
      },
      {
        jp: '日本酒なら、この銘柄がおすすめです。',
        romaji: 'Nihonshu nara, kono meigara ga osusume desu.',
        en: 'If it\'s Japanese sake you\'re looking for, I recommend this brand.'
      }
    ],
    commonMistakes: [
      'Using 〜と with a request or volition in clause 2 (e.g. *駅に着くと、電話してください is ungrammatical; must use 〜たら).'
    ],
    practiceQuestions: [
      {
        question: 'Which conditional works for natural mechanical consequence: 「このボタンを___、水が出ます。」',
        options: ['押すと', '押すなら', '押せばいい', '押したい'],
        answer: 0,
        explanation: '〜と expresses inevitable automatic consequences.'
      }
    ]
  },

  // ==========================================
  // ADVANCED GRAMMAR
  // ==========================================
  {
    id: 'g-10',
    level: 'Advanced (N2-N1)',
    title: 'Honorific Japanese: 敬語 (Keigo - Sonkeigo & Kenjougo)',
    category: 'Honorifics & Business',
    explanation: 'Keigo is the sophisticated Japanese politeness hierarchy essential for business, academia, and social respect.',
    usageRules: [
      '丁寧語 (Teineigo): Standard polite speech (です/ます).',
      '尊敬語 (Sonkeigo - Respectful): Elevates the listener\'s or third party\'s actions. Patterns: お+Stem+になる, or special verbs (いらっしゃる, おっしゃる, なさる, ご覧になる).',
      '謙譲語 (Kenjougo - Humble): Lowers the speaker\'s actions to elevate the counterpart. Patterns: お+Stem+する / いたす, or special verbs (参る, 申す, 拝見する, いただく).'
    ],
    examples: [
      {
        jp: '先生は何時に研究室にいらっしゃいますか？ (尊敬語)',
        romaji: 'Sensei wa nanji ni kenkyuushitsu ni irasshaimasu ka?',
        en: 'What time will the professor be at the laboratory? (Respectful)'
      },
      {
        jp: '送っていただいた資料を拝見いたしました。 (謙譲語)',
        romaji: 'Okutte itadaita shiryou o haiken itashimashita.',
        en: 'I have respectfully reviewed the materials you sent. (Humble)'
      },
      {
        jp: '明日の午後、御社へ伺います。 (謙譲語)',
        romaji: 'Ashita no gogo, onsha e ukagaimasu.',
        en: 'I will humbly visit your company tomorrow afternoon.'
      }
    ],
    commonMistakes: [
      'Using Sonkeigo for one\'s own actions (e.g. *私が先生におっしゃいました is disastrous; must use humble 申しました).'
    ],
    practiceQuestions: [
      {
        question: 'Humble expression for "I will read (your email)":',
        options: ['拝読します', 'お読みになります', '読まれます', 'ご覧になります'],
        answer: 0,
        explanation: '拝読する (haidoku suru) is humble Kenjougo for reading something received from a superior.'
      }
    ]
  },
  {
    id: 'g-11',
    level: 'Advanced (N2-N1)',
    title: '〜わけにはいかない (Cannot afford to / Must not out of principle)',
    category: 'Nuance & Modality',
    explanation: 'Indicates that one cannot do something due to social obligation, moral conscience, psychological resistance, or strong common sense circumstances.',
    usageRules: [
      'Verb (Dictionary form) + わけにはいかない (Cannot do, even if I want to).',
      'Verb (ない-form) + わけにはいかない (Must do, cannot avoid doing).'
    ],
    examples: [
      {
        jp: '明日は大事な最終試験があるので、休むわけにはいきません。',
        romaji: 'Ashita wa daiji na saishuu shiken ga aru node, yasumu wake ni wa ikimasen.',
        en: 'Since there is an important final exam tomorrow, I cannot afford to take the day off.'
      },
      {
        jp: 'チームリーダーとして、この責任から逃げるわけにはいかない。',
        romaji: 'Chiimu riidaa toshite, kono sekinin kara nigeru wake ni wa ikanai.',
        en: 'As team leader, I cannot possibly run away from this responsibility.'
      }
    ],
    commonMistakes: [
      'Confusing physical impossibility (〜ことができない) with social/moral prohibition (〜わけにはいかない).'
    ],
    practiceQuestions: [
      {
        question: 'Choose the appropriate meaning for: 「約束したから、行かないわけにはいかない。」',
        options: [
          'Because I promised, I must go.',
          'Because I promised, I cannot go.',
          'I don\'t want to promise.',
          'I forgot my promise.'
        ],
        answer: 0,
        explanation: 'Verb-ない + わけにはいかない means "cannot NOT do" = must do out of duty.'
      }
    ]
  }
];
