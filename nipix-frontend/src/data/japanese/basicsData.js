/**
 * Japanese Language Basics Data
 * Comprehensive reference for writing systems, kana charts, pronunciation,
 * greetings, self-introductions, calendar, time, and counters.
 */

export const WRITING_SYSTEMS_INFO = [
  {
    name: 'Hiragana (ひらがな)',
    origin: 'Developed from simplified cursive kanji around the 9th century.',
    usage: 'Native Japanese words, grammatical particles (は, が, を), verb and adjective inflections (okurigana), and furigana reading aids.',
    characterCount: '46 basic characters + 25 dakuten/handakuten + 33 combo sounds (yōon).',
    example: 'こんにちは (Konnichiwa - Hello)'
  },
  {
    name: 'Katakana (カタカナ)',
    origin: 'Derived from parts of kanji by Buddhist monks as shorthand notes.',
    usage: 'Foreign loanwords (gairaigo), non-Japanese names, foreign place names, technical terms, plant/animal names, and onomatopoeia for emphasis.',
    characterCount: '46 basic characters + dakuten/handakuten + specialized foreign sound combinations.',
    example: 'コンピュータ (Konpyūta - Computer)'
  },
  {
    name: 'Kanji (漢字)',
    origin: 'Logographic Chinese characters adopted by Japan around the 5th century.',
    usage: 'Content words representing nouns, verb roots, and adjective stems. Each character carries inherent meaning and multiple readings (On\'yomi and Kun\'yomi).',
    characterCount: '2,136 Jōyō Kanji (regular-use kanji taught in compulsory schooling).',
    example: '日本語 (Nihongo - Japanese Language)'
  },
  {
    name: 'Romaji (ローマ字)',
    origin: 'Roman alphabet transcription methods (Hepburn, Kunrei-shiki).',
    usage: 'Keyboard input (IME), train station signs, international communication, and beginner learning references.',
    characterCount: '26 Latin characters.',
    example: 'Tokyo, Arigatou'
  }
];

