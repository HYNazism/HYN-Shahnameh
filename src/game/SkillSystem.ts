// Mythic Shahnameh Skill Tree & Progression System
import { SkillNode, SkillBranch, PlayerProgress } from '../types';

export const SKILL_NODES: SkillNode[] = [
  // ===================== شاخه دلاوری (Valor & Melee Combos) =====================
  {
    id: 'delavari_1',
    branch: 'delavari',
    tier: 1,
    nameFa: 'زور پیلتن (قدرت پیلتنی)',
    nameEn: 'Mighty Elephant Strength',
    descFa: 'افزایش ۱۰٪ به قدرت ضربات شمشیر و گرز باستانی',
    descEn: 'Increases all melee damage by 10%',
    icon: 'Hammer',
    costSkillPoints: 1,
    costGold: 150,
    effects: { stat: 'attack', value: 8 },
  },
  {
    id: 'delavari_2',
    branch: 'delavari',
    tier: 2,
    nameFa: 'گرز گاوسار سام نریمان',
    nameEn: 'Bull-Headed Mace of Sam',
    descFa: 'ضربات سنگین و فینیشرها ۲۰٪ آسیب بیشتر وارد می‌کنند و باعث پرتاب دشمنان می‌شوند',
    descEn: 'Heavy attacks and combo finishers deal 20% more damage and knock enemies back',
    icon: 'Zap',
    costSkillPoints: 2,
    costGold: 300,
    prerequisiteId: 'delavari_1',
    effects: { stat: 'attack', value: 16 },
  },
  {
    id: 'delavari_3',
    branch: 'delavari',
    tier: 3,
    nameFa: 'کمبوی آتشین رزم‌نامه',
    nameEn: 'Blazing Razm Strike',
    descFa: 'امکان اجرای کمبوی ۳ ضربه‌ای به همراه ضربه هوایی لانچر (Launcher Uppercut)',
    descEn: 'Unlocks aerial launcher follow-up to standard 3-hit combo',
    icon: 'Flame',
    costSkillPoints: 3,
    costGold: 600,
    prerequisiteId: 'delavari_2',
    effects: { stat: 'critChance', value: 0.15 },
  },
  {
    id: 'delavari_4',
    branch: 'delavari',
    tier: 4,
    nameFa: 'قهر تهمتن: ضربه گرز آتشین',
    nameEn: 'Wrath of Tahamtan',
    descFa: 'تمام ضربات گرز و شمشیر رد آتشین مقدس بر جا گذاشته و دشمنان را می‌سوزانند',
    descEn: 'Attacks unleash holy fire waves burning enemies for continuous damage',
    icon: 'Flame',
    costSkillPoints: 4,
    costGold: 1200,
    prerequisiteId: 'delavari_3',
    effects: { isSpecialPerk: true, perkCode: 'flaming_mace', value: 25 },
  },

  // ===================== شاخه افسون و فرّ (Divine Farreh & Simurgh) =====================
  {
    id: 'afsoon_1',
    branch: 'afsoon',
    tier: 1,
    nameFa: 'درخشش فرّ کیانی',
    nameEn: 'Gleam of Kayanian Farreh',
    descFa: 'افزایش سرعت پر شدن گیج فرّه مقدس و قدرت انفجار انرژی به میزان ۱۵٪',
    descEn: 'Increases Divine Farreh energy gauge charge rate by 15%',
    icon: 'Sun',
    costSkillPoints: 1,
    costGold: 180,
    effects: { stat: 'rageGain', value: 15 },
  },
  {
    id: 'afsoon_2',
    branch: 'afsoon',
    tier: 2,
    nameFa: 'پر جادویی سیمرغ البرز',
    nameEn: 'Feather of Alborz Simurgh',
    descFa: 'در صورت رسیدن جان به صفر، پر سیمرغ رستم را یک بار در هر مرحله با ۵۰٪ سلامتی احیا می‌کند',
    descEn: 'Simurgh feather revives hero once per stage with 50% HP',
    icon: 'Sparkles',
    costSkillPoints: 3,
    costGold: 500,
    prerequisiteId: 'afsoon_1',
    effects: { isSpecialPerk: true, perkCode: 'simurgh_revive', value: 50 },
  },
  {
    id: 'afsoon_3',
    branch: 'afsoon',
    tier: 3,
    nameFa: 'طلسم شکن باستان',
    nameEn: 'Ancient Hex Breaker',
    descFa: 'کاهش ۳۵٪ آسیب جادوی دیوان و تیرهای آتشین پرتابی',
    descEn: 'Reduces magical demon projectile and poison damage by 35%',
    icon: 'ShieldAlert',
    costSkillPoints: 3,
    costGold: 750,
    prerequisiteId: 'afsoon_2',
    effects: { stat: 'defense', value: 20 },
  },
  {
    id: 'afsoon_4',
    branch: 'afsoon',
    tier: 4,
    nameFa: 'آذرخش فرّه ایزدی',
    nameEn: 'Celestial Thunder of Farreh',
    descFa: 'فعال‌سازی آلتیمیت فرّه، طوفانی از صاعقه‌های زرین بر تمام صفحه فرو می‌ریزد',
    descEn: 'Ultimate Farreh calls down golden celestial lightning storm across entire battlefield',
    icon: 'Zap',
    costSkillPoints: 5,
    costGold: 1500,
    prerequisiteId: 'afsoon_3',
    effects: { stat: 'attack', value: 40 },
  },

  // ===================== شاخه چالاکی (Agility & Flash Parry) =====================
  {
    id: 'chalaki_1',
    branch: 'chalaki',
    tier: 1,
    nameFa: 'پویه بادپا (گام سبک)',
    nameEn: 'Fleet Wind Step',
    descFa: 'افزایش ۱۰٪ به سرعت دویدن و جهش پهلوان',
    descEn: 'Increases movement and dash speed by 10%',
    icon: 'Wind',
    costSkillPoints: 1,
    costGold: 120,
    effects: { stat: 'speed', value: 0.8 },
  },
  {
    id: 'chalaki_2',
    branch: 'chalaki',
    tier: 2,
    nameFa: 'دفع برق‌آسا (رد تیغ / پری)',
    nameEn: 'Flash Deflect (Parry)',
    descFa: 'افزایش پنجره زمانی دفع ضربات (Parry Window)؛ دفع موفق به حریف صدمه متقابل می‌زند',
    descEn: 'Broadens parry window. Successful parries stagger attackers',
    icon: 'Shield',
    costSkillPoints: 2,
    costGold: 320,
    prerequisiteId: 'chalaki_1',
    effects: { stat: 'parryWindow', value: 80 },
  },
  {
    id: 'chalaki_3',
    branch: 'chalaki',
    tier: 3,
    nameFa: 'تاخت رخش گلگون',
    nameEn: 'Spectral Charge of Rakhsh',
    descFa: 'حرکت دش (Dash) تبدیل به تاخت رخش شده و همه دشمنان در مسیر را زیر پای می‌نهد',
    descEn: 'Dash becomes a spectral Rakhsh charge that tramples through all obstacles',
    icon: 'ChevronRight',
    costSkillPoints: 3,
    costGold: 650,
    prerequisiteId: 'chalaki_2',
    effects: { isSpecialPerk: true, perkCode: 'rakhsh_charge', value: 20 },
  },
  {
    id: 'chalaki_4',
    branch: 'chalaki',
    tier: 4,
    nameFa: 'پری بی‌نقص و زمان راکد',
    nameEn: 'Perfect Deflect Shockwave',
    descFa: 'دفع دقیق، زمان را برای ۱ ثانیه کند کرده و موج شوک طلایی تمام دشمنان مجاور را گیج (Stun) می‌کند',
    descEn: 'Perfect parry freezes time briefly and emits a golden shockwave stunning nearby enemies',
    icon: 'Crosshair',
    costSkillPoints: 4,
    costGold: 1300,
    prerequisiteId: 'chalaki_3',
    effects: { isSpecialPerk: true, perkCode: 'perfect_parry_stun', value: 100 },
  },

  // ===================== شاخه پایداری (Fortitude & Babr-e Bayan) =====================
  {
    id: 'paydari_1',
    branch: 'paydari',
    tier: 1,
    nameFa: 'کالبد پولادین سنگی',
    nameEn: 'Iron Pahlavan Physique',
    descFa: 'افزایش ۳۰ واحد به حداکثر خط سلامت (HP) پهلوان',
    descEn: 'Increases maximum Health Points by +30',
    icon: 'Heart',
    costSkillPoints: 1,
    costGold: 160,
    effects: { stat: 'hp', value: 30 },
  },
  {
    id: 'paydari_2',
    branch: 'paydari',
    tier: 2,
    nameFa: 'جوشن ببر بیان',
    nameEn: 'Babr-e Bayan Leopard Cuirass',
    descFa: 'زره اسطوره‌ای ساخته شده از پوست ببر بیان؛ جذب ۲۰٪ از تمام ضربات فیزیکی',
    descEn: 'Mythic leopard cuirass absorbs 20% of incoming physical damage',
    icon: 'ShieldCheck',
    costSkillPoints: 2,
    costGold: 380,
    prerequisiteId: 'paydari_1',
    effects: { stat: 'defense', value: 25 },
  },
  {
    id: 'paydari_3',
    branch: 'paydari',
    tier: 3,
    nameFa: 'بازگشت زخم (تیغ خارپشت)',
    nameEn: 'Thorns of Retribution',
    descFa: 'هر ضربه‌ای که به زره اصابت کند، ۲۵٪ صدمه را به مهاجم منعکس می‌نماید',
    descEn: 'Reflects 25% of incoming damage back to attacking foes',
    icon: 'Sparkle',
    costSkillPoints: 3,
    costGold: 700,
    prerequisiteId: 'paydari_2',
    effects: { isSpecialPerk: true, perkCode: 'babre_bayan_thorns', value: 25 },
  },
  {
    id: 'paydari_4',
    branch: 'paydari',
    tier: 4,
    nameFa: 'نوشداروی کیکاووس',
    nameEn: 'Elixir of Noshdaru',
    descFa: 'بازسازی پیوسته سلامتی در طول نبرد (۱٪ جان در هر ۲ ثانیه) و مقاومت کامل در برابر پرت شدن',
    descEn: 'Continuous HP regeneration (1% every 2s) and immune to knockback while attacking',
    icon: 'Activity',
    costSkillPoints: 4,
    costGold: 1400,
    prerequisiteId: 'paydari_3',
    effects: { stat: 'hp', value: 50 },
  },
];

