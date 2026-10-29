import { HeroDef, HeroId, Language, PlayerAlignment, StageDef } from '../types/game';
import { SHAHNAMEH_LORE } from '../constants/shahnamehLore';

export type EnemyFactionMelee =
  | 'div_soldier'
  | 'zahhak_guard'
  | 'turani_raider'
  | 'iranian_sentinel'
  | 'kayanian_guard';

export type EnemyFactionRanged =
  | 'archer_turani'
  | 'iranian_archer'
  | 'div_sorcerer';

export type EnemyFactionAerial =
  | 'flying_akvan'
  | 'turani_falcon'
  | 'zahhak_bat';

export interface StageHeroConfig {
  baseHeroId: HeroId;
  heroRenderId: string;
  heroName: string;
  heroTitle: string;
  heroEquipmentSubtitle: string;
  heroDesc: string;
  weaponName: string;
  specialName: string;
  color: string;
  accentColor: string;
  capeColor: string;
  maxHp: number;
  attackPower: number;
  speed: number;
  jumpForce: number;
  hasDoubleJump?: boolean;
}

export interface StageNarrativeProfile {
  stageId: number;
  alignment: PlayerAlignment;
  heroId: HeroId;
  heroConfig: StageHeroConfig;
  title: string;
  chapterTitle: string;
  subtitle: string;
  couplet: string;
  prologueCouplet: string;
  poet: string;
  prologuePoet: string;
  fullProse: string;
  prologueProse: string;
  dialogueHeader: string;
  dialogueProse: string | null;
  waypoints: {
    start: string;
    mid: string;
    boss: string;
  };
  bossConfig: {
    bossRenderId: string;
    bossDisplayName: string;
    bossTitle: string;
    duelOpponentId: string;
    duelButtonLabel: string;
  };
  enemyRoster: {
    factionName: string;
    meleeType: EnemyFactionMelee;
    rangedType: EnemyFactionRanged;
    aerialType: EnemyFactionAerial;
  };
}

type LocalizedText = Record<Language, string>;

function pickLang(map: LocalizedText, lang: Language): string {
  return map[lang] || map.en;
}

interface AlignmentChapterBlueprint {
  baseHeroId: HeroId;
  heroRenderId?: string;
  color: string;
  accentColor: string;
  capeColor: string;
  maxHp: number;
  attackPower: number;
  speed: number;
  jumpForce: number;
  hasDoubleJump?: boolean;
  heroName: LocalizedText;
  heroTitle: LocalizedText;
  heroEquipmentSubtitle: LocalizedText;
  heroDesc: LocalizedText;
  weaponName: LocalizedText;
  specialName: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  dialogueHeader: LocalizedText;
  dialogueProse: LocalizedText | null;
  waypoints: {
    start: LocalizedText;
    mid: LocalizedText;
    boss: LocalizedText;
  };
  bossConfig: {
    bossRenderId: string;
    duelOpponentId: string;
    bossDisplayName: LocalizedText;
    duelButtonLabel: LocalizedText;
  };
  enemyRoster: {
    factionName: LocalizedText;
    meleeType: EnemyFactionMelee;
    rangedType: EnemyFactionRanged;
    aerialType: EnemyFactionAerial;
  };
}