export const HIRAGANA_DATA = [
  // Vowels
  { kana: 'あ', romaji: 'a', strokes: 3, guide: 'Ah (like "father")', word: 'あさ (Asa)', meaning: 'Morning' },
  { kana: 'い', romaji: 'i', strokes: 2, guide: 'Ee (like "see")', word: 'いぬ (Inu)', meaning: 'Dog' },
  { kana: 'う', romaji: 'u', strokes: 2, guide: 'Oo (like "food", lips unrounded)', word: 'うみ (Umi)', meaning: 'Sea/Ocean' },
  { kana: 'え', romaji: 'e', strokes: 2, guide: 'Eh (like "bed")', word: 'えき (Eki)', meaning: 'Train Station' },
  { kana: 'お', romaji: 'o', strokes: 3, guide: 'Oh (like "origami")', word: 'お茶 (Ocha)', meaning: 'Tea' },

  // K-row
  { kana: 'か', romaji: 'ka', strokes: 3, guide: 'Kah', word: 'かさ (Kasa)', meaning: 'Umbrella' },
  { kana: 'き', romaji: 'ki', strokes: 4, guide: 'Kee', word: 'き (Ki)', meaning: 'Tree / Wood' },
  { kana: 'く', romaji: 'ku', strokes: 1, guide: 'Koo', word: 'くるま (Kuruma)', meaning: 'Car' },
  { kana: 'け', romaji: 'ke', strokes: 3, guide: 'Keh', word: 'けさ (Kesa)', meaning: 'This morning' },
  { kana: 'こ', romaji: 'ko', strokes: 2, guide: 'Koh', word: 'こども (Kodomo)', meaning: 'Child' },

  // S-row
  { kana: 'さ', romaji: 'sa', strokes: 3, guide: 'Sah', word: 'さくら (Sakura)', meaning: 'Cherry blossom' },
  { kana: 'し', romaji: 'shi', strokes: 1, guide: 'Shee (softer than English)', word: 'しろ (Shiro)', meaning: 'White' },
  { kana: 'す', romaji: 'su', strokes: 2, guide: 'Soo', word: 'すし (Sushi)', meaning: 'Sushi' },
  { kana: 'せ', romaji: 'se', strokes: 3, guide: 'Seh', word: 'せんせい (Sensei)', meaning: 'Teacher' },
  { kana: 'そ', romaji: 'so', strokes: 1, guide: 'Soh', word: 'そら (Sora)', meaning: 'Sky' },

  // T-row
  { kana: 'た', romaji: 'ta', strokes: 4, guide: 'Tah', word: 'たべる (Taberu)', meaning: 'To eat' },
  { kana: 'ち', romaji: 'chi', strokes: 2, guide: 'Chee', word: 'ちず (Chizu)', meaning: 'Map' },
  { kana: 'つ', romaji: 'tsu', strokes: 1, guide: 'Tsoo (like "caTS")', word: 'つき (Tsuki)', meaning: 'Moon' },
  { kana: 'て', romaji: 'te', strokes: 1, guide: 'Teh', word: 'て (Te)', meaning: 'Hand' },
  { kana: 'と', romaji: 'to', strokes: 2, guide: 'Toh', word: 'ともだち (Tomodachi)', meaning: 'Friend' },

  // N-row
  { kana: 'な', romaji: 'na', strokes: 4, guide: 'Nah', word: 'なつ (Natsu)', meaning: 'Summer' },
  { kana: 'に', romaji: 'ni', strokes: 3, guide: 'Nee', word: 'にほん (Nihon)', meaning: 'Japan' },
  { kana: 'ぬ', romaji: 'nu', strokes: 2, guide: 'Noo', word: 'ぬいぐるみ (Nuigurumi)', meaning: 'Stuffed toy' },
  { kana: 'ね', romaji: 'ne', strokes: 2, guide: 'Neh', word: 'ねこ (Neko)', meaning: 'Cat' },
  { kana: 'の', romaji: 'no', strokes: 1, guide: 'Noh', word: 'のみもの (Nomimono)', meaning: 'Drink / Beverage' },

  // H-row
  { kana: 'は', romaji: 'ha', strokes: 3, guide: 'Hah (pronounced "wa" as particle)', word: 'はな (Hana)', meaning: 'Flower / Nose' },
  { kana: 'ひ', romaji: 'hi', strokes: 1, guide: 'Hee', word: 'ひと (Hito)', meaning: 'Person' },
  { kana: 'ふ', romaji: 'fu', strokes: 4, guide: 'Foo (soft bilabial blow)', word: 'ふゆ (Fuyu)', meaning: 'Winter' },
  { kana: 'へ', romaji: 'he', strokes: 1, guide: 'Heh (pronounced "e" as particle)', word: 'へや (Heya)', meaning: 'Room' },
  { kana: 'ほ', romaji: 'ho', strokes: 4, guide: 'Hoh', word: 'ほん (Hon)', meaning: 'Book' },

  // M-row
  { kana: 'ま', romaji: 'ma', strokes: 3, guide: 'Mah', word: 'まち (Machi)', meaning: 'Town / City' },
  { kana: 'み', romaji: 'mi', strokes: 2, guide: 'Mee', word: 'みず (Mizu)', meaning: 'Water' },
  { kana: 'む', romaji: 'mu', strokes: 3, guide: 'Moo', word: 'むし (Mushi)', meaning: 'Insect' },
  { kana: 'め', romaji: 'me', strokes: 2, guide: 'Meh', word: 'め (Me)', meaning: 'Eye' },
  { kana: 'も', romaji: 'mo', strokes: 3, guide: 'Moh', word: 'もり (Mori)', meaning: 'Forest' },

  // Y-row
  { kana: 'や', romaji: 'ya', strokes: 3, guide: 'Yah', word: 'やま (Yama)', meaning: 'Mountain' },
  { kana: 'ゆ', romaji: 'yu', strokes: 2, guide: 'Yoo', word: 'ゆき (Yuki)', meaning: 'Snow' },
  { kana: 'よ', romaji: 'yo', strokes: 2, guide: 'Yoh', word: 'よる (Yoru)', meaning: 'Night' },

  // R-row
  { kana: 'ら', romaji: 'ra', strokes: 2, guide: 'Rah (alveolar tap like Spanish r)', word: 'らいしゅう (Raishuu)', meaning: 'Next week' },
  { kana: 'り', romaji: 'ri', strokes: 2, guide: 'Ree', word: 'りんご (Ringo)', meaning: 'Apple' },
  { kana: 'る', romaji: 'ru', strokes: 1, guide: 'Roo', word: 'るす (Rusu)', meaning: 'Absence from home' },
  { kana: 'れ', romaji: 're', strokes: 2, guide: 'Reh', word: 'れきし (Rekishi)', meaning: 'History' },
  { kana: 'ろ', romaji: 'ro', strokes: 1, guide: 'Roh', word: 'ろうそく (Rousoku)', meaning: 'Candle' },

  // W & N
  { kana: 'わ', romaji: 'wa', strokes: 2, guide: 'Wah', word: 'わたし (Watashi)', meaning: 'I / Me' },
  { kana: 'を', romaji: 'wo (o)', strokes: 3, guide: 'Oh (used only as grammatical object particle)', word: '本を読む (Hon o yomu)', meaning: 'Read a book' },
  { kana: 'ん', romaji: 'n', strokes: 1, guide: 'N (nasal coda, never starts a word)', word: 'にほん (Nihon)', meaning: 'Japan' }
];

