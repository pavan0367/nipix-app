/**
 * Japanese Reading Practice Dataset
 * Graded passages from absolute beginner (pure kana) to advanced news & essays,
 * with Romaji, English translations, vocabulary breakdowns, and grammar explanations.
 */

export const READING_PASSAGES = [
  {
    id: 'r-1',
    level: 'Beginner (Kana & Simple Sentences)',
    title: '私の朝の習慣 (My Morning Routine)',
    genre: 'Daily Life',
    japanese: `わたしは まいあさ ろくじに おきます。
まず、かおを あらって、みずを いっぱいに のみます。
それから、あさごはんを たべます。あさごはんは ごはんと たまごと みそしるです。
しちにじはんに でんしゃに のって、だいがくへ いきます。
きょうも いちにち がんばります！`,
    romaji: `Watashi wa maiasa roku-ji ni okimasu.
Mazu, kao o aratte, mizu o ippai nomimasu.
Sorekara, asagohan o tabemasu. Asagohan wa gohan to tamago to misoshiru desu.
Shichi-ji han ni densha ni notte, daigaku e ikimasu.
Kyou mo ichinichi gambarimasu!`,
    english: `I wake up at six o'clock every morning.
First, I wash my face and drink a glass of water.
Then, I eat breakfast. Breakfast is rice, eggs, and miso soup.
At seven-thirty, I get on the train and head to university.
I will do my best all day today as well!`,
    vocabulary: [
      { word: 'まいあさ (maiasa)', meaning: 'Every morning' },
      { word: 'おきます (okimasu)', meaning: 'To wake up' },
      { word: 'かお (kao)', meaning: 'Face' },
      { word: 'みそしる (misoshiru)', meaning: 'Miso soup' },
      { word: 'のって (notte)', meaning: 'To board / get on (te-form of のる)' },
      { word: 'がんばります (gambarimasu)', meaning: 'To do one\'s best' }
    ],
    grammarNotes: [
      'ろくじに: Particle に marks the exact time of waking up.',
      'あらって: て-form of あらう (to wash) used to sequence actions (wash face, then drink water).',
      'だいがくへ: Particle へ marks direction toward a destination.'
    ]
  },
  {
    id: 'r-2',
    level: 'Elementary (Short Story)',
    title: '初めての秋葉原 (First Time in Akihabara)',
    genre: 'Travel & Tech Culture',
    japanese: `先週の土曜日、私は友達と一緒に秋葉原へ行きました。
秋葉原は日本のテクノロジーと電子機器の有名な街です。
私たちは大きな電気店に入って、最新のコンピュータ部品やロボットを見ました。
その後、アニメグッズの店やカフェにも立ち寄りました。
とてもにぎやかで、一日中楽しかったです。また来月行きたいです。`,
    romaji: `Senshuu no doyoubi, watashi wa tomodachi to issho ni Akihabara e ikimashita.
Akihabara wa Nihon no teknorojii to denshi kiki no yuumei na machi desu.
Watashitachi wa ookina denkiten ni haitte, saishin no konpyuuta buhin ya robotto o mimashita.
Sono ato, anime guzzu no mise ya kafe ni mo tachiyorimashita.
Totemo nigiyaka de, ichinichijuu tanoshikatta desu. Mata raigetsu ikitai desu.`,
    english: `Last Saturday, I went to Akihabara together with my friend.
Akihabara is a famous town for Japanese technology and electronic equipment.
We entered a large electronics megastore and saw the latest computer parts and robots.
After that, we also dropped by anime goods shops and cafes.
It was very bustling and enjoyable all day long. I want to go again next month.`,
    vocabulary: [
      { word: '先週 (せんしゅう)', meaning: 'Last week' },
      { word: '電子機器 (でんしきき)', meaning: 'Electronic equipment' },
      { word: '電気店 (でんきてん)', meaning: 'Electronics store' },
      { word: '部品 (ぶひん)', meaning: 'Parts / Components' },
      { word: 'にぎやか (nigiyaka)', meaning: 'Lively / Bustling (na-adj)' },
      { word: '行きたい (ikitai)', meaning: 'Want to go (-tai form of iku)' }
    ],
    grammarNotes: [
      '友達と一緒に: 〜と一緒に means "together with someone".',
      '入って: て-form of 入る (hairu) connects the act of entering to observing.',
      '〜たい: Verb stem + たい expresses the speaker\'s desire ("want to do").'
    ]
  },
  {
    id: 'r-3',
    level: 'Intermediate (Tech & News)',
    title: '日本のAI技術と教育の未来 (AI Tech & the Future of Education in Japan)',
    genre: 'News & Technology',
    japanese: `近年、人工知能（AI）の急速な進化に伴い、日本の教育現場でもデジタル技術の導入が進んでいます。
文部科学省の調査によると、多くの大学や高等専門学校が生成AIを活用した学習支援ツールの導入を検討しています。
AIチューターを利用することで、学生は24時間いつでも質問し、個々の習熟度に合わせた解説を受けることができます。
専門家は「AIは教員に代わるものではなく、学習者の好奇心と自立的な探求を支える強力なパートナーである」と指摘しています。`,
    romaji: `Kinnen, jinkouchinou (AI) no kyuusoku na shinka ni tomonai, Nihon no kyouiku genba demo dejitaru gijutsu no dounyuu ga susundeimasu.
Monbukagakushou no chousa ni yoru to, ooku no daigaku ya koutousenmongakkou ga seisei AI o katsuyou shita gakushuu shien tsuuru no dounyuu o kentou shiteimasu.
AI chuutaa o riyou suru koto de, gakusei wa nijuuyo-jikan itsudemo shitsumon shi, koko no shuujukudo ni awaseta kaisetsu o ukeru koto ga dekimasu.
Senmonka wa "AI wa kyouin ni kawaru mono dewa naku, gakushuusha no koukishin to jiritsuteki na tankyuu o sasaeru kyouryoku na paatonaa de aru" to shiteki shiteimasu.`,
    english: `In recent years, along with the rapid evolution of artificial intelligence (AI), the adoption of digital technologies is advancing in Japanese educational settings.
According to research by the Ministry of Education, Culture, Sports, Science and Technology, many universities and technical colleges are considering the introduction of learning support tools utilizing generative AI.
By using AI tutors, students can ask questions at any time 24 hours a day and receive explanations tailored to their individual proficiency levels.
Experts point out: "AI is not something that replaces teachers, but rather a powerful partner supporting learners' curiosity and self-directed inquiry."`,
    vocabulary: [
      { word: '急速 (きゅうそく)', meaning: 'Rapid / Swift' },
      { word: '導入 (どうにゅう)', meaning: 'Introduction / Adoption' },
      { word: '生成AI (せいせいAI)', meaning: 'Generative AI' },
      { word: '習熟度 (しゅうじゅくど)', meaning: 'Proficiency level' },
      { word: '自立的 (じりつてき)', meaning: 'Independent / Self-reliant' },
      { word: '指摘する (してきする)', meaning: 'To point out' }
    ],
    grammarNotes: [
      '〜に伴い (にともない): Expresses "in conjunction with / as X evolves, Y follows".',
      '〜によると: Expresses hearsay/citation ("according to [source]").',
      '〜ことができる: Expresses potential/capability ("are able to receive").'
    ]
  },
  {
    id: 'r-4',
    level: 'Advanced (Essay & Discourse)',
    title: '伝統と革新の調和：日本のものづくり精神 (Harmony of Tradition & Innovation: Japan\'s Monozukuri Spirit)',
    genre: 'Culture & Engineering Philosophy',
    japanese: `日本における「ものづくり」の精神は、単なる工業製品の製造技術にとどまらず、素材への深い敬意と極限までの品質追求に根ざしている。
何世紀にもわたって受け継がれてきた刀鍛冶や漆器工芸の技法は、現代の超精密半導体加工や航空宇宙産業の基盤技術へと脈々と息づいているのである。
変革の激しいグローバル経済において、伝統を守ることと新たな技術革新を果敢に取り入れることの止揚こそが、持続可能な未来社会を切り拓く鍵となるに違いない。`,
    romaji: `Nihon ni okeru "monozukuri" no seishin wa, tannaru kougyou seihin no seizou gijutsu ni todomarazu, sozai e no fukai keii to kyokugen made no hinshitsu tsuikyuu ni nezaiteiru.
Nan-seiki ni mo watatte uketsugarete kita katanakaji ya shikki kougei no gihou wa, gendai no chou-seimitsu handoutai kakou ya koukuu-uchuu sangyou no kiban gijutsu e to myakumyaku to ikizuiteiru no de aru.
Henkaku no hageshii guroobaru keizai ni oite, dentou o mamoru koto to arata na gijutsu kakushin o kakan ni toriireru koto no shiyou koso ga, jizoku kanou na mirai shakai o kirihiraku kagi to naru ni chigainai.`,
    english: `The spirit of "Monozukuri" in Japan is not merely confined to manufacturing techniques for industrial goods, but is deeply rooted in profound reverence for materials and an uncompromising pursuit of quality to the limit.
Techniques of swordsmithing and lacquer craft passed down across centuries continue to pulse continuously within the foundational technologies of modern ultra-precision semiconductor processing and aerospace industries.
In a fiercely volatile global economy, the sublation (Aufheben) of preserving tradition while intrepidly embracing technological innovations will undoubtedly be the master key to pioneering a sustainable future society.`,
    vocabulary: [
      { word: 'ものづくり (Monozukuri)', meaning: 'Craftsmanship / Manufacturing philosophy' },
      { word: '敬意 (けいい)', meaning: 'Respect / Reverence' },
      { word: '超精密 (ちょうせいみつ)', meaning: 'Ultra-precision' },
      { word: '半導体 (はんどうたい)', meaning: 'Semiconductor' },
      { word: '脈々と (みゃくみゃくと)', meaning: 'Continuously / Unbroken stream' },
      { word: 'に違いない (にちがいない)', meaning: 'Undoubtedly / Without a doubt' }
    ],
    grammarNotes: [
      '〜にとどまらず: "Not stopping at X / not merely limited to X".',
      '〜にわたって: "Spanning across [a period of time or spatial distance]".',
      '〜に違いない: "Must be / there is no doubt that...".'
    ]
  }
];
