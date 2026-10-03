// Nipix Japanese Listening Curriculum
// Progressive listening tracks from absolute beginner to JLPT N1 dialogues with speech synthesis and comprehension questions

export const LISTENING_LESSONS = [
  {
    id: 'jp-list-1',
    level: 'Beginner (JLPT N5)',
    title: 'Daily Greetings & Meeting an Exchange Student',
    scenario: 'Tanaka-san meets an international student at university in the morning.',
    duration: '2:15',
    points: 20,
    transcript: [
      { speaker: 'Tanaka', japanese: 'おはようございます、スミスさん！今日はいい天気ですね。', romaji: 'Ohayou gozaimasu, Sumisu-san! Kyou wa ii tenki desu ne.', english: 'Good morning, Mr. Smith! It is nice weather today, isn\'t it?' },
      { speaker: 'Smith', japanese: 'おはようございます、田中さん。ええ、とても気持ちがいい朝です。', romaji: 'Ohayou gozaimasu, Tanaka-san. Ee, totemo kimochi ga ii asa desu.', english: 'Good morning, Tanaka-san. Yes, it is a very pleasant morning.' },
      { speaker: 'Tanaka', japanese: '今日の授業は何時から始まりますか？', romaji: 'Kyou no jugyou wa nan-ji kara hajimarimasu ka?', english: 'From what time does today\'s class start?' },
      { speaker: 'Smith', japanese: '午前十時からです。日本語の文法を勉強します。', romaji: 'Gozen juu-ji kara desu. Nihongo no bunpou o benkyou shimasu.', english: 'It starts from 10:00 AM. We will study Japanese grammar.' },
      { speaker: 'Tanaka', japanese: '頑張ってください！また後で図書館で会いましょう。', romaji: 'Ganbatte kudasai! Mata ato de toshokan de aimashou.', english: 'Good luck! Let\'s meet later at the library.' }
    ],
    vocabulary: [
      { word: '天気 (てんき)', reading: 'tenki', meaning: 'weather' },
      { word: '授業 (じゅぎょう)', reading: 'jugyou', meaning: 'class / lecture' },
      { word: '図書館 (としょかん)', reading: 'toshokan', meaning: 'library' },
      { word: '文法 (ぶんぽう)', reading: 'bunpou', meaning: 'grammar' }
    ],
    questions: [
      {
        question: 'What time does Smith’s Japanese grammar class start?',
        options: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
        correctIndex: 1,
        explanation: 'Smith explicitly stated: 午前十時からです (It starts from 10:00 AM).'
      },
      {
        question: 'Where did Tanaka suggest they meet later?',
        options: ['Cafeteria', 'Train Station', 'Library (図書館)', 'Dormitory'],
        correctIndex: 2,
        explanation: 'Tanaka said: 図書館で会いましょう (Let\'s meet at the library).'
      }
    ]
  },
  {
    id: 'jp-list-2',
    level: 'Beginner (JLPT N5)',
    title: 'Ordering at a Traditional Tokyo Ramen Shop',
    scenario: 'A customer enters a ramen shop in Shinjuku and interacts with the chef.',
    duration: '2:40',
    points: 25,
    transcript: [
      { speaker: 'Chef', japanese: 'いらっしゃいませ！ご注文はお決まりですか？', romaji: 'Irasshaimase! Go-chuumon wa o-kimari desu ka?', english: 'Welcome! Have you decided on your order?' },
      { speaker: 'Customer', japanese: 'しょうゆラーメンを一つと、ギョーザをお願いします。', romaji: 'Shouyu raamen o hitotsu to, gyouza o onegai shimasu.', english: 'One soy sauce ramen and gyoza, please.' },
      { speaker: 'Chef', japanese: 'かしこまりました。麺の硬さはいかがなさいますか？', romaji: 'Kashikomarimashita. Men no katasa wa ikaga nasaimasu ka?', english: 'Understood. How would you like the firmness of the noodles?' },
      { speaker: 'Customer', japanese: '硬めでお願いします。あと、お水も一杯いただけますか？', romaji: 'Katame de onegai shimasu. Ato, o-mizu mo ippai itadakemasu ka?', english: 'Firm, please. Also, could I have a glass of water as well?' },
      { speaker: 'Chef', japanese: 'はい、すぐにお持ちします！少々お待ちください。', romaji: 'Hai, sugu ni o-mochi shimasu! Shou-shou o-machi kudasai.', english: 'Yes, I will bring it right away! Please wait a moment.' }
    ],
    vocabulary: [
      { word: '注文 (ちゅうもん)', reading: 'chuumon', meaning: 'order' },
      { word: '硬さ (かたさ)', reading: 'katasa', meaning: 'hardness / firmness' },
      { word: '水 (みず)', reading: 'mizu', meaning: 'water' },
      { word: '少々 (しょうしょう)', reading: 'shoushou', meaning: 'a little / short while' }
    ],
    questions: [
      {
        question: 'How did the customer prefer their noodles?',
        options: ['Soft (やわらかめ)', 'Normal (普通)', 'Firm (硬め - Katame)', 'Extra Soft'],
        correctIndex: 2,
        explanation: 'The customer answered: 硬めでお願いします (Firm, please).'
      },
      {
        question: 'What side item did the customer order in addition to ramen?',
        options: ['Rice (ごはん)', 'Gyoza (ギョーザ)', 'Beer (ビール)', 'Salad (サラダ)'],
        correctIndex: 1,
        explanation: 'The customer ordered: しょうゆラーメンを一つと、ギョーザをお願いします.'
      }
    ]
  },
  {
    id: 'jp-list-3',
    level: 'Intermediate (JLPT N4/N3)',
    title: 'Asking for Directions at Tokyo Shinjuku Station',
    scenario: 'A traveler asks a station master how to transfer to the Yamanote Line.',
    duration: '3:10',
    points: 30,
    transcript: [
      { speaker: 'Traveler', japanese: 'すみません、山手線への乗り換えはどちらでしょうか？', romaji: 'Sumimasen, Yamanote-sen e no norikae wa dochira deshou ka?', english: 'Excuse me, which way is the transfer to the Yamanote Line?' },
      { speaker: 'Staff', japanese: 'この階段を上がって、まっすぐ行くと二番線ホームが見えます。', romaji: 'Kono kaidan o agatte, massugu iku to ni-ban-sen hoomu ga miemasu.', english: 'Go up these stairs and go straight, and you will see platform 2.' },
      { speaker: 'Traveler', japanese: '渋谷方面は二番線で合っていますか？', romaji: 'Shibuya houmen wa ni-ban-sen de atte imasu ka?', english: 'Is platform 2 correct for the Shibuya direction?' },
      { speaker: 'Staff', japanese: 'はい、内回りですので二番線で間違いありません。', romaji: 'Hai, uchi-mawari desu no de ni-ban-sen de machigai arimasen.', english: 'Yes, it is the inner loop, so platform 2 is correct without a doubt.' }
    ],
    vocabulary: [
      { word: '乗り換え (のりかえ)', reading: 'norikae', meaning: 'transfer' },
      { word: '階段 (かいだん)', reading: 'kaidan', meaning: 'stairs' },
      { word: 'ホーム', reading: 'hoomu', meaning: 'train platform' },
      { word: '方面 (ほうめん)', reading: 'houmen', meaning: 'direction / bound for' }
    ],
    questions: [
      {
        question: 'Which platform should the traveler head to for the Yamanote line towards Shibuya?',
        options: ['Platform 1', 'Platform 2 (二番線)', 'Platform 4', 'Central Exit'],
        correctIndex: 1,
        explanation: 'The staff affirmed: 二番線で間違いありません (Platform 2 is definitely correct).'
      }
    ]
  }
];