const CHAPTER_BLUEPRINTS: Record<number, Record<PlayerAlignment, AlignmentChapterBlueprint>> = {
  // =========================================================================
  // CHAPTER 1: BLOOD OF IRAJ & FEREYDOUN'S VENGEANCE
  // =========================================================================
  1: {
    good: {
      baseHeroId: 'rostam',
      color: '#d97706',
      accentColor: '#b45309',
      capeColor: '#991b1b',
      maxHp: 165,
      attackPower: 36,
      speed: 4.9,
      jumpForce: 13.5,
      heroName: {
        fa: 'فریدون و منوچهر دادگر',
        en: 'Fereydoun & Manuchehr the Just',
        ar: 'فريدون ومنوشهر العادل',
        fr: 'Fereydoun & Manoutchehr le Juste',
      },
      heroTitle: {
        fa: 'پادشاه دادگر پیشدادی و خون‌خواه ایرج',
        en: 'Sovereign of Iran & Avenger of Pure Iraj',
        ar: 'ملك إيران العادل والمنتقم لدم إيرج',
        fr: 'Souverain d\'Iran & Vengeur d\'Iraj',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده گرز گاوسار زرین، جوشن پیشدادی و فرّه کیانی',
        en: 'Wielder of the Golden Bull-Headed Mace & Pishdadian Royal Armor',
        ar: 'حامل صولجان رأس الثور الذهبي والدرع الملكي',
        fr: 'Porteur de la Masse à Tête de Taureau & Armure Royale',
      },
      heroDesc: {
        fa: 'پهلوان دادخواه ایران‌زمین که برای ستاندن داد خون مظلومانه ایرج با گرز گاوسار به قلب سپاه بیدادگران می‌تازد.',
        en: 'The righteous champion of Iran who marches with the Bull-headed Mace to avenge the innocent blood of Iraj.',
        ar: 'بطل إيران العادل الذي ينطلق بصولجان رأس الثور للأخذ بثأر إيرج المظلوم.',
        fr: 'Le juste champion d\'Iran qui marche avec la Masse à tête de taureau pour venger le sang innocent d\'Iraj.',
      },
      weaponName: {
        fa: 'گرز گاوسار فریدون',
        en: 'Bull-Headed Mace of Fereydoun',
        ar: 'صولجان فريدون ذو رأس الثور',
        fr: 'Masse à Tête de Taureau de Fereydoun',
      },
      specialName: {
        fa: 'خروش دادخواهی فریدون',
        en: 'Earthquake of Righteous Justice',
        ar: 'زلزال العدالة الإلهية',
        fr: 'Séisme de la Justice Royale',
      },
      title: {
        fa: 'فصل اول (جبهه خیر): خون پاک ایرج و دادخواهی فریدون',
        en: 'Chapter 1 (Light): Blood of Iraj & Fereydoun\'s Justice',
        ar: 'الفصل 1 (جبهة النور): دم إيرج الطاهر وعدالة فريدون',
        fr: 'Chapitre 1 (Lumière) : Le Sang d\'Iraj & la Justice de Fereydoun',
      },
      subtitle: {
        fa: 'پیشروی در مسیر عادی بدون غول و نبرد نهایی با سالار سپاه تور در انتهای مرحله',
        en: 'Advance through Tur\'s vanguard and confront Warlord Tur in the locked final arena',
        ar: 'تقدم عبر طلائع جيش تور وواجه قائدهم في الساحة النهائية المغلقة',
        fr: 'Traversez l\'avant-garde et affrontez le Seigneur de Tour dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · دادخواهی خون ایرج',
        en: 'Shahnameh Prologue · Avenging the Blood of Iraj',
        ar: 'مقدمة الشاهنامه · الثأر لدم إيرج',
        fr: 'Prologue du Shahnameh · Venger le Sang d\'Iraj',
      },
      dialogueProse: {
        fa: 'منوچهر و فریدون رو به لشکر کینه‌توز خروشیدند: «ای پیمان‌شکنان که برادر بی‌گناه را بی‌سلاح سر بریدید! امروز گرز گاوسار داد ایران را از بیداد شما خواهد ستاند!»',
        en: '"O oath-breakers who slew an unarmed brother! Today the Bull-headed Mace shall exact the justice of Iran upon your treacherous host!"',
        ar: '«أيها الغادرون الذين قتلوا أخاهم الأعزل! اليوم سيقتص صولجان الحق من جيشكم المعتدي!»',
        fr: '« Ô parjures qui avez égorgé un frère désarmé ! Aujourd\'hui la Masse royale fera triompher la justice d\'Iran ! »',
      },
      waypoints: {
        start: {
          fa: 'سپاه دادخواهی وارد بیشه مرزی شد؛ سربازان عادی پیشقراول را از سر راه بردار!',
          en: 'The army of justice enters the frontier forest; clear the regular vanguard troops!',
          ar: 'دخل جيش العدالة غابات الحدود؛ تغلب على جنود الطليعة!',
          fr: 'L\'armée de la justice pénètre dans la forêt frontalière ; repoussez les éclaireurs !',
        },
        mid: {
          fa: 'طلایه‌داران تور عقب می‌نشینند؛ در انتهای مسیر، باس مرحله در انتظار توست!',
          en: 'Tur\'s vanguard retreats; at the end of the path, the chapter boss awaits!',
          ar: 'تتراجع طلائع تور؛ في نهاية المسار ينتظرك زعيم المرحلة!',
          fr: 'L\'avant-garde recule ; au bout du chemin, le boss du chapitre vous attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! سالار سپاه تور و سلم با تبر پولادین وارد کارزار گشت!',
          en: 'Arena locked! The Warlord of Tur and Salm enters the battlefield!',
          ar: 'أُغلقت الساحة! قائد جيوش تور وسلم يدخل المعركة النهائية!',
          fr: 'Arène verrouillée ! Le Seigneur de Guerre de Tour et Salm entre en scène !',
        },
      },
      bossConfig: {
        bossRenderId: 'warlord_1',
        duelOpponentId: 'div_sepid',
        bossDisplayName: {
          fa: 'تور و سالار سپاه بیداد (باس پایانی فصل ۱)',
          en: 'Tur & Warlord of Treason (Chapter 1 Final Boss)',
          ar: 'تور وقائد جيش البغي (زعيم الفصل 1)',
          fr: 'Tour & Seigneur de Guerre (Boss Final Chapitre 1)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با سالار تور',
          en: '1v1 Duel vs Warlord of Tur',
          ar: 'مبارزة فردية مع قائد تور',
          fr: 'Duel 1v1 contre le Seigneur de Tour',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'سربازان پیشقراول سپاه تور و سلم',
          en: 'Vanguard Soldiers of Tur & Salm',
          ar: 'جنود طليعة جيش تور وسلم',
          fr: 'Soldats d\'Avant-Garde de Tour et Salm',
        },
        meleeType: 'turani_raider',
        rangedType: 'archer_turani',
        aerialType: 'turani_falcon',
      },
    },
    evil: {
      baseHeroId: 'sohrab',
      heroRenderId: 'warlord_1',
      color: '#dc2626',
      accentColor: '#991b1b',
      capeColor: '#1e1b4b',
      maxHp: 140,
      attackPower: 34,
      speed: 6.1,
      jumpForce: 14.3,
      heroName: {
        fa: 'تور جنگاور (فرمانروای توران)',
        en: 'Tur the Conqueror (Lord of Turan)',
        ar: 'تور المحارب (سيد توران)',
        fr: 'Tour le Conquérant (Seigneur du Touran)',
      },
      heroTitle: {
        fa: 'شاهزاده بلندپرواز توران و مدعی تاج و تخت گیتی',
        en: 'Ambitious Prince of Turan & Claimant to the Throne',
        ar: 'أمير توران الطموح والمطالب بعرش العالم',
        fr: 'Prince Ambitieux du Touran & Prétendant au Trône',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده شمشیر سرخ توران، جوشن پولادین سیاه و شنل خشم',
        en: 'Wielder of the Crimson Scimitar of Turan & Dark Steel Cuirass',
        ar: 'حامل السيف القرمزي التوراني والدرع الفولاذي الأسود',
        fr: 'Porteur du Cimeterre Cramoisi & Cuirasse d\'Acier Noir',
      },
      heroDesc: {
        fa: 'فرمانروای تندخو و شمشیرزن برق‌آسای توران که برای تسخیر تخت ایران‌زمین بر مرزبانان فریدون یورش می‌برد.',
        en: 'The fierce, lightning-fast Lord of Turan marching to seize the throne of Iran from Fereydoun\'s sentinels.',
        ar: 'سيد توران السريع والشرس الذي يزحف للاستيلاء على عرش إيران.',
        fr: 'Le fougueux seigneur du Touran marchant pour s\'emparer du trône d\'Iran.',
      },
      weaponName: {
        fa: 'تیغ خون‌ریز توران',
        en: 'Crimson Blade of Turan',
        ar: 'نصل توران الدامي',
        fr: 'Lame Sanglante du Touran',
      },
      specialName: {
        fa: 'گردباد خشم توران',
        en: 'Whirlwind of Turanian Wrath',
        ar: 'إعصار غضب توران',
        fr: 'Tourbillon du Courroux Touranien',
      },
      title: {
        fa: 'فصل اول (جبهه شر): یورش تور برای تسخیر تاج و تخت ایران',
        en: 'Chapter 1 (Dark): Tur\'s Invasion for the Throne of Iran',
        ar: 'الفصل 1 (جبهة الظلام): زحف تور للسيطرة على عرش إيران',
        fr: 'Chapitre 1 (Ombre) : L\'Invasion de Tour pour le Trône d\'Iran',
      },
      subtitle: {
        fa: 'درهم شکستن مرزبانان ایران و رویارویی نهایی با فریدون در انتهای مرحله',
        en: 'Crush the border sentinels and face Fereydoun\'s Champion at the end of the stage',
        ar: 'اسحق حراس الحدود وواجه بطل فريدون في نهاية المرحلة',
        fr: 'Brisez les sentinelles frontalières et affrontez le Champion de Fereydoun en fin de niveau',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · لشکرکشی تور به ایران‌زمین',
        en: 'Shahnameh Prologue · Tur\'s March upon Iran',
        ar: 'مقدمة الشاهنامه · زحف تور نحو إيران',
        fr: 'Prologue du Shahnameh · La Marche de Tour sur l\'Iran',
      },
      dialogueProse: {
        fa: 'تور شمشیر برکشید و بانک زد: «چرا باید دل جهان و تخت زرین ایران تنها از آنِ ایرج و منوچهر باشد؟ با تیغ توران سراسر گیتی را به زیر نگین خود درمی‌آورم!»',
        en: '"Why should the golden throne of Iran belong only to Iraj and Manuchehr? By Turan\'s steel, I shall claim the heart of the world!"',
        ar: '«لماذا يكون عرش إيران الذهبي لإيرج ومنوشهر وحدهما؟ بسيف توران سأخضع العالم بأسره!»',
        fr: '« Pourquoi le trône d\'or d\'Iran reviendrait-il au seul Iraj ? Par le fer du Touran, je soumettrai l\'empire ! »',
      },
      waypoints: {
        start: {
          fa: 'تور به مرزهای ایران تاخت؛ نگهبانان مرزی را با تیغ توران از پیش رو بردار!',
          en: 'Tur charges across the Iranian frontier; cut through the border guards!',
          ar: 'تور يقتحم حدود إيران؛ شق طريقك عبر حراس الحدود!',
          fr: 'Tour franchit la frontière d\'Iran ; taillez-vous un chemin parmi les gardes !',
        },
        mid: {
          fa: 'کمانداران پیشدادی عقب می‌نشینند؛ در انتهای مسیر، نبرد نهایی در انتظار است!',
          en: 'Pishdadian archers fall back; at the end of the road, the final boss battle awaits!',
          ar: 'رماة البيشداديين يتراجعون؛ في نهاية الطريق تنتظرك المعركة الفاصلة!',
          fr: 'Les archers reculent ; au bout de la route, le combat final vous attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! پهلوان دادخواه فریدون با گرز گاوسار راهت را بسته است!',
          en: 'Arena locked! Fereydoun\'s Champion stands before you with the Bull-headed Mace!',
          ar: 'أُغلقت الساحة! بطل فريدون يقف أمامك بصولجان رأس الثور!',
          fr: 'Arène verrouillée ! Le Champion de Fereydoun se dresse devant vous !',
        },
      },
      bossConfig: {
        bossRenderId: 'rostam',
        duelOpponentId: 'rostam',
        bossDisplayName: {
          fa: 'فریدون و سپهدار منوچهر (باس پایانی فصل ۱)',
          en: 'Fereydoun & General Manuchehr (Chapter 1 Final Boss)',
          ar: 'فريدون والقائد منوشهر (زعيم الفصل 1)',
          fr: 'Fereydoun & Général Manoutchehr (Boss Final Chapitre 1)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با سپهدار فریدون',
          en: '1v1 Duel vs Fereydoun\'s Champion',
          ar: 'مبارزة فردية مع بطل فريدون',
          fr: 'Duel 1v1 contre le Champion de Fereydoun',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'مرزبانان و کمانداران پیشدادی ایران',
          en: 'Pishdadian Sentinels & Archers of Iran',
          ar: 'حراس ورماة دولة البيشداديين',
          fr: 'Sentinelles et Archers Pichdadiens d\'Iran',
        },
        meleeType: 'iranian_sentinel',
        rangedType: 'iranian_archer',
        aerialType: 'turani_falcon',
      },
    },
  },

  // =========================================================================
  // CHAPTER 2: BANNER OF KAVEH & ZAHHAK THE SERPENT KING
  // =========================================================================
  2: {
    good: {
      baseHeroId: 'rostam',
      color: '#ea580c',
      accentColor: '#c2410c',
      capeColor: '#7c2d12',
      maxHp: 165,
      attackPower: 37,
      speed: 5.0,
      jumpForce: 13.6,
      heroName: {
        fa: 'کاوه آهنگر و فریدون',
        en: 'Kaveh the Blacksmith & Fereydoun',
        ar: 'كاوه الحداد وفريدون',
        fr: 'Kaveh le Forgeron & Fereydoun',
      },
      heroTitle: {
        fa: 'برافرازنده درفش کاویانی و درهم‌شکننده کاخ بیداد',
        en: 'Bearer of the Kaviani Banner & Breaker of Tyranny',
        ar: 'رافع الراية الكيانية ومحطم عرش الطغيان',
        fr: 'Porteur de l\'Étendard Kavianide & Briseur de Tyrannie',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده پتک پولادین آهنگری، درفش کاویانی و گرز گاوسار',
        en: 'Armed with the Blacksmith\'s Heavy Hammer, Kaviani Banner & Bull Mace',
        ar: 'مسلح بمطرقة الحداد الفولاذية والراية الكيانية',
        fr: 'Armé du Marteau de Forgeron & de l\'Étendard Kavianide',
      },
      heroDesc: {
        fa: 'آهنگر دلیر ایرانی که پیش‌بند چرمی خود را بر سر نیزه کرد و قیام آزادی‌بخش ایران علیه ضحاک ماردوش را رقم زد.',
        en: 'The fearless blacksmith who raised his leather apron upon a spear to lead Iran\'s uprising against Serpent King Zahhak.',
        ar: 'الحداد الشجاع الذي رفع مئزره الجلدي على رمح ليقود ثورة الحرية ضد الضحاك.',
        fr: 'Le forgeron intrépide qui hissa son tablier de cuir sur une lance pour renverser le tyran Zahhak.',
      },
      weaponName: {
        fa: 'پتک کاوه و گرز گاوسار',
        en: 'Hammer of Kaveh & Bull Mace',
        ar: 'مطرقة كاوه وصولجان الثور',
        fr: 'Marteau de Kaveh & Masse Royale',
      },
      specialName: {
        fa: 'خروش درفش کاویانی',
        en: 'Roar of the Kaviani Banner',
        ar: 'هدير الراية الكيانية',
        fr: 'Rugissement de l\'Étendard Kavianide',
      },
      title: {
        fa: 'فصل دوم (جبهه خیر): قیام کاوه آهنگر و سقوط ضحاک ماردوش',
        en: 'Chapter 2 (Light): Uprising of Kaveh & Fall of Zahhak',
        ar: 'الفصل 2 (جبهة النور): ثورة كاوه الحداد وسقوط الضحاك',
        fr: 'Chapitre 2 (Lumière) : Révolte de Kaveh & Chute de Zahhak',
      },
      subtitle: {
        fa: 'عبور از نگهبانان دژ و رویارویی نهایی با ضحاک ماردوش در انتهای مرحله',
        en: 'Fight through castle guards and chain Zahhak the Serpent King at the stage end',
        ar: 'قاتل حراس القلعة وقيد الضحاك في الساحة النهائية',
        fr: 'Traversez la citadelle et enchaînez Zahhak au terme du niveau',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · خروش کاوه در بارگاه ضحاک',
        en: 'Shahnameh Prologue · Kaveh\'s Defiance against Zahhak',
        ar: 'مقدمة الشاهنامه · صرخة كاوه في وجه الضحاك',
        fr: 'Prologue du Shahnameh · Le Défi de Kaveh face à Zahhak',
      },
      dialogueProse: {
        fa: 'کاوه آهنگر درفش کاویانی را برافراشت و فریاد زد: «ای ماردوش ستمگر! هجده فرزندم را خوراک ماران کردی؛ امروز با پتک آهنگران تاج و تختت را در کوه دماوند به بند می‌کشیم!»',
        en: '"O Serpent Tyrant! Eighteen of my sons were fed to your vipers; today our blacksmiths\' hammers shall chain your throne beneath Mount Damavand!"',
        ar: '«أيها الطاغية ذو الثعابين! اليوم ستحطم مطارقنا عرشك ونقيدك في جبل دماوند!»',
        fr: '« Ô Tyran aux serpents ! Aujourd\'hui nos marteaux briseront ton trône et t\'enchaîneront au mont Damavand ! »',
      },
      waypoints: {
        start: {
          fa: 'کاوه و فریدون وارد دژ دماوند شدند؛ پاسداران مارپرست را درهم بکوب!',
          en: 'Kaveh and Fereydoun breach Damavand Citadel; crush the serpent guards!',
          ar: 'دخل كاوه وفريدون قلعة دماوند؛ اسحق حراس الثعابين!',
          fr: 'Kaveh et Fereydoun entrent dans la citadelle de Damavand ; écrasez les gardes !',
        },
        mid: {
          fa: 'مشعل‌های دژ می‌لرزند؛ در انتهای تالار، ضحاک ماردوش در انتظار نبرد نهایی است!',
          en: 'The citadel torches tremble; at the end of the hall, Zahhak awaits the final duel!',
          ar: 'مشاعل القلعة تهتز؛ في نهاية القاعة ينتظرك الضحاك للمعركة الفاصلة!',
          fr: 'Les torches tremblent ; au fond de la salle, Zahhak attend le duel final !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! ضحاک ماردوش با دو مار کبرای زهرآگین بر شانه‌هایش وارد شد!',
          en: 'Arena locked! Zahhak the Serpent King descends with twin venomous cobras!',
          ar: 'أُغلقت الساحة! الضحاك ذو الثعابين ينزل إلى الميدان بثعبانين سامين!',
          fr: 'Arène verrouillée ! Zahhak le Roi-Serpent descend avec ses deux cobras !',
        },
      },
      bossConfig: {
        bossRenderId: 'zahhak',
        duelOpponentId: 'div_sepid',
        bossDisplayName: {
          fa: 'ضحاک ماردوش (باس پایانی فصل ۲)',
          en: 'Zahhak the Serpent King (Chapter 2 Final Boss)',
          ar: 'الضحاك ذو الثعابين (زعيم الفصل 2)',
          fr: 'Zahhak le Roi-Serpent (Boss Final Chapitre 2)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با ضحاک ماردوش',
          en: '1v1 Duel vs Zahhak the Serpent King',
          ar: 'مبارزة فردية مع الضحاك',
          fr: 'Duel 1v1 contre Zahhak le Roi-Serpent',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'پاسداران مارپرست کاخ ضحاک',
          en: 'Serpent-Cult Guards of Zahhak',
          ar: 'حراس معبد الثعابين للضحاك',
          fr: 'Gardes du Culte des Serpents de Zahhak',
        },
        meleeType: 'zahhak_guard',
        rangedType: 'div_sorcerer',
        aerialType: 'zahhak_bat',
      },
    },
    evil: {
      baseHeroId: 'sohrab',
      heroRenderId: 'zahhak',
      color: '#991b1b',
      accentColor: '#dc2626',
      capeColor: '#090d16',
      maxHp: 155,
      attackPower: 36,
      speed: 5.8,
      jumpForce: 14.2,
      heroName: {
        fa: 'ضحاک ماردوش (فرمانروای هزارساله)',
        en: 'Zahhak the Serpent Lord',
        ar: 'الضحاك سيد الثعابين',
        fr: 'Zahhak le Seigneur aux Serpents',
      },
      heroTitle: {
        fa: 'پادشاه جادو و تاریکی با دو مار سیاه بر شانه',
        en: 'Sovereign of Dark Sorcery & Twin Shoulder Serpents',
        ar: 'ملك السحر والظلام ذو الثعبانين الأسودين',
        fr: 'Roi de la Sorcellerie Noire aux Deux Serpents',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده تیغ زهرآگین اهریمنی، تاج آتشین و مارهای دوش',
        en: 'Wielding the Venomous Ahrimanic Blade & Twin Shoulder Vipers',
        ar: 'حامل النصل السام والتاج الناري وثعابين الكتف',
        fr: 'Armé de la Lame Venimeuse & Couronne de Flammes Noires',
      },
      heroDesc: {
        fa: 'فرمانروای مخوف دژ دماوند که با نیروی جادوی اهریمن و تیغ زهرآلود، شورش کاوه آهنگر را سرکوب می‌کند.',
        en: 'The dreaded ruler of Damavand who unleashes dark sorcery and venomous blades to crush Kaveh\'s rebellion.',
        ar: 'حاكم دماوند الرهيب الذي يطلق السحر الأسود والنصال السامة لسحق ثورة كاوه.',
        fr: 'Le redoutable maître de Damavand déchaînant la magie noire contre la révolte de Kaveh.',
      },
      weaponName: {
        fa: 'شمشیر زهرآگین ماردوش',
        en: 'Venomous Serpent Scimitar',
        ar: 'سيف الثعابين المسموم',
        fr: 'Cimeterre Venimeux des Serpents',
      },
      specialName: {
        fa: 'طوفان زهر ماران اهریمن',
        en: 'Tempest of Ahriman\'s Venom',
        ar: 'عاصفة سموم أهريمن',
        fr: 'Tempête du Venin d\'Ahriman',
      },
      title: {
        fa: 'فصل دوم (جبهه شر): خشم ضحاک ماردوش و سرکوب شورش کاوه',
        en: 'Chapter 2 (Dark): Wrath of Zahhak & Crushing the Rebellion',
        ar: 'الفصل 2 (جبهة الظلام): غضب الضحاك وسحق ثورة الحدادين',
        fr: 'Chapitre 2 (Ombre) : La Colère de Zahhak contre la Révolte',
      },
      subtitle: {
        fa: 'نبرد با شورشیان درفش کاویانی و رویارویی نهایی با کاوه و فریدون در انتهای مرحله',
        en: 'Cut down the rebel warriors and confront Kaveh & Fereydoun in the final arena',
        ar: 'اقضِ على الثوار وواجه كاوه وفريدون في الساحة النهائية',
        fr: 'Éliminez les rebelles et affrontez Kaveh et Fereydoun dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · خروش ضحاک بر شورشیان',
        en: 'Shahnameh Prologue · Zahhak\'s Decree of Fire',
        ar: 'مقدمة الشاهنامه · وعيد الضحاك للثوار',
        fr: 'Prologue du Shahnameh · Le Décret de Feu de Zahhak',
      },
      dialogueProse: {
        fa: 'ضحاک از فراز تخت آهنین بانگ زد: «هزار سال پادشاهی من با پیش‌بند چرمی یک آهنگر فرو نخواهد ریخت! مارهای دوش من امروز از خون شورشیان سیراب خواهند شد!»',
        en: '"A thousand years of my empire shall not crumble before a blacksmith\'s leather apron! My serpents shall feast upon the rebels today!"',
        ar: '«ألف عام من سلطاني لن تسقط أمام مئزر حداد! ستروي ثعابيني عطشها من دماء المتمردين!»',
        fr: '« Mille ans de règne ne tomberont pas devant le tablier d\'un forgeron ! Mes serpents dévoreront ces rebelles ! »',
      },
      waypoints: {
        start: {
          fa: 'ضحاک به میان صفوف شورشیان زد؛ مبارزان درفش کاویانی را عقب بران!',
          en: 'Zahhak charges into the rebel ranks; drive back the fighters of the Kaviani Banner!',
          ar: 'الضحاك يقتحم صفوف الثوار؛ ادفع مقاتلي الراية الكيانية للخلف!',
          fr: 'Zahhak charge les rangs rebelles ; repoussez les combattants de la bannière !',
        },
        mid: {
          fa: 'شعله‌های دماوند زبانه می‌کشد؛ در انتهای مسیر، کاوه و فریدون آماده نبردند!',
          en: 'Damavand\'s flames roar; at the end of the path, Kaveh and Fereydoun await!',
          ar: 'نيران دماوند تتأجج؛ في نهاية الطريق ينتظرك كاوه وفريدون!',
          fr: 'Les flammes du Damavand grondent ; au bout du chemin, Kaveh et Fereydoun vous attendent !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! کاوه آهنگر و فریدون با گرز گاوسار به میدان آمدند!',
          en: 'Arena locked! Kaveh the Blacksmith and Fereydoun step into the arena!',
          ar: 'أُغلقت الساحة! كاوه الحداد وفريدون يدخلان ساحة النزال!',
          fr: 'Arène verrouillée ! Kaveh le Forgeron et Fereydoun entrent dans l\'arène !',
        },
      },
      bossConfig: {
        bossRenderId: 'rostam',
        duelOpponentId: 'rostam',
        bossDisplayName: {
          fa: 'کاوه آهنگر و فریدون (باس پایانی فصل ۲)',
          en: 'Kaveh & Fereydoun (Chapter 2 Final Boss)',
          ar: 'كاوه الحداد وفريدون (زعيم الفصل 2)',
          fr: 'Kaveh & Fereydoun (Boss Final Chapitre 2)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با کاوه و فریدون',
          en: '1v1 Duel vs Kaveh & Fereydoun',
          ar: 'مبارزة فردية مع كاوه وفريدون',
          fr: 'Duel 1v1 contre Kaveh et Fereydoun',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'مبارزان قیام درفش کاویانی',
          en: 'Freedom Fighters of the Kaviani Banner',
          ar: 'مقاتلو ثورة الراية الكيانية',
          fr: 'Combattants de la Révolte Kavianide',
        },
        meleeType: 'iranian_sentinel',
        rangedType: 'iranian_archer',
        aerialType: 'turani_falcon',
      },
    },
  },

  // =========================================================================
  // CHAPTER 3: SEVEN LABORS OF MAZANDARAN & THE WHITE DIV
  // =========================================================================
  3: {
    good: {
      baseHeroId: 'rostam',
      color: '#d97706',
      accentColor: '#b45309',
      capeColor: '#991b1b',
      maxHp: 170,
      attackPower: 38,
      speed: 4.9,
      jumpForce: 13.6,
      heroName: {
        fa: 'رستم دستان (فاتح هفت‌خوان)',
        en: 'Rostam the Mighty (Conqueror of Haft-Khan)',
        ar: 'رستم دستان (قاهر الخانات السبع)',
        fr: 'Rostam le Colosse (Héros des Sept Épreuves)',
      },
      heroTitle: {
        fa: 'تهمتن سیستان و ناجی لشکر ایران در مازندران',
        en: 'Colossus of Sistan & Savior of Iran in Mazandaran',
        ar: 'بطل سيستان ومنقذ جيش إيران في مازندران',
        fr: 'Colosse du Sistan & Sauveur d\'Iran au Mazandaran',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده زره ببر بیان، کلاه‌خود کاموس و گرز گاوسار سام',
        en: 'Clad in Babr-e Bayan Tiger Pelt & Wielding Sam\'s Bull Mace',
        ar: 'مرتدياً درع النمر وحاملاً صولجان سام',
        fr: 'Revêtu de la Cuirasse de Tigre & de la Masse de Sam',
      },
      heroDesc: {
        fa: 'پیلتن شکست‌ناپذیر ایران که پس از گذر از شش خوان، برای رهایی کاووس به غار تاریک دیو سپید فرود می‌آید.',
        en: 'The invincible champion of Iran descending into the dark cavern of Mazandaran to slay the Colossal White Div.',
        ar: 'البطل الذي لا يقهر والذي ينزل إلى كهف مازندران المظلم لمواجهة الشيطان الأبيض.',
        fr: 'Le héros invaincu descendant dans l\'antre du Mazandaran pour terrasser le Démon Blanc.',
      },
      weaponName: {
        fa: 'گرز گاوسار سام نریمان',
        en: 'Bull-Headed Mace of Sam',
        ar: 'صولجان سام ذو رأس الثور',
        fr: 'Masse à Tête de Taureau de Sam',
      },
      specialName: {
        fa: 'زمین‌لرزه تهمتن',
        en: 'Earthquake of Tahamtan',
        ar: 'زلزال رستم الساحق',
        fr: 'Séisme de Tahamtan',
      },
      title: {
        fa: 'فصل سوم (جبهه خیر): هفت‌خوان رستم و نبرد با دیو سپید',
        en: 'Chapter 3 (Light): Rostam\'s Seven Labors & The White Div',
        ar: 'الفصل 3 (جبهة النور): خانات رستم السبع والشيطان الأبيض',
        fr: 'Chapitre 3 (Lumière) : Les Sept Épreuves & Le Démon Blanc',
      },
      subtitle: {
        fa: 'پاکسازی غار مازندران از دیوان عادی و نبرد نهایی با دیو سپید در انتهای مرحله',
        en: 'Clear the cavern of demon grunts and battle the Colossal White Div at the stage end',
        ar: 'طهر الكهف من الشياطين الصغار وواجه الشيطان الأبيض في نهاية المرحلة',
        fr: 'Purgez la caverne et affrontez le Démon Blanc dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · ورود رستم به غار دیو سپید',
        en: 'Shahnameh Prologue · Rostam Enters the White Div\'s Cavern',
        ar: 'مقدمة الشاهنامه · دخول رستم كهف الشيطان الأبيض',
        fr: 'Prologue du Shahnameh · Rostam dans l\'Antre du Démon Blanc',
      },
      dialogueProse: {
        fa: 'دیو سپید همچون کوهی از تاریکی برون جهید و غرید: «کدام آدمیزاد پای به کنام من نهاده است؟» رستم گرز برکشید: «منم رستم پور دستان سام! امروز جگر تاریکت را برای بینایی چشمان ایرانیان برون می‌کشم!»',
        en: '"What mortal dares enter my dark lair?" roared the White Div. Rostam raised his mace: "I am Rostam, son of Zal! Today your dark reign ends!"',
        ar: 'زمجر الشيطان الأبيض: «أي بشر يجرؤ على دخول عريني؟» فرفع رستم صولجانه: «أنا رستم بن زال، واليوم ينتهي ظلامك!»',
        fr: 'Le Démon Blanc rugit : « Quel mortel ose entrer dans mon antre ? » Rostam leva sa masse : « Je suis Rostam, fils de Zal ! »',
      },
      waypoints: {
        start: {
          fa: 'رستم وارد دهلیز غار مازندران شد؛ دیوان نگهبان را از سر راه بردار!',
          en: 'Rostam enters the cavern corridor of Mazandaran; clear the demon sentries!',
          ar: 'دخل رستم دهليز كهف مازندران؛ اقضِ على الشياطين الحراس!',
          fr: 'Rostam entre dans la galerie du Mazandaran ; éliminez les gardes démons !',
        },
        mid: {
          fa: 'قندیل‌های غار می‌لرزند؛ در انتهای غار، دیو سپید آماده نبرد نهایی است!',
          en: 'Cavern stalactites shudder; at the end of the cave, the White Div awaits!',
          ar: 'صخور الكهف ترتجف؛ في نهاية الكهف ينتظرك الشيطان الأبيض!',
          fr: 'Les stalactites tremblent ; au fond de la grotte, le Démon Blanc vous attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! دیو سپید مازندران با سنگ آسیاب و شاخ‌های اهریمنی وارد شد!',
          en: 'Arena locked! The Colossal White Div of Mazandaran charges forth!',
          ar: 'أُغلقت الساحة! الشيطان الأبيض العملاق يقتحم الميدان!',
          fr: 'Arène verrouillée ! Le Colossal Démon Blanc du Mazandaran surgit !',
        },
      },
      bossConfig: {
        bossRenderId: 'div_sepid',
        duelOpponentId: 'div_sepid',
        bossDisplayName: {
          fa: 'دیو سپید مازندران (باس پایانی فصل ۳)',
          en: 'The Colossal White Div (Chapter 3 Final Boss)',
          ar: 'الشيطان الأبيض العملاق (زعيم الفصل 3)',
          fr: 'Le Colossal Démon Blanc (Boss Final Chapitre 3)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با دیو سپید مازندران',
          en: '1v1 Duel vs The White Div',
          ar: 'مبارزة فردية مع الشيطان الأبيض',
          fr: 'Duel 1v1 contre le Démon Blanc',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'دیوان و جادوگران غار مازندران',
          en: 'Cavern Demons & Sorcerers of Mazandaran',
          ar: 'شياطين وسحرة كهف مازندران',
          fr: 'Démons et Sorciers du Mazandaran',
        },
        meleeType: 'div_soldier',
        rangedType: 'div_sorcerer',
        aerialType: 'flying_akvan',
      },
    },
    evil: {
      baseHeroId: 'rostam',
      heroRenderId: 'div_sepid',
      color: '#64748b',
      accentColor: '#dc2626',
      capeColor: '#1e1b4b',
      maxHp: 175,
      attackPower: 39,
      speed: 4.8,
      jumpForce: 13.5,
      heroName: {
        fa: 'ارژنگ‌دیو و سالار مازندران',
        en: 'Arzhang Div (Warlord of Mazandaran)',
        ar: 'أرجنك ديو (قائد جيوش مازندران)',
        fr: 'Arzhang Div (Seigneur du Mazandaran)',
      },
      heroTitle: {
        fa: 'سپهبد لشکر تاریکی و پاسدار قلمرو دیو سپید',
        en: 'Commander of the Dark Host & Guardian of Mazandaran',
        ar: 'قائد جيش الظلام وحامي مملكة الشيطان الأبيض',
        fr: 'Commandant des Ténèbres & Gardien du Mazandaran',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده گرز سنگی خاردار، زره پولاد سیاه و شاخ‌های دیوآسا',
        en: 'Armed with the Spiked Crag-Mace & Obsidian Demon Armor',
        ar: 'مسلح بالصولجان الصخري المسنن ودرع الظلام',
        fr: 'Armé de la Masse de Roc Épineuse & Armure d\'Obsidienne',
      },
      heroDesc: {
        fa: 'سپهدار نیرومند دیوان مازندران که برای درهم شکستن اردوی کیکاووس و متوقف ساختن رستم دستان به میدان می‌آید.',
        en: 'The mighty demon general of Mazandaran marching to crush Kay Kavus\'s camp and halt Rostam.',
        ar: 'قائد شياطين مازندران الجبار الذي يزحف لسحق معسكر كيكاوس وإيقاف رستم.',
        fr: 'Le puissant général démon du Mazandaran marchant pour écraser le camp perse et arrêter Rostam.',
      },
      weaponName: {
        fa: 'گرز صخره‌شکن ارژنگ‌دیو',
        en: 'Boulder-Crushing Mace of Arzhang',
        ar: 'صولجان أرجنك محطم الصخور',
        fr: 'Masse Brise-Roc d\'Arzhang',
      },
      specialName: {
        fa: 'غرش سیاه‌چال مازندران',
        en: 'Cataclysm of the Dark Cavern',
        ar: 'زلزال كهف الظلام',
        fr: 'Cataclysme de la Caverne Noire',
      },
      title: {
        fa: 'فصل سوم (جبهه شر): خروش ارژنگ‌دیو در برابر لشکر ایران',
        en: 'Chapter 3 (Dark): Fury of Arzhang Div against Iran\'s Host',
        ar: 'الفصل 3 (جبهة الظلام): غضب أرجنك ديو ضد جيش إيران',
        fr: 'Chapitre 3 (Ombre) : La Fureur d\'Arzhang Div contre l\'Iran',
      },
      subtitle: {
        fa: 'درهم شکستن سپاهیان کاووس و نبرد نهایی با رستم دستان در انتهای مرحله',
        en: 'Smash through Kavus\'s soldiers and battle Rostam the Mighty at the stage end',
        ar: 'حطم جنود كيكاوس وواجه رستم دستان في الساحة النهائية',
        fr: 'Écrasez les soldats de Kavus et affrontez Rostam à la fin du niveau',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · خروش ارژنگ‌دیو بر لشکر ایران',
        en: 'Shahnameh Prologue · Arzhang Div\'s Roar in Mazandaran',
        ar: 'مقدمة الشاهنامه · زمجرة أرجنك ديو في مازندران',
        fr: 'Prologue du Shahnameh · Le Rugissement d\'Arzhang Div',
      },
      dialogueProse: {
        fa: 'ارژنگ‌دیو نعره برآورد: «کیکاووس به طمع مازندران در دام تاریکی ما افتاد! اکنون نوبت پهلوان زابلی است تا طعم گرز دیوان را بچشد!»',
        en: '"Kay Kavus fell into our darkness out of greed for Mazandaran! Now the champion of Zabol shall taste the wrath of the Divs!"',
        ar: '«سقط كيكاوس في ظلامنا طمعاً في مازندران! والآن سيذوق بطل زابل بأس الشياطين!»',
        fr: '« Kay Kavus est tombé dans nos ténèbres ! Maintenant le champion de Zabol goûtera à notre courroux ! »',
      },
      waypoints: {
        start: {
          fa: 'ارژنگ‌دیو به اردوی سپاه ایران تاخت؛ سربازان کاووس را تارومار کن!',
          en: 'Arzhang Div storms the Iranian camp; scatter Kavus\'s vanguard!',
          ar: 'أرجنك ديو يهاجم معسكر إيران؛ شتت جنود الطليعة!',
          fr: 'Arzhang Div prend d\'assaut le camp perse ; dispersez l\'avant-garde !',
        },
        mid: {
          fa: 'شیهه رخش از انتهای بیشه به گوش می‌رسد؛ رستم دستان در انتهای مرحله منتظر است!',
          en: 'Rakhsh\'s neigh echoes from the clearing; Rostam awaits at the end of the stage!',
          ar: 'صهيل رخش يتردد في نهاية الغابة؛ رستم ينتظرك في الساحة النهائية!',
          fr: 'Le hennissement de Rakhsh résonne ; Rostam vous attend à la fin du niveau !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! رستم دستان با زره ببر بیان و گرز سام وارد کارزار گشت!',
          en: 'Arena locked! Rostam the Mighty enters the arena in Tiger Pelt Armor!',
          ar: 'أُغلقت الساحة! رستم دستان يدخل الميدان بدرع النمر وصولجان سام!',
          fr: 'Arène verrouillée ! Rostam le Colosse entre en lice dans sa Cuirasse de Tigre !',
        },
      },
      bossConfig: {
        bossRenderId: 'rostam',
        duelOpponentId: 'rostam',
        bossDisplayName: {
          fa: 'رستم دستان (باس پایانی فصل ۳)',
          en: 'Rostam the Mighty (Chapter 3 Final Boss)',
          ar: 'رستم دستان (زعيم الفصل 3)',
          fr: 'Rostam le Colosse (Boss Final Chapitre 3)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با رستم دستان',
          en: '1v1 Duel vs Rostam the Mighty',
          ar: 'مبارزة فردية مع رستم دستان',
          fr: 'Duel 1v1 contre Rostam le Colosse',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'طلایه‌داران لشکر کیکاووس در مازندران',
          en: 'Expeditionary Vanguard of Kay Kavus',
          ar: 'طلائع جيش كيكاوس في مازندران',
          fr: 'Avant-Garde de l\'Armée de Kay Kavus',
        },
        meleeType: 'kayanian_guard',
        rangedType: 'iranian_archer',
        aerialType: 'turani_falcon',
      },
    },
  },

  // =========================================================================
  // CHAPTER 4: WHITE FORTRESS & TRAGEDY OF ROSTAM AND SOHRAB
  // =========================================================================
  4: {
    good: {
      baseHeroId: 'gordafarid',
      color: '#10b981',
      accentColor: '#059669',
      capeColor: '#d97706',
      maxHp: 135,
      attackPower: 32,
      speed: 6.8,
      jumpForce: 15.2,
      hasDoubleJump: true,
      heroName: {
        fa: 'گردآفرید شیرزن (و رستم دستان)',
        en: 'Gordafarid the Fierce (Defender of White Fortress)',
        ar: 'كردآفريد الفارسة (حامية الحصن الأبيض)',
        fr: 'Gordafarid l\'Intrépide (Gardienne du Fort Blanc)',
      },
      heroTitle: {
        fa: 'پاسدار دلیر دژ سپید و کماندار بی‌همتای ایران',
        en: 'Heroine of the White Fortress & Master Kayanian Archer',
        ar: 'بطلة الحصن الأبيض ورامية السهام الإيرانية',
        fr: 'Héroïne de la Forteresse Blanche & Archère d\'Élite',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده جوشن یشمی زرنگار، کمان کیانی، پرش جفتی و سنان زرین',
        en: 'Clad in Jade Mail with Kayanian Bow, Double Jump & Golden Lance',
        ar: 'مرتدية الدرع اليشمي مع قوس كيان والقفز المزدوج',
        fr: 'Vêtue de l\'Armure de Jade avec Arc Kayanide & Double Saut',
      },
      heroDesc: {
        fa: 'شیرزن سلحشور ایران که در دژ سپید جوشن پوشید و برای دفاع از مرزهای ایران در برابر سپاه سهراب به میدان تاخت.',
        en: 'The fearless warrior maiden who donned armor at the White Fortress to defend Iran\'s frontier against Sohrab\'s host.',
        ar: 'الفارسة الشجاعة التي ارتدت الدرع في الحصن الأبيض للدفاع عن حدود إيران أمام جيش سهراب.',
        fr: 'La guerrière intrépide qui revêtit l\'armure à la Forteresse Blanche pour défendre la frontière contre Sohrab.',
      },
      weaponName: {
        fa: 'کمان کیانی و زوبین زرین',
        en: 'Kayanian Recurve Bow & Golden Lance',
        ar: 'قوس كيان والرمح الذهبي',
        fr: 'Arc Kayanide & Lance d\'Or',
      },
      specialName: {
        fa: 'باران تیرهای آتشین',
        en: 'Rain of Blazing Arrows',
        ar: 'مطر السهام الملتهبة',
        fr: 'Pluie de Flèches Incendiaires',
      },
      title: {
        fa: 'فصل چهارم (جبهه خیر): دفاع گردآفرید از دژ سپید در برابر سهراب',
        en: 'Chapter 4 (Light): Gordafarid\'s Defense of the White Fortress',
        ar: 'الفصل 4 (جبهة النور): دفاع كردآفريد عن الحصن الأبيض ضد سهراب',
        fr: 'Chapitre 4 (Lumière) : Défense de la Forteresse Blanche par Gordafarid',
      },
      subtitle: {
        fa: 'عقب راندن مهاجمان تورانی در مسیر دژ و رویارویی نهایی با سهراب یل در انتهای مرحله',
        en: 'Repel Turanian raiders along the ramparts and face Sohrab in the final arena',
        ar: 'صد الغزاة التورانيين على أسوار الحصن وواجه سهراب في الساحة النهائية',
        fr: 'Repoussez les assaillants sur les remparts et affrontez Sohrab dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · رویارویی گردآفرید و سهراب در دژ سپید',
        en: 'Shahnameh Prologue · Gordafarid Confronts Sohrab at the White Fortress',
        ar: 'مقدمة الشاهنامه · مواجهة كردآفريد وسهراب عند الحصن الأبيض',
        fr: 'Prologue du Shahnameh · Gordafarid face à Sohrab au Fort Blanc',
      },
      dialogueProse: {
        fa: 'گردآفرید کمان کیانی را به زه کشید و فریاد زد: «ای سپهدار جوان توران! تا شیرزنان و مرزبانان ایران زنده‌اند، دژ سپید هرگز تسلیم نخواهد شد!»',
        en: '"O young general of Turan! So long as the lion-hearted defenders of Iran draw breath, the White Fortress shall never fall!"',
        ar: '«أيها القائد الشاب! ما دام حماة إيران أحياءً فلن يسقط الحصن الأبيض أبداً!»',
        fr: '« Ô jeune général du Touran ! Tant que les défenseurs d\'Iran respireront, la Forteresse Blanche ne tombera pas ! »',
      },
      waypoints: {
        start: {
          fa: 'گردآفرید از دروازه دژ سپید بیرون تاخت؛ مهاجمان عادی توران را هدف بگیر!',
          en: 'Gordafarid rides out from the White Fortress gate; target the Turanian raiders!',
          ar: 'انطلقت كردآفريد من بوابة الحصن الأبيض؛ صوّب سهامك نحو المهاجمين!',
          fr: 'Gordafarid sort de la Forteresse Blanche ; visez les assaillants touraniens !',
        },
        mid: {
          fa: 'سهراب از دور تیراندازی تو را می‌ستابد؛ در انتهای دشت، نبرد با سهراب آغاز می‌شود!',
          en: 'Sohrab marvels at your archery from afar; at the end of the field, Sohrab awaits!',
          ar: 'سهراب يعجب ببراعتك من بعيد؛ في نهاية الساحة ينتظرك نزال سهراب!',
          fr: 'Sohrab admire votre tir de loin ; au bout de la plaine, le duel contre Sohrab vous attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! سهراب یل با شمشیر دمشقی برای نبرد نهایی وارد میدان شد!',
          en: 'Arena locked! Sohrab the Valiant steps forth with his Damascus Scimitar!',
          ar: 'أُغلقت الساحة! سهراب الباسل يتقدم بسيفه الدمشقي للمعركة النهائية!',
          fr: 'Arène verrouillée ! Sohrab le Vaillant s\'avance avec son Cimeterre de Damas !',
        },
      },
      bossConfig: {
        bossRenderId: 'sohrab',
        duelOpponentId: 'sohrab',
        bossDisplayName: {
          fa: 'سهراب یل (باس پایانی فصل ۴)',
          en: 'Sohrab the Valiant (Chapter 4 Final Boss)',
          ar: 'سهراب الباسل (زعيم الفصل 4)',
          fr: 'Sohrab le Vaillant (Boss Final Chapitre 4)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با سهراب یل',
          en: '1v1 Duel vs Sohrab the Valiant',
          ar: 'مبارزة فردية مع سهراب الباسل',
          fr: 'Duel 1v1 contre Sohrab le Vaillant',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'طلایه‌داران لشکر سهراب در دژ سپید',
          en: 'Turanian Vanguard at the White Fortress',
          ar: 'طلائع جيش سهراب عند الحصن الأبيض',
          fr: 'Avant-Garde de Sohrab à la Forteresse Blanche',
        },
        meleeType: 'turani_raider',
        rangedType: 'archer_turani',
        aerialType: 'turani_falcon',
      },
    },
    evil: {
      baseHeroId: 'sohrab',
      color: '#0284c7',
      accentColor: '#0369a1',
      capeColor: '#dc2626',
      maxHp: 145,
      attackPower: 35,
      speed: 6.3,
      jumpForce: 14.6,
      heroName: {
        fa: 'سهراب یل (سپهدار جوان توران)',
        en: 'Sohrab the Valiant (General of Turan)',
        ar: 'سهراب الباسل (قائد جيش توران)',
        fr: 'Sohrab le Vaillant (Général du Touran)',
      },
      heroTitle: {
        fa: 'فرزند تهمینه و رستم، فاتح دژ سپید و استاد شمشیر دمشقی',
        en: 'Son of Rostam & Tahmineh, Conqueror of the Frontier',
        ar: 'ابن رستم وتهمينة وفاتح حصون الحدود',
        fr: 'Fils de Rostam et Tahmineh, Maître du Cimeterre',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده جوشن فیروزه‌ای، بازوبند یاقوت رستم و تیغ پولادین دمشقی',
        en: 'Bearing Rostam\'s Ruby Armlet, Turquoise Mail & Damascus Scimitar',
        ar: 'حامل سوار رستم الياقوتي والدرع الفيروزي والسيف الدمشقي',
        fr: 'Porteur du Brassard de Rubis, Armure Turquoise & Cimeterre',
      },
      heroDesc: {
        fa: 'پهلوان جوان و طوفانی که با لشکر توران از مرزها گذشت تا کاووس را براندازد و در انتهای میدان با رستم دستان روبه‌رو می‌شود.',
        en: 'The swift young titan leading Turan\'s host across the frontier, destined to clash with Rostam the Mighty in the final arena.',
        ar: 'البطل الشاب السريع الذي يقود جيش توران عبر الحدود ليواجه رستم دستان في نهاية المرحلة.',
        fr: 'Le jeune prodige menant l\'armée du Touran, destiné à affronter Rostam dans l\'arène finale.',
      },
      weaponName: {
        fa: 'تیغ پولادین دمشقی سهراب',
        en: 'Damascus Steel Scimitar',
        ar: 'السيف الفولاذي الدمشقي',
        fr: 'Cimeterre d\'Acier Damassé',
      },
      specialName: {
        fa: 'گردباد تیغ سهراب',
        en: 'Whirlwind Blade Rush',
        ar: 'إعصار السيف القاطع',
        fr: 'Tourbillon de Lames',
      },
      title: {
        fa: 'فصل چهارم (جبهه شر): یورش سهراب یل و نبرد سرنوشت با رستم',
        en: 'Chapter 4 (Dark): Sohrab\'s Campaign & Fateful Clash with Rostam',
        ar: 'الفصل 4 (جبهة الظلام): حملة سهراب والنزال المصيري مع رستم',
        fr: 'Chapitre 4 (Ombre) : La Campagne de Sohrab & Duel face à Rostam',
      },
      subtitle: {
        fa: 'گذر از مدافعان دژ سپید و نبرد نهایی با رستم دستان در انتهای مرحله',
        en: 'Break through the fortress sentinels and duel Rostam the Mighty in the locked arena',
        ar: 'اخترق صفوف حراس الحصن وبارز رستم دستان في الساحة النهائية',
        fr: 'Franchissez les sentinelles du fort et affrontez Rostam dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'دیالوگ منظوم شاهنامه · پرسش سهراب از نام و نشان رستم',
        en: 'Shahnameh Dialogue · Sohrab Questions the Unnamed Colossus',
        ar: 'حوار الشاهنامه · سؤال سهراب عن اسم رستم ونسبه',
        fr: 'Dialogue du Shahnameh · Sohrab interroge le Colosse inconnu',
      },
      dialogueProse: {
        fa: 'سهراب با دلی تپنده بانک زد: «ای پهلوان! به یزدان سوگند بگو آیا تو رستم دستانی؟ که دلم به مهر تو گواهی می‌دهد، اما اگر تیغ برکشی، سپاه کاووس را زیرورو خواهم کرد!»',
        en: '"O Champion! Swear by Heaven and tell me if you are Rostam! My heart speaks of love, yet if we cross blades, Kay Kavus\'s throne shall tremble!"',
        ar: '«أيها البطل! أقسم عليك بالله هل أنت رستم دستان؟ قلبي يشهد بحبك، ولكن إن سللت السيف فسأدك عرش كيكاوس!»',
        fr: '« Ô Champion ! Dis-moi si tu es Rostam ! Mon cœur t\'appelle, mais si nous croisons le fer, le trône de Kavus tremblera ! »',
      },
      waypoints: {
        start: {
          fa: 'سهراب از باروی دژ سپید گذشت؛ پاسداران کاووس را با شمشیر دمشقی کنار بزن!',
          en: 'Sohrab breaches the White Fortress outer wall; cut through Kavus\'s guards!',
          ar: 'اخترق سهراب أسوار الحصن الأبيض؛ تجاوز حراس كيكاوس بسيفك!',
          fr: 'Sohrab franchit le mur extérieur ; repoussez les gardes de Kavus !',
        },
        mid: {
          fa: 'سهراب به بازوبند خود می‌نگرد؛ در انتهای دشت، رستم دستان آماده نبرد نهایی است!',
          en: 'Sohrab glances at his royal armlet; at the end of the plain, Rostam awaits!',
          ar: 'ينظر سهراب إلى سواره الملكي؛ في نهاية السهل ينتظرك رستم دستان!',
          fr: 'Sohrab regarde son brassard royal ; au bout de la plaine, Rostam attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! رستم دستان با هیبت پیلتن برای نبرد سرنوشت وارد شد!',
          en: 'Arena locked! Rostam the Mighty steps forward for the fateful clash of titans!',
          ar: 'أُغلقت الساحة! رستم دستان يتقدم للنزال المصيري بين العملاقين!',
          fr: 'Arène verrouillée ! Rostam le Colosse s\'avance pour le duel fatidique !',
        },
      },
      bossConfig: {
        bossRenderId: 'rostam',
        duelOpponentId: 'rostam',
        bossDisplayName: {
          fa: 'رستم دستان (باس پایانی فصل ۴)',
          en: 'Rostam the Mighty (Chapter 4 Final Boss)',
          ar: 'رستم دستان (زعيم الفصل 4)',
          fr: 'Rostam le Colosse (Boss Final Chapitre 4)',
        },
        duelButtonLabel: {
          fa: 'دوئل سرنوشت‌ساز سهراب با رستم دستان',
          en: '1v1 Fateful Duel vs Rostam',
          ar: 'مبارزة مصيرية مع رستم دستان',
          fr: 'Duel Fatidique 1v1 contre Rostam',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'مرزبانان و کمانداران دژ سپید ایران',
          en: 'Defenders & Archers of the White Fortress',
          ar: 'حراس ورماة الحصن الأبيض الإيراني',
          fr: 'Défenseurs et Archers de la Forteresse Blanche',
        },
        meleeType: 'iranian_sentinel',
        rangedType: 'iranian_archer',
        aerialType: 'turani_falcon',
      },
    },
  },

  // =========================================================================
  // CHAPTER 5: SIAVASH'S TRIAL OF FIRE & KING AFRASIAB
  // =========================================================================
  5: {
    good: {
      baseHeroId: 'sohrab',
      color: '#eab308',
      accentColor: '#ca8a04',
      capeColor: '#f8fafc',
      maxHp: 150,
      attackPower: 36,
      speed: 6.2,
      jumpForce: 14.5,
      heroName: {
        fa: 'شاهزاده سیاوش پاک‌نهاد',
        en: 'Prince Siavash the Pure',
        ar: 'الأمير سياوش الطاهر',
        fr: 'Prince Siavash le Pur',
      },
      heroTitle: {
        fa: 'گذرنده از کوه آتش و بنیان‌گذار سیاوش‌گرد',
        en: 'Walker Through the Mountain of Fire & Lord of Siavashgard',
        ar: 'عابر جبل النار ومؤسس مدينة سياوشكرد',
        fr: 'Vainqueur de la Montagne de Feu & Fondateur de Siavashgard',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده خود زرین، جامه سپید پاکی، شبرنگ بهزاد و تیغ کیانی',
        en: 'Wearing the Golden Helmet, White Robe of Purity & Kayanian Blade',
        ar: 'مرتدياً الخوذة الذهبية وثوب النقاء الأبيض وحاملاً سيف كيان',
        fr: 'Coiffé du Casque d\'Or, Tunique Blanche & Lame Kayanide',
      },
      heroDesc: {
        fa: 'شاهزاده آزاده و پرورده رستم که سرافراز از کوه آتش گذشت و اینک در برابر لشکر بیدادگر افراسیاب و گرسیوز ایستاده است.',
        en: 'The noble prince raised by Rostam who rode unharmed through raging fire and stands against tyrant Afrasiab.',
        ar: 'الأمير النبيل الذي عبر النار بسلام ويقف بشجاعة في وجه الطاغية أفراسياب.',
        fr: 'Le noble prince élevé par Rostam qui traversa les flammes et fait face au tyran Afrasiab.',
      },
      weaponName: {
        fa: 'شمشیر زرین سیاوش',
        en: 'Golden Kayanian Blade of Siavash',
        ar: 'سيف سياوش الكياني الذهبي',
        fr: 'Épée Royale Dorée de Siavash',
      },
      specialName: {
        fa: 'موج آتش پاک‌دامنی',
        en: 'Sacred Flame Wave of Siavash',
        ar: 'موجة لهيب الطهارة المقدس',
        fr: 'Onde de Flamme Sacrée de Siavash',
      },
      title: {
        fa: 'فصل پنجم (جبهه خیر): گذر سیاوش از آتش و نبرد با افراسیاب',
        en: 'Chapter 5 (Light): Siavash\'s Trial of Fire & Clash with Afrasiab',
        ar: 'الفصل 5 (جبهة النور): عبور سياوش النار ومواجهة أفراسياب',
        fr: 'Chapitre 5 (Lumière) : L\'Épreuve du Feu de Siavash face à Afrasiab',
      },
      subtitle: {
        fa: 'گذر از دشت شعله‌ور بدون غول میانی و رویارویی نهایی با افراسیاب در انتهای مرحله',
        en: 'Cross the fiery plains and confront King Afrasiab in the locked final arena',
        ar: 'اعبر السهول المشتعلة وواجه الملك أفراسياب في الساحة النهائية',
        fr: 'Traversez les plaines ardentes et affrontez le roi Afrasiab en fin de niveau',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · سیاوش در برابر مکر گرسیوز و افراسیاب',
        en: 'Shahnameh Prologue · Siavash Faces the Treachery of Afrasiab',
        ar: 'مقدمة الشاهنامه · سياوش في مواجهة غدر أفراسياب',
        fr: 'Prologue du Shahnameh · Siavash face à la Trahison d\'Afrasiab',
      },
      dialogueProse: {
        fa: 'سیاوش رو به آسمان نیایش کرد: «ای دادار پاک! چنان‌که مرا از کوه آتش بی‌گزند گذراندی، امروز نیز در برابر تیغ بیداد افراسیاب یار و یاور راستی باش!»',
        en: '"O Creator of Light! Just as You carried me unharmed through the mountain of fire, grant me strength against Afrasiab\'s tyranny!"',
        ar: '«يا خالق النور! كما نجيتني من جبل النار، امنحني القوة اليوم في وجه طغيان أفراسياب!»',
        fr: '« Ô Créateur de Lumière ! Comme Tu m\'as guidé à travers la montagne de feu, soutiens mon bras face à Afrasiab ! »',
      },
      waypoints: {
        start: {
          fa: 'سیاوش از میان شعله‌ها گذشت؛ مهاجمان لشکر گرسیوز و افراسیاب را عقب بران!',
          en: 'Siavash rides past the flames; drive back the raiders of Garsivaz and Afrasiab!',
          ar: 'عبر سياوش وسط اللهب؛ ادفع جنود كرسيوز وأفراسياب للوراء!',
          fr: 'Siavash franchit les flammes ; repoussez les soldats de Garsivaz et d\'Afrasiab !',
        },
        mid: {
          fa: 'دروازه سیاوش‌گرد در افق پیداست؛ افراسیاب در انتهای مرحله در انتظار است!',
          en: 'The gates of Siavashgard loom ahead; King Afrasiab awaits at the end of the stage!',
          ar: 'بوابات سياوشكرد تلوح في الأفق؛ الملك أفراسياب ينتظرك في نهاية المسار!',
          fr: 'Les portes de Siavashgard apparaissent ; le roi Afrasiab vous attend au bout du chemin !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! افراسیاب پادشاه توران با تیغ خون‌ریز وارد میدان شد!',
          en: 'Arena locked! King Afrasiab of Turan steps into the blazing arena!',
          ar: 'أُغلقت الساحة! الملك أفراسياب يدخل الساحة الملتهبة!',
          fr: 'Arène verrouillée ! Le roi Afrasiab du Touran entre dans l\'arène ardente !',
        },
      },
      bossConfig: {
        bossRenderId: 'warlord_5',
        duelOpponentId: 'esfandiar',
        bossDisplayName: {
          fa: 'افراسیاب پادشاه توران (باس پایانی فصل ۵)',
          en: 'King Afrasiab of Turan (Chapter 5 Final Boss)',
          ar: 'الملك أفراسياب ملك توران (زعيم الفصل 5)',
          fr: 'Le Roi Afrasiab du Touran (Boss Final Chapitre 5)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با افراسیاب تورانی',
          en: '1v1 Duel vs King Afrasiab',
          ar: 'مبارزة فردية مع الملك أفراسياب',
          fr: 'Duel 1v1 contre le Roi Afrasiab',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'سپاهیان مهاجم گرسیوز و افراسیاب',
          en: 'Assault Legions of Garsivaz & Afrasiab',
          ar: 'كتائب كرسيوز وأفراسياب المعتدية',
          fr: 'Légions d\'Assaut de Garsivaz et Afrasiab',
        },
        meleeType: 'turani_raider',
        rangedType: 'archer_turani',
        aerialType: 'turani_falcon',
      },
    },
    evil: {
      baseHeroId: 'rostam',
      heroRenderId: 'warlord_5',
      color: '#b91c1c',
      accentColor: '#7f1d1d',
      capeColor: '#111827',
      maxHp: 170,
      attackPower: 38,
      speed: 5.0,
      jumpForce: 13.6,
      heroName: {
        fa: 'افراسیاب (پادشاه مقتدر توران)',
        en: 'King Afrasiab (Emperor of Turan)',
        ar: 'الملك أفراسياب (إمبراطور توران)',
        fr: 'Le Roi Afrasiab (Empereur du Touran)',
      },
      heroTitle: {
        fa: 'فرمانروای آهنین توران و دشمن دیرین کیانیان',
        en: 'Iron Sovereign of Turan & Arch-Nemesis of the Kayanians',
        ar: 'حاكم توران الحديدي والعدو اللدود للكيانيين',
        fr: 'Souverain de Fer du Touran & Ennemi Juré des Kayanides',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده گرز و تیغ شاهی توران، زره پولاد سرخ و تاج خاقانی',
        en: 'Wielding the Royal Mace of Turan, Crimson Plate & Imperial Crown',
        ar: 'حامل الصولجان الملكي التوراني والدرع القرمزي والتاج الإمبراطوري',
        fr: 'Porteur de la Masse Royale du Touran & Couronne Impériale',
      },
      heroDesc: {
        fa: 'پادشاه جنگجو و بی‌رحم توران که به تحریک گرسیوز با لشکری گران برای تسخیر سیاوش‌گرد و درهم شکستن سیاوش یورش می‌برد.',
        en: 'The ruthless warrior-king of Turan marching at the head of his imperial host to storm Siavashgard.',
        ar: 'ملك توران المحارب الذي يزحف على رأس جيشه لاقتحام سياوشكرد ومواجهة سياوش.',
        fr: 'Le roi-guerrier impitoyable du Touran marchant pour prendre d\'assaut Siavashgard.',
      },
      weaponName: {
        fa: 'گرز و شمشیر خاقان توران',
        en: 'Imperial War-Mace of Afrasiab',
        ar: 'صولجان وسيف خاقان توران',
        fr: 'Masse de Guerre Impériale d\'Afrasiab',
      },
      specialName: {
        fa: 'صاعقه خشم افراسیاب',
        en: 'Thunderbolt of Afrasiab\'s Wrath',
        ar: 'صاعقة غضب أفراسياب',
        fr: 'Foudre du Courroux d\'Afrasiab',
      },
      title: {
        fa: 'فصل پنجم (جبهه شر): لشکرکشی افراسیاب به سیاوش‌گرد',
        en: 'Chapter 5 (Dark): Afrasiab\'s Siege of Siavashgard',
        ar: 'الفصل 5 (جبهة الظلام): زحف أفراسياب نحو سياوشكرد',
        fr: 'Chapitre 5 (Ombre) : Le Siège de Siavashgard par Afrasiab',
      },
      subtitle: {
        fa: 'درهم شکستن محافظان سیاوش‌گرد و رویارویی نهایی با سیاوش در انتهای مرحله',
        en: 'Overrun the royal guards of Siavashgard and confront Prince Siavash at the end',
        ar: 'اجتح حراس سياوشكرد وواجه الأمير سياوش في الساحة النهائية',
        fr: 'Submergez les gardes royaux et affrontez le prince Siavash dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · فرمان یورش افراسیاب به سیاوش‌گرد',
        en: 'Shahnameh Prologue · Afrasiab Orders the Assault on Siavashgard',
        ar: 'مقدمة الشاهنامه · أمر أفراسياب باقتحام سياوشكرد',
        fr: 'Prologue du Shahnameh · Afrasiab ordonne l\'assaut sur Siavashgard',
      },
      dialogueProse: {
        fa: 'افراسیاب بر فراز اسب جنگی خروشید: «نمی‌گذارم شاهزاده‌ای از تبار کیان در خاک توران کاخ و پادشاهی بنا کند! سیاوش‌گرد را به آتش بکشید!»',
        en: '"I shall not suffer a Kayanian prince to build a rival kingdom upon Turanian soil! Burn Siavashgard to the ground!"',
        ar: '«لن أسمح لأمير كياني ببناء مملكة فوق أرض توران! احرقوا سياوشكرد عن بكرة أبيها!»',
        fr: '« Je ne tolérerai pas qu\'un prince kayanide bâtisse un royaume sur nos terres ! Brûlez Siavashgard ! »',
      },
      waypoints: {
        start: {
          fa: 'افراسیاب وارد دروازه سیاوش‌گرد شد؛ پاسداران وفادار سیاوش را از پیش رو بردار!',
          en: 'Afrasiab breaches Siavashgard\'s gates; crush Siavash\'s loyal guards!',
          ar: 'اقتحم أفراسياب بوابات سياوشكرد؛ اسحق الحراس المخلصين لسياوش!',
          fr: 'Afrasiab franchit les portes de Siavashgard ; écrasez les gardes fidèles !',
        },
        mid: {
          fa: 'کاخ سیاوش‌گرد در محاصره است؛ در انتهای مسیر، شاهزاده سیاوش ایستاده است!',
          en: 'The palace of Siavashgard is surrounded; at the end of the path, Prince Siavash stands ready!',
          ar: 'قصر سياوشكرد محاصر؛ في نهاية المسار يقف الأمير سياوش مستعداً للنزال!',
          fr: 'Le palais est encerclé ; au bout du chemin, le prince Siavash vous attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! شاهزاده سیاوش با خود زرین و تیغ کیانی به میدان آمد!',
          en: 'Arena locked! Prince Siavash enters the arena in his Golden Helmet!',
          ar: 'أُغلقت الساحة! الأمير سياوش يدخل الميدان بخوذته الذهبية وسيفه الكياني!',
          fr: 'Arène verrouillée ! Le prince Siavash s\'avance coiffé de son Casque d\'Or !',
        },
      },
      bossConfig: {
        bossRenderId: 'sohrab',
        duelOpponentId: 'sohrab',
        bossDisplayName: {
          fa: 'شاهزاده سیاوش و پهلوانان ایران (باس پایانی فصل ۵)',
          en: 'Prince Siavash the Pure (Chapter 5 Final Boss)',
          ar: 'الأمير سياوش الطاهر (زعيم الفصل 5)',
          fr: 'Prince Siavash le Pur (Boss Final Chapitre 5)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با شاهزاده سیاوش',
          en: '1v1 Duel vs Prince Siavash',
          ar: 'مبارزة فردية مع الأمير سياوش',
          fr: 'Duel 1v1 contre le Prince Siavash',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'پاسداران وفادار کاخ سیاوش‌گرد',
          en: 'Loyal Royal Guards of Siavashgard',
          ar: 'حراس قصر سياوشكرد الأوفياء',
          fr: 'Gardes Royaux Fidèles de Siavashgard',
        },
        meleeType: 'kayanian_guard',
        rangedType: 'iranian_archer',
        aerialType: 'turani_falcon',
      },
    },
  },

  // =========================================================================
  // CHAPTER 6: ROSTAM & INVINCIBLE ESFANDIYAR
  // =========================================================================
  6: {
    good: {
      baseHeroId: 'gordafarid',
      color: '#d97706',
      accentColor: '#10b981',
      capeColor: '#991b1b',
      maxHp: 165,
      attackPower: 38,
      speed: 6.4,
      jumpForce: 14.8,
      hasDoubleJump: true,
      heroName: {
        fa: 'رستم دستان (مجهز به تیر گز و پر سیمرغ)',
        en: 'Rostam of Zabol (Armed with Simurgh\'s Tamarisk Arrow)',
        ar: 'رستم دستان (مسلح بسهم الطرفاء وريشة السيمرغ)',
        fr: 'Rostam de Zabol (Armé de la Flèche de Tamaris du Simurgh)',
      },
      heroTitle: {
        fa: 'پیلتن آزادمرد سیستان و یار دیرین سیمرغ',
        en: 'Freeborn Colossus of Sistan & Chosen of the Simurgh',
        ar: 'بطل سيستان الحر والمؤيد بحكمة طائر السيمرغ',
        fr: 'Colosse Libre du Sistan & Élu du Simurgh Mythique',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده کمان چرخ، تیر دوشاخه چوب گز، پر سیمرغ و ببر بیان',
        en: 'Wielding the Charkh Bow, Forked Tamarisk Arrow & Simurgh\'s Blessing',
        ar: 'حامل قوس رستم وسهم الطرفاء المزدوج ودرع النمر',
        fr: 'Porteur de l\'Arc Royal, de la Flèche de Tamaris à Double Pointe & Cuirasse',
      },
      heroDesc: {
        fa: 'پهلوان پیر و خردمند سیستان که تن به بند اسارت نداد و با راهنمایی سیمرغ، تیر دوشاخه گز را در چله کمان نهاد.',
        en: 'The noble titan of Sistan who refused chains of bondage and knocked the Simurgh\'s forked tamarisk arrow.',
        ar: 'بطل سيستان الحكيم الذي رفض قيود الأسر وجهز سهم الطرفاء المزدوج بهداية السيمرغ.',
        fr: 'Le noble colosse du Sistan qui refusa les chaînes et encorda la flèche de tamaris révélée par le Simurgh.',
      },
      weaponName: {
        fa: 'کمان رستم و تیر دوشاخه گز',
        en: 'Rostam\'s Bow & Forked Tamarisk Arrow',
        ar: 'قوس رستم وسهم الطرفاء المزدوج',
        fr: 'Arc de Rostam & Flèche de Tamaris',
      },
      specialName: {
        fa: 'پرواز تیر سیمرغ',
        en: 'Volley of the Simurgh\'s Feather',
        ar: 'طيران سهام السيمرغ',
        fr: 'Salve de la Plume du Simurgh',
      },
      title: {
        fa: 'فصل ششم (جبهه خیر): رزم رستم دستان با اسفندیار رویین‌تن',
        en: 'Chapter 6 (Light): Rostam\'s Duel with Invincible Esfandiyar',
        ar: 'الفصل 6 (جبهة النور): نزال رستم دستان مع إسفنديار الحصين',
        fr: 'Chapitre 6 (Lumière) : Le Duel de Rostam face à l\'Invincible Esfandiyar',
      },
      subtitle: {
        fa: 'عبور از اردوگاه زابلستان و نبرد سرنوشت‌ساز با اسفندیار رویین‌تن در انتهای مرحله',
        en: 'Cross the plains of Zabolistan and face Invincible Esfandiyar in the final arena',
        ar: 'اعبر سهول زابلستان وواجه إسفنديار الحصين في الساحة النهائية',
        fr: 'Traversez la plaine du Zabolistan et affrontez Esfandiyar dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · اندرز رستم و پاسخ اسفندیار رویین‌تن',
        en: 'Shahnameh Prologue · Rostam\'s Counsel & Esfandiyar\'s Pride',
        ar: 'مقدمة الشاهنامه · نصيحة رستم واعتزاز إسفنديار بدرعه',
        fr: 'Prologue du Shahnameh · La Sagesse de Rostam face à l\'Orgueil d\'Esfandiyar',
      },
      dialogueProse: {
        fa: 'رستم با اندوه بانک برآورد: «ای پور گشتاسپ! از من مخواه که دست در بند نهم، که در خاندان سام هرگز کسی بندگی نکرده است! اکنون که جز رزم چاره نیست، تیر گز داور ماست!»',
        en: '"O son of Goshtasp! Ask me not to place my hands in chains, for the house of Sam has never bowed to bondage! Since you leave no path but war, the tamarisk shaft shall judge between us!"',
        ar: '«يا بن كشتاسب! لا تطلب مني وضع يدي في القيود، فآل سام لم يخضعوا للأسر قط! والآن ليحكم سهم الطرفاء بيننا!»',
        fr: '« Ô fils de Goshtasp ! Ne me demande pas d\'accepter les fers ! Puisque tu refuses la paix, que la flèche de tamaris soit notre juge ! »',
      },
      waypoints: {
        start: {
          fa: 'سپاهیان گشتاسپ در دشت هیرمند صف کشیده‌اند؛ محافظان اردوگاه را کنار بزن!',
          en: 'Goshtasp\'s guards line the Hirmand plain; push past the camp sentries!',
          ar: 'اصطفت قوات كشتاسب في سهل هيرمند؛ تجاوز حراس المعسكر!',
          fr: 'Les gardes de Goshtasp bordent le fleuve Hirmand ; franchissez les sentinelles !',
        },
        mid: {
          fa: 'پر سیمرغ در باد می‌درخشد؛ در انتهای دشت، اسفندیار رویین‌تن منتظر است!',
          en: 'The Simurgh\'s feather gleams in the wind; at the end of the plain, Esfandiyar awaits!',
          ar: 'ريشة السيمرغ تلمع في الريح؛ في نهاية السهل ينتظرك إسفنديار الحصين!',
          fr: 'La plume du Simurgh brille dans le vent ; au bout de la plaine, Esfandiyar attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! اسفندیار رویین‌تن با جوشن مینوی وارد میدان نبرد گشت!',
          en: 'Arena locked! Esfandiyar the Invincible steps forth in Celestial Brazen Armor!',
          ar: 'أُغلقت الساحة! إسفنديار الحصين يتقدم بدرعه السماوي المنيع!',
          fr: 'Arène verrouillée ! Esfandiyar l\'Invincible s\'avance dans son Armure d\'Airain !',
        },
      },
      bossConfig: {
        bossRenderId: 'esfandiar',
        duelOpponentId: 'esfandiar',
        bossDisplayName: {
          fa: 'اسفندیار رویین‌تن (باس پایانی فصل ۶)',
          en: 'Esfandiyar the Invincible (Chapter 6 Final Boss)',
          ar: 'إسفنديار الحصين (زعيم الفصل 6)',
          fr: 'Esfandiyar l\'Invincible (Boss Final Chapitre 6)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با اسفندیار رویین‌تن',
          en: '1v1 Duel vs Invincible Esfandiyar',
          ar: 'مبارزة فردية مع إسفنديار الحصين',
          fr: 'Duel 1v1 contre l\'Invincible Esfandiyar',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'گارد زرین‌پوش اردوی گشتاسپ و اسفندیار',
          en: 'Golden Imperial Guard of Goshtasp',
          ar: 'الحرس الذهبي لمعسكر كشتاسب وإسفنديار',
          fr: 'Garde Impériale Dorée de Goshtasp',
        },
        meleeType: 'kayanian_guard',
        rangedType: 'iranian_archer',
        aerialType: 'turani_falcon',
      },
    },
    evil: {
      baseHeroId: 'sohrab',
      heroRenderId: 'esfandiar',
      color: '#f59e0b',
      accentColor: '#fef08a',
      capeColor: '#1e3a8a',
      maxHp: 175,
      attackPower: 39,
      speed: 6.0,
      jumpForce: 14.4,
      heroName: {
        fa: 'اسفندیار رویین‌تن (شاهزاده شکست‌ناپذیر)',
        en: 'Esfandiyar the Invincible (Brazen-Bodied Prince)',
        ar: 'إسفنديار الحصين (الأمير ذو الجسد المنيع)',
        fr: 'Esfandiyar l\'Invincible (Prince au Corps d\'Airain)',
      },
      heroTitle: {
        fa: 'فاتح هفت‌خوان اسفندیار و مدعی تاج کیانی',
        en: 'Conqueror of the Seven Stages & Heir to Goshtasp\'s Crown',
        ar: 'فاتح خانات إسفنديار السبع ووريث التاج الكياني',
        fr: 'Vainqueur des Sept Épreuves & Héritier de la Couronne',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده پیکر رویین‌تن، جوشن زرین آسمانی، زنجیر پولاد و تیغ شاهی',
        en: 'Endowed with Brazen Invulnerability, Celestial Gold Mail & Royal Blade',
        ar: 'متمتع بالجسد المنيع والدرع الذهبي السماوي والسيف الملكي',
        fr: 'Doté du Corps d\'Airain Invulnérable & Armure Céleste d\'Or',
      },
      heroDesc: {
        fa: 'شاهزاده رویین‌تن و مغرور که به فرمان گشتاسپ برای به بند کشیدن رستم دستان به سیستان لشکر کشیده است.',
        en: 'The proud, brazen-bodied prince sent by King Goshtasp to bring the legendary Rostam of Sistan in chains.',
        ar: 'الأمير الحصين الذي زحف بأمر الملك كشتاسب إلى سيستان لتقييد رستم دستان.',
        fr: 'Le fier prince au corps d\'airain envoyé au Sistan pour enchaîner le légendaire Rostam.',
      },
      weaponName: {
        fa: 'تیغ و نیزه زرین اسفندیار رویین‌تن',
        en: 'Golden Blade & Lance of Esfandiyar',
        ar: 'سيف ورمح إسفنديار الذهبي',
        fr: 'Lame et Lance d\'Or d\'Esfandiyar',
      },
      specialName: {
        fa: 'طوفان پولاد رویین‌تن',
        en: 'Tempest of Brazen Invulnerability',
        ar: 'عاصفة الفولاذ المنيع',
        fr: 'Tempête de l\'Acier Invulnérable',
      },
      title: {
        fa: 'فصل ششم (جبهه شر): لشکرکشی اسفندیار برای به بند کشیدن رستم',
        en: 'Chapter 6 (Dark): Esfandiyar\'s March to Chain Rostam',
        ar: 'الفصل 6 (جبهة الظلام): زحف إسفنديار لتقييد رستم دستان',
        fr: 'Chapitre 6 (Ombre) : La Marche d\'Esfandiyar pour Enchaîner Rostam',
      },
      subtitle: {
        fa: 'درهم شکستن مرزبانان زابلستان و نبرد نهایی با رستم دستان در انتهای مرحله',
        en: 'Push past the defenders of Zabolistan and duel Rostam at the stage end',
        ar: 'تجاوز حماة زابلستان وبارز رستم دستان في الساحة النهائية',
        fr: 'Franchissez les défenseurs du Zabolistan et affrontez Rostam en fin de niveau',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · فرمان اسفندیار در دشت زابلستان',
        en: 'Shahnameh Prologue · Esfandiyar\'s Ultimatum in Zabolistan',
        ar: 'مقدمة الشاهنامه · إنذار إسفنديار في سهل زابلستان',
        fr: 'Prologue du Shahnameh · L\'Ultimatum d\'Esfandiyar au Zabolistan',
      },
      dialogueProse: {
        fa: 'اسفندیار رویین‌تن بانگ زد: «پیکر من به آب مینوی رویین گشته و هیچ سنان و خنجری بر آن کارگر نیست! امروز رستم دستان باید دست در بند من نهد تا تاج شاهی را بستانم!»',
        en: '"My body is forged in celestial waters and no spear can pierce my flesh! Today Rostam must submit to my chains so I may claim the royal crown!"',
        ar: '«جسدي منيع بالماء المقدس ولا يخترقه سيف أو رمح! اليوم سيخضع رستم لقيودي لأنال تاج الملك!»',
        fr: '« Mon corps est trempé dans l\'eau céleste et nul fer ne peut me blesser ! Aujourd\'hui Rostam pliera devant moi ! »',
      },
      waypoints: {
        start: {
          fa: 'اسفندیار به مرز زابلستان تاخت؛ سواران خاندان سام را از پیش رو بردار!',
          en: 'Esfandiyar advances into Zabolistan; drive back the riders of the House of Sam!',
          ar: 'تقدم إسفنديار داخل زابلستان؛ ادفع فرسان آل سام للوراء!',
          fr: 'Esfandiyar avance au Zabolistan ; repoussez les cavaliers de la lignée de Sam !',
        },
        mid: {
          fa: 'تیرهای نگهبانان بر زره رویین‌تن بی‌اثر است؛ در انتهای دشت، رستم ایستاده است!',
          en: 'Arrows bounce off your brazen armor; at the end of the plain, Rostam stands ready!',
          ar: 'السهام ترتد عن درعك المنيع؛ في نهاية السهل يقف رستم دستان!',
          fr: 'Les flèches ricochent sur votre armure ; au bout de la plaine, Rostam vous attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! رستم دستان با گرز گاوسار و کمان سیمرغ وارد کارزار شد!',
          en: 'Arena locked! Rostam the Mighty enters the arena for the ultimate clash!',
          ar: 'أُغلقت الساحة! رستم دستان يدخل الميدان للمواجهة الكبرى!',
          fr: 'Arène verrouillée ! Rostam le Colosse entre dans l\'arène pour l\'affrontement ultime !',
        },
      },
      bossConfig: {
        bossRenderId: 'rostam',
        duelOpponentId: 'rostam',
        bossDisplayName: {
          fa: 'رستم دستان، پیلتن زابلستان (باس پایانی فصل ۶)',
          en: 'Rostam of Zabolistan (Chapter 6 Final Boss)',
          ar: 'رستم دستان بطل زابلستان (زعيم الفصل 6)',
          fr: 'Rostam du Zabolistan (Boss Final Chapitre 6)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با رستم دستان',
          en: '1v1 Duel vs Rostam of Zabolistan',
          ar: 'مبارزة فردية مع رستم دستان',
          fr: 'Duel 1v1 contre Rostam du Zabolistan',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'سواران و کمانداران دلیر سیستان و زابل',
          en: 'Valiant Riders & Archers of Sistan',
          ar: 'فرسان ورماة سيستان وزابل الشجعان',
          fr: 'Cavaliers et Archers Vaillants du Sistan',
        },
        meleeType: 'iranian_sentinel',
        rangedType: 'iranian_archer',
        aerialType: 'turani_falcon',
      },
    },
  },

  // =========================================================================
  // CHAPTER 7: AMBUSH OF KABUL & IMMORTAL LEGACY OF SHAHNAMEH
  // =========================================================================
  7: {
    good: {
      baseHeroId: 'rostam',
      color: '#d97706',
      accentColor: '#f59e0b',
      capeColor: '#7e22ce',
      maxHp: 180,
      attackPower: 42,
      speed: 5.1,
      jumpForce: 13.8,
      heroName: {
        fa: 'رستم جاودان و فرامرز',
        en: 'Immortal Rostam & Faramarz',
        ar: 'رستم الخالد وفرامرز',
        fr: 'Rostam l\'Immortel & Faramarz',
      },
      heroTitle: {
        fa: 'اسطوره جاودان ایران‌زمین و انتقام‌گیرنده از خائنان کابل',
        en: 'Immortal Legend of Iran & Avenger of the Kabul Ambush',
        ar: 'أسطورة إيران الخالدة والمنتقم من غدر كابل',
        fr: 'Légende Immortelle d\'Iran & Vengeur de l\'Embûche de Kaboul',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده کمان واپسین چنار، گرز گاوسار و فرّه جاودانگی شاهنامه',
        en: 'Wielding the Plane-Tree Piercing Bow, Bull Mace & Immortal Farreh',
        ar: 'حامل القوس الخارق لشجرة الدلب وصولجان الثور والمجد الأبدي',
        fr: 'Porteur de l\'Arc Ultime, de la Masse Royale & du Farreh Éternel',
      },
      heroDesc: {
        fa: 'واپسین و باشکوه‌ترین نبرد تهمتن ایران و فرزندش فرامرز که مکر شغاد و شاه کابل را درهم می‌کوبد تا نام ایران جاودانه بماند.',
        en: 'The culminating battle of Iran\'s greatest colossus and his son Faramarz, crushing the treachery of Shaghad and immortalizing the Shahnameh.',
        ar: 'المعركة الختامية العظمى لبطل إيران وابنه فرامرز لسحق خيانة شغاد وتخليد اسم الشاهنامه.',
        fr: 'L\'ultime bataille grandiose du colosse d\'Iran et de son fils Faramarz, écrasant la trahison de Shaghad.',
      },
      weaponName: {
        fa: 'گرز گاوسار و کمان درخت‌دوز رستم',
        en: 'Bull Mace & Tree-Piercing Bow of Rostam',
        ar: 'صولجان الثور وقوس رستم الخارق',
        fr: 'Masse Royale & Arc Perce-Arbre de Rostam',
      },
      specialName: {
        fa: 'تیر جاودانگی شاهنامه',
        en: 'Immortal Arrow of the Shahnameh',
        ar: 'سهم خلود الشاهنامه',
        fr: 'Trait Immortel du Shahnameh',
      },
      title: {
        fa: 'فصل هفتم (جبهه خیر): نیرنگ شغاد و جاودانگی حماسه ایران',
        en: 'Chapter 7 (Light): Shaghad\'s Treachery & The Immortal Saga',
        ar: 'الفصل 7 (جبهة النور): غدر شغاد وخلود ملحمة إيران',
        fr: 'Chapitre 7 (Lumière) : La Trahison de Shaghad & La Saga Éternelle',
      },
      subtitle: {
        fa: 'گذر از کمین‌گاه‌های کابلستان و کیفر نهایی شغاد خائن در انتهای مرحله',
        en: 'Cross the ambushes of Kabulistan and punish Shaghad the Traitor in the final arena',
        ar: 'تجاوز كمائن كابلستان وعاقب شغاد الخائن في الساحة النهائية',
        fr: 'Franchissez les embuscades de Kaboul et châtiez Shaghad dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · واپسین تیر رستم و کیفر شغاد',
        en: 'Shahnameh Prologue · Rostam\'s Final Arrow & Shaghad\'s Doom',
        ar: 'مقدمة الشاهنامه · سهم رستم الأخير وعقاب شغاد',
        fr: 'Prologue du Shahnameh · L\'Ultime Flèche de Rostam & le Châtiment de Shaghad',
      },
      dialogueProse: {
        fa: 'رستم کمان را به زه کشید و رو به چنار کهنسال خروشید: «ای نابرادر خائن که به پشت درخت پنهان گشته‌ای! بدان که تیر تهمتن و نام ایران‌زمین از باد و باران گزند نخواهد یافت!»',
        en: '"O treacherous half-brother hiding behind the hollow plane tree! Know that Tahamtan\'s arrow and the glory of Iran shall never perish!"',
        ar: '«أيها الغادر المختبئ خلف شجرة الدلب! اعلم أن سهم رستم ومجد إيران لن ينال منهما الزمان!»',
        fr: '« Ô frère félon caché derrière ce platane ! Sache que la flèche de Tahamtan et la gloire d\'Iran sont immortelles ! »',
      },
      waypoints: {
        start: {
          fa: 'شکارگاه کابلستان پر از کمین است؛ مزدوران شاه کابل را از سر راه بردار!',
          en: 'The hunting grounds of Kabul teem with ambushers; clear the King of Kabul\'s mercenaries!',
          ar: 'أرض صيد كابل مليئة بالكمائن؛ اقضِ على مرتزقة ملك كابل!',
          fr: 'Les terres de chasse de Kaboul regorgent d\'embuscades ; éliminez les mercenaires !',
        },
        mid: {
          fa: 'چنار کهنسال در انتهای دره نمایان شد؛ شغاد خائن در انتهای مرحله در کمین است!',
          en: 'The ancient plane tree appears at the valley\'s end; Shaghad lurks in the final arena!',
          ar: 'ظهرت شجرة الدلب القديمة في نهاية الوادي؛ شغاد الخائن يتربص في الساحة النهائية!',
          fr: 'L\'ancien platane apparaît au bout de la vallée ; Shaghad se terre dans l\'arène finale !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! شغاد خیانت‌پیشه و شاه کابل برای نبرد نهایی وارد شدند!',
          en: 'Arena locked! Shaghad the Traitor and the King of Kabul step into the final arena!',
          ar: 'أُغلقت الساحة! شغاد الغادر وملك كابل يدخلان الساحة النهائية!',
          fr: 'Arène verrouillée ! Shaghad le Traître et le Roi de Kaboul entrent en scène !',
        },
      },
      bossConfig: {
        bossRenderId: 'warlord_7',
        duelOpponentId: 'div_sepid',
        bossDisplayName: {
          fa: 'شغاد خیانت‌پیشه و شاه کابل (باس پایانی فصل ۷)',
          en: 'Shaghad the Traitor & King of Kabul (Chapter 7 Final Boss)',
          ar: 'شغاد الغادر وملك كابل (زعيم الفصل 7)',
          fr: 'Shaghad le Traître & Roi de Kaboul (Boss Final Chapitre 7)',
        },
        duelButtonLabel: {
          fa: 'دوئل تن‌به‌تن با شغاد خیانت‌پیشه',
          en: '1v1 Duel vs Shaghad the Traitor',
          ar: 'مبارزة فردية مع شغاد الغادر',
          fr: 'Duel 1v1 contre Shaghad le Traître',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'مزدوران کمین‌گاه شغاد و شاه کابل',
          en: 'Ambush Mercenaries of Shaghad & Kabul',
          ar: 'مرتزقة كمين شغاد وملك كابل',
          fr: 'Mercenaires de l\'Embuscade de Shaghad',
        },
        meleeType: 'zahhak_guard',
        rangedType: 'archer_turani',
        aerialType: 'zahhak_bat',
      },
    },
    evil: {
      baseHeroId: 'gordafarid',
      heroRenderId: 'warlord_7',
      color: '#9333ea',
      accentColor: '#dc2626',
      capeColor: '#090d16',
      maxHp: 155,
      attackPower: 38,
      speed: 6.7,
      jumpForce: 15.1,
      hasDoubleJump: true,
      heroName: {
        fa: 'شغاد و شاه کابل (طراحان کمین زابل)',
        en: 'Shaghad & King of Kabul (Masters of the Ambush)',
        ar: 'شغاد وملك كابل (مدبرا مكيدة الصيد)',
        fr: 'Shaghad & le Roi de Kaboul (Maîtres de l\'Embuscade)',
      },
      heroTitle: {
        fa: 'کماندار زهرآگین و هم‌پیمان شاه کابل علیه خاندان سام',
        en: 'Venomous Archer & Conspirator Against the House of Sam',
        ar: 'الرامي السام وحليف ملك كابل ضد آل سام',
        fr: 'Archer Venimeux & Conspirateur contre la Lignée de Sam',
      },
      heroEquipmentSubtitle: {
        fa: 'دارنده کمان زهرآلود کابل، سنان‌های مسموم، پرش جفتی و شنل شب',
        en: 'Armed with the Venomous Bow of Kabul, Poisoned Spears & Double Jump',
        ar: 'مسلح بقوس كابل المسموم والرماح القاتلة والقفز المزدوج',
        fr: 'Armé de l\'Arc Empoisonné de Kaboul, Lances Toxiques & Double Saut',
      },
      heroDesc: {
        fa: 'نابرادر کینه‌توز که با شاه کابل هم‌دست شد تا با تیرهای مسموم و دام‌های مرگبار به دوران پهلوانی رستم پایان دهد.',
        en: 'The vengeful half-brother who allied with the King of Kabul to end Rostam\'s era with poisoned arrows and lethal traps.',
        ar: 'الأخ غير الشقيق الحاقد الذي تحالف مع ملك كابل لإنهاء عصر رستم بالسهام المسمومة.',
        fr: 'Le demi-frère rancunier allié au roi de Kaboul pour mettre fin au règne de Rostam.',
      },
      weaponName: {
        fa: 'کمان زهرآگین شغاد و خنجر کابل',
        en: 'Venomous Bow of Shaghad & Kabul Dagger',
        ar: 'قوس شغاد المسموم وخنجر كابل',
        fr: 'Arc Venimeux de Shaghad & Dague de Kaboul',
      },
      specialName: {
        fa: 'باران سنان‌های مسموم',
        en: 'Rain of Poisoned Spears',
        ar: 'مطر الرماح المسمومة',
        fr: 'Pluie de Lances Empoisonnées',
      },
      title: {
        fa: 'فصل هفتم (جبهه شر): توطئه شغاد و کمین‌گاه بزرگ کابلستان',
        en: 'Chapter 7 (Dark): Shaghad\'s Conspiracy & The Great Ambush of Kabul',
        ar: 'الفصل 7 (جبهة الظلام): مؤامرة شغاد والكمين الكبير في كابلستان',
        fr: 'Chapitre 7 (Ombre) : La Conspiration de Shaghad à Kaboul',
      },
      subtitle: {
        fa: 'پیشروی در نخجیرگاه کابل و رویارویی نهایی با رستم دستان در انتهای مرحله',
        en: 'Advance through the hunting gorge and confront Rostam the Mighty in the final arena',
        ar: 'تقدم عبر وادي الصيد وواجه رستم دستان في الساحة النهائية',
        fr: 'Avancez dans la gorge de chasse et affrontez Rostam dans l\'arène finale',
      },
      dialogueHeader: {
        fa: 'رجزخوانی شاهنامه · مکر شغاد در نخجیرگاه کابل',
        en: 'Shahnameh Prologue · Shaghad\'s Trap in the Hunting Grounds',
        ar: 'مقدمة الشاهنامه · مكيدة شغاد في أرض صيد كابل',
        fr: 'Prologue du Shahnameh · Le Piège de Shaghad à Kaboul',
      },
      dialogueProse: {
        fa: 'شغاد در دل شب با شاه کابل پیمان بست: «دیگر زمان آن رسیده است که سایه سنگین رستم و زال از سر کابلستان برداشته شود؛ نخجیرگاه فردا، میدان واپسین اوست!»',
        en: '"The hour has come to lift the heavy shadow of Rostam and Zal from Kabulistan! Tomorrow\'s hunting ground shall be his final battlefield!"',
        ar: '«لقد حان الوقت لرفع ظل رستم وزال الثقيل عن كابلستان! أرض الصيد ستكون ساحته الأخيرة!»',
        fr: '« L\'heure est venue d\'effacer l\'ombre de Rostam sur Kaboul ! Ce terrain de chasse sera son dernier combat ! »',
      },
      waypoints: {
        start: {
          fa: 'شغاد وارد نخجیرگاه کابل شد؛ پیشقراولان زابلی را با تیرهای زهرآلود هدف بگیر!',
          en: 'Shaghad enters the hunting grounds; strike down the Zabolitan scouts!',
          ar: 'دخل شغاد أرض الصيد؛ استهدف طلائع فرسان زابل بسهامك!',
          fr: 'Shaghad entre sur le terrain de chasse ; abattez les éclaireurs de Zabol !',
        },
        mid: {
          fa: 'غرش رستم دستان در دره پیچیده است؛ در انتهای مسیر، تهمتن آماده نبرد است!',
          en: 'Rostam\'s roar echoes through the gorge; at the end of the path, Tahamtan awaits!',
          ar: 'هدير رستم يتردد في الوادي؛ في نهاية المسار يقف تهمتن مستعداً للمواجهة!',
          fr: 'Le rugissement de Rostam résonne dans la gorge ; au bout du chemin, Tahamtan vous attend !',
        },
        boss: {
          fa: 'میدان نبرد قفل شد! رستم دستان با خشم پهلوانی و کمان کیانی در برابرت ایستاده است!',
          en: 'Arena locked! Rostam the Mighty stands before you in towering wrath!',
          ar: 'أُغلقت الساحة! رستم دستان يقف أمامك بغضب الأبطال وقوسه الكياني!',
          fr: 'Arène verrouillée ! Rostam le Colosse se dresse devant vous dans toute sa fureur !',
        },
      },
      bossConfig: {
        bossRenderId: 'rostam',
        duelOpponentId: 'rostam',
        bossDisplayName: {
          fa: 'رستم دستان، تهمتن جاودان (باس پایانی فصل ۷)',
          en: 'Rostam the Immortal Colossus (Chapter 7 Final Boss)',
          ar: 'رستم دستان البطل الخالد (زعيم الفصل 7)',
          fr: 'Rostam le Colosse Immortel (Boss Final Chapitre 7)',
        },
        duelButtonLabel: {
          fa: 'دوئل نهایی شغاد با رستم دستان',
          en: '1v1 Final Duel vs Rostam the Mighty',
          ar: 'المبارزة النهائية مع رستم دستان',
          fr: 'Duel Final 1v1 contre Rostam le Colosse',
        },
      },
      enemyRoster: {
        factionName: {
          fa: 'سواران وفادار رستم و فرامرز در کابلستان',
          en: 'Loyal Retainers of Rostam & Faramarz',
          ar: 'فرسان رستم وفرامرز الأوفياء',
          fr: 'Cavaliers Fidèles de Rostam et Faramarz',
        },
        meleeType: 'kayanian_guard',
        rangedType: 'iranian_archer',
        aerialType: 'turani_falcon',
      },
    },
  },
};