export const HIRAGANA_DAKUTEN = [
  // G-row (K + dakuten ゛)
  { kana: 'が', romaji: 'ga', strokes: 5, word: 'がっこう (Gakkou)', meaning: 'School' },
  { kana: 'ぎ', romaji: 'gi', strokes: 6, word: 'ぎんこう (Ginkou)', meaning: 'Bank' },
  { kana: 'ぐ', romaji: 'gu', strokes: 3, word: 'ぐんたい (Guntai)', meaning: 'Army' },
  { kana: 'げ', romaji: 'ge', strokes: 5, word: 'げんき (Genki)', meaning: 'Healthy / Energetic' },
  { kana: 'ご', romaji: 'go', strokes: 4, word: 'ごはん (Gohan)', meaning: 'Rice / Meal' },

  // Z-row (S + dakuten ゛)
  { kana: 'ざ', romaji: 'za', strokes: 5, word: 'ざっし (Zasshi)', meaning: 'Magazine' },
  { kana: 'じ', romaji: 'ji', strokes: 3, word: 'じかん (Jikan)', meaning: 'Time' },
  { kana: 'ず', romaji: 'zu', strokes: 4, word: 'ずっと (Zutto)', meaning: 'Continuously' },
  { kana: 'ぜ', romaji: 'ze', strokes: 5, word: 'ぜんぶ (Zenbu)', meaning: 'All / Everything' },
  { kana: 'ぞ', romaji: 'zo', strokes: 3, word: 'ぞう (Zou)', meaning: 'Elephant' },

  // D-row (T + dakuten ゛)
  { kana: 'だ', romaji: 'da', strokes: 6, word: 'だいがく (Daigaku)', meaning: 'University' },
  { kana: 'ぢ', romaji: 'ji (di)', strokes: 4, word: 'はなぢ (Hanaji)', meaning: 'Nosebleed' },
  { kana: 'づ', romaji: 'zu (du)', strokes: 3, word: 'つづく (Tsuzuku)', meaning: 'To continue' },
  { kana: 'で', romaji: 'de', strokes: 3, word: 'でんしゃ (Densha)', meaning: 'Electric train' },
  { kana: 'ど', romaji: 'do', strokes: 4, word: 'どこ (Doko)', meaning: 'Where' },

  // B-row (H + dakuten ゛)
  { kana: 'ば', romaji: 'ba', strokes: 5, word: 'ばしょ (Basho)', meaning: 'Place' },
  { kana: 'び', romaji: 'bi', strokes: 3, word: 'びょういん (Byouin)', meaning: 'Hospital' },
  { kana: 'ぶ', romaji: 'bu', strokes: 6, word: 'ぶんか (Bunka)', meaning: 'Culture' },
  { kana: 'べ', romaji: 'be', strokes: 3, word: 'べんきょう (Benkyou)', meaning: 'Study' },
  { kana: 'ぼ', romaji: 'bo', strokes: 6, word: 'ぼうし (Boushi)', meaning: 'Hat' },

  // P-row (H + handakuten ゜)
  { kana: 'ぱ', romaji: 'pa', strokes: 4, word: 'ぱん (Pan)', meaning: 'Bread' },
  { kana: 'ぴ', romaji: 'pi', strokes: 2, word: 'ぴかぴか (Pikapika)', meaning: 'Sparkling' },
  { kana: 'ぷ', romaji: 'pu', strokes: 5, word: 'ぷりん (Purin)', meaning: 'Pudding' },
  { kana: 'ぺ', romaji: 'pe', strokes: 2, word: 'ぺらぺら (Perapera)', meaning: 'Fluent' },
  { kana: 'ぽ', romaji: 'po', strokes: 5, word: 'ぽすと (Posuto)', meaning: 'Postbox' }
];

export const HIRAGANA_YOON = [
  { kana: 'きゃ', romaji: 'kya', word: 'きゃく (Kyaku)', meaning: 'Guest / Customer' },
  { kana: 'きゅ', romaji: 'kyu', word: 'きゅう (Kyuu)', meaning: 'Nine / Rapid' },
  { kana: 'きょ', romaji: 'kyo', word: 'きょう (Kyou)', meaning: 'Today' },
  { kana: 'しゃ', romaji: 'sha', word: 'しゃしん (Shashin)', meaning: 'Photograph' },
  { kana: 'しゅ', romaji: 'shu', word: 'しゅくだい (Shukudai)', meaning: 'Homework' },
  { kana: 'しょ', romaji: 'sho', word: 'しょくどう (Shokudou)', meaning: 'Cafeteria' },
  { kana: 'ちゃ', romaji: 'cha', word: 'おちゃ (Ocha)', meaning: 'Green tea' },
  { kana: 'ちゅ', romaji: 'chu', word: 'ちゅうごく (Chuugoku)', meaning: 'China' },
  { kana: 'ちょ', romaji: 'cho', word: 'ちょっと (Chotto)', meaning: 'A little bit' },
  { kana: 'にゃ', romaji: 'nya', word: 'にゃんこ (Nyanko)', meaning: 'Kitty' },
  { kana: 'にゅ', romaji: 'nyu', word: 'ぎゅうにゅう (Gyuunyuu)', meaning: 'Milk' },
  { kana: 'にょ', romaji: 'nyo', word: 'にょうぼう (Nyoubou)', meaning: 'Wife' },
  { kana: 'ひゃ', romaji: 'hya', word: 'ひゃく (Hyaku)', meaning: 'Hundred' },
  { kana: 'ひゅ', romaji: 'hyu', word: 'ひゅうひゅう (Hyuuhyuu)', meaning: 'Whistling wind' },
  { kana: 'ひょ', romaji: 'hyo', word: 'ひょうげん (Hyougen)', meaning: 'Expression' },
  { kana: 'みゃ', romaji: 'mya', word: 'みゃく (Myaku)', meaning: 'Pulse' },
  { kana: 'みゅ', romaji: 'myu', word: 'みゅーじかる (Myuujikaru)', meaning: 'Musical' },
  { kana: 'みょ', romaji: 'myo', word: 'みょうじ (Myouji)', meaning: 'Family name' },
  { kana: 'りゃ', romaji: 'rya', word: 'りゃく (Ryaku)', meaning: 'Abbreviation' },
  { kana: 'りゅ', romaji: 'ryu', word: 'りゅうがく (Ryuugaku)', meaning: 'Study abroad' },
  { kana: 'りょ', romaji: 'ryo', word: 'りょこう (Ryokou)', meaning: 'Travel / Trip' },
  { kana: 'ぎゃ', romaji: 'gya', word: 'ぎゃくてん (Gyakuten)', meaning: 'Reversal' },
  { kana: 'ぎゅ', romaji: 'gyu', word: 'ぎゅうにく (Gyuuniku)', meaning: 'Beef' },
  { kana: 'ぎょ', romaji: 'gyo', word: 'ぎょうざ (Gyouza)', meaning: 'Dumpling' },
  { kana: 'じゃ', romaji: 'ja', word: 'じゃあ (Jaa)', meaning: 'Well then' },
  { kana: 'じゅ', romaji: 'ju', word: 'じゅぎょう (Jugyou)', meaning: 'Class / Lecture' },
  { kana: 'じょ', romaji: 'jo', word: 'じょせい (Josei)', meaning: 'Woman / Female' },
  { kana: 'びゃ', romaji: 'bya', word: 'さんびゃく (Sanbyaku)', meaning: 'Three hundred' },
  { kana: 'びゅ', romaji: 'byu', word: 'いんたびゅー (Intabyuu)', meaning: 'Interview' },
  { kana: 'びょ', romaji: 'byo', word: 'びょういん (Byouin)', meaning: 'Hospital' },
  { kana: 'ぴゃ', romaji: 'pya', word: 'ろっぴゃく (Roppyaku)', meaning: 'Six hundred' },
  { kana: 'ぴゅ', romaji: 'pyu', word: 'ぴゅあ (Pyua)', meaning: 'Pure' },
  { kana: 'ぴょ', romaji: 'pyo', word: 'ぴょんぴょん (Pyonpyon)', meaning: 'Hopping' }
];

