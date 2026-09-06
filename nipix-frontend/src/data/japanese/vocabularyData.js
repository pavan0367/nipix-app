/**
 * Japanese Vocabulary Library
 * Categorized vocabulary covering 28+ domains with Japanese, Romaji,
 * English definitions, example sentences, and English translations.
 */

export const VOCAB_CATEGORIES = [
  'All Words',
  'Everyday',
  'Greetings',
  'Family',
  'Food & Drinks',
  'College & School',
  'Technology & Internet',
  'Programming',
  'Science',
  'Travel & Transport',
  'Shopping',
  'Weather & Nature',
  'Body Parts',
  'Jobs & Business',
  'Places & Buildings',
  'Animals',
  'Colors & Numbers',
  'Emotions & Hobbies',
  'Common Verbs',
  'Common Adjectives',
  'JLPT Essentials'
];

export const VOCABULARY_DATA = [
  // --- Everyday & Greetings ---
  {
    id: 'v-1',
    category: 'Greetings',
    japanese: 'こんにちは',
    romaji: 'Konnichiwa',
    english: 'Hello / Good afternoon',
    sentence: {
      jp: '先生、こんにちは！今日もよろしくお願いします。',
      romaji: 'Sensei, konnichiwa! Kyou mo yoroshiku onegaishimasu.',
      en: 'Hello Professor! Looking forward to working with you today as well.'
    }
  },
  {
    id: 'v-2',
    category: 'Greetings',
    japanese: 'ありがとう',
    romaji: 'Arigatou',
    english: 'Thank you',
    sentence: {
      jp: '手伝ってくれて本当にありがとう。',
      romaji: 'Tetsudatte kurete hontou ni arigatou.',
      en: 'Thank you so much for helping me.'
    }
  },
  {
    id: 'v-3',
    category: 'Everyday',
    japanese: '鍵 (かぎ)',
    romaji: 'Kagi',
    english: 'Key',
    sentence: {
      jp: '部屋の鍵をカバンに入れました。',
      romaji: 'Heya no kagi o kaban ni iremashita.',
      en: 'I put the room key in my bag.'
    }
  },
  {
    id: 'v-4',
    category: 'Everyday',
    japanese: '傘 (かさ)',
    romaji: 'Kasa',
    english: 'Umbrella',
    sentence: {
      jp: '午後から雨が降るそうなので、傘を持っていきます。',
      romaji: 'Gogo kara ame ga furu sou na node, kasa o motte ikimasu.',
      en: 'It seems it will rain in the afternoon, so I will take an umbrella.'
    }
  },

  // --- Family ---
  {
    id: 'v-5',
    category: 'Family',
    japanese: '家族 (かぞく)',
    romaji: 'Kazoku',
    english: 'Family',
    sentence: {
      jp: '私の家族は四人います。',
      romaji: 'Watashi no kazoku wa yonin imasu.',
      en: 'There are four people in my family.'
    }
  },
  {
    id: 'v-6',
    category: 'Family',
    japanese: '両親 (りょうしん)',
    romaji: 'Ryoushin',
    english: 'Parents',
    sentence: {
      jp: '週末に両親に電話をかけます。',
      romaji: 'Shuumatsu ni ryoushin ni denwa o kakemasu.',
      en: 'I call my parents on weekends.'
    }
  },
  {
    id: 'v-7',
    category: 'Family',
    japanese: '兄弟 (きょうだい)',
    romaji: 'Kyoudai',
    english: 'Siblings / Brothers',
    sentence: {
      jp: '兄と妹がいるので、三人兄弟です。',
      romaji: 'Ani to imouto ga iru node, sannin kyoudai desu.',
      en: 'I have an older brother and younger sister, so we are three siblings.'
    }
  },

  // --- Food & Drinks ---
  {
    id: 'v-8',
    category: 'Food & Drinks',
    japanese: '緑茶 (りょくちゃ / お茶)',
    romaji: 'Ryokucha / Ocha',
    english: 'Green tea',
    sentence: {
      jp: '食後に温かい緑茶を飲むのが好きです。',
      romaji: 'Shokugo ni atatakai ryokucha o nomu no ga suki desu.',
      en: 'I like drinking warm green tea after meals.'
    }
  },
  {
    id: 'v-9',
    category: 'Food & Drinks',
    japanese: '朝ご飯 (あさごはん)',
    romaji: 'Asagohan',
    english: 'Breakfast',
    sentence: {
      jp: '毎朝七時に朝ご飯を食べます。',
      romaji: 'Maiasa shichi-ji ni asagohan o tabemasu.',
      en: 'I eat breakfast at 7:00 every morning.'
    }
  },
  {
    id: 'v-10',
    category: 'Food & Drinks',
    japanese: '水 (みず)',
    romaji: 'Mizu',
    english: 'Water (cold/room temp)',
    sentence: {
      jp: 'お水を一杯いただけますか？',
      romaji: 'Omizu o ippai itadakemasu ka?',
      en: 'Could I have a glass of water, please?'
    }
  },

  // --- College & School ---
  {
    id: 'v-11',
    category: 'College & School',
    japanese: '大学 (だいがく)',
    romaji: 'Daigaku',
    english: 'University / College',
    sentence: {
      jp: '大学の図書館でレポートを書いています。',
      romaji: 'Daigaku no toshokan de repooto o kaiteimasu.',
      en: 'I am writing a report at the university library.'
    }
  },
  {
    id: 'v-12',
    category: 'College & School',
    japanese: '講義 (こうぎ)',
    romaji: 'Kougi',
    english: 'Lecture / Academic class',
    sentence: {
      jp: '今日の機械学習の講義はとても刺激的でした。',
      romaji: 'Kyou no kikaigakushuu no kougi wa totemo shigekiteki deshita.',
      en: 'Today\'s machine learning lecture was very stimulating.'
    }
  },
  {
    id: 'v-13',
    category: 'College & School',
    japanese: '研究室 (けんきゅうしつ)',
    romaji: 'Kenkyuushitsu',
    english: 'Research laboratory / Professor\'s lab',
    sentence: {
      jp: '放課後はAI研究室で実験を行います。',
      romaji: 'Houkago wa AI kenkyuushitsu de jikken o okonaimasu.',
      en: 'After class, we perform experiments in the AI research lab.'
    }
  },

  // --- Technology & Internet ---
  {
    id: 'v-14',
    category: 'Technology & Internet',
    japanese: '人工知能 (じんこうちのう)',
    romaji: 'Jinkouchinou (AI)',
    english: 'Artificial Intelligence',
    sentence: {
      jp: '人工知能は教育や医療の現場を大きく変えています。',
      romaji: 'Jinkouchinou wa kyouiku ya iryou no genba o ookiku kaeteimasu.',
      en: 'Artificial intelligence is drastically transforming education and healthcare.'
    }
  },
  {
    id: 'v-15',
    category: 'Technology & Internet',
    japanese: '通信 (つうしん)',
    romaji: 'Tsuushin',
    english: 'Telecommunications / Data transmission',
    sentence: {
      jp: '高速データ通信のおかげで快適に作業できます。',
      romaji: 'Kousoku deeta tsuushin no okage de kaiteki ni sagyou dekimasu.',
      en: 'Thanks to high-speed data communications, we can work comfortably.'
    }
  },
  {
    id: 'v-16',
    category: 'Technology & Internet',
    japanese: '検索 (けんさく)',
    romaji: 'Kensaku',
    english: 'Search / Retrieval',
    sentence: {
      jp: 'キーワードで論文のデータベースを検索しました。',
      romaji: 'Kiiwaado de ronbun no deetabeesu o kensaku shimashita.',
      en: 'I searched the research paper database with keywords.'
    }
  },

  // --- Programming ---
  {
    id: 'v-17',
    category: 'Programming',
    japanese: '開発 (かいはつ)',
    romaji: 'Kaihatsu',
    english: 'Development (software/system)',
    sentence: {
      jp: '新しいReactフロントエンドを開発しています。',
      romaji: 'Atarashii React furontoendo o kaihatsu shiteimasu.',
      en: 'We are developing a new React frontend.'
    }
  },
  {
    id: 'v-18',
    category: 'Programming',
    japanese: '関数 (かんすう)',
    romaji: 'Kansuu',
    english: 'Function (programming / math)',
    sentence: {
      jp: 'この非同期関数はAPIからデータを取得します。',
      romaji: 'Kono hidouki kansuu wa API kara deeta o shutoku shimasu.',
      en: 'This asynchronous function retrieves data from the API.'
    }
  },
  {
    id: 'v-19',
    category: 'Programming',
    japanese: '不具合 / バグ (ふぐあい)',
    romaji: 'Fuguai / Bagu',
    english: 'Bug / Defect / Malfunction',
    sentence: {
      jp: 'コードの不具合を修正してプルリクエストを送りました。',
      romaji: 'Koodo no fuguai o shuusei shite puru rikuesuto o okurimashita.',
      en: 'I fixed the code bug and sent a pull request.'
    }
  },
  {
    id: 'v-20',
    category: 'Programming',
    japanese: '変数 (へんすう)',
    romaji: 'Hensuu',
    english: 'Variable',
    sentence: {
      jp: '変数のスコープを注意深く確認してください。',
      romaji: 'Hensuu no sukoopu o chuuibukaku kakunin shite kudasai.',
      en: 'Please check the variable scope carefully.'
    }
  },

  // --- Science ---
  {
    id: 'v-21',
    category: 'Science',
    japanese: '物理学 (ぶつりがく)',
    romaji: 'Butsurigaku',
    english: 'Physics',
    sentence: {
      jp: '量子力学は現代物理学の最も魅力的な分野の一つです。',
      romaji: 'Ryoushirikigaku wa gendai butsurigaku no mottomo miryokuteki na bunya no hitotsu desu.',
      en: 'Quantum mechanics is one of modern physics\' most fascinating fields.'
    }
  },
  {
    id: 'v-22',
    category: 'Science',
    japanese: '実験 (じっけん)',
    romaji: 'Jikken',
    english: 'Experiment',
    sentence: {
      jp: '実験の仮説を検証するためにデータを測定しました。',
      romaji: 'Jikken no kasetsu o kenshou suru tame ni deeta o sokutei shimashita.',
      en: 'We measured data to verify the experimental hypothesis.'
    }
  },

  // --- Travel & Transport ---
  {
    id: 'v-23',
    category: 'Travel & Transport',
    japanese: '新幹線 (しんかんせん)',
    romaji: 'Shinkansen',
    english: 'Bullet train',
    sentence: {
      jp: '新幹線に乗れば東京から大阪まで二時間半で着きます。',
      romaji: 'Shinkansen ni noreba Toukyou kara Oosaka made ni-jikan han de tsukimasu.',
      en: 'If you ride the Shinkansen, you arrive from Tokyo to Osaka in 2.5 hours.'
    }
  },
  {
    id: 'v-24',
    category: 'Travel & Transport',
    japanese: '切符 (きっぷ)',
    romaji: 'Kippu',
    english: 'Ticket',
    sentence: {
      jp: '券売機で電車の往復切符を買いました。',
      romaji: 'Kenbaiki de densha no oufuku kippu o kaimashita.',
      en: 'I bought a round-trip train ticket at the ticket machine.'
    }
  },
  {
    id: 'v-25',
    category: 'Travel & Transport',
    japanese: '空港 (くうこう)',
    romaji: 'Kuukou',
    english: 'Airport',
    sentence: {
      jp: '成田空港で友人の到着を待っています。',
      romaji: 'Narita kuukou de yuujin no touchaku o matteimasu.',
      en: 'I am waiting for my friend\'s arrival at Narita Airport.'
    }
  },

  // --- Shopping ---
  {
    id: 'v-26',
    category: 'Shopping',
    japanese: '値段 (ねだん)',
    romaji: 'Nedan',
    english: 'Price',
    sentence: {
      jp: 'この最新ヘッドホンの値段はいくらですか？',
      romaji: 'Kono saishin heddohon no nedan wa ikura desu ka?',
      en: 'How much is the price of these latest headphones?'
    }
  },
  {
    id: 'v-27',
    category: 'Shopping',
    japanese: 'お会計 (おかいけい)',
    romaji: 'Okaikei',
    english: 'Bill / Check / Payment',
    sentence: {
      jp: 'すみません、お会計をお願いします。',
      romaji: 'Sumimasen, okaikei o onegaishimasu.',
      en: 'Excuse me, could we have the bill please?'
    }
  },

  // --- Weather & Nature ---
  {
    id: 'v-28',
    category: 'Weather & Nature',
    japanese: '天気予報 (てんきよほう)',
    romaji: 'Tenki yohou',
    english: 'Weather forecast',
    sentence: {
      jp: '天気予報によると明日は一日中晴れの予報です。',
      romaji: 'Tenki yohou ni yoru to ashita wa ichinichijuu hare no yohou desu.',
      en: 'According to the weather forecast, tomorrow will be sunny all day.'
    }
  },
  {
    id: 'v-29',
    category: 'Weather & Nature',
    japanese: '桜 (さくら)',
    romaji: 'Sakura',
    english: 'Cherry blossom',
    sentence: {
      jp: '春になると公園の桜が満開になります。',
      romaji: 'Haru ni naru to kouen no sakura ga mankai ni narimasu.',
      en: 'When spring arrives, the cherry blossoms in the park reach full bloom.'
    }
  },

  // --- Body Parts ---
  {
    id: 'v-30',
    category: 'Body Parts',
    japanese: '目 (め)',
    romaji: 'Me',
    english: 'Eye',
    sentence: {
      jp: '長時間のプログラミングで目が疲れました。',
      romaji: 'Choujikan no puroguramingu de me ga tsukaremashita.',
      en: 'My eyes are tired from programming for long hours.'
    }
  },
  {
    id: 'v-31',
    category: 'Body Parts',
    japanese: '心 (こころ)',
    romaji: 'Kokoro',
    english: 'Heart / Mind / Spirit',
    sentence: {
      jp: '温かい言葉に心が落ち着きました。',
      romaji: 'Atatakai kotoba ni kokoro ga ochitsukimashita.',
      en: 'My heart calmed down with the warm words.'
    }
  },

  // --- Jobs & Business ---
  {
    id: 'v-32',
    category: 'Jobs & Business',
    japanese: '会議 (かいぎ)',
    romaji: 'Kaigi',
    english: 'Meeting / Conference',
    sentence: {
      jp: '午後二時から新規プロジェクトの会議が始まります。',
      romaji: 'Gogo ni-ji kara shinki purojekuto no kaigi ga hajimarimasu.',
      en: 'The meeting for the new project starts from 2:00 PM.'
    }
  },
  {
    id: 'v-33',
    category: 'Jobs & Business',
    japanese: '名刺 (めいし)',
    romaji: 'Meishi',
    english: 'Business card',
    sentence: {
      jp: '日本のビジネスでは両手で名刺を交換します。',
      romaji: 'Nihon no bijinesu dewa ryoute de meishi o koukan shimasu.',
      en: 'In Japanese business, business cards are exchanged with both hands.'
    }
  },

  // --- Common Verbs ---
  {
    id: 'v-34',
    category: 'Common Verbs',
    japanese: '話す (はなす)',
    romaji: 'Hanasu',
    english: 'To speak / talk',
    sentence: {
      jp: '日本語を流暢に話せるようになりたいです。',
      romaji: 'Nihongo o ryuuchou ni hanaseru you ni naritai desu.',
      en: 'I want to become able to speak Japanese fluently.'
    }
  },
  {
    id: 'v-35',
    category: 'Common Verbs',
    japanese: '読む (よむ)',
    romaji: 'Yomu',
    english: 'To read',
    sentence: {
      jp: '毎晩寝る前に技術書を読みます。',
      romaji: 'Maiban neru mae ni gijutsusho o yomimasu.',
      en: 'I read tech books every night before sleeping.'
    }
  },
  {
    id: 'v-36',
    category: 'Common Verbs',
    japanese: '理解する (りかいする)',
    romaji: 'Rikai suru',
    english: 'To understand / comprehend',
    sentence: {
      jp: 'アルゴリズムの仕組みを完全に理解しました。',
      romaji: 'Arugorizumu no shikumi o kanzen ni rikai shimashita.',
      en: 'I completely understood how the algorithm works.'
    }
  },

  // --- Common Adjectives ---
  {
    id: 'v-37',
    category: 'Common Adjectives',
    japanese: '美しい (うつくしい)',
    romaji: 'Utsukushii',
    english: 'Beautiful / Graceful',
    sentence: {
      jp: '夕暮れ時の富士山は息をのむほど美しいです。',
      romaji: 'Yuuguredoki no Fujisan wa iki o nomu hodo utsukushii desu.',
      en: 'Mount Fuji at dusk is breathtakingly beautiful.'
    }
  },
  {
    id: 'v-38',
    category: 'Common Adjectives',
    japanese: '便利 (べんり)',
    romaji: 'Benri (na-adj)',
    english: 'Convenient / Handy',
    sentence: {
      jp: 'スマートフォンは勉強にも仕事にもとても便利です。',
      romaji: 'Sumātofon wa benkyou ni mo shigoto ni mo totemo benri desu.',
      en: 'Smartphones are very convenient for both study and work.'
    }
  },
  {
    id: 'v-39',
    category: 'Common Adjectives',
    japanese: '速い (はやい)',
    romaji: 'Hayai',
    english: 'Fast / Speedy',
    sentence: {
      jp: 'このAPIの応答速度は非常に速いです。',
      romaji: 'Kono API no outousokudo wa hijou ni hayai desu.',
      en: 'The response speed of this API is extremely fast.'
    }
  },

  // --- JLPT Essentials ---
  {
    id: 'v-40',
    category: 'JLPT Essentials',
    japanese: '合格 (ごうかく)',
    romaji: 'Goukaku',
    english: 'Passing an exam / Success',
    sentence: {
      jp: '一生懸命勉強してJLPT N2に合格しました！',
      romaji: 'Isshoukenmei benkyou shite JLPT N2 ni goukaku shimashita!',
      en: 'I studied with all my might and passed JLPT N2!'
    }
  }
];