export class StoryLogicManager {
  public static resolveAlignment(alignmentOrHero?: PlayerAlignment | HeroId): PlayerAlignment {
    if (alignmentOrHero === 'evil' || alignmentOrHero === 'sohrab') {
      return 'evil';
    }
    return 'good';
  }

  public static getStageProfile(
    stageOrId: StageDef | number,
    alignmentOrHero: PlayerAlignment | HeroId = 'good',
    lang: Language = 'fa'
  ): StageNarrativeProfile {
    const alignment = this.resolveAlignment(alignmentOrHero);
    const rawId = typeof stageOrId === 'number' ? stageOrId : stageOrId?.id ?? 1;
    const stageId = rawId >= 1 && rawId <= 7 ? rawId : 1;
    const baseLore = SHAHNAMEH_LORE[lang]?.[stageId] || SHAHNAMEH_LORE.en[stageId];
    const blueprint = CHAPTER_BLUEPRINTS[stageId]?.[alignment] || CHAPTER_BLUEPRINTS[1].good;

    return {
      stageId,
      alignment,
      heroId: blueprint.baseHeroId,
      heroConfig: {
        baseHeroId: blueprint.baseHeroId,
        heroRenderId: blueprint.heroRenderId || blueprint.baseHeroId,
        heroName: pickLang(blueprint.heroName, lang),
        heroTitle: pickLang(blueprint.heroTitle, lang),
        heroEquipmentSubtitle: pickLang(blueprint.heroEquipmentSubtitle, lang),
        heroDesc: pickLang(blueprint.heroDesc, lang),
        weaponName: pickLang(blueprint.weaponName, lang),
        specialName: pickLang(blueprint.specialName, lang),
        color: blueprint.color,
        accentColor: blueprint.accentColor,
        capeColor: blueprint.capeColor,
        maxHp: blueprint.maxHp,
        attackPower: blueprint.attackPower,
        speed: blueprint.speed,
        jumpForce: blueprint.jumpForce,
        hasDoubleJump: blueprint.hasDoubleJump,
      },
      title: pickLang(blueprint.title, lang),
      chapterTitle: pickLang(blueprint.title, lang),
      subtitle: pickLang(blueprint.subtitle, lang),
      couplet: baseLore.couplet,
      prologueCouplet: baseLore.couplet,
      poet: baseLore.poet,
      prologuePoet: baseLore.poet,
      fullProse: baseLore.fullProse,
      prologueProse: baseLore.fullProse,
      dialogueHeader: pickLang(blueprint.dialogueHeader, lang),
      dialogueProse: blueprint.dialogueProse ? pickLang(blueprint.dialogueProse, lang) : null,
      waypoints: {
        start: pickLang(blueprint.waypoints.start, lang),
        mid: pickLang(blueprint.waypoints.mid, lang),
        boss: pickLang(blueprint.waypoints.boss, lang),
      },
      bossConfig: {
        bossRenderId: blueprint.bossConfig.bossRenderId,
        duelOpponentId: blueprint.bossConfig.duelOpponentId,
        bossDisplayName: pickLang(blueprint.bossConfig.bossDisplayName, lang),
        bossTitle: pickLang(blueprint.enemyRoster.factionName, lang),
        duelButtonLabel: pickLang(blueprint.bossConfig.duelButtonLabel, lang),
      },
      enemyRoster: {
        factionName: pickLang(blueprint.enemyRoster.factionName, lang),
        meleeType: blueprint.enemyRoster.meleeType,
        rangedType: blueprint.enemyRoster.rangedType,
        aerialType: blueprint.enemyRoster.aerialType,
      },
    };
  }