export class SkillSystem {
  public static canUnlock(nodeId: string, progress: PlayerProgress): { can: boolean; reason?: string } {
    const node = SKILL_NODES.find(n => n.id === nodeId);
    if (!node) return { can: false, reason: 'مهارت یافت نشد' };

    const unlocked = progress.unlockedSkillNodes || {};
    if (unlocked[nodeId]) {
      return { can: false, reason: 'قبلاً فعال شده است' };
    }

    if (node.prerequisiteId && !unlocked[node.prerequisiteId]) {
      const prereq = SKILL_NODES.find(n => n.id === node.prerequisiteId);
      return { can: false, reason: `نیازمند مهارت پیش‌نیاز: ${prereq?.nameFa || ''}` };
    }

    const currentPoints = progress.skillPoints || 0;
    if (currentPoints < node.costSkillPoints) {
      return { can: false, reason: `نیاز به ${node.costSkillPoints} امتیاز مهارت دارید` };
    }

    if (progress.gold < node.costGold) {
      return { can: false, reason: `نیاز به ${node.costGold} سکه طلا دارید` };
    }

    return { can: true };
  }

  public static unlockNode(nodeId: string, progress: PlayerProgress): PlayerProgress | null {
    const check = this.canUnlock(nodeId, progress);
    if (!check.can) return null;

    const node = SKILL_NODES.find(n => n.id === nodeId)!;
    const newUnlocked = { ...(progress.unlockedSkillNodes || {}), [nodeId]: true };
    const currentPoints = progress.skillPoints || 0;
    const newPoints = Math.max(0, currentPoints - node.costSkillPoints);
    const newGold = Math.max(0, progress.gold - node.costGold);

    const perks = new Set(progress.equippedPerks || []);
    if (node.effects.isSpecialPerk && node.effects.perkCode) {
      perks.add(node.effects.perkCode);
    }

    return {
      ...progress,
      skillPoints: newPoints,
      gold: newGold,
      unlockedSkillNodes: newUnlocked,
      equippedPerks: Array.from(perks),
    };
  }

