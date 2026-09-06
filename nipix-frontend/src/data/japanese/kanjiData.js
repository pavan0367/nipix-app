/**
 * Japanese Kanji Dataset
 * Comprehensive Kanji entries covering JLPT N5 through N1 with radicals,
 * stroke counts, On'yomi, Kun'yomi, meanings, example words, and example sentences.
 */

export const KANJI_RADICALS_INTRO = [
  { radical: '人 / 亻 (hito / ninben)', name: 'Person', meaning: 'Concepts related to human actions, character, or social roles', examples: '休 (rest), 体 (body), 信 (trust)' },
  { radical: '木 (ki / kihen)', name: 'Tree / Wood', meaning: 'Vegetation, wooden structures, forestry, plants', examples: '林 (grove), 森 (forest), 本 (book/origin), 机 (desk)' },
  { radical: '氵 (sanzui)', name: 'Water', meaning: 'Liquids, rivers, flow, oceans, cleaning', examples: '海 (sea), 池 (pond), 洗 (wash), 泳 (swim)' },
  { radical: '日 (hi / nichi)', name: 'Sun / Day', meaning: 'Time, sunlight, days, illumination, bright concepts', examples: '明 (bright), 早 (early), 時 (time), 春 (spring)' },
  { radical: '心 / 忄 (kokoro / risshinben)', name: 'Heart / Mind', meaning: 'Feelings, thoughts, emotions, psychology', examples: '思 (think), 愛 (love), 忙 (busy), 忘 (forget)' },
  { radical: '言 / 訁 (gonben)', name: 'Speech / Words', meaning: 'Speaking, languages, discussions, promises', examples: '語 (language), 話 (speak), 読 (read), 訳 (translate)' },
  { radical: '糸 (ito / itohen)', name: 'Thread / Silk', meaning: 'Textiles, connections, continuation, networks', examples: '結 (tie/bind), 続 (continue), 線 (line), 組 (group)' },
  { radical: '門 (mon / mongamae)', name: 'Gate', meaning: 'Openings, passages, questions, closures', examples: '問 (question), 開 (open), 閉 (close), 間 (interval)' }
];

