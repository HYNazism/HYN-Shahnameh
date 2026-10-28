import React from 'react';
import { HeroId, Language, StageDef } from '../types/game';
import { SHAHNAMEH_LORE } from '../constants/shahnamehLore';
import { TRANSLATIONS } from '../constants/translations';
import { X, BookOpen, Scroll, Play, Shield, UserCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import { NaqqalNarrator } from './NaqqalNarrator';

interface Props {
  stage: StageDef;
  selectedHeroId: HeroId;
  onSelectHero: (id: HeroId) => void;
  lang: Language;
  onClose: () => void;
  onStartBattle: () => void;
}

export const StoryPrologueModal: React.FC<Props> = ({
  stage,
  selectedHeroId,
  onSelectHero,
  lang,
  onClose,
  onStartBattle,
}) => {
  const t = TRANSLATIONS[lang];
  const baseLore = SHAHNAMEH_LORE[lang]?.[stage.id] || SHAHNAMEH_LORE['fa'][stage.id];

  // Dynamically tailor the narrative prose & couplet based on the chosen hero in Stage 4 (Dej-e Sepid)
  let activeLore = { ...baseLore };

  if (stage.id === 4) {
    if (selectedHeroId === 'gordafarid') {
      activeLore = {
        title: 'فصل چهارم: نبرد گردآفرید شیرزن و سهراب در دژ سپید',
        couplet:
          'چو آگاه شد دختر گژدهم / که سالار آن انجمن گشت کم\nزنی بود بر سان گردی سوار / همیشه به جنگ اندرون نامدار\nکجا نام او بود گردآفرید / زمانه ز مادر چنین ناورید',
        poet: 'حکیم ابوالقاسم فردوسی',
        fullProse:
          'چون هجیر به دست سهراب یل اسیر گشت و بیم سقوط دژ سپید به مرزهای ایران رخنه کرد، گردآفرید دختر گژدهم، زره جنگی پوشید و گیسوان مشک‌فام خویش را در زیر خود پنهان ساخت. او یک‌تنه با تیر و کمان و نیزه زرین بر باروی دژ تاخت و راه را بر سپاهیان توران بست. سهراب از دلاوری این سوار ناشناس شگفت‌زده شد و نیزه در دست به سویش شتافت. اکنون تو ای شیرزن دلاور، کمان کیانی را برکش و با چابکی از خاک پاک دژ سپید پاسداری کن!',
        battleStartSubtitle:
          'گردآفرید بر باروی دژ سپید ایستاده است؛ کمان کیانی را برکش و از دژ ایران در برابر سهراب پاسداری کن!',
        battleMidSubtitle:
          'سهراب یل نیزه به کف پیش می‌آید: «کدام یل است این که بی‌باک بر دژ ایستاده و هماوردی می‌جوید؟»',
        bossConfrontationSubtitle:
          'چو خود از سر دلاور فروریخت و گیسوان مشک‌فام آشکار گشت، سهراب مبهوت دلیری شیرزن ایرانی شد!',
      };
    } else if (selectedHeroId === 'sohrab') {
      activeLore = {
        title: 'فصل چهارم: پیشروی سهراب یل به سوی دژ سپید و جستجوی پدر',
        couplet:
          'به مادر چنین گفت کین راز را / بدین آشکارا کن آغاز را\nکه گوید مرا بر سر انجمن / نژاد تو بر کیست ای پیلتن؟',
        poet: 'حکیم ابوالقاسم فردوسی',
        fullProse:
          'سهراب دلاور از سمنگان لشکری آراست تا پدر نادیده خویش، رستم تهمتن را بیابد. او در مسیر به دژ سپید رسید؛ دژبانی چابک به نام گردآفرید شیرزن به مقابله برخاست و پس از نبردی پرشور، راز دلیری شیرزنان ایران بر سهراب عیان گشت. اکنون سهراب به دشت رزمگاه ایران گام می‌نهد؛ دلی آکنده از مهر پدر دارد اما افسوس که مکر افراسیاب پرده بر دیدگان دو پهلوان کشیده است!',
        battleStartSubtitle:
          'سهراب به پای دژ سپید رسید؛ کمانداران دژ تیر می‌بارند، راه را به سوی مقصد بگشای!',
        battleMidSubtitle:
          'گردآفرید شیرزن با زوبین و کمان سد راه سپاه توران شده است؛ با احتیاط شمشیر بزن!',
        bossConfrontationSubtitle:
          'هماوردی تن‌به‌تن در دروازه دژ سپید آغاز گشت؛ دلاوری حریف را با هنر شمشیرزنی بیازمای!',
      };
    } else {
      activeLore = {
        title: 'فصل چهارم: حماسه و تراژدی رستم و سهراب',
        couplet:
          'یکی داستان است پر آب چشم / دل نازک از رستم آید به خشم\nاگر تندبادی برآید ز کنج / به خاک افکند نارسیده ترنج',
        poet: 'حکیم ابوالقاسم فردوسی',
        fullProse:
          'پس از نبرد دژ سپید، رستم تهمتن برای رویارویی با پهلوان جوان توران به رزمگاه آمد. سهراب با مهر به سیمای رستم می‌نگریست و نشانی پدر را می‌جست؛ اما رستم نام خویش را پنهان داشت تا مبادا نام خاندان تهمتن دستمایه غرور دشمن گردد. دو کوه پولادین به نبرد ایستادند؛ نبردی که در آن نه زور بازو، که تقدیر سرنوشت‌ساز پیروز میدان گشت!',
        battleStartSubtitle:
          'رستم به دشت رزمگاه رسید؛ سهراب با دلی آکنده از مهر به تهمتن خیره شده است.',
        battleMidSubtitle:
          'سهراب: «پهلوان، سوگند به یزدان بگو تو کیستی؟ مهر تو در دلم می‌جوشد و تیره‌روزی در کمین است!»',
        bossConfrontationSubtitle:
          'دو کوه پولادین به هم آویختند؛ دریغا از نامی که پنهان ماند و رازی که در دل زره خفته است!',
      };
    }
  }

  const handleStart = () => {
    sound.playVictory();
    onStartBattle();
  };

  const dynamicBossName =
    stage.id === 4
      ? selectedHeroId === 'gordafarid'
        ? 'سهراب یل (هماورد در دژ سپید)'
        : selectedHeroId === 'sohrab'
        ? 'گردآفرید شیرزن (مدافع دژ)'
        : 'سهراب یل (رزم پدر و پسر)'
      : t[stage.bossNameKey];

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 select-none animate-fadeIn">
      <div className="bg-[#0b101e] border-2 border-amber-500/60 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Decorative Golden Corner Accents */}
        <div className="absolute top-2 right-2 text-amber-500/30 text-xs font-serif pointer-events-none">❖</div>
        <div className="absolute top-2 left-2 text-amber-500/30 text-xs font-serif pointer-events-none">❖</div>
        <div className="absolute bottom-2 right-2 text-amber-500/30 text-xs font-serif pointer-events-none">❖</div>
        <div className="absolute bottom-2 left-2 text-amber-500/30 text-xs font-serif pointer-events-none">❖</div>

        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-wider block">
                پرده‌خوانی و نقالی شاهنامه فردوسی · {stage.chapterEra}
              </span>
              <h2 className="text-base md:text-lg font-black text-slate-100">
                {activeLore.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Illustrated Verse & Full Prose */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
          {/* Animated Naqqal Character & Audio Narration Engine */}
          <NaqqalNarrator
            title={activeLore.title}
            couplet={activeLore.couplet}
            poet={activeLore.poet}
            fullProse={activeLore.fullProse}
          />

          {/* Hero Selection Choice in Stage 4: Dej-e Sepid */}
          {stage.allowHeroDuelSelect && (
            <div className="p-3.5 bg-slate-900/80 border border-amber-500/40 rounded-xl flex flex-col gap-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                انتخاب پهلوان در این مرحله حماسی:
              </span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                  onClick={() => {
                    onSelectHero('gordafarid');
                    sound.playArrow();
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedHeroId === 'gordafarid'
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-lg'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>🏹 گردآفرید (دژدار)</span>
                </button>
                <button
                  onClick={() => {
                    onSelectHero('sohrab');
                    sound.playSlash();
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedHeroId === 'sohrab'
                      ? 'bg-sky-600 text-white ring-2 ring-sky-300 shadow-lg'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>🦅 سهراب یل</span>
                </button>
                <button
                  onClick={() => {
                    onSelectHero('rostam');
                    sound.playMaceSmash();
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedHeroId === 'rostam'
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-lg font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>🦁 رستم دستان</span>
                </button>
              </div>
            </div>
          )}

          {/* Reward & Boss Preview */}
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">حریف و هماورد مرحله:</span>
              <span className="font-bold text-rose-400">{dynamicBossName}</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-amber-400 font-bold">
              <span>+{stage.goldReward}🪙</span>
              <span>+{stage.gemReward}💎</span>
            </div>
          </div>
        </div>

        {/* Modal Footer & Start Battle CTA */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {t.close}
          </button>

          <button
            onClick={handleStart}
            className="py-2.5 px-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t.start_stage}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