export const KATAKANA_DATA = [
  // Vowels
  { kana: 'ア', romaji: 'a', strokes: 2, guide: 'Ah', word: 'アイス (Aisu)', meaning: 'Ice cream' },
  { kana: 'イ', romaji: 'i', strokes: 2, guide: 'Ee', word: 'インターネット (Intānetto)', meaning: 'Internet' },
  { kana: 'ウ', romaji: 'u', strokes: 3, guide: 'Oo', word: 'ウェブ (Webu)', meaning: 'Web' },
  { kana: 'エ', romaji: 'e', strokes: 3, guide: 'Eh', word: 'エンジニア (Enjinia)', meaning: 'Engineer' },
  { kana: 'オ', romaji: 'o', strokes: 3, guide: 'Oh', word: 'オフィス (Ofisu)', meaning: 'Office' },

  // K-row
  { kana: 'カ', romaji: 'ka', strokes: 2, guide: 'Kah', word: 'カメラ (Kamera)', meaning: 'Camera' },
  { kana: 'キ', romaji: 'ki', strokes: 3, guide: 'Kee', word: 'キーボード (Kībōdo)', meaning: 'Keyboard' },
  { kana: 'ク', romaji: 'ku', strokes: 2, guide: 'Koo', word: 'クラス (Kurasu)', meaning: 'Class' },
  { kana: 'ケ', romaji: 'ke', strokes: 3, guide: 'Keh', word: 'ケーキ (Kēki)', meaning: 'Cake' },
  { kana: 'コ', romaji: 'ko', strokes: 2, guide: 'Koh', word: 'コーヒー (Kōhī)', meaning: 'Coffee' },

  // S-row
  { kana: 'サ', romaji: 'sa', strokes: 3, guide: 'Sah', word: 'サーバー (Sābā)', meaning: 'Server' },
  { kana: 'シ', romaji: 'shi', strokes: 3, guide: 'Shee', word: 'システム (Shisutemu)', meaning: 'System' },
  { kana: 'ス', romaji: 'su', strokes: 2, guide: 'Soo', word: 'スマートフォン (Sumātofon)', meaning: 'Smartphone' },
  { kana: 'セ', romaji: 'se', strokes: 2, guide: 'Seh', word: 'セキュリティ (Sekyuriti)', meaning: 'Security' },
  { kana: 'ソ', romaji: 'so', strokes: 2, guide: 'Soh', word: 'ソフトウェア (Sofutowea)', meaning: 'Software' },

  // T-row
  { kana: 'タ', romaji: 'ta', strokes: 3, guide: 'Tah', word: 'タクシー (Takushī)', meaning: 'Taxi' },
  { kana: 'チ', romaji: 'chi', strokes: 3, guide: 'Chee', word: 'チーム (Chīmu)', meaning: 'Team' },
  { kana: 'ツ', romaji: 'tsu', strokes: 3, guide: 'Tsoo', word: 'ツアー (Tsuā)', meaning: 'Tour' },
  { kana: 'テ', romaji: 'te', strokes: 3, guide: 'Teh', word: 'テスト (Tesuto)', meaning: 'Test' },
  { kana: 'ト', romaji: 'to', strokes: 2, guide: 'Toh', word: 'トイレ (Toire)', meaning: 'Restroom' },

  // N-row
  { kana: 'ナ', romaji: 'na', strokes: 2, guide: 'Nah', word: 'ナイフ (Naifu)', meaning: 'Knife' },
  { kana: 'ニ', romaji: 'ni', strokes: 2, guide: 'Nee', word: 'ニュース (Nyūsu)', meaning: 'News' },
  { kana: 'ヌ', romaji: 'nu', strokes: 2, guide: 'Noo', word: 'ヌードル (Nūdoru)', meaning: 'Noodle' },
  { kana: 'ネ', romaji: 'ne', strokes: 4, guide: 'Neh', word: 'ネットワーク (Nettowāku)', meaning: 'Network' },
  { kana: 'ノ', romaji: 'no', strokes: 1, guide: 'Noh', word: 'ノート (Nōto)', meaning: 'Notebook' },

  // H-row
  { kana: 'ハ', romaji: 'ha', strokes: 2, guide: 'Hah', word: 'ハードウェア (Hādowea)', meaning: 'Hardware' },
  { kana: 'ヒ', romaji: 'hi', strokes: 2, guide: 'Hee', word: 'ヒント (Hinto)', meaning: 'Hint' },
  { kana: 'フ', romaji: 'fu', strokes: 1, guide: 'Foo', word: 'ファイル (Fairu)', meaning: 'File' },
  { kana: 'ヘ', romaji: 'he', strokes: 1, guide: 'Heh', word: 'ヘッドホン (Heddohon)', meaning: 'Headphones' },
  { kana: 'ホ', romaji: 'ho', strokes: 4, guide: 'Hoh', word: 'ホテル (Hoteru)', meaning: 'Hotel' },

  // M-row
  { kana: 'マ', romaji: 'ma', strokes: 2, guide: 'Mah', word: 'マウス (Mausu)', meaning: 'Computer mouse' },
  { kana: 'ミ', romaji: 'mi', strokes: 3, guide: 'Mee', word: 'ミーティング (Mītingu)', meaning: 'Meeting' },
  { kana: 'ム', romaji: 'mu', strokes: 2, guide: 'Moo', word: 'ムービー (Mūbī)', meaning: 'Movie' },
  { kana: 'メ', romaji: 'me', strokes: 2, guide: 'Meh', word: 'メール (Mēru)', meaning: 'Email / Mail' },
  { kana: 'モ', romaji: 'mo', strokes: 3, guide: 'Moh', word: 'モニター (Monitā)', meaning: 'Monitor' },

  // Y-row
  { kana: 'ヤ', romaji: 'ya', strokes: 2, guide: 'Yah', word: 'ユーザー (Yūzā)', meaning: 'User' },
  { kana: 'ユ', romaji: 'yu', strokes: 2, guide: 'Yoo', word: 'ユニーク (Yunīku)', meaning: 'Unique' },
  { kana: 'ヨ', romaji: 'yo', strokes: 3, guide: 'Yoh', word: 'ヨーロッパ (Yōroppa)', meaning: 'Europe' },

  // R-row
  { kana: 'ラ', romaji: 'ra', strokes: 2, guide: 'Rah', word: 'ラジオ (Rajio)', meaning: 'Radio' },
  { kana: 'リ', romaji: 'ri', strokes: 2, guide: 'Ree', word: 'リーダー (Rīdā)', meaning: 'Leader' },
  { kana: 'ル', romaji: 'ru', strokes: 2, guide: 'Roo', word: 'ルール (Rūru)', meaning: 'Rule' },
  { kana: 'レ', romaji: 're', strokes: 1, guide: 'Reh', word: 'レポート (Repōto)', meaning: 'Report' },
  { kana: 'ロ', romaji: 'ro', strokes: 3, guide: 'Roh', word: 'ロボット (Robotto)', meaning: 'Robot' },

  // W & N
  { kana: 'ワ', romaji: 'wa', strokes: 2, guide: 'Wah', word: 'ワイン (Wain)', meaning: 'Wine' },
  { kana: 'ヲ', romaji: 'wo', strokes: 3, guide: 'Oh (Rare in modern katakana)', word: 'ヲタク (Wotaku / Otaku)', meaning: 'Otaku / Geek' },
  { kana: 'ン', romaji: 'n', strokes: 2, guide: 'N', word: 'パン (Pan)', meaning: 'Bread' }
];

