import { HeroId, Language, StageDef } from '../types/game';
import { SHAHNAMEH_LORE } from '../constants/shahnamehLore';
import { TRANSLATIONS } from '../constants/translations';

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

export interface StageNarrativeProfile {
  stageId: number;
  heroId: HeroId;
  title: string;
  subtitle: string;
  couplet: string;
  poet: string;
  fullProse: string;
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

/**
 * Story Logic Manager (لایه مدیریت روایت و تطبیق هوشمند شاهنامه)
 *
 * Dynamically filters and personalizes stage titles, Shahnameh couplets,
 * pre-battle dialogues, vanguard enemy factions, and final bosses based on
 * the active Hero (Rostam, Sohrab, or Gordafarid) so that no anachronistic or
 * contradictory encounters ever occur.
 */
export class StoryLogicManager {
  public static getStageProfile(
    stage: StageDef,
    heroId: HeroId,
    lang: Language = 'fa'
  ): StageNarrativeProfile {
    const t = TRANSLATIONS[lang];
    const baseLore = SHAHNAMEH_LORE[lang]?.[stage.id] || SHAHNAMEH_LORE['fa'][stage.id];
    const stageId = stage.id;

    // -------------------------------------------------------------------------
    // STAGE 4: DEJ-E SEPID & THE TRAGEDY OF SOHRAB (Adaptive per Hero)
    // -------------------------------------------------------------------------
    if (stageId === 4) {
      if (heroId === 'gordafarid') {
        return {
          stageId,
          heroId,
          title: 'فصل چهارم: حماسه دژ سپید · رزم گردآفرید و سهراب',
          subtitle: 'پاسداری شیرزن ایرانی از مرزهای ایران در برابر سپاه سهراب',
          couplet:
            'چو آگاه شد دختر گژدهم / که سالار آن انجمن گشت کم\nزنی بود بر سان گردی سوار / همیشه به جنگ اندرون نامدار\nکجا نام او بود گردآفرید / زمانه ز مادر چنین ناورید',
          poet: 'حکیم ابوالقاسم فردوسی',
          fullProse:
            'چون هجیر دژبان در نخستین رزم به دست سهراب یل اسیر گشت، گردآفرید دختر گژدهم درنگ را جایز ندید؛ جوشن پولادین پوشید، گیسوان مشک‌فام خویش را زیر مغفر پنهان ساخت و چون آذرخش از دژ سپید به میدان تاخت. در این روایت، تو در نقش گردآفرید شیرزن در برابر پیشقراولان سپاه توران و شخص سهراب یل می‌ایستی تا با تیر کمان کیانی و تدبیر پهلوانی، دژ سپید را از سقوط برهانی.',
          dialogueHeader: 'رجزخوانی منظوم شاهنامه · رویارویی گردآفرید و سهراب در دژ سپید',
          dialogueProse:
            'سهراب به شگفتی بانک برآورد: «کدام یل از لشکر ایران است که این‌چنین بی‌باک بر سپاه من تیر می‌بارد؟» گردآفرید کمان را به زه کشید و پاسخ داد: «ای سپهدار توران! تا شیرزنان و مرزبانان ایران زنده‌اند، گامی به درون دژ سپید نخواهی نهاد!»',
          waypoints: {
            start:
              'گردآفرید از دروازه دژ سپید بیرون تاخت؛ طلایه‌داران سپاه توران در پیش‌اند، کمان کیانی را به کار گیر!',
            mid:
              'سهراب از دور نظاره‌گر تیراندازی توست: «به یزدان که چنین چابک‌سواری در هیچ رزمی ندیده‌ام!»',
            boss:
              'سهراب یل شمشیر دمشقی برکشید و به میدان آمد؛ چو مغفر از سر فروافتاد، سهراب مبهوت دلیری شیرزن ایران گشت!',
          },
          bossConfig: {
            bossRenderId: 'sohrab',
            bossDisplayName: 'سهراب یل (سپهدار لشکر توران در پای دژ سپید)',
            duelOpponentId: 'sohrab',
            duelButtonLabel: 'دوئل حماسی گردآفرید و سهراب در دژ سپید',
          },
          enemyRoster: {
            factionName: 'طلایه‌داران مهاجم توران',
            meleeType: 'turani_raider',
            rangedType: 'archer_turani',
            aerialType: 'turani_falcon',
          },
        };
      }

      if (heroId === 'sohrab') {
        return {
          stageId,
          heroId,
          title: 'فصل چهارم: لشکرکشی سهراب به دژ سپید و جستجوی پدر',
          subtitle: 'آغاز سفر سرنوشت‌ساز سهراب یل به مرزهای ایران و نبرد با گردآفرید',
          couplet:
            'به مادر چنین گفت کین راز را / بدین آشکارا کن آغاز را\nکه گوید مرا بر سر انجمن / نژاد تو بر کیست ای پیلتن؟\nکنون من ز ترکان جنگ‌آوران / فراز آورم لشکری بی‌کران',
          poet: 'حکیم ابوالقاسم فردوسی',
          fullProse:
            'سهراب، فرزند برومند رستم و تهمینه، با بازوبند مهره رستم بر بازو، لشکری گران آراست تا به ایران درآید، کاووس را از تخت برگیرد و پدر نادیده خویش رستم را بر تخت نشاند. در نخستین منزلگاه مرز ایران، دژ سپید در برابر او قد علم کرده است؛ نگهبانان دژ و سواری نقاب‌دار و چابک به نام گردآفرید شیرزن راه را بر او بسته‌اند!',
          dialogueHeader: 'رجزخوانی منظوم شاهنامه · سهراب در برابر مدافعان دژ سپید',
          dialogueProse:
            'سهراب رو به باروی دژ سپید خروشید: «من به کین‌خواهی نیامده‌ام؛ جویای پهلوان نامدار ایران، رستم دستانم! راه بگشایید!» گردآفرید از فراز اسب پاسخ داد: «ای جوان تورانی! پیش از یافتن تهمتن، باید از کمند و سنان گردآفرید بگذری!»',
          waypoints: {
            start:
              'سهراب به پای حصار دژ سپید رسید؛ مرزبانان و کمانداران دژ سپر در سپر ایستاده‌اند!',
            mid:
              'سهراب به بازوبند یاقوت‌نشان خود می‌نگرد: «ای پدر، آیا آوازه رزم من در دژ سپید به گوش تو خواهد رسید؟»',
            boss:
              'گردآفرید شیرزن با جوشن یشمی و سنان زرین در برابرت ایستاده است؛ نبردی جوانمردانه در پیش است!',
          },
          bossConfig: {
            bossRenderId: 'gordafarid',
            bossDisplayName: 'گردآفرید شیرزن (پاسدار دلیر دژ سپید ایران)',
            duelOpponentId: 'gordafarid',
            duelButtonLabel: 'دوئل تن‌به‌تن سهراب با گردآفرید شیرزن',
          },
          enemyRoster: {
            factionName: 'مرزبانان و کمانداران دژ سپید ایران',
            meleeType: 'iranian_sentinel',
            rangedType: 'iranian_archer',
            aerialType: 'turani_falcon',
          },
        };
      }

      // Default Hero for Stage 4: ROSTAM (The Tragic Duel of Father & Son)
      return {
        stageId,
        heroId,
        title: 'فصل چهارم: تراژدی دشت نبرد · رزم رستم و سهراب',
        subtitle: 'نبرد سرنوشت‌ساز تهمتن و فرزند نادیده‌اش سهراب در دشت کین',
        couplet:
          'یکی داستان است پر آب چشم / دل نازک از رستم آید به خشم\nاگر تندبادی برآید ز کنج / به خاک افکند نارسیده ترنج',
        poet: 'حکیم ابوالقاسم فردوسی',
        fullProse:
          'پس از گذر سهراب از دژ سپید، رستم دستان به فرمان کاووس به دشت نبرد فراخوانده شد. سهراب که در دل مهر رستم را می‌پروراند، بارها از او نام و نشان پرسید؛ اما رستم به گمان آنکه جوان تورانی قصد فریب دارد، نام خویش را پنهان ساخت. اکنون دو پهلوان هم‌خون، بی‌خبر از راز مهره بازوبند، در برابر یکدیگر صف آراسته‌اند.',
        dialogueHeader: 'دیالوگ منظوم شاهنامه · پرسش سهراب از نام و نشان رستم',
        dialogueProse:
          'سهراب با دلی تپنده گفت: «پهلوان! به یزدان سوگند بگو آیا تو رستم دستانی؟ که دلم به مهر تو گواهی می‌دهد!» رستم با ابروانی درهم‌کشیده پاسخ داد: «من رستم نیستم؛ که رستم پهلوانی است نامدار و من کهتری از خاندان نریمانم! به رزم آماده باش!»',
        waypoints: {
          start:
            'رستم دستان با زره ببر بیان گام به دشت رزم نهاد؛ گردان توران از هیبت تهمتن پس می‌نشینند!',
          mid:
            'سهراب از دور بانک برمی‌آورد: «ای پیر پهلوان، چرا نام خویش را از من دریغ می‌داری؟»',
          boss:
            'رستم و سهراب روبه‌روی هم ایستادند؛ دریغا که چرخ فلک سرنوشتی پر آب چشم رقم زده است!',
        },
        bossConfig: {
          bossRenderId: 'sohrab',
          bossDisplayName: 'سهراب یل (فرزند نادیده و سپهدار توران)',
          duelOpponentId: 'sohrab',
          duelButtonLabel: 'دوئل سرنوشت‌ساز رستم و سهراب',
        },
        enemyRoster: {
          factionName: 'گردان برگزیده لشکر توران',
          meleeType: 'turani_raider',
          rangedType: 'archer_turani',
          aerialType: 'turani_falcon',
        },
      };
    }

    // -------------------------------------------------------------------------
    // STAGE 1: BISH-E MAZANDARAN (خوان اول: بیشه مازندران)
    // -------------------------------------------------------------------------
    if (stageId === 1) {
      const heroTitle =
        heroId === 'rostam'
          ? 'رستم دستان'
          : heroId === 'sohrab'
          ? 'سهراب یل'
          : 'گردآفرید شیرزن';

      return {
        stageId,
        heroId,
        title:
          heroId === 'rostam'
            ? baseLore.title
            : `فصل اول: نبرد ${heroTitle} در بیشه تاریک مازندران`,
        subtitle: 'آغاز هفت‌خوان و رویارویی با دیوان پیشقراول بیشه مازندران',
        couplet: baseLore.couplet,
        poet: baseLore.poet,
        fullProse:
          heroId === 'rostam'
            ? baseLore.fullProse
            : `${heroTitle} برای آزمودن بازوی پهلوانی خویش گام به نیزارها و بیشه مخوف مازندران نهاده است. دیوان شاخ‌دار و درندگان اهریمنی از هر سو کمین کرده‌اند تا راه را بر پهلوان ببندند.`,
        dialogueHeader: `پرده‌خوانی بیشه مازندران · رزم ${heroTitle}`,
        dialogueProse: null,
        waypoints: {
          start: `${heroTitle} وارد بیشه مهتابی مازندران شد؛ دیوان شاخ‌دار در کمین‌اند!`,
          mid: 'غرّش سالار دیوان بیشه از میان درختان کهنسال به گوش می‌رسد؛ قبضه سلاح را بفشار!',
          boss: 'سالار دیوان بیشه مازندران با تبر دوطبقه پولادین راه را بسته است!',
        },
        bossConfig: {
          bossRenderId: 'warlord_1',
          bossDisplayName: t[stage.bossNameKey] || 'سالار دیوان بیشه مازندران',
          duelOpponentId: 'div_sepid',
          duelButtonLabel: 'دوئل تن‌به‌تن با سالار دیوان',
        },
        enemyRoster: {
          factionName: 'دیوان بیشه مازندران',
          meleeType: 'div_soldier',
          rangedType: 'div_sorcerer',
          aerialType: 'flying_akvan',
        },
      };
    }

    // -------------------------------------------------------------------------
    // STAGE 2: ZAHHAK THE SERPENT KING (دژ ضحاک ماردوش)
    // -------------------------------------------------------------------------
    if (stageId === 2) {
      const heroTitle =
        heroId === 'rostam'
          ? 'رستم تهمتن'
          : heroId === 'sohrab'
          ? 'سهراب یل'
          : 'گردآفرید شیرزن';

      return {
        stageId,
        heroId,
        title: `فصل دوم: قیام علیه ضحاک ماردوش به دست ${heroTitle}`,
        subtitle: 'یورش به کاخ بیداد ضحاک و درهم شکستن پاسداران اژدهانشان',
        couplet: baseLore.couplet,
        poet: baseLore.poet,
        fullProse: baseLore.fullProse,
        dialogueHeader: 'رجزخوانی در تالار ضحاک ماردوش',
        dialogueProse:
          'ضحاک ماردوش از فراز تخت زرین خروشید: «مارهای دوش من تشنه مغز جوانانند! کدام گستاخ به کاخ من پا نهاده؟» پهلوان سلاح برکشید: «دوران بیداد و جادوی تو به سر آمده است ای ماردوش!»',
        waypoints: {
          start: `${heroTitle} از دروازه دژ ضحاک گذشت؛ پاسداران مارپرست بابلی پیش می‌آیند!`,
          mid: 'صدای فِس‌فِس مارهای سیاه ضحاک در تالارهای سنگی کاخ طنین انداخته است!',
          boss: 'ضحاک ماردوش با دو مار کبرای زنده بر شانه‌هایش به میدان نبرد فرود آمد!',
        },
        bossConfig: {
          bossRenderId: 'zahhak',
          bossDisplayName: 'ضحاک ماردوش (پادشاه ستمگر ماربردوش)',
          duelOpponentId: 'div_sepid',
          duelButtonLabel: 'دوئل مرگبار با ضحاک ماردوش',
        },
        enemyRoster: {
          factionName: 'پاسداران مارپرست کاخ ضحاک',
          meleeType: 'zahhak_guard',
          rangedType: 'div_sorcerer',
          aerialType: 'zahhak_bat',
        },
      };
    }

    // -------------------------------------------------------------------------
    // STAGE 3: CAVE OF DIV-E SEPID (خوان هفتم: غار دیو سپید مازندران)
    // -------------------------------------------------------------------------
    if (stageId === 3) {
      const heroTitle =
        heroId === 'rostam'
          ? 'رستم دستان'
          : heroId === 'sohrab'
          ? 'سهراب یل'
          : 'گردآفرید شیرزن';

      return {
        stageId,
        heroId,
        title: `فصل سوم: نبرد ${heroTitle} با دیو سپید در غار تاریک مازندران`,
        subtitle: 'ورود به ژرفای سیاه‌چال مازندران و نبرد با مهیب‌ترین اهریمن شاهنامه',
        couplet: baseLore.couplet,
        poet: baseLore.poet,
        fullProse: baseLore.fullProse,
        dialogueHeader: 'خروش دیو سپید در ژرفای غار مازندران',
        dialogueProse:
          'چون روشنایی تیغ پهلوان تاریکی غار را شکافت، دیو سپید همچون کوهی از برف و سنگ از خواب برخاست و سنگ آسیاب بر سر دست گرفت: «از این غار تاریک هیچ آدمیزادی زنده بیرون نخواهد رفت!»',
        waypoints: {
          start: `${heroTitle} گام به دهلیز تاریک غار مازندران نهاد؛ قندیل‌های سنگی می‌لرزند!`,
          mid: 'چشمان سرخ دیوان نگهبان غار در تاریکی می‌درخشد؛ به پیش بتاز!',
          boss: 'دیو سپید مازندران با شاخ‌های قوچی و گرز سنگ آسیاب از دل تاریکی بیرون جهید!',
        },
        bossConfig: {
          bossRenderId: 'div_sepid',
          bossDisplayName: 'دیو سپید مازندران (فرمانروای دیوان سیاه‌چال)',
          duelOpponentId: 'div_sepid',
          duelButtonLabel: 'دوئل تن‌به‌تن با دیو سپید مازندران',
        },
        enemyRoster: {
          factionName: 'نگهبانان سیاه‌چال دیو سپید',
          meleeType: 'div_soldier',
          rangedType: 'div_sorcerer',
          aerialType: 'flying_akvan',
        },
      };
    }

    // -------------------------------------------------------------------------
    // STAGE 6: DUEL WITH ESFANDIAR THE BRAZEN-BODIED (نبرد با اسفندیار رویین‌تن)
    // -------------------------------------------------------------------------
    if (stageId === 6) {
      const heroTitle =
        heroId === 'rostam'
          ? 'رستم دستان'
          : heroId === 'sohrab'
          ? 'سهراب یل'
          : 'گردآفرید شیرزن';

      return {
        stageId,
        heroId,
        title:
          heroId === 'rostam'
            ? 'فصل ششم: نبرد سرنوشت‌ساز رستم و اسفندیار رویین‌تن در زابلستان'
            : `فصل ششم: هماوردی ${heroTitle} با اسفندیار رویین‌تن در زابلستان`,
        subtitle: 'رویارویی با شاهزاده شکست‌ناپذیر کیانی و راز چوب گز و سیمرغ',
        couplet: baseLore.couplet,
        poet: baseLore.poet,
        fullProse: baseLore.fullProse,
        dialogueHeader: 'رجزخوانی شاهنامه · نبرد با اسفندیار رویین‌تن',
        dialogueProse:
          'اسفندیار رویین‌تن با جوشن زرین درخشنده پیش آمد: «ای پهلوان! پیکر من به آب مینوی رویین گشته و هیچ تیغی بر آن کارگر نیست؛ دست در بند نه!» پهلوان با صلابت پاسخ داد: «سرانجامِ غرور، شکست است؛ که فرّه ایزدی یار آزادگان است!»',
        waypoints: {
          start: `سپاه زرین‌پوش کیانی در دشت زابلستان صف کشیده‌اند؛ ${heroTitle} به میدان درمی‌آید!`,
          mid: 'پر سیمرغ در باد می‌درخشد؛ تنها تیر گز و ضربت هوشمندانه بر زره رویین‌تن کارگر است!',
          boss: 'اسفندیار رویین‌تن با هاله فرّه کیانی و نیزه زرین در برابر تو ایستاده است!',
        },
        bossConfig: {
          bossRenderId: 'esfandiar',
          bossDisplayName: 'اسفندیار رویین‌تن (شاهزاده کیانی)',
          duelOpponentId: 'esfandiar',
          duelButtonLabel: 'دوئل حماسی با اسفندیار رویین‌تن',
        },
        enemyRoster: {
          factionName: 'گارد جاویدان سپاه اسفندیار',
          meleeType: 'kayanian_guard',
          rangedType: 'iranian_archer',
          aerialType: 'turani_falcon',
        },
      };
    }

    // -------------------------------------------------------------------------
    // STAGES 5 & 7: GREAT WAR AGAINST AFRASIAB & KAMUS (جنگ بزرگ توران و افراسیاب)
    // -------------------------------------------------------------------------
    const isSohrabHero = heroId === 'sohrab';
    return {
      stageId,
      heroId,
      title: isSohrabHero
        ? `فصل ${stageId === 5 ? 'پنجم' : 'هفتم'}: خیزش سهراب علیه فریب و بیداد افراسیاب`
        : baseLore.title,
      subtitle: isSohrabHero
        ? 'پی بردن سهراب به نیرنگ افراسیاب و نبرد با سرداران اهریمنی توران'
        : 'نبرد بزرگ سپاه ایران با لشکر کاموس کشانی و افراسیاب تورانی',
      couplet: baseLore.couplet,
      poet: baseLore.poet,
      fullProse: isSohrabHero
        ? 'هنگامی که سهراب دریافت افراسیاب به فرماندهان خود دستور داده تا حقیقت نژاد رستم را از او پنهان دارند تا پدر و پسر به دست هم تباه شوند، خشم پهلوانی وجودش را فرا گرفت و شمشیر دمشقی خود را به سوی لشکر فریبکاران افراسیاب گرداند!'
        : baseLore.fullProse,
      dialogueHeader: isSohrabHero
        ? 'خروش سهراب بر سرداران فریبکار افراسیاب'
        : 'خروش پهلوانان در نبرد بزرگ کیخسرو و افراسیاب',
      dialogueProse: null,
      waypoints: {
        start: isSohrabHero
          ? 'سهراب پی به مکر افراسیاب برده است؛ شمشیر به کین فریبکاران برکش!'
          : baseLore.battleStartSubtitle,
        mid: isSohrabHero
          ? 'سرداران افراسیاب از خشم سهراب یل به لرزه افتاده‌اند!'
          : baseLore.battleMidSubtitle,
        boss: isSohrabHero
          ? 'سالار دژخیمان افراسیاب در برابرت ایستاده است؛ سزای نیرنگ را کف دستش بگذار!'
          : baseLore.bossConfrontationSubtitle,
      },
      bossConfig: {
        bossRenderId: `warlord_${stageId}`,
        bossDisplayName: t[stage.bossNameKey] || 'افراسیاب (پادشاه فریبکار توران)',
        duelOpponentId: stageId === 5 ? 'esfandiar' : 'div_sepid',
        duelButtonLabel: 'دوئل تن‌به‌تن با سالار توران',
      },
      enemyRoster: {
        factionName: 'لشکر زرهپوش افراسیاب',
        meleeType: 'turani_raider',
        rangedType: 'archer_turani',
        aerialType: 'turani_falcon',
      },
    };
  }
}
