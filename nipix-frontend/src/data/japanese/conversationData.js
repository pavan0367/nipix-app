/**
 * Japanese Situational Conversation Lessons
 * Practical real-world dialogues with speaker roles, Japanese, Romaji,
 * English translations, and situational cultural tips.
 */

export const CONVERSATION_SCENARIOS = [
  {
    id: 'c-1',
    category: 'Restaurant & Ordering',
    title: '居酒屋・レストランでの注文 (Ordering at a Restaurant)',
    situation: 'Arriving at a restaurant, ordering food, and requesting the bill.',
    culturalTip: 'Use 「すみません！」 with a hand slightly raised to call the server. Say 「いただきます」 before eating and 「ごちそうさまでした」 when finishing.',
    dialogue: [
      {
        speaker: '店員 (Server)',
        role: 'Server',
        jp: 'いらっしゃいませ！何名様でしょうか？',
        romaji: 'Irasshaimase! Nan-mei-sama deshou ka?',
        en: 'Welcome! How many people in your party?'
      },
      {
        speaker: '客 (Customer)',
        role: 'Customer',
        jp: '二人です。禁煙席をお願いします。',
        romaji: 'Futari desu. Kin\'enseki o onegaishimasu.',
        en: 'Two people, please. A non-smoking table, please.'
      },
      {
        speaker: '店員 (Server)',
        role: 'Server',
        jp: 'かしこまりました。こちらのテーブルへどうぞ。ご注文が決まりましたらお呼びください。',
        romaji: 'Kashikomarimashita. Kochira no teeburu e douzo. Gochuumon ga kimarimashitara oyobi kudasai.',
        en: 'Certainly. Please come to this table. When you are ready to order, please call me.'
      },
      {
        speaker: '客 (Customer)',
        role: 'Customer',
        jp: 'すみません！おすすめのラーメンを二つと、温かいお茶を二つください。',
        romaji: 'Sumimasen! Osusume no raamen o futatsu to, atatakai ocha o futatsu kudasai.',
        en: 'Excuse me! Two bowls of your recommended ramen and two cups of warm tea, please.'
      },
      {
        speaker: '店員 (Server)',
        role: 'Server',
        jp: 'はい、おすすめの特製醤油ラーメン二丁とお茶二つですね。少々お待ちください。',
        romaji: 'Hai, osusume no tokusei shouyu raamen ni-chou to ocha futatsu desu ne. Shou-shou omachi kudasai.',
        en: 'Yes, two orders of our special soy sauce ramen and two teas. Please wait just a moment.'
      },
      {
        speaker: '客 (Customer)',
        role: 'Customer',
        jp: 'ごちそうさまでした。お会計をお願いします。別々に払えますか？',
        romaji: 'Gochisousama deshita. Okaikei o onegaishimasu. Betsubetsu ni haraemasu ka?',
        en: 'Thank you for the meal! Could we have the bill, please? Can we pay separately?'
      }
    ]
  },
  {
    id: 'c-2',
    category: 'Train Station & Shinkansen',
    title: '駅で新幹線の切符を買う (Buying Shinkansen Bullet Train Tickets)',
    situation: 'At the ticket counter (みどりの窓口 - Midori no Madoguchi) purchasing reserved tickets for Kyoto.',
    culturalTip: 'Shinkansen cars have Reserved (指定席 - Shiteiseki) and Non-reserved (自由席 - Jiyuuseki) seats.',
    dialogue: [
      {
        speaker: '駅員 (Station Staff)',
        role: 'Staff',
        jp: 'いらっしゃいませ。どちらまででしょうか？',
        romaji: 'Irasshaimase. Dochira made deshou ka?',
        en: 'May I help you? Where are you traveling to?'
      },
      {
        speaker: '旅行者 (Traveler)',
        role: 'Traveler',
        jp: '京都まで大人二枚、指定席をお願いしたいのですが。',
        romaji: 'Kyouto made otona ni-mai, shiteiseki o onegai shitai no desu ga.',
        en: 'I would like two adult reserved tickets to Kyoto, please.'
      },
      {
        speaker: '駅員 (Station Staff)',
        role: 'Staff',
        jp: '本日のご出発でしょうか？ご希望の時間はございますか？',
        romaji: 'Honjitsu no goshuppatsu deshou ka? Gokibou no jikan wa gozaimasu ka?',
        en: 'Are you departing today? What time would you prefer?'
      },
      {
        speaker: '旅行者 (Traveler)',
        role: 'Traveler',
        jp: '午前十時頃の「のぞみ」号で、窓側の席は空いていますか？',
        romaji: 'Gozen juu-ji goro no "Nozomi"-gou de, madogawa no seki wa aiteimasu ka?',
        en: 'On the "Nozomi" around 10:00 AM, are window seats available?'
      },
      {
        speaker: '駅員 (Station Staff)',
        role: 'Staff',
        jp: 'はい、十時七分発のぞみ２１号、E席とD席が並びでお取りできます。',
        romaji: 'Hai, juu-ji nana-fun hatsu Nozomi nijuuichi-gou, E-seki to D-seki ga narabi de otori dekimasu.',
        en: 'Yes, on the 10:07 departure Nozomi #21, I can book seats E and D side-by-side for you.'
      }
    ]
  },
  {
    id: 'c-3',
    category: 'Asking Directions',
    title: '道を聞く (Asking for Directions on the Street)',
    situation: 'Asking a passerby how to reach the university campus from the station exit.',
    culturalTip: 'Start politely with 「すみません、ちょっとお伺いしてもよろしいですか？」 to immediately put the passerby at ease.',
    dialogue: [
      {
        speaker: '学生 (Student)',
        role: 'Inquirer',
        jp: 'すみません、道をお尋ねしてもよろしいでしょうか？',
        romaji: 'Sumimasen, michi o otazune shitemo yoroshii deshou ka?',
        en: 'Excuse me, could I please ask you for directions?'
      },
      {
        speaker: '通行人 (Passerby)',
        role: 'Passerby',
        jp: 'はい、どこをお探しですか？',
        romaji: 'Hai, doko o osagashi desu ka?',
        en: 'Yes, where are you looking for?'
      },
      {
        speaker: '学生 (Student)',
        role: 'Inquirer',
        jp: 'ここから東京大学の本郷キャンパスへはどう行けばいいですか？',
        romaji: 'Koko kara Toukyou Daigaku no Hongou kyanpasu e wa dou ikeba ii desu ka?',
        en: 'How should I get to the University of Tokyo\'s Hongo campus from here?'
      },
      {
        speaker: '通行人 (Passerby)',
        role: 'Passerby',
        jp: 'この道をまっすぐ五分ほど歩くと、大きな交差点があります。そこを右に曲がると赤門が見えますよ。',
        romaji: 'Kono michi o massugu go-fun hodo aruku to, ookina kousaten ga arimasu. Soko o migi ni magaru to Akamon ga miemasu yo.',
        en: 'If you walk straight down this street for about five minutes, there is a large intersection. Turn right there and you will see the Red Gate (Akamon).'
      },
      {
        speaker: '学生 (Student)',
        role: 'Inquirer',
        jp: '分かりました！親切に教えていただき、本当にありがとうございます。',
        romaji: 'Wakarimashita! Shinsetsu ni oshiete itadaki, hontou ni arigatou gozaimasu.',
        en: 'I understand! Thank you so very much for explaining so kindly.'
      }
    ]
  },
  {
    id: 'c-4',
    category: 'Workplace & College',
    title: '研究室・オフィスでの挨拶と報告 (Greetings & Reporting at the Lab/Office)',
    situation: 'Reporting progress on an AI model to the professor or team supervisor.',
    culturalTip: 'The "Hou-Ren-So" (報告・連絡・相談 - Report, Communicate, Consult) framework is paramount in Japanese work culture.',
    dialogue: [
      {
        speaker: '研究員 (Researcher)',
        role: 'Junior Scholar',
        jp: '先生、おはようございます。今、少しお時間よろしいでしょうか？',
        romaji: 'Sensei, ohayou gozaimasu. Ima, sukoshi ojikan yoroshii deshou ka?',
        en: 'Good morning Professor. Do you have a moment to spare right now?'
      },
      {
        speaker: '教授 (Professor)',
        role: 'Professor',
        jp: 'おはよう。うん、大丈夫だよ。深層学習モデルの検証はどうなった？',
        romaji: 'Ohayou. Un, daijoubu da yo. Shinsou gakushuu moderu no kenshou wa dou natta?',
        en: 'Good morning. Yes, sure. How did the deep learning model validation turn out?'
      },
      {
        speaker: '研究員 (Researcher)',
        role: 'Junior Scholar',
        jp: 'はい、昨晩のテストで認識精度が94パーセントまで向上いたしました。こちらが最新のログデータです。',
        romaji: 'Hai, sakuban no tesuto de ninshiki seido ga kyuujuuyon paasento made koujou itashimashita. Kochira ga saishin no rogu deeta desu.',
        en: 'Yes, in last night\'s benchmark test, the recognition accuracy improved up to 94%. Here are the latest log data.'
      },
      {
        speaker: '教授 (Professor)',
        role: 'Professor',
        jp: '素晴らしい成果だね！よく頑張った。次は推論速度の最適化に進もう。',
        romaji: 'Subarashii seika da ne! Yoku gambatta. Tsugi wa suiron sokudo no saitekika ni susumou.',
        en: 'That is a magnificent result! You worked very hard. Next, let us advance to optimizing inference latency.'
      },
      {
        speaker: '研究員 (Researcher)',
        role: 'Junior Scholar',
        jp: 'ありがとうございます！早速パイプラインの改善に着手いたします。',
        romaji: 'Arigatou gozaimasu! Sassoku paipurain no kaizen ni chakushu itashimasu.',
        en: 'Thank you very much! I will immediately start improving the pipeline.'
      }
    ]
  }
];