export const PRONUNCIATION_RULES = [
  {
    title: 'Short vs Long Vowels (長音 - Chōon)',
    rule: 'Holding a vowel sound for two beats instead of one alters the meaning completely.',
    examples: [
      { jp: 'おばさん (obasan)', romaji: 'obasan', meaning: 'Aunt' },
      { jp: 'おばあさん (obāsan)', romaji: 'obāsan', meaning: 'Grandmother' },
      { jp: 'ここ (koko)', romaji: 'koko', meaning: 'Here' },
      { jp: 'こうこう (kōkō)', romaji: 'kōkō', meaning: 'High school' },
      { jp: 'カード (kādo)', romaji: 'kādo', meaning: 'Card (Katakana uses long dash ー)' }
    ]
  },
  {
    title: 'Small っ (促音 - Sokuon / Glottal Stop)',
    rule: 'The small っ causes a sudden momentary stop before k, s, t, p consonants, doubling the consonant sound.',
    examples: [
      { jp: 'きて (kite)', romaji: 'kite', meaning: 'Come / Please come' },
      { jp: 'きって (kitte)', romaji: 'kitte', meaning: 'Postage stamp' },
      { jp: 'がっこう (gakkou)', romaji: 'gakkou', meaning: 'School' },
      { jp: 'ちょっと (chotto)', romaji: 'chotto', meaning: 'A moment / A little' }
    ]
  },
  {
    title: 'Small ゃ ゅ ょ (拗音 - Yōon / Glides)',
    rule: 'Small ya, yu, yo combine with i-row kana (ki, shi, chi, ni, hi, mi, ri, gi, ji, bi, pi) to produce a single blended syllable.',
    examples: [
      { jp: 'きょう (kyou)', romaji: 'kyou', meaning: 'Today (one syllable, not ki-yo-u)' },
      { jp: 'しゃしん (shashin)', romaji: 'shashin', meaning: 'Photograph' },
      { jp: 'おちゃ (ocha)', romaji: 'ocha', meaning: 'Tea' }
    ]
  },
  {
    title: 'Particle Pronunciations: は (wa) and へ (e)',
    rule: 'When used as grammatical particles, は is pronounced "wa" (not ha), and へ is pronounced "e" (not he).',
    examples: [
      { jp: 'わたしは学生です。', romaji: 'Watashi wa gakusei desu.', meaning: 'I am a student.' },
      { jp: '東京へ行きます。', romaji: 'Toukyou e ikimasu.', meaning: 'I am going to Tokyo.' }
    ]
  }
];

