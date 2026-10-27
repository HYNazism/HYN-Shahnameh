// Audio Soundscape & Voice Recitation Engine for Shahnameh Naqqal & Zoorkhaneh

class NaqqalAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private ambientRhythmTimer: number | null = null;

  constructor() {
    const saved = localStorage.getItem('razmnameh_sound_muted');
    if (saved) {
      this.isMuted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  // 1. Zang-e Morshed (زنگ مرشد زورخانه) - Authentic brass bell with long shimmer & harmonics
  public playZangMorshed(intensity: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Harmonics for a heavy cast brass Zoorkhaneh bell
    const frequencies = [1180, 1780, 2360, 3540, 4720];
    const decayTimes = [1.8, 1.4, 1.1, 0.7, 0.4];

    frequencies.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Slight pitch vibrato for brass realism
      osc.frequency.exponentialRampToValueAtTime(freq * 0.992, now + decayTimes[idx]);

      const gainLevel = (0.28 / (idx + 1)) * intensity;
      gain.gain.setValueAtTime(gainLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTimes[idx] * 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + decayTimes[idx] * 1.4);
    });

    // Sub-strike thud
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    subGain.gain.setValueAtTime(0.3 * intensity, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.15);
  }

  // 2. Blade Clash / قفل شدن تیغه‌ها
  public playBladeClash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // High metallic clang
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1420, now);
    osc1.frequency.exponentialRampToValueAtTime(900, now + 0.25);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(2840, now);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.3);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  // 3. Heavy Zoorkhaneh Zarb / Tonbak Rhythmic Pattern
  public playZoorkhanehBeat(type: 'bahr' | 'ton' | 'kashmakash' = 'bahr') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (type === 'kashmakash') {
      // Rapid drum roll for intense duel moments
      for (let i = 0; i < 4; i++) {
        const timeOffset = now + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i === 3 ? 'triangle' : 'sine';
        const startFreq = i === 3 ? 90 : 220 + i * 20;
        osc.frequency.setValueAtTime(startFreq, timeOffset);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, timeOffset + 0.07);

        gain.gain.setValueAtTime(0.25, timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(timeOffset);
        osc.stop(timeOffset + 0.07);
      }
      return;
    }

    const isBass = type === 'bahr';
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isBass ? 'triangle' : 'sine';
    const startFreq = isBass ? 115 : 310;
    const endFreq = isBass ? 42 : 130;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + (isBass ? 0.22 : 0.12));

    gain.gain.setValueAtTime(isBass ? 0.38 : 0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isBass ? 0.28 : 0.15));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + (isBass ? 0.28 : 0.15));
  }

  // 4. Naqqali Persian Speech Synthesis (روایت صوتی نقال)
  public reciteText(
    text: string,
    options: {
      onStart?: () => void;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    } = {}
  ): boolean {
    if (this.isMuted) return false;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;

    // Ring Zang-e Morshed at start of recitation!
    this.playZangMorshed(0.9);

    window.speechSynthesis.cancel();

    // Clean markdown/special characters
    const cleanText = text
      .replace(/[—#*❖/«»]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    // Detect available voices
    const voices = window.speechSynthesis.getVoices();
    const farsiVoice = voices.find(v => v.lang.startsWith('fa') || v.lang.includes('persian') || v.lang.includes('IR'));
    if (farsiVoice) {
      utterance.voice = farsiVoice;
      utterance.lang = farsiVoice.lang;
    } else {
      utterance.lang = 'fa-IR';
    }

    // Epic resonant pitch & pacing
    utterance.rate = 0.88; // Majestic deliberate tempo of traditional Naqqals
    utterance.pitch = 0.92; // Deep resonant masculine timbre
    utterance.volume = 1.0;

    utterance.onstart = () => {
      options.onStart?.();
      // Start accompanying low zoorkhaneh drum pulse
      this.startAccompanyingRhythm();
    };

    utterance.onboundary = (e) => {
      if (options.onBoundary && e.charIndex !== undefined) {
        options.onBoundary(e.charIndex);
      }
    };

    utterance.onend = () => {
      this.stopAccompanyingRhythm();
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = () => {
      this.stopAccompanyingRhythm();
      this.currentUtterance = null;
      options.onEnd?.();
    };

    // Small delay for bell resonance to breathe
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 280);

    return true;
  }

  private startAccompanyingRhythm() {
    this.stopAccompanyingRhythm();
    let tick = 0;
    this.ambientRhythmTimer = window.setInterval(() => {
      if (this.isMuted) return;
      if (tick % 6 === 0) {
        this.playZoorkhanehBeat('bahr');
      } else if (tick % 3 === 0) {
        this.playZoorkhanehBeat('ton');
      }
      tick++;
    }, 550);
  }

  private stopAccompanyingRhythm() {
    if (this.ambientRhythmTimer) {
      clearInterval(this.ambientRhythmTimer);
      this.ambientRhythmTimer = null;
    }
  }

  public stopAll() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.stopAccompanyingRhythm();
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export const naqqalAudio = new NaqqalAudioEngine();
