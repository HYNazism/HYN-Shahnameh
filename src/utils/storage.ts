import { PlayerProgress, MonetizationState, Language, GraphicsTier } from '../types/game';
import { DEFAULT_PROGRESS, DEFAULT_MONETIZATION } from '../constants/gameData';

const PROGRESS_KEY = 'razmnameh_player_progress_v2';
const MONETIZATION_KEY = 'razmnameh_monetization_v2';
const LANG_KEY = 'razmnameh_language_v2';
const GRAPHICS_KEY = 'razmnameh_graphics_tier_v1';

export function detectOptimalGraphicsTier(): GraphicsTier {
  try {
    if (typeof window === 'undefined') return 'high';
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const dpr = window.devicePixelRatio || 1;

    if (cores >= 8 && !isMobile && dpr >= 1) {
      return 'ultra';
    } else if (cores >= 4 && !isMobile) {
      return 'high';
    } else if (cores >= 4 && isMobile) {
      return 'medium';
    } else {
      return 'low';
    }
  } catch (e) {
    return 'high';
  }
}

export function loadGraphicsTier(): GraphicsTier {
  try {
    const saved = localStorage.getItem(GRAPHICS_KEY);
    if (saved && ['low', 'medium', 'high', 'ultra'].includes(saved)) {
      return saved as GraphicsTier;
    }
  } catch (e) {
    console.warn('Failed to load graphics tier', e);
  }
  return detectOptimalGraphicsTier();
}

export function saveGraphicsTier(tier: GraphicsTier): void {
  try {
    localStorage.setItem(GRAPHICS_KEY, tier);
  } catch (e) {
    console.warn('Failed to save graphics tier', e);
  }
}

export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        dailyQuests: parsed.dailyQuests || DEFAULT_PROGRESS.dailyQuests,
      };
    }
  } catch (e) {
    console.warn('Failed to load player progress from storage', e);
  }
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(progress: PlayerProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save player progress', e);
  }
}

export function loadMonetization(): MonetizationState {
  try {
    const raw = localStorage.getItem(MONETIZATION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_MONETIZATION,
        ...parsed,
        creatorWallets: {
          ...DEFAULT_MONETIZATION.creatorWallets,
          ...(parsed.creatorWallets || {}),
        },
        transactions: parsed.transactions || DEFAULT_MONETIZATION.transactions,
      };
    }
  } catch (e) {
    console.warn('Failed to load monetization state', e);
  }
  return { ...DEFAULT_MONETIZATION };
}

export function saveMonetization(state: MonetizationState): void {
  try {
    localStorage.setItem(MONETIZATION_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save monetization state', e);
  }
}

export function loadLanguage(): Language {
  try {
    const raw = localStorage.getItem(LANG_KEY);
    if (raw && ['fa', 'en', 'ar', 'fr'].includes(raw)) {
      return raw as Language;
    }
  } catch (e) {
    console.warn('Failed to load language', e);
  }
  return 'fa';
}

export function saveLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    console.warn('Failed to save language', e);
  }
}