export const GREETINGS_DATA = [
  {
    japanese: 'おはようございます',
    romaji: 'Ohayou gozaimasu',
    english: 'Good morning (Polite)',
    situation: 'Morning greeting to teachers, colleagues, superiors, or in general before around 10:30 AM.'
  },
  {
    japanese: 'おはよう',
    romaji: 'Ohayou',
    english: 'Good morning (Casual)',
    situation: 'Used with close friends, siblings, family members, or children.'
  },
  {
    japanese: 'こんにちは',
    romaji: 'Konnichiwa',
    english: 'Hello / Good afternoon',
    situation: 'Standard daytime greeting between late morning and dusk.'
  },
  {
    japanese: 'こんばんは',
    romaji: 'Konbanwa',
    english: 'Good evening',
    situation: 'Greeting used after dusk and at night.'
  },
  {
    japanese: 'おやすみなさい',
    romaji: 'Oyasuminasai',
    english: 'Good night (Polite)',
    situation: 'Said when going to bed or leaving somewhere late in the evening.'
  },
  {
    japanese: 'おやすみ',
    romaji: 'Oyasumi',
    english: 'Good night (Casual)',
    situation: 'Said to friends, family members, or partners before sleep.'
  },
  {
    japanese: 'ありがとうございます',
    romaji: 'Arigatou gozaimasu',
    english: 'Thank you very much (Polite)',
    situation: 'Expressing gratitude in everyday, academic, or professional settings.'
  },
  {
    japanese: 'どうもありがとう',
    romaji: 'Doumo arigatou',
    english: 'Thanks a lot',
    situation: 'Informal or semi-casual thanks.'
  },
  {
    japanese: 'どういたしまして',
    romaji: 'Dou itashimashite',
    english: 'You are welcome',
    situation: 'Replying to thanks ("Not at all / My pleasure").'
  },
  {
    japanese: 'すみません',
    romaji: 'Sumimasen',
    english: 'Excuse me / I am sorry / Thank you',
    situation: 'Extremely versatile phrase: calling a waiter, apologizing for a slight inconvenience, or thanking someone who stepped aside for you.'
  },
  {
    japanese: 'ごめんなさい',
    romaji: 'Gomennasai',
    english: 'I am sorry',
    situation: 'Direct apology for an accidental mistake or fault.'
  },
  {
    japanese: 'さようなら',
    romaji: 'Sayounara',
    english: 'Goodbye (Formal / Long separation)',
    situation: 'Signifies parting for a long time or leaving school/class for the day.'
  },
  {
    japanese: 'じゃあ、また！',
    romaji: 'Jaa, mata!',
    english: 'See you later!',
    situation: 'Casual everyday parting among peers and friends.'
  },
  {
    japanese: 'お疲れ様でした',
    romaji: 'Otsukaresama deshita',
    english: 'Thank you for your hard work / Great job',
    situation: 'Essential workplace/school phrase said after completing a shift, project, lecture, or meeting.'
  },
  {
    japanese: 'いただきます',
    romaji: 'Itadakimasu',
    english: 'Humbly receiving this meal (Let\'s eat)',
    situation: 'Said before eating a meal, expressing gratitude to the ingredients, chef, and nature.'
  },
  {
    japanese: 'ごちそうさまでした',
    romaji: 'Gochisousama deshita',
    english: 'Thank you for the wonderful meal',
    situation: 'Said immediately after finishing a meal to the host or restaurant staff.'
  }
];

