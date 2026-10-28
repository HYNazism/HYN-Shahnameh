// 1v1 Pahlavani Duel Engine with Blade Clash Mechanic & Authentic Combat AI
import { HeroDef, HeroId, GraphicsTier } from '../types/game';
import { PersianMiniatureEnvironment } from './PersianMiniatureEnvironment';
import { QahvehKhanehRenderer } from './QahvehKhanehRenderer';
import { naqqalAudio } from '../utils/naqqalAudio';
import { sound } from '../utils/audio';

export interface DuelFighter {
  id: string;
  name: string;
  title: string;
  color: string;
  accentColor: string;
  isAi: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  rage: number;
  maxRage: number;
  isGrounded: boolean;
  isAttacking: boolean;
  attackType: 'light' | 'heavy' | 'special';
  attackTimer: number;
  isParrying: boolean;
  isStaggered: boolean;
  staggerTimer: number;
  isHit: boolean;
  hitTimer: number;
  animFrame: number;
  heroDef?: HeroDef;
}

export interface DuelEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export type ClashState = {
  active: boolean;
  playerProgress: number; // 0 to 100
  timeRemaining: number; // in seconds
  tapCount: number;
};

export class DuelEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isRunning: boolean = false;
  private animationId: number | null = null;
  private lastTime: number = 0;

  public fighter1!: DuelFighter;
  public fighter2!: DuelFighter;
  public clashState: ClashState = { active: false, playerProgress: 50, timeRemaining: 0, tapCount: 0 };
  public particles: DuelEffect[] = [];

  public graphicsTier: GraphicsTier = 'ultra';
  public onClashUpdate?: (state: ClashState) => void;
  public onDuelEnd?: (winner: 'player' | 'opponent') => void;

  private miniatureEnv: PersianMiniatureEnvironment = new PersianMiniatureEnvironment();
  public stageId: number = 1;

  private arenaWidth: number = 900;
  private arenaGroundY: number = 420;
  private cameraShake: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get 2d context for DuelEngine');
    this.ctx = context;
  }

  public initDuel(
    p1: { name: string; title: string; color: string; accentColor: string; heroId: HeroId; heroDef?: HeroDef },
    p2: { name: string; title: string; color: string; accentColor: string; heroId: HeroId | string; heroDef?: HeroDef },
    tier: GraphicsTier = 'ultra'
  ) {
    this.graphicsTier = tier;
    this.arenaWidth = Math.max(800, this.canvas.width);
    this.arenaGroundY = this.canvas.height - 110;

    // Infer appropriate Shahnameh stage background for the duel
    if (p2.heroId === 'div_sepid') {
      this.stageId = 3; // Dark Caves of Mazandaran
    } else if (p2.heroId === 'sohrab' || p1.heroId === 'gordafarid' || p2.heroId === 'gordafarid') {
      this.stageId = 4; // Dej-e Sepid Fortress
    } else if (p2.heroId === 'esfandiar') {
      this.stageId = 6; // Zabolistan
    } else {
      this.stageId = 1; // Zabol Plains
    }

    this.fighter1 = {
      id: p1.heroId,
      name: p1.name,
      title: p1.title,
      color: p1.color,
      accentColor: p1.accentColor,
      isAi: false,
      x: this.arenaWidth * 0.28,
      y: this.arenaGroundY,
      vx: 0,
      vy: 0,
      facing: 1,
      hp: 100,
      maxHp: 100,
      stamina: 100,
      maxStamina: 100,
      rage: 0,
      maxRage: 100,
      isGrounded: true,
      isAttacking: false,
      attackType: 'light',
      attackTimer: 0,
      isParrying: false,
      isStaggered: false,
      staggerTimer: 0,
      isHit: false,
      hitTimer: 0,
      animFrame: 0,
      heroDef: p1.heroDef,
    };

    this.fighter2 = {
      id: p2.heroId,
      name: p2.name,
      title: p2.title,
      color: p2.color,
      accentColor: p2.accentColor,
      isAi: true,
      x: this.arenaWidth * 0.72,
      y: this.arenaGroundY,
      vx: 0,
      vy: 0,
      facing: -1,
      hp: 100,
      maxHp: 100,
      stamina: 100,
      maxStamina: 100,
      rage: 0,
      maxRage: 100,
      isGrounded: true,
      isAttacking: false,
      attackType: 'light',
      attackTimer: 0,
      isParrying: false,
      isStaggered: false,
      staggerTimer: 0,
      isHit: false,
      hitTimer: 0,
      animFrame: 0,
      heroDef: p2.heroDef,
    };

    this.clashState = { active: false, playerProgress: 50, timeRemaining: 0, tapCount: 0 };
    this.particles = [];
  }

  public start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    naqqalAudio.playZangMorshed(1.1);
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // Player Input Commands
  public playerMove(dir: -1 | 0 | 1) {
    if (!this.isRunning || this.clashState.active || this.fighter1.isStaggered) return;
    this.fighter1.vx = dir * 240;
    if (dir !== 0) {
      this.fighter1.facing = dir;
    }
  }

  public playerJump() {
    if (!this.isRunning || this.clashState.active || this.fighter1.isStaggered) return;
    if (this.fighter1.isGrounded) {
      this.fighter1.vy = -450;
      this.fighter1.isGrounded = false;
      sound.playJump();
    }
  }

  public playerAttack(type: 'light' | 'heavy' = 'light') {
    if (!this.isRunning || this.clashState.active || this.fighter1.isStaggered || this.fighter1.isAttacking) return;

    const stamCost = type === 'light' ? 12 : 25;
    if (this.fighter1.stamina < stamCost) return;

    this.fighter1.stamina -= stamCost;
    this.fighter1.isAttacking = true;
    this.fighter1.attackType = type;
    this.fighter1.attackTimer = type === 'light' ? 0.28 : 0.45;

    sound.playSlash(type === 'light' ? 1.0 : 0.8);

    // Check potential Blade Clash with AI attack!
    this.checkBladeClashInitiation();
  }

  public playerParry(active: boolean) {
    if (!this.isRunning || this.clashState.active || this.fighter1.isStaggered) return;
    this.fighter1.isParrying = active;
  }

  public playerSpecial() {
    if (!this.isRunning || this.clashState.active || this.fighter1.isStaggered) return;
    if (this.fighter1.rage < 50) return;

    this.fighter1.rage -= 50;
    this.fighter1.isAttacking = true;
    this.fighter1.attackType = 'special';
    this.fighter1.attackTimer = 0.55;

    sound.playSpecial();
    this.cameraShake = 14;

    // Huge energy sparks
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: this.fighter1.x + this.fighter1.facing * 30,
        y: this.fighter1.y - 30,
        vx: (Math.random() - 0.5) * 350 + this.fighter1.facing * 180,
        vy: (Math.random() - 0.5) * 350,
        color: '#fef08a',
        size: 3 + Math.random() * 4,
        life: 0.6,
        maxLife: 0.6,
      });
    }
  }

  // Blade Clash Rapid-Tap Mechanic (تپ سریع برای پیروزی در قفل سلاح)
  public onClashTap() {
    if (!this.clashState.active) return;

    this.clashState.tapCount++;
    this.clashState.playerProgress = Math.min(100, this.clashState.playerProgress + 9.5);
    this.cameraShake = 6;
    naqqalAudio.playBladeClash();

    // Spawn clash sparks
    const midX = (this.fighter1.x + this.fighter2.x) / 2;
    const midY = this.arenaGroundY - 35;
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: midX,
        y: midY,
        vx: (Math.random() - 0.5) * 280,
        vy: (Math.random() - 0.5) * 280,
        color: Math.random() > 0.4 ? '#fef08a' : '#f97316',
        size: 2.5 + Math.random() * 3,
        life: 0.35,
        maxLife: 0.35,
      });
    }

    if (this.onClashUpdate) {
      this.onClashUpdate({ ...this.clashState });
    }

    // Immediate win if bar filled!
    if (this.clashState.playerProgress >= 100) {
      this.resolveBladeClash('player');
    }
  }

  private checkBladeClashInitiation() {
    const dist = Math.abs(this.fighter1.x - this.fighter2.x);
    if (dist < 75 && this.fighter1.isAttacking && this.fighter2.isAttacking && !this.clashState.active) {
      // Trigger Epic Blade Clash!
      this.clashState = {
        active: true,
        playerProgress: 50,
        timeRemaining: 3.2,
        tapCount: 0,
      };

      this.cameraShake = 16;
      naqqalAudio.playBladeClash();
      naqqalAudio.playZoorkhanehBeat('kashmakash');

      if (this.onClashUpdate) {
        this.onClashUpdate({ ...this.clashState });
      }
    }
  }

  private resolveBladeClash(winner: 'player' | 'opponent') {
    this.clashState.active = false;
    if (this.onClashUpdate) {
      this.onClashUpdate({ ...this.clashState });
    }

    const midX = (this.fighter1.x + this.fighter2.x) / 2;
    const midY = this.arenaGroundY - 35;

    if (winner === 'player') {
      // Player smashes rival back!
      naqqalAudio.playZangMorshed(1.4);
      sound.playComboFinisher();
      this.cameraShake = 22;

      this.fighter2.hp = Math.max(0, this.fighter2.hp - 24);
      this.fighter2.isStaggered = true;
      this.fighter2.staggerTimer = 1.2;
      this.fighter2.isHit = true;
      this.fighter2.hitTimer = 0.4;
      this.fighter2.vx = 360;

      this.fighter1.rage = Math.min(100, this.fighter1.rage + 35);

      // Huge spark burst
      for (let i = 0; i < 30; i++) {
        this.particles.push({
          x: midX,
          y: midY,
          vx: Math.random() * 400 + 80,
          vy: (Math.random() - 0.5) * 350,
          color: '#fbbf24',
          size: 4 + Math.random() * 3,
          life: 0.7,
          maxLife: 0.7,
        });
      }

      if (this.fighter2.hp <= 0) {
        this.endDuel('player');
      }
    } else {
      // Opponent pushes player back
      sound.playHit();
      this.fighter1.hp = Math.max(0, this.fighter1.hp - 16);
      this.fighter1.isStaggered = true;
      this.fighter1.staggerTimer = 0.9;
      this.fighter1.isHit = true;
      this.fighter1.hitTimer = 0.3;
      this.fighter1.vx = -320;

      if (this.fighter1.hp <= 0) {
        this.endDuel('opponent');
      }
    }
  }

  private endDuel(winner: 'player' | 'opponent') {
    this.isRunning = false;
    if (winner === 'player') {
      sound.playVictory();
      naqqalAudio.playZangMorshed(1.5);
    } else {
      sound.playDefeat();
    }
    this.onDuelEnd?.(winner);
  }

  // Main Loop
  private loop = (timestamp: number) => {
    if (!this.isRunning) return;

    const dt = Math.min(0.1, (timestamp - this.lastTime) * 0.001);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    this.animationId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // Camera Shake decay
    if (this.cameraShake > 0) {
      this.cameraShake = Math.max(0, this.cameraShake - dt * 25);
    }

    // Blade Clash QTE Countdown
    if (this.clashState.active) {
      this.clashState.timeRemaining -= dt;
      // AI naturally pushes back during clash!
      this.clashState.playerProgress = Math.max(5, this.clashState.playerProgress - dt * 24);

      if (this.onClashUpdate) {
        this.onClashUpdate({ ...this.clashState });
      }

      if (this.clashState.timeRemaining <= 0) {
        if (this.clashState.playerProgress >= 50) {
          this.resolveBladeClash('player');
        } else {
          this.resolveBladeClash('opponent');
        }
      }
      return; // Skip normal combat during active clash lock
    }

    // Stamina Regeneration
    this.fighter1.stamina = Math.min(100, this.fighter1.stamina + dt * 14);
    this.fighter2.stamina = Math.min(100, this.fighter2.stamina + dt * 14);

    // Update AI Opponent Behavior
    this.updateAi(dt);

    // Update Fighters
    this.updateFighter(this.fighter1, dt);
    this.updateFighter(this.fighter2, dt);

    // Keep facing each other
    if (this.fighter1.x < this.fighter2.x) {
      this.fighter1.facing = 1;
      this.fighter2.facing = -1;
    } else {
      this.fighter1.facing = -1;
      this.fighter2.facing = 1;
    }

    // Combat Hit Detection
    this.checkCombatHits();

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 320 * dt; // gravity
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateAi(dt: number) {
    const ai = this.fighter2;
    const target = this.fighter1;
    if (ai.isStaggered || ai.isAttacking) return;

    const dist = target.x - ai.x;
    const absDist = Math.abs(dist);

    // AI Decision Making
    if (absDist > 160) {
      // Close distance
      ai.vx = Math.sign(dist) * 180;
    } else if (absDist < 60) {
      // Step back or attack
      if (Math.random() < 0.04 && ai.stamina >= 20) {
        ai.isAttacking = true;
        ai.attackType = Math.random() > 0.6 ? 'heavy' : 'light';
        ai.attackTimer = ai.attackType === 'heavy' ? 0.42 : 0.28;
        sound.playSlash(0.9);
        this.checkBladeClashInitiation();
      } else {
        ai.vx = -Math.sign(dist) * 120;
      }
    } else {
      // Mid-range: attack or parry
      ai.vx = 0;
      if (target.isAttacking && Math.random() < 0.35) {
        ai.isParrying = true;
        setTimeout(() => (ai.isParrying = false), 350);
      } else if (Math.random() < 0.05 && ai.stamina >= 15) {
        ai.isAttacking = true;
        ai.attackType = 'light';
        ai.attackTimer = 0.28;
        sound.playSlash(1.0);
        this.checkBladeClashInitiation();
      }
    }
  }

  private updateFighter(f: DuelFighter, dt: number) {
    // Gravity & Velocity
    f.vy += 1200 * dt;
    f.x += f.vx * dt;
    f.y += f.vy * dt;

    // Arena Bounds
    f.x = Math.max(60, Math.min(this.arenaWidth - 60, f.x));

    // Ground Check
    if (f.y >= this.arenaGroundY) {
      f.y = this.arenaGroundY;
      f.vy = 0;
      f.isGrounded = true;
    }

    // Friction
    f.vx *= 0.82;

    // Timers
    if (f.isAttacking) {
      f.attackTimer -= dt;
      if (f.attackTimer <= 0) {
        f.isAttacking = false;
      }
    }

    if (f.isStaggered) {
      f.staggerTimer -= dt;
      if (f.staggerTimer <= 0) {
        f.isStaggered = false;
      }
    }

    if (f.isHit) {
      f.hitTimer -= dt;
      if (f.hitTimer <= 0) {
        f.isHit = false;
      }
    }

    f.animFrame += dt * 8;
  }

  private checkCombatHits() {
    const dist = Math.abs(this.fighter1.x - this.fighter2.x);
    if (dist > 85) return;

    // Player attacking Opponent
    if (this.fighter1.isAttacking && this.fighter1.attackTimer > 0.12 && !this.fighter2.isHit) {
      if (this.fighter2.isParrying) {
        // Opponent Parried
        this.fighter1.isStaggered = true;
        this.fighter1.staggerTimer = 0.6;
        sound.playHit();
        naqqalAudio.playBladeClash();
      } else {
        const dmg = this.fighter1.attackType === 'special' ? 32 : this.fighter1.attackType === 'heavy' ? 18 : 10;
        this.fighter2.hp = Math.max(0, this.fighter2.hp - dmg);
        this.fighter2.isHit = true;
        this.fighter2.hitTimer = 0.25;
        this.fighter2.vx = this.fighter1.facing * 180;
        this.fighter1.rage = Math.min(100, this.fighter1.rage + 14);
        sound.playHit();
        this.cameraShake = 8;

        if (this.fighter2.hp <= 0) {
          this.endDuel('player');
        }
      }
    }

    // Opponent attacking Player
    if (this.fighter2.isAttacking && this.fighter2.attackTimer > 0.12 && !this.fighter1.isHit) {
      if (this.fighter1.isParrying) {
        // Player Parried!
        this.fighter2.isStaggered = true;
        this.fighter2.staggerTimer = 0.8;
        sound.playHit();
        naqqalAudio.playBladeClash();
      } else {
        const dmg = this.fighter2.attackType === 'heavy' ? 16 : 9;
        this.fighter1.hp = Math.max(0, this.fighter1.hp - dmg);
        this.fighter1.isHit = true;
        this.fighter1.hitTimer = 0.25;
        this.fighter1.vx = this.fighter2.facing * 180;
        sound.playHit();
        this.cameraShake = 7;

        if (this.fighter1.hp <= 0) {
          this.endDuel('opponent');
        }
      }
    }
  }

  // Rendering
  private render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const time = performance.now() * 0.001;

    ctx.save();
    if (this.cameraShake > 0) {
      ctx.translate((Math.random() - 0.5) * this.cameraShake, (Math.random() - 0.5) * this.cameraShake);
    }

    // 1. Dynamic Persian Miniature Environment (shifting from Zabol to Mazandaran caves)
    const camX = (this.fighter1.x + this.fighter2.x) / 2 - w / 2;
    this.miniatureEnv.render(ctx, w, h, camX, this.stageId, this.graphicsTier, time);

    // 2. Arena Ground (گود رزم پهلوانی)
    const groundGrad = ctx.createLinearGradient(0, this.arenaGroundY, 0, h);
    if (this.stageId === 3) {
      groundGrad.addColorStop(0, '#0f172a');
      groundGrad.addColorStop(0.3, '#022c22');
      groundGrad.addColorStop(1, '#020617');
    } else {
      groundGrad.addColorStop(0, '#78350f');
      groundGrad.addColorStop(0.2, '#92400e');
      groundGrad.addColorStop(1, '#451a03');
    }
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, this.arenaGroundY, w, h - this.arenaGroundY);

    // Gold Trim on Ground Perimeter
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.arenaGroundY);
    ctx.lineTo(w, this.arenaGroundY);
    ctx.stroke();

    // 3. Render Fighters
    this.renderFighter(this.fighter1);
    this.renderFighter(this.fighter2);

    // 4. Render Particles
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // 5. Blade Clash Visual Shockwave
    if (this.clashState.active) {
      const midX = (this.fighter1.x + this.fighter2.x) / 2;
      const midY = this.arenaGroundY - 35;

      // Radiant energy flare
      const flare = ctx.createRadialGradient(midX, midY, 4, midX, midY, 65);
      flare.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      flare.addColorStop(0.3, 'rgba(254, 240, 138, 0.7)');
      flare.addColorStop(0.7, 'rgba(249, 115, 22, 0.35)');
      flare.addColorStop(1, 'transparent');
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(midX, midY, 65, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private renderFighter(f: DuelFighter) {
    const ctx = this.ctx;
    const time = performance.now() * 0.001;

    ctx.save();
    ctx.translate(f.x, f.y - 26);

    if (f.id !== 'div_sepid') {
      QahvehKhanehRenderer.renderHero({
        ctx,
        heroId: f.id,
        facing: f.facing,
        animFrame: f.animFrame,
        vx: f.vx,
        vy: f.vy,
        isGrounded: f.isGrounded,
        isAttacking: f.isAttacking,
        attackType: f.attackType,
        attackTimer: f.attackTimer,
        isHit: f.isHit,
        isParrying: f.isParrying,
        rageRatio: Math.min(1.0, f.rage / 100),
        graphicsTier: this.graphicsTier,
        time,
        scale: 1.48,
      });
    } else {
      if (f.facing === -1) {
        ctx.scale(-1, 1);
      }
      QahvehKhanehRenderer.renderEnemy({
        ctx,
        type: 'boss',
        stageId: 3,
        heroId: 'rostam',
        width: 64,
        height: 86,
        vx: f.vx,
        isAttacking: f.isAttacking,
        isHit: f.isHit,
        isBoss: true,
        graphicsTier: this.graphicsTier,
        time,
      });
    }

    ctx.restore();
  }
}