  public static getAggregatedBonuses(progress: PlayerProgress) {
    const unlocked = progress.unlockedSkillNodes || {};
    let bonusAttack = 0;
    let bonusHp = 0;
    let bonusSpeed = 0;
    let bonusDefense = 0;
    let bonusCrit = 0;
    let bonusParryWindow = 0;
    let bonusRageGain = 0;
    const activePerks: Record<string, boolean> = {};

    for (const node of SKILL_NODES) {
      if (unlocked[node.id]) {
        const eff = node.effects;
        if (eff.stat === 'attack') bonusAttack += eff.value;
        if (eff.stat === 'hp') bonusHp += eff.value;
        if (eff.stat === 'speed') bonusSpeed += eff.value;
        if (eff.stat === 'defense') bonusDefense += eff.value;
        if (eff.stat === 'critChance') bonusCrit += eff.value;
        if (eff.stat === 'parryWindow') bonusParryWindow += eff.value;
        if (eff.stat === 'rageGain') bonusRageGain += eff.value;
        if (eff.isSpecialPerk && eff.perkCode) {
          activePerks[eff.perkCode] = true;
        }
      }
    }

    return {
      bonusAttack,
      bonusHp,
      bonusSpeed,
      bonusDefense,
      bonusCrit,
      bonusParryWindow,
      bonusRageGain,
      activePerks,
    };
  }
}