export const SELF_INTRODUCTION_GUIDE = {
  title: '自己紹介 (Jikoshoukai - Self Introduction)',
  description: 'Mastering a concise, polite Japanese self-introduction creates an outstanding first impression.',
  template: [
    {
      step: '1. Opening greeting',
      jp: 'はじめまして。',
      romaji: 'Hajimemashite.',
      en: 'Nice to meet you (for the very first time).'
    },
    {
      step: '2. Stating your name',
      jp: 'わたしは [名前] です。 / [名前] と申します。',
      romaji: 'Watashi wa [Name] desu. / [Name] to moushimasu.',
      en: 'I am [Name]. / My name is [Name] (humble/polite).'
    },
    {
      step: '3. Stating nationality / origin',
      jp: '[国] から来ました。',
      romaji: '[Kuni] kara kimashita.',
      en: 'I came from [Country]. (e.g. インドから来ました - Indo kara kimashita).'
    },
    {
      step: '4. Stating occupation / major',
      jp: '大学生です。 / コンピュータサイエンスを専攻しています。',
      romaji: 'Daigakusei desu. / Konpyūtasaiensu o senkou shiteimasu.',
      en: 'I am a university student. / I am majoring in Computer Science.'
    },
    {
      step: '5. Polite closing statement',
      jp: 'どうぞよろしくお願いします。',
      romaji: 'Douzo yoroshiku onegaishimasu.',
      en: 'Please treat me favorably / Pleased to meet you / Looking forward to working with you.'
    }
  ],
  sampleFullIntro: {
    jp: 'はじめまして。わたしはパヴァンです。インドから来ました。ソフトウェアエンジニアです。日本語とAIの勉強をしています。どうぞよろしくお願いします！',
    romaji: 'Hajimemashite. Watashi wa Pavan desu. Indo kara kimashita. Sofutowea enjinia desu. Nihongo to AI no benkyou o shiteimasu. Douzo yoroshiku onegaishimasu!',
    en: 'Nice to meet you! I am Pavan. I came from India. I am a software engineer. I am studying Japanese and AI. It is a pleasure to meet you!'
  }
};

export const NUMBERS_DATA = [
  { num: 0, kanji: '零 / ゼロ', kana: 'れい / ぜろ', romaji: 'rei / zero' },
  { num: 1, kanji: '一', kana: 'いち', romaji: 'ichi' },
  { num: 2, kanji: '二', kana: 'に', romaji: 'ni' },
  { num: 3, kanji: '三', kana: 'さん', romaji: 'san' },
  { num: 4, kanji: '四', kana: 'よん / し', romaji: 'yon / shi' },
  { num: 5, kanji: '五', kana: 'ご', romaji: 'go' },
  { num: 6, kanji: '六', kana: 'ろく', romaji: 'roku' },
  { num: 7, kanji: '七', kana: 'なな / しち', romaji: 'nana / shichi' },
  { num: 8, kanji: '八', kana: 'はち', romaji: 'hachi' },
  { num: 9, kanji: '九', kana: 'きゅう / く', romaji: 'kyuu / ku' },
  { num: 10, kanji: '十', kana: 'じゅう', romaji: 'juu' },
  { num: 20, kanji: '二十', kana: 'にじゅう', romaji: 'ni-juu' },
  { num: 50, kanji: '五十', kana: 'ごじゅう', romaji: 'go-juu' },
  { num: 100, kanji: '百', kana: 'ひゃく', romaji: 'hyaku' },
  { num: 300, kanji: '三百', kana: 'さんびゃく', romaji: 'sanbyaku' },
  { num: 600, kanji: '六百', kana: 'ろっぴゃく', romaji: 'roppyaku' },
  { num: 800, kanji: '八百', kana: 'はっぴゃく', romaji: 'happyaku' },
  { num: 1000, kanji: '千', kana: 'せん', romaji: 'sen' },
  { num: 3000, kanji: '三千', kana: 'さんぜん', romaji: 'sanzen' },
  { num: 8000, kanji: '八千', kana: 'はっせん', romaji: 'hassen' },
  { num: 10000, kanji: '一万', kana: 'いちまん', romaji: 'ichiman (Japanese counts in units of 10,000)' }
];