export const KANJI_DATA = [
  // --- JLPT N5 (Beginner) ---
  {
    id: 'k-1',
    kanji: '日',
    meaning: 'Sun / Day / Japan',
    onyomi: 'ニチ, ジツ (nichi, jitsu)',
    kunyomi: 'ひ, -び, -か (hi, -bi, -ka)',
    strokeCount: 4,
    radical: '日 (sun)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '日本', reading: 'にほん (Nihon)', meaning: 'Japan' },
      { word: '日曜日', reading: 'にちようび (Nichiyoubi)', meaning: 'Sunday' },
      { word: '毎日', reading: 'まいにち (Mainichi)', meaning: 'Every day' },
      { word: '休日', reading: 'きゅうじつ (Kyuujitsu)', meaning: 'Holiday / Day off' }
    ],
    exampleSentence: {
      jp: '今日はとても天気がいい日です。',
      romaji: 'Kyou wa totemo tenki ga ii hi desu.',
      en: 'Today is a very nice day with good weather.'
    }
  },
  {
    id: 'k-2',
    kanji: '本',
    meaning: 'Book / Origin / Main',
    onyomi: 'ホン (hon)',
    kunyomi: 'もと (moto)',
    strokeCount: 5,
    radical: '木 (tree)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '本棚', reading: 'ほんだな (Hondana)', meaning: 'Bookshelf' },
      { word: '日本語', reading: 'にほんご (Nihongo)', meaning: 'Japanese language' },
      { word: '本当', reading: 'ほんとう (Hontou)', meaning: 'Truth / Reality' },
      { word: '基本', reading: 'きほん (Kihon)', meaning: 'Foundation / Basics' }
    ],
    exampleSentence: {
      jp: '図書館で面白い本を借りました。',
      romaji: 'Toshokan de omoshiroi hon o karimashita.',
      en: 'I borrowed an interesting book at the library.'
    }
  },
  {
    id: 'k-3',
    kanji: '人',
    meaning: 'Person / Human being',
    onyomi: 'ジン, ニン (jin, nin)',
    kunyomi: 'ひと (hito)',
    strokeCount: 2,
    radical: '人 (person)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '日本人', reading: 'にほんじん (Nihonjin)', meaning: 'Japanese person' },
      { word: '外国人', reading: 'がいこくじん (Gaikokujin)', meaning: 'Foreigner' },
      { word: '三人', reading: 'さんにん (Sannin)', meaning: 'Three people' },
      { word: '人々', reading: 'ひとびと (Hitobito)', meaning: 'People / The public' }
    ],
    exampleSentence: {
      jp: 'あの人はとても親切な先生です。',
      romaji: 'Ano hito wa totemo shinsetsu na sensei desu.',
      en: 'That person is a very kind teacher.'
    }
  },
  {
    id: 'k-4',
    kanji: '学',
    meaning: 'Study / Learning / Science',
    onyomi: 'ガク (gaku)',
    kunyomi: 'まな・ぶ (mana-bu)',
    strokeCount: 8,
    radical: '子 (child)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '学生', reading: 'がくせい (Gakusei)', meaning: 'Student' },
      { word: '大学', reading: 'だいがく (Daigaku)', meaning: 'University' },
      { word: '学校', reading: 'がっこう (Gakkou)', meaning: 'School' },
      { word: '学ぶ', reading: 'まなぶ (Manabu)', meaning: 'To learn / study' }
    ],
    exampleSentence: {
      jp: '大学で人工知能と情報工学を学んでいます。',
      romaji: 'Daigaku de jinkouchinou to jouhoukougaku o manandeimasu.',
      en: 'I am studying artificial intelligence and computer science at university.'
    }
  },
  {
    id: 'k-5',
    kanji: '生',
    meaning: 'Life / Birth / Genuine',
    onyomi: 'セイ, ショウ (sei, shou)',
    kunyomi: 'い・きる, う・まれる, なま (i-kiru, u-mareru, nama)',
    strokeCount: 5,
    radical: '生 (life)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '先生', reading: 'せんせい (Sensei)', meaning: 'Teacher / Professor' },
      { word: '生活', reading: 'せいかつ (Seikatsu)', meaning: 'Daily life' },
      { word: '生まれる', reading: 'うまれる (Umareru)', meaning: 'To be born' },
      { word: '生ビール', reading: 'なまビール (Nama biiru)', meaning: 'Draft beer' }
    ],
    exampleSentence: {
      jp: '日本での留学生活はとても充実しています。',
      romaji: 'Nihon de no ryuugaku seikatsu wa totemo juujitsu shiteimasu.',
      en: 'Life studying abroad in Japan is very fulfilling.'
    }
  },
  {
    id: 'k-6',
    kanji: '先',
    meaning: 'Before / Ahead / Previous',
    onyomi: 'セン (sen)',
    kunyomi: 'さき, ま・ず (saki, ma-zu)',
    strokeCount: 6,
    radical: '儿 (legs)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '先週', reading: 'せんしゅう (Senshuu)', meaning: 'Last week' },
      { word: '先生', reading: 'せんせい (Sensei)', meaning: 'Teacher' },
      { word: '先月', reading: 'せんげつ (Sengetsu)', meaning: 'Last month' },
      { word: '先に', reading: 'さきに (Saki ni)', meaning: 'Ahead / First' }
    ],
    exampleSentence: {
      jp: 'どうぞお先に召し上がってください。',
      romaji: 'Douzo osaki ni meshagatte kudasai.',
      en: 'Please go ahead and eat first.'
    }
  },
  {
    id: 'k-7',
    kanji: '大',
    meaning: 'Big / Great / Large',
    onyomi: 'ダイ, タイ (dai, tai)',
    kunyomi: 'おお・きい (oo-kii)',
    strokeCount: 3,
    radical: '大 (big)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '大きい', reading: 'おおきい (Ookii)', meaning: 'Large / Big' },
      { word: '大学', reading: 'だいがく (Daigaku)', meaning: 'University' },
      { word: '大変', reading: 'たいへん (Taihen)', meaning: 'Tough / Serious / Very' },
      { word: '大人', reading: 'おとな (Otona)', meaning: 'Adult' }
    ],
    exampleSentence: {
      jp: '富士山は日本で一番大きな山です。',
      romaji: 'Fujisan wa Nihon de ichiban ookina yama desu.',
      en: 'Mount Fuji is the biggest mountain in Japan.'
    }
  },
  {
    id: 'k-8',
    kanji: '小',
    meaning: 'Small / Little',
    onyomi: 'ショウ (shou)',
    kunyomi: 'ちい・さい, こ-, お- (chii-sai, ko-, o-)',
    strokeCount: 3,
    radical: '小 (small)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '小さい', reading: 'ちいさい (Chiisai)', meaning: 'Small / Tiny' },
      { word: '小学校', reading: 'しょうがっこう (Shougakkou)', meaning: 'Elementary school' },
      { word: '小川', reading: 'おがわ (Ogawa)', meaning: 'Stream / Brook' },
      { word: '小鳥', reading: 'ことり (Kotori)', meaning: 'Little bird' }
    ],
    exampleSentence: {
      jp: 'この部屋は少し小さいですが静かです。',
      romaji: 'Kono heya wa sukoshi chiisai desu ga shizuka desu.',
      en: 'This room is a bit small, but it is quiet.'
    }
  },
  {
    id: 'k-9',
    kanji: '行',
    meaning: 'Go / Act / Conduct',
    onyomi: 'コウ, ギョウ, アン (kou, gyou, an)',
    kunyomi: 'い・く, ゆ・く, おこな・う (i-ku, yu-ku, okona-u)',
    strokeCount: 6,
    radical: '行 (go)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '行く', reading: 'いく (Iku)', meaning: 'To go' },
      { word: '旅行', reading: 'りょこう (Ryokou)', meaning: 'Travel / Trip' },
      { word: '銀行', reading: 'ぎんこう (Ginkou)', meaning: 'Bank' },
      { word: '行動', reading: 'こうどう (Koudou)', meaning: 'Action / Behavior' }
    ],
    exampleSentence: {
      jp: '来月新幹線で京都へ旅行に行きます。',
      romaji: 'Raigetsu shinkansen de Kyouto e ryokou ni ikimasu.',
      en: 'Next month, I will go on a trip to Kyoto by Shinkansen.'
    }
  },
  {
    id: 'k-10',
    kanji: '食',
    meaning: 'Eat / Food / Meal',
    onyomi: 'ショク, ジキ (shoku, jiki)',
    kunyomi: 'た・べる, く・う (ta-beru, ku-u)',
    strokeCount: 9,
    radical: '食 (food)',
    level: 'Beginner',
    jlpt: 'N5',
    exampleWords: [
      { word: '食べる', reading: 'たべる (Taberu)', meaning: 'To eat' },
      { word: '食堂', reading: 'しょくどう (Shokudou)', meaning: 'Cafeteria / Dining hall' },
      { word: '朝食', reading: 'ちょうしょく (Choushoku)', meaning: 'Breakfast' },
      { word: '食事', reading: 'しょくじ (Shokuji)', meaning: 'Meal' }
    ],
    exampleSentence: {
      jp: '日本の美味しいラーメンを食べました。',
      romaji: 'Nihon no oishii raamen o tabemashita.',
      en: 'I ate delicious Japanese ramen.'
    }
  },

  // --- JLPT N4 (Elementary) ---
  {
    id: 'k-11',
    kanji: '開',
    meaning: 'Open / Unfold',
    onyomi: 'カイ (kai)',
    kunyomi: 'あ・く, あ・ける, ひら・く (a-ku, a-keru, hira-ku)',
    strokeCount: 12,
    radical: '門 (gate)',
    level: 'Intermediate',
    jlpt: 'N4',
    exampleWords: [
      { word: '開ける', reading: 'あける (Akeru)', meaning: 'To open (something)' },
      { word: '開く', reading: 'あく (Aku)', meaning: '(Something) opens' },
      { word: '開店', reading: 'かいてん (Kaiten)', meaning: 'Store opening' },
      { word: '開発', reading: 'かいはつ (Kaihatsu)', meaning: 'Development (software/tech)' }
    ],
    exampleSentence: {
      jp: '新しいウェブアプリケーションを開発しています。',
      romaji: 'Atarashii webu apurikeeshon o kaihatsu shiteimasu.',
      en: 'We are developing a new web application.'
    }
  },
  {
    id: 'k-12',
    kanji: '発',
    meaning: 'Depart / Emit / Discover / Start',
    onyomi: 'ハツ, ホツ (hatsu, hotsu)',
    kunyomi: 'た・つ (ta-tsu)',
    strokeCount: 9,
    radical: '癶 (tent)',
    level: 'Intermediate',
    jlpt: 'N4',
    exampleWords: [
      { word: '出発', reading: 'しゅっぱつ (Shuppatsu)', meaning: 'Departure' },
      { word: '発表', reading: 'はっぴょう (Happyou)', meaning: 'Presentation / Announcement' },
      { word: '発見', reading: 'はっけん (Hakken)', meaning: 'Discovery' },
      { word: '発明', reading: 'はつめい (Hatsumei)', meaning: 'Invention' }
    ],
    exampleSentence: {
      jp: '電車は午前九時に出発します。',
      romaji: 'Densha wa gozen ku-ji ni shuppatsu shimasu.',
      en: 'The train departs at 9:00 AM.'
    }
  },
  {
    id: 'k-13',
    kanji: '思',
    meaning: 'Think / Consider / Feel',
    onyomi: 'シ (shi)',
    kunyomi: 'おも・う (omo-u)',
    strokeCount: 9,
    radical: '心 (heart)',
    level: 'Intermediate',
    jlpt: 'N4',
    exampleWords: [
      { word: '思う', reading: 'おもう (Omou)', meaning: 'To think / feel' },
      { word: '思い出', reading: 'おもいで (Omoide)', meaning: 'Memory' },
      { word: '思考', reading: 'しこう (Shikou)', meaning: 'Thought / Thinking' },
      { word: '不思議', reading: 'ふしぎ (Fushigi)', meaning: 'Mysterious / Wonder' }
    ],
    exampleSentence: {
      jp: 'この技術は将来とても重要になると思います。',
      romaji: 'Kono gijutsu wa shourai totemo juuyou ni naru to omoimasu.',
      en: 'I think this technology will become very important in the future.'
    }
  },
  {
    id: 'k-14',
    kanji: '考',
    meaning: 'Think / Ponder / Investigate',
    onyomi: 'コウ (kou)',
    kunyomi: 'かんが・える (kanga-eru)',
    strokeCount: 6,
    radical: '老 (old)',
    level: 'Intermediate',
    jlpt: 'N4',
    exampleWords: [
      { word: '考える', reading: 'かんがえる (Kangaeru)', meaning: 'To consider / ponder' },
      { word: '考え', reading: 'かんがえ (Kangae)', meaning: 'Idea / Opinion' },
      { word: '考古学', reading: 'こうこがく (Koukogaku)', meaning: 'Archaeology' },
      { word: '参考', reading: 'さんこう (Sankou)', meaning: 'Reference' }
    ],
    exampleSentence: {
      jp: '良い解決策をよく考えてみましょう。',
      romaji: 'Yoi kaiketsusaku o yoku kangaete mimashou.',
      en: 'Let us think through a good solution carefully.'
    }
  },

  // --- JLPT N3 (Intermediate) ---
  {
    id: 'k-15',
    kanji: '情',
    meaning: 'Emotion / Condition / Information',
    onyomi: 'ジョウ, セイ (jou, sei)',
    kunyomi: 'なさ・け (nasa-ke)',
    strokeCount: 11,
    radical: '忄 (heart)',
    level: 'Intermediate',
    jlpt: 'N3',
    exampleWords: [
      { word: '情報', reading: 'じょうほう (Jouhou)', meaning: 'Information / Data' },
      { word: '感情', reading: 'かんじょう (Kanjou)', meaning: 'Emotion / Feeling' },
      { word: '事情', reading: 'じじょう (Jijou)', meaning: 'Circumstances' },
      { word: '友情', reading: 'ゆうじょう (Yuujou)', meaning: 'Friendship' }
    ],
    exampleSentence: {
      jp: 'インターネットで正確な最新情報を集めました。',
      romaji: 'Intaanetto de seikaku na saishin jouhou o atsumemashita.',
      en: 'I gathered accurate and up-to-date information on the internet.'
    }
  },
  {
    id: 'k-16',
    kanji: '報',
    meaning: 'Report / Reward / News',
    onyomi: 'ホウ (hou)',
    kunyomi: 'むく・いる (muku-iru)',
    strokeCount: 12,
    radical: '土 (earth)',
    level: 'Intermediate',
    jlpt: 'N3',
    exampleWords: [
      { word: '報告', reading: 'ほうこく (Houkoku)', meaning: 'Report' },
      { word: '予報', reading: 'よほう (Yohou)', meaning: 'Forecast (e.g. weather)' },
      { word: '報酬', reading: 'ほうしゅう (Houshuu)', meaning: 'Remuneration / Reward' },
      { word: '報道', reading: 'ほうどう (Houdou)', meaning: 'Journalism / News coverage' }
    ],
    exampleSentence: {
      jp: '実験の結果を詳しく教授に報告しました。',
      romaji: 'Jikken no kekka o kuwashiku kyouju ni houkoku shimashita.',
      en: 'I reported the experiment results to the professor in detail.'
    }
  },
  {
    id: 'k-17',
    kanji: '現',
    meaning: 'Present / Existing / Appear',
    onyomi: 'ゲン (gen)',
    kunyomi: 'あらわ・れる, あらわ・す (arawa-reru, arawa-su)',
    strokeCount: 11,
    radical: '玉 (jade)',
    level: 'Intermediate',
    jlpt: 'N3',
    exampleWords: [
      { word: '現在', reading: 'げんざい (Genzai)', meaning: 'Current / Present' },
      { word: '現実', reading: 'げんじつ (Genjitsu)', meaning: 'Reality' },
      { word: '表現', reading: 'ひょうげん (Hyougen)', meaning: 'Expression' },
      { word: '現代', reading: 'げんだい (Gendai)', meaning: 'Modern era' }
    ],
    exampleSentence: {
      jp: '夢を現実にするために日々努力を重ねています。',
      romaji: 'Yume o genjitsu ni suru tame ni hibi doryoku o kasaneteimasu.',
      en: 'I strive every day to turn my dreams into reality.'
    }
  },

  // --- JLPT N2 (Upper Intermediate) ---
  {
    id: 'k-18',
    kanji: '識',
    meaning: 'Discern / Knowledge / Consciousness',
    onyomi: 'シキ (shiki)',
    kunyomi: 'し・る, しる・す (shi-ru, shiru-su)',
    strokeCount: 19,
    radical: '言 (words)',
    level: 'Advanced',
    jlpt: 'N2',
    exampleWords: [
      { word: '知識', reading: 'ちしき (Chishiki)', meaning: 'Knowledge' },
      { word: '意識', reading: 'いしき (Ishiki)', meaning: 'Consciousness / Awareness' },
      { word: '認識', reading: 'にんしき (Ninshiki)', meaning: 'Recognition / Perception' },
      { word: '常識', reading: 'じょうしき (Joushiki)', meaning: 'Common sense' }
    ],
    exampleSentence: {
      jp: '深層学習による画像認識モデルの精度が向上しました。',
      romaji: 'Shinsou gakushuu ni yoru gazou ninshiki moderu no seido ga koujou shimashita.',
      en: 'The accuracy of the image recognition model improved via deep learning.'
    }
  },
  {
    id: 'k-19',
    kanji: '構',
    meaning: 'Construct / Frame / Posture',
    onyomi: 'コウ (kou)',
    kunyomi: 'かま・える, かま・う (kama-eru, kama-u)',
    strokeCount: 14,
    radical: '木 (wood)',
    level: 'Advanced',
    jlpt: 'N2',
    exampleWords: [
      { word: '構造', reading: 'こうぞう (Kouzou)', meaning: 'Structure / Architecture' },
      { word: '構成', reading: 'こうせい (Kousei)', meaning: 'Composition / Organization' },
      { word: '機構', reading: 'きこう (Kikou)', meaning: 'Mechanism / Organization' },
      { word: '構想', reading: 'こうそう (Kousou)', meaning: 'Concept / Grand plan' }
    ],
    exampleSentence: {
      jp: 'マイクロサービスアーキテクチャの基本構造を設計しました。',
      romaji: 'Maikurosaabisu aakitekucha no kihon kouzou o sekkei shimashita.',
      en: 'We designed the basic structure of the microservices architecture.'
    }
  },

  // --- JLPT N1 (Advanced) ---
  {
    id: 'k-20',
    kanji: '緻',
    meaning: 'Fine / Precise / Elaborate',
    onyomi: 'チ (chi)',
    kunyomi: 'こまか・い (komaka-i)',
    strokeCount: 15,
    radical: '糸 (thread)',
    level: 'Advanced',
    jlpt: 'N1',
    exampleWords: [
      { word: '緻密', reading: 'ちみつ (Chimitsu)', meaning: 'Meticulous / Elaborate / Minute' },
      { word: '精緻', reading: 'せいち (Seichi)', meaning: 'Exquisite / Highly delicate' },
      { word: '緻密な計画', reading: 'ちみつなけいかく (Chimitsu na keikaku)', meaning: 'Meticulous plan' }
    ],
    exampleSentence: {
      jp: 'この暗号化アルゴリズムは緻密な数学的理論に基づいています。',
      romaji: 'Kono angouka arugorizumu wa chimitsu na suugakuteki riron ni motozuiteimasu.',
      en: 'This encryption algorithm is founded upon meticulous mathematical theory.'
    }
  },
  {
    id: 'k-21',
    kanji: '諮',
    meaning: 'Consult with / Deliberate',
    onyomi: 'シ (shi)',
    kunyomi: 'はか・る (haka-ru)',
    strokeCount: 16,
    radical: '言 (words)',
    level: 'Advanced',
    jlpt: 'N1',
    exampleWords: [
      { word: '諮問', reading: 'しもん (Shimon)', meaning: 'Consultation / Inquest' },
      { word: '諮る', reading: 'はかる (Hakaru)', meaning: 'To consult / submit for advice' },
      { word: '諮問機関', reading: 'しもんきかん (Shimon kikan)', meaning: 'Advisory committee' }
    ],
    exampleSentence: {
      jp: 'AIの倫理指針について専門家の諮問委員会に諮りました。',
      romaji: 'AI no rinri shishin ni tsuite senmonka no shimon iinkai ni hakarimashita.',
      en: 'We consulted the expert advisory committee regarding AI ethical guidelines.'
    }
  }
];