  /**
   * Builds a complete HeroDef for the active stage and alignment so the GameEngine
   * and UI automatically use the chapter's story-specific character and stats.
   */
  public static getStageHeroDef(
    stageOrId: StageDef | number,
    alignmentOrHero: PlayerAlignment | HeroId = 'good',
    lang: Language = 'fa'
  ): HeroDef {
    const profile = this.getStageProfile(stageOrId, alignmentOrHero, lang);
    const hc = profile.heroConfig;
    return {
      id: hc.baseHeroId,
      nameKey: `${hc.baseHeroId}_name`,
      titleKey: `${hc.baseHeroId}_title`,
      descKey: `${hc.baseHeroId}_desc`,
      weaponKey: `${hc.baseHeroId}_weapon`,
      specialKey: `${hc.baseHeroId}_special`,
      specialDescKey: `${hc.baseHeroId}_special_desc`,
      maxHp: hc.maxHp,
      attackPower: hc.attackPower,
      speed: hc.speed,
      jumpForce: hc.jumpForce,
      hasDoubleJump: hc.hasDoubleJump,
      color: hc.color,
      accentColor: hc.accentColor,
      capeColor: hc.capeColor,
      customDisplayName: hc.heroName,
      customTitle: hc.heroTitle,
      customDesc: hc.heroDesc,
      customWeaponName: hc.weaponName,
      customSpecialName: hc.specialName,
    };
  }
}