export const CALENDAR_DATA = {
  daysOfWeek: [
    { kanji: '月曜日', romaji: 'Getsuyoubi', element: 'Moon (月)', english: 'Monday' },
    { kanji: '火曜日', romaji: 'Kayoubi', element: 'Fire (火)', english: 'Tuesday' },
    { kanji: '水曜日', romaji: 'Suiyoubi', element: 'Water (水)', english: 'Wednesday' },
    { kanji: '木曜日', romaji: 'Mokuyoubi', element: 'Tree / Wood (木)', english: 'Thursday' },
    { kanji: '金曜日', romaji: 'Kinyoubi', element: 'Gold / Metal (金)', english: 'Friday' },
    { kanji: '土曜日', romaji: 'Doyoubi', element: 'Earth / Soil (土)', english: 'Saturday' },
    { kanji: '日曜日', romaji: 'Nichiyoubi', element: 'Sun (日)', english: 'Sunday' }
  ],
  months: [
    { num: 1, kanji: '一月', kana: 'いちがつ', romaji: 'Ichigatsu', english: 'January' },
    { num: 2, kanji: '二月', kana: 'にがつ', romaji: 'Nigatsu', english: 'February' },
    { num: 3, kanji: '三月', kana: 'さんがつ', romaji: 'Sangatsu', english: 'March' },
    { num: 4, kanji: '四月', kana: 'しがつ', romaji: 'Shigatsu', english: 'April' },
    { num: 5, kanji: '五月', kana: 'ごがつ', romaji: 'Gogatsu', english: 'May' },
    { num: 6, kanji: '六月', kana: 'ろくがつ', romaji: 'Rokugatsu', english: 'June' },
    { num: 7, kanji: '七月', kana: 'しちがつ', romaji: 'Shichigatsu', english: 'July' },
    { num: 8, kanji: '八月', kana: 'はちがつ', romaji: 'Hachigatsu', english: 'August' },
    { num: 9, kanji: '九月', kana: 'くがつ', romaji: 'Kugatsu', english: 'September' },
    { num: 10, kanji: '十月', kana: 'じゅうがつ', romaji: 'Juugatsu', english: 'October' },
    { num: 11, kanji: '十一月', kana: 'じゅういちがつ', romaji: 'Juuichigatsu', english: 'November' },
    { num: 12, kanji: '十二月', kana: 'じゅうにがつ', romaji: 'Juunigatsu', english: 'December' }
  ],
  specialDaysOfMonth: [
    { day: '1st', kanji: '1日', kana: 'ついたち', romaji: 'tsuitachi' },
    { day: '2nd', kanji: '2日', kana: 'ふつか', romaji: 'futsuka' },
    { day: '3rd', kanji: '3日', kana: 'みっか', romaji: 'mikka' },
    { day: '4th', kanji: '4日', kana: 'よっか', romaji: 'yokka' },
    { day: '5th', kanji: '5日', kana: 'いつか', romaji: 'itsuka' },
    { day: '6th', kanji: '6日', kana: 'むいか', romaji: 'muika' },
    { day: '7th', kanji: '7日', kana: 'なのか', romaji: 'nanoka' },
    { day: '8th', kanji: '8日', kana: 'ようか', romaji: 'youka' },
    { day: '9th', kanji: '9日', kana: 'ここのか', romaji: 'kokonoka' },
    { day: '10th', kanji: '10日', kana: 'とおか', romaji: 'tooka' },
    { day: '14th', kanji: '14日', kana: 'じゅうよっか', romaji: 'juuyokka' },
    { day: '20th', kanji: '20日', kana: 'はつか', romaji: 'hatsuka' },
    { day: '24th', kanji: '24日', kana: 'にじゅうよっか', romaji: 'nijuuyokka' }
  ]
};

export const TIME_AND_COUNTERS_DATA = {
  timeUnits: [
    { jp: '時 (じ)', romaji: 'ji', en: 'O\'clock (e.g. 1時 ichi-ji = 1:00, 4時 yo-ji = 4:00, 9時 ku-ji = 9:00)' },
    { jp: '分 (ふん / ぷん)', romaji: 'fun / pun', en: 'Minutes (1分 ippun, 5分 gofun, 10分 juppun, 30分 sanjuppun / 半 han)' },
    { jp: '秒 (びょう)', romaji: 'byou', en: 'Seconds (e.g. 10秒 juu-byou)' },
    { jp: '午前 (ごぜん)', romaji: 'gozen', en: 'A.M. / Morning' },
    { jp: '午後 (ごご)', romaji: 'gogo', en: 'P.M. / Afternoon' },
    { jp: '今 (いま)', romaji: 'ima', en: 'Now (e.g. いま何時ですか？ What time is it now?)' }
  ],
  counters: [
    { counter: '〜人 (にん / り)', usage: 'Counting people', examples: '1人 (ひとり hitori), 2人 (ふたり futari), 3人 (さんにん sannin)' },
    { counter: '〜つ (tsu)', usage: 'General native counter for items, ideas, orders', examples: '1つ (ひとつ hitotsu), 2つ (ふたつ futatsu), 3つ (みっつ mittsu)' },
    { counter: '〜本 (ほん / ぽん / ぼん)', usage: 'Long cylindrical objects (bottles, pens, umbrellas, trees, trains)', examples: '1本 (いっぽん ippon), 2本 (にほん nihon), 3本 (さんぼん sanbon)' },
    { counter: '〜枚 (まい)', usage: 'Flat thin objects (paper, shirts, plates, tickets, cards)', examples: '1枚 (いちまい ichimai), 2枚 (にまい nimai), 3枚 (さんまい sanmai)' },
    { counter: '〜冊 (さつ)', usage: 'Bound volumes (books, magazines, notebooks)', examples: '1冊 (いっさつ issatsu), 2冊 (にさつ nisatsu)' },
    { counter: '〜匹 (ひき / ぴき / びき)', usage: 'Small to medium animals, fish, insects', examples: '1匹 (いっぴき ippiki), 2匹 (にひき nihiki), 3匹 (さんびき sanbiki)' },
    { counter: '〜杯 (はい / ぱい / ばい)', usage: 'Cups and bowls of liquid or rice', examples: '1杯 (いっぱい ippai), 2杯 (にはい nihai)' },
    { counter: '〜台 (だい)', usage: 'Machines, vehicles, computers, electronic devices', examples: '1台 (いちだい ichidai), 2台 (にだい nidai)' },
    { counter: '〜階 (かい / がい)', usage: 'Floors of a building', examples: '1階 (いっかい ikkai), 3階 (さんがい sangai)' },
    { counter: '〜歳 / 才 (さい)', usage: 'Years of age', examples: '18歳 (じゅうはっさい juuhassai), 20歳 (はたち hatachi)' }
  ]
};
