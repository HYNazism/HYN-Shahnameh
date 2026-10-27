import { HeroDef, StageDef, GraphicsTier } from '../types/game';
import { SHAHNAMEH_LORE } from '../constants/shahnamehLore';
import { sound } from '../utils/audio';

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  attack: boolean;
  quickAttack: boolean;
  special: boolean;
  parry?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  isRing?: boolean;
  ringRadius?: number;
}

interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  vy: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  fromPlayer: boolean;
  damage: number;
  isFire?: boolean;
  life: number;
}

interface Collectible {
  id: number;
  x: number;
  y: number;
  type: 'gold' | 'gem' | 'noshdaru';
  value: number;
  collected: boolean;
  bobOffset: number;
}

interface Enemy {
  id: number;
  type: 'grunt' | 'archer' | 'flying_akvan' | 'boss';
  bossNameKey?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  damage: number;
  facing: -1 | 1;
  patrolLeft: number;
  patrolRight: number;
  attackCooldown: number;
  isAttacking: boolean;
  isHit: boolean;
  hitTimer: number;
  isBoss?: boolean;
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  isGround?: boolean;
  isGate?: boolean;
  hasTorch?: boolean;
  hasBanner?: boolean;
  hasColumn?: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hero: HeroDef;
  private stage: StageDef;
  public graphicsTier: GraphicsTier;
  private weaponBonusDamage: number;
  private armorDamageReduction: number;
  private onGameOver: (score: number, gold: number, gems: number) => void;
  private onVictory: (score: number, gold: number, gems: number) => void;
  private onStatsUpdate: (hp: number, maxHp: number, rage: number, gold: number, gems: number, bossHp?: number, bossMaxHp?: number) => void;
  private onComboUpdate: (comboCount: number, multiplier: number) => void;
  private onFinisherLanded: () => void;
  private onNarrativeMilestone: (text: string) => void;

  // Running State & Hit-Stop Feedback
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private hitStopTimer: number = 0;

  // Player Entity
  public player = {
    x: 100,
    y: 350,
    vx: 0,
    vy: 0,
    w: 42,
    h: 58,
    hp: 150,
    maxHp: 150,
    rage: 0,
    maxRage: 100,
    facing: 1 as -1 | 1,
    isGrounded: false,
    jumpCount: 0,
    maxJumps: 1,
    isAttacking: false,
    attackTimer: 0,
    attackType: 'melee' as 'melee' | 'special',
    isParrying: false,
    parryTimer: 0,
    isInvulnerable: false,
    invulnTimer: 0,
    specialCooldown: 0,
    animFrame: 0,
  };

  // Simurgh Perk & Mythic Abilities
  public hasSimurghFeather: boolean = false;
  private simurghRevived: boolean = false;
  private prevParry: boolean = false;

  // 3-Hit Combo State System
  public comboStep: number = 0;
  public comboResetTimer: number = 0;
  public currentComboCount: number = 0;
  public comboDecayTimer: number = 0;

  // Narrative Waypoint tracking in stage
  private narrativePassed = {
    start: false,
    mid: false,
    boss: false,
  };

  // World & Camera
  public worldWidth = 3400;
  public worldHeight = 650;
  private cameraX = 0;
  private screenShake = 0;

  // World Entities
  private platforms: Platform[] = [];
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private particles: Particle[] = [];
  private weatherParticles: WeatherParticle[] = [];
  private floatTexts: FloatingText[] = [];
  private collectibles: Collectible[] = [];

  // Run Stats
  public stageGoldEarned = 0;
  public stageGemsEarned = 0;
  public stageScore = 0;

  // Current inputs
  public input: InputState = {
    left: false,
    right: false,
    jump: false,
    attack: false,
    quickAttack: false,
    special: false,
  };

  private prevJump = false;
  private prevAttack = false;
  private prevQuickAttack = false;
  private prevSpecial = false;

  constructor(
    canvas: HTMLCanvasElement,
    hero: HeroDef,
    stage: StageDef,
    graphicsTier: GraphicsTier,
    weaponBonusDamage: number,
    armorDamageReduction: number,
    onGameOver: (score: number, gold: number, gems: number) => void,
    onVictory: (score: number, gold: number, gems: number) => void,
    onStatsUpdate: (hp: number, maxHp: number, rage: number, gold: number, gems: number, bossHp?: number, bossMaxHp?: number) => void,
    onComboUpdate: (comboCount: number, multiplier: number) => void,
    onFinisherLanded: () => void,
    onNarrativeMilestone: (text: string) => void,
    hasSimurghBoots: boolean = false
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.hero = hero;
    this.stage = stage;
    this.graphicsTier = graphicsTier;
    this.weaponBonusDamage = weaponBonusDamage;
    this.armorDamageReduction = armorDamageReduction;
    this.onGameOver = onGameOver;
    this.onVictory = onVictory;
    this.onStatsUpdate = onStatsUpdate;
    this.onComboUpdate = onComboUpdate;
    this.onFinisherLanded = onFinisherLanded;
    this.onNarrativeMilestone = onNarrativeMilestone;

    this.player.maxHp = hero.maxHp;
    this.player.hp = hero.maxHp;
    this.player.maxJumps = (hero.hasDoubleJump || hasSimurghBoots) ? 2 : 1;

    this.initLevel();
  }

  public setGraphicsTier(tier: GraphicsTier) {
    this.graphicsTier = tier;
    if (tier === 'low') {
      this.weatherParticles = [];
      this.particles = [];
    } else if (tier === 'ultra' && this.weatherParticles.length === 0) {
      this.seedWeatherParticles();
    }
  }

  private initLevel() {
    this.platforms = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.floatTexts = [];
    this.collectibles = [];
    this.weatherParticles = [];

    this.narrativePassed = { start: false, mid: false, boss: false };

    // Continuous Ground Floor
    this.platforms.push({ x: 0, y: 550, w: this.worldWidth, h: 100, isGround: true, hasTorch: true });

    // Procedural Level Layout with Banners, Columns, and Torches
    const platformData = [
      { x: 280, y: 430, w: 180, h: 24, hasTorch: true, hasBanner: true, hasColumn: true },
      { x: 540, y: 340, w: 220, h: 24, hasTorch: false, hasColumn: true },
      { x: 840, y: 420, w: 180, h: 24, hasTorch: true, hasColumn: true },
      { x: 1100, y: 310, w: 240, h: 24, hasTorch: false, hasBanner: true, hasColumn: true },
      { x: 1420, y: 400, w: 200, h: 24, hasTorch: true, hasColumn: true },
      { x: 1720, y: 300, w: 240, h: 24, hasTorch: false, hasColumn: true },
      { x: 2060, y: 410, w: 220, h: 24, hasTorch: true, hasBanner: true, hasColumn: true },
      { x: 2400, y: 320, w: 260, h: 24, hasTorch: false, hasColumn: true },
      { x: 2750, y: 420, w: 320, h: 24, hasTorch: true, hasBanner: true, hasColumn: true },
    ];
    platformData.forEach(p => this.platforms.push(p));

    // Regular stage enemies
    this.enemies.push(
      this.createEnemy('grunt', 420, 480, 280, 600),
      this.createEnemy('archer', 580, 280, 550, 740),
      this.createEnemy('flying_akvan', 950, 220, 800, 1200),
      this.createEnemy('grunt', 1250, 480, 1100, 1500),
      this.createEnemy('archer', 1780, 240, 1730, 1940),
      this.createEnemy('flying_akvan', 2150, 230, 2000, 2350),
      this.createEnemy('grunt', 2450, 480, 2300, 2650),
      this.createChapterBoss(2850, 400, this.stage.id)
    );

    this.platforms.push({ x: 3180, y: 430, w: 70, h: 120, isGate: true });

    // Seed initial collectibles
    for (let i = 0; i < 22; i++) {
      this.collectibles.push({
        id: i,
        x: 250 + i * 135,
        y: 280 + Math.sin(i * 1.5) * 140,
        type: i % 5 === 0 ? 'gem' : i % 8 === 7 ? 'noshdaru' : 'gold',
        value: i % 5 === 0 ? 3 : i % 8 === 7 ? 40 : 20,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    if (this.graphicsTier === 'ultra' || this.graphicsTier === 'high') {
      this.seedWeatherParticles();
    }
  }

  private seedWeatherParticles() {
    this.weatherParticles = [];
    const count = this.graphicsTier === 'ultra' ? 45 : 20;
    const isFire = this.stage.id === 2 || this.stage.id === 5;
    const isFrost = this.stage.id === 3;

    for (let i = 0; i < count; i++) {
      this.weatherParticles.push({
        x: Math.random() * 1200,
        y: Math.random() * 650,
        vx: isFire ? (Math.random() - 0.5) * 30 : isFrost ? (Math.random() - 0.5) * 40 : 25,
        vy: isFire ? -(Math.random() * 50 + 20) : isFrost ? Math.random() * 40 + 20 : 10,
        size: Math.random() * 3 + 1,
        color: isFire ? '#f97316' : isFrost ? '#e0f2fe' : '#fbbf24',
        alpha: Math.random() * 0.7 + 0.3,
      });
    }
  }

  private createEnemy(type: 'grunt' | 'archer' | 'flying_akvan', x: number, y: number, pLeft: number, pRight: number): Enemy {
    const isFlying = type === 'flying_akvan';
    return {
      id: Math.random(),
      type,
      x,
      y,
      vx: isFlying ? 1.8 : 1.2,
      vy: 0,
      width: isFlying ? 44 : 36,
      height: isFlying ? 40 : 54,
      hp: type === 'grunt' ? 65 : type === 'archer' ? 45 : 80,
      maxHp: type === 'grunt' ? 65 : type === 'archer' ? 45 : 80,
      damage: type === 'grunt' ? 14 : type === 'archer' ? 12 : 18,
      facing: -1,
      patrolLeft: pLeft,
      patrolRight: pRight,
      attackCooldown: 0,
      isAttacking: false,
      isHit: false,
      hitTimer: 0,
    };
  }

  private createChapterBoss(x: number, y: number, stageId: number): Enemy {
    const hpMap: Record<number, number> = { 1: 350, 2: 500, 3: 750, 4: 900, 5: 1100, 6: 1350, 7: 1600 };
    const dmgMap: Record<number, number> = { 1: 18, 2: 22, 3: 25, 4: 28, 5: 32, 6: 35, 7: 40 };

    const hp = hpMap[stageId] || 600;
    const damage = dmgMap[stageId] || 25;

    return {
      id: 9999,
      type: 'boss',
      bossNameKey: this.stage.bossNameKey,
      x,
      y: y - 30,
      vx: 1.1,
      vy: 0,
      width: stageId === 3 ? 80 : 70,
      height: stageId === 3 ? 105 : 92,
      hp,
      maxHp: hp,
      damage,
      facing: -1,
      patrolLeft: x - 260,
      patrolRight: x + 160,
      attackCooldown: 2,
      isAttacking: false,
      isHit: false,
      hitTimer: 0,
      isBoss: true,
    };
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    sound.startBgBeat();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    sound.stopBgBeat();
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    if (this.isPaused) sound.stopBgBeat();
    else {
      sound.startBgBeat();
      this.lastTime = performance.now();
    }
    return this.isPaused;
  }

  public respawnPlayer() {
    this.player.hp = Math.floor(this.player.maxHp * 0.65);
    this.player.isInvulnerable = true;
    this.player.invulnTimer = 2.5;
    this.spawnParticles(this.player.x, this.player.y, '#f59e0b', 25);
    sound.playVictory();
  }

  private loop = (timestamp: number) => {
    if (!this.isRunning) return;

    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const dt = Math.min(rawDt, 0.05);

    // Cinematic Hit-Stop impact frame freeze
    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dt;
      this.render();
      this.animFrameId = requestAnimationFrame(this.loop);
      return;
    }

    if (!this.isPaused) {
      this.update(dt);
    }
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.player.animFrame += dt * 10;

    // Check narrative milestones
    const lore = SHAHNAMEH_LORE['fa']?.[this.stage.id];
    if (lore) {
      if (!this.narrativePassed.start && this.player.x > 300) {
        this.narrativePassed.start = true;
        this.onNarrativeMilestone(lore.battleStartSubtitle);
      } else if (!this.narrativePassed.mid && this.player.x > 1500) {
        this.narrativePassed.mid = true;
        this.onNarrativeMilestone(lore.battleMidSubtitle);
      } else if (!this.narrativePassed.boss && this.player.x > 2600) {
        this.narrativePassed.boss = true;
        this.onNarrativeMilestone(lore.bossConfrontationSubtitle);
      }
    }

    // Combo Timers update
    if (this.comboResetTimer > 0) {
      this.comboResetTimer -= dt;
      if (this.comboResetTimer <= 0) this.comboStep = 0;
    }

    if (this.comboDecayTimer > 0) {
      this.comboDecayTimer -= dt;
      if (this.comboDecayTimer <= 0) {
        this.currentComboCount = 0;
        this.onComboUpdate(0, 1.0);
      }
    }

    // Horizontal Movement
    const speed = this.hero.speed * 60;
    if (this.input.left) {
      this.player.vx = -speed;
      this.player.facing = -1;
    } else if (this.input.right) {
      this.player.vx = speed;
      this.player.facing = 1;
    } else {
      this.player.vx *= 0.8;
      if (Math.abs(this.player.vx) < 1) this.player.vx = 0;
    }

    // Jump Input
    if (this.input.jump && !this.prevJump) {
      if (this.player.isGrounded) {
        this.player.vy = -this.hero.jumpForce * 36;
        this.player.isGrounded = false;
        this.player.jumpCount = 1;
        sound.playJump();
        if (this.graphicsTier !== 'low') {
          this.spawnParticles(this.player.x + this.player.w / 2, this.player.y + this.player.h, '#94a3b8', 6);
        }
      } else if (this.player.jumpCount < this.player.maxJumps) {
        this.player.vy = -this.hero.jumpForce * 32;
        this.player.jumpCount++;
        sound.playJump();
        if (this.graphicsTier !== 'low') {
          this.spawnParticles(this.player.x + this.player.w / 2, this.player.y + this.player.h, '#38bdf8', 10);
        }
      }
    }
    this.prevJump = this.input.jump;

    // Gravity
    this.player.vy += 980 * dt;
    if (this.player.vy > 800) this.player.vy = 800;

    this.player.x += this.player.vx * dt;
    this.checkPlatformCollisionX();

    this.player.y += this.player.vy * dt;
    this.checkPlatformCollisionY();

    // Spawn running dust puffs on ground in high/ultra tiers
    if (
      this.player.isGrounded &&
      Math.abs(this.player.vx) > 130 &&
      Math.random() < 0.28 &&
      this.graphicsTier !== 'low'
    ) {
      this.spawnParticles(
        this.player.x + (this.player.facing === 1 ? -4 : this.player.w + 4),
        this.player.y + this.player.h - 2,
        '#94a3b8',
        2
      );
    }

    if (this.player.x < 10) this.player.x = 10;
    if (this.player.x > this.worldWidth - this.player.w - 10) {
      this.player.x = this.worldWidth - this.player.w - 10;
    }

    if (this.player.y > this.worldHeight + 100) {
      this.takePlayerDamage(40);
      this.player.x = Math.max(100, this.player.x - 200);
      this.player.y = 350;
      this.player.vy = 0;
    }

    // Combo Attack Key J
    if (this.input.attack && !this.prevAttack && this.player.attackTimer <= 0) {
      this.executeComboAttack();
    }
    this.prevAttack = this.input.attack;

    // Quick Attack Key K
    if (this.input.quickAttack && !this.prevQuickAttack && this.player.attackTimer <= 0) {
      if (this.hero.id === 'gordafarid') {
        sound.playArrow();
        this.projectiles.push({
          x: this.player.facing === 1 ? this.player.x + this.player.w + 10 : this.player.x - 10,
          y: this.player.y + this.player.h * 0.4,
          vx: this.player.facing * 560,
          vy: 0,
          radius: 5,
          color: '#fbbf24',
          fromPlayer: true,
          damage: this.hero.attackPower + this.weaponBonusDamage,
          life: 2.5,
        });
        this.player.attackTimer = 0.22;
      } else {
        this.player.vx = this.player.facing * 450;
        this.player.isAttacking = true;
        this.player.attackTimer = 0.24;
        sound.playSlash(1.2);
        this.executeMeleeHit(1.2, false);
      }
    }
    this.prevQuickAttack = this.input.quickAttack;

    // Special Skill Key L
    if (this.input.special && !this.prevSpecial && this.player.specialCooldown <= 0) {
      if (this.player.rage >= 30) {
        this.player.rage -= 30;
        this.player.specialCooldown = 5.0;
        sound.playSpecial();
        this.screenShake = 12;

        if (this.hero.id === 'rostam') {
          this.spawnParticles(this.player.x, this.player.y + this.player.h, '#d97706', 40);
          this.enemies.forEach(e => {
            const dist = Math.hypot((e.x + e.width / 2) - (this.player.x + this.player.w / 2), e.y - this.player.y);
            if (dist < 340) {
              this.damageEnemy(e, 85 + this.weaponBonusDamage * 2);
              e.vy = -360;
            }
          });
          this.addFloatingText(this.player.x, this.player.y - 20, 'زمین‌لرزه تهمتن!', '#f59e0b');
        } else if (this.hero.id === 'sohrab') {
          this.player.vx = this.player.facing * 720;
          this.player.isInvulnerable = true;
          this.player.invulnTimer = 1.0;
          this.spawnParticles(this.player.x, this.player.y + this.player.h / 2, '#38bdf8', 35);
          this.enemies.forEach(e => {
            if (Math.abs(e.x - this.player.x) < 280 && Math.abs(e.y - this.player.y) < 80) {
              this.damageEnemy(e, 70 + this.weaponBonusDamage * 1.5);
            }
          });
          this.addFloatingText(this.player.x, this.player.y - 20, 'گردباد تیغ توران!', '#38bdf8');
        } else {
          this.spawnParticles(this.player.x, this.player.y - 50, '#ef4444', 30);
          for (let i = 0; i < 8; i++) {
            this.projectiles.push({
              x: this.player.x - 200 + i * 60,
              y: this.player.y - 300,
              vx: (Math.random() - 0.5) * 80,
              vy: 550,
              radius: 6,
              color: '#ef4444',
              fromPlayer: true,
              damage: 50 + this.weaponBonusDamage,
              isFire: true,
              life: 1.5,
            });
          }
          this.addFloatingText(this.player.x, this.player.y - 20, 'باران تیرهای آتشین!', '#ef4444');
        }
      } else {
        this.addFloatingText(this.player.x, this.player.y - 20, 'نیاز به ۳۰٪ فرّه ایزدی!', '#94a3b8');
      }
    }
    this.prevSpecial = this.input.special;

    // Parry / Deflect Key C / Mobile Button
    if (this.input.parry && !this.prevParry && this.player.parryTimer <= 0) {
      this.player.isParrying = true;
      this.player.parryTimer = 0.35;
      sound.playSlash(1.5);
      this.spawnParticles(this.player.x + (this.player.facing === 1 ? this.player.w : 0), this.player.y + this.player.h / 2, '#38bdf8', 8);
    }
    this.prevParry = !!this.input.parry;

    if (this.player.parryTimer > 0) {
      this.player.parryTimer -= dt;
      if (this.player.parryTimer <= 0) this.player.isParrying = false;
    }

    if (this.player.attackTimer > 0) {
      this.player.attackTimer -= dt;
      if (this.player.attackTimer <= 0) this.player.isAttacking = false;
    }
    if (this.player.invulnTimer > 0) {
      this.player.invulnTimer -= dt;
      if (this.player.invulnTimer <= 0) this.player.isInvulnerable = false;
    }
    if (this.player.specialCooldown > 0) {
      this.player.specialCooldown -= dt;
    }

    // Weather Particles Simulation (Ultra & High)
    if (this.graphicsTier === 'ultra' || this.graphicsTier === 'high') {
      this.weatherParticles.forEach(wp => {
        wp.x += wp.vx * dt;
        wp.y += wp.vy * dt;
        if (wp.y < 0) wp.y = 650;
        if (wp.y > 650) wp.y = 0;
        if (wp.x < 0) wp.x = 1200;
        if (wp.x > 1200) wp.x = 0;
      });
    }

    // Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;

      if (p.life <= 0 || p.x < 0 || p.x > this.worldWidth || p.y > this.worldHeight) {
        this.projectiles.splice(i, 1);
        continue;
      }

      if (p.fromPlayer) {
        for (const enemy of this.enemies) {
          if (
            p.x > enemy.x &&
            p.x < enemy.x + enemy.width &&
            p.y > enemy.y &&
            p.y < enemy.y + enemy.height
          ) {
            this.damageEnemy(enemy, p.damage);
            this.spawnParticles(p.x, p.y, p.color, this.graphicsTier === 'low' ? 3 : 8);
            this.projectiles.splice(i, 1);
            break;
          }
        }
      } else {
        if (
          !this.player.isInvulnerable &&
          p.x > this.player.x &&
          p.x < this.player.x + this.player.w &&
          p.y > this.player.y &&
          p.y < this.player.y + this.player.h
        ) {
          this.takePlayerDamage(p.damage);
          this.spawnParticles(p.x, p.y, '#ef4444', this.graphicsTier === 'low' ? 3 : 8);
          this.projectiles.splice(i, 1);
        }
      }
    }

    // Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      this.updateEnemy(enemy, dt);

      if (enemy.hp <= 0) {
        const comboMultiplier = 1.0 + Math.min(1.5, Math.floor(this.currentComboCount / 3) * 0.25);
        this.stageScore += Math.round((enemy.isBoss ? 2500 : 160) * comboMultiplier);
        this.stageGoldEarned += Math.round((enemy.isBoss ? 250 : 30) * comboMultiplier);
        if (enemy.isBoss) this.stageGemsEarned += 10;

        this.collectibles.push({
          id: Math.random(),
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height / 2,
          type: enemy.isBoss ? 'gem' : 'gold',
          value: enemy.isBoss ? 5 : 20,
          collected: false,
          bobOffset: 0,
        });

        this.spawnParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#d97706', enemy.isBoss ? (this.graphicsTier === 'ultra' ? 80 : 50) : 18);
        sound.playHit();
        this.enemies.splice(i, 1);
        continue;
      }

      if (
        !this.player.isInvulnerable &&
        this.player.x < enemy.x + enemy.width &&
        this.player.x + this.player.w > enemy.x &&
        this.player.y < enemy.y + enemy.height &&
        this.player.y + this.player.h > enemy.y
      ) {
        this.takePlayerDamage(enemy.damage);
        this.player.vx = (this.player.x < enemy.x ? -1 : 1) * 280;
        this.player.vy = -200;
        this.currentComboCount = 0;
        this.onComboUpdate(0, 1.0);
      }
    }

    // Collectibles
    this.collectibles.forEach(c => {
      if (!c.collected) {
        const dist = Math.hypot((c.x) - (this.player.x + this.player.w / 2), (c.y) - (this.player.y + this.player.h / 2));
        if (dist < 45) {
          c.collected = true;
          sound.playCoin();
          const mult = 1.0 + Math.min(1.5, Math.floor(this.currentComboCount / 3) * 0.25);
          if (c.type === 'gold') {
            const added = Math.round(c.value * mult);
            this.stageGoldEarned += added;
            this.addFloatingText(c.x, c.y, `+${added} زر`, '#fbbf24');
          } else if (c.type === 'gem') {
            this.stageGemsEarned += c.value;
            this.addFloatingText(c.x, c.y, `+${c.value} گوهر`, '#38bdf8');
          } else if (c.type === 'noshdaru') {
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + c.value);
            this.addFloatingText(c.x, c.y, `+${c.value} نوشدارو`, '#10b981');
          }
          this.spawnParticles(c.x, c.y, '#fbbf24', this.graphicsTier === 'low' ? 4 : 12);
        }
      }
    });

    // Check Victory Gate
    const gate = this.platforms.find(p => p.isGate);
    const bossesRemaining = this.enemies.filter(e => e.isBoss).length;
    if (gate && bossesRemaining === 0) {
      if (
        this.player.x + this.player.w > gate.x &&
        this.player.x < gate.x + gate.w &&
        this.player.y + this.player.h > gate.y
      ) {
        this.stop();
        sound.playVictory();
        this.onVictory(this.stageScore + 1200, this.stageGoldEarned + this.stage.goldReward, this.stageGemsEarned + this.stage.gemReward);
        return;
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life += dt;
      if (pt.isRing && pt.ringRadius !== undefined) {
        pt.ringRadius += 190 * dt;
      }
      pt.alpha = Math.max(0, 1 - pt.life / pt.maxLife);
      if (pt.life >= pt.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Floating text
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y += ft.vy * dt;
      ft.life += dt;
      if (ft.life >= ft.maxLife) {
        this.floatTexts.splice(i, 1);
      }
    }

    const targetCamX = this.player.x - this.canvas.width / 2 + this.player.w / 2;
    this.cameraX += (targetCamX - this.cameraX) * 0.1;
    this.cameraX = Math.max(0, Math.min(this.worldWidth - this.canvas.width, this.cameraX));

    if (this.screenShake > 0) {
      this.screenShake *= 0.88;
      if (this.screenShake < 0.2) this.screenShake = 0;
    }

    const boss = this.enemies.find(e => e.isBoss);
    this.onStatsUpdate(
      Math.max(0, Math.round(this.player.hp)),
      this.player.maxHp,
      Math.round(this.player.rage),
      this.stageGoldEarned,
      this.stageGemsEarned,
      boss ? boss.hp : undefined,
      boss ? boss.maxHp : undefined
    );
  }

  private executeComboAttack() {
    this.player.isAttacking = true;
    this.comboResetTimer = 0.85;
    this.comboDecayTimer = 2.8;

    if (this.comboStep === 0) {
      this.player.attackTimer = 0.22;
      sound.playSlash(1.0);
      this.executeMeleeHit(1.0, false);
      this.comboStep = 1;
    } else if (this.comboStep === 1) {
      this.player.attackTimer = 0.24;
      sound.playSlash(1.3);
      this.executeMeleeHit(1.25, false);
      this.comboStep = 2;
    } else {
      this.player.attackTimer = 0.32;
      sound.playComboFinisher();
      this.screenShake = 14;

      this.spawnShockwave(
        this.player.x + (this.player.facing === 1 ? this.player.w + 25 : -25),
        this.player.y + this.player.h / 2
      );

      this.executeMeleeHit(1.85, true);
      this.onFinisherLanded();
      this.comboStep = 0;
    }
  }

  private executeMeleeHit(multiplier: number, isFinisher: boolean) {
    const attackBox = {
      x: this.player.facing === 1 ? this.player.x + this.player.w : this.player.x - 85,
      y: this.player.y - 12,
      w: 90,
      h: this.player.h + 24,
    };

    let hitCount = 0;
    this.enemies.forEach(e => {
      if (
        attackBox.x < e.x + e.width &&
        attackBox.x + attackBox.w > e.x &&
        attackBox.y < e.y + e.height &&
        attackBox.y + attackBox.h > e.y
      ) {
        const baseDmg = (this.hero.attackPower + this.weaponBonusDamage) * multiplier;
        const isCrit = isFinisher || Math.random() < 0.2;
        const totalDmg = Math.round(isCrit ? baseDmg * 1.5 : baseDmg);

        this.damageEnemy(e, totalDmg, isCrit);
        hitCount++;

        this.player.rage = Math.min(this.player.maxRage, this.player.rage + (isFinisher ? 15 : 6));

        if (isFinisher) {
          this.hitStopTimer = 0.07; // 70ms cinematic impact crunch
          e.vx = this.player.facing * 520;
          e.vy = -340;
          this.addFloatingText(e.x + e.width / 2, e.y - 25, 'فینیشر پرتاب‌کننده!', '#f59e0b');
        } else if (e.isBoss) {
          this.hitStopTimer = 0.04;
          e.vx = this.player.facing * 180;
        } else {
          e.vx = this.player.facing * 180;
        }
      }
    });

    if (hitCount > 0) {
      this.currentComboCount += hitCount;
      const multiplierVal = 1.0 + Math.min(1.5, Math.floor(this.currentComboCount / 3) * 0.25);
      this.onComboUpdate(this.currentComboCount, multiplierVal);

      if (this.graphicsTier !== 'low') {
        this.spawnParticles(
          this.player.facing === 1 ? this.player.x + this.player.w + 20 : this.player.x - 20,
          this.player.y + this.player.h / 2,
          isFinisher ? '#f59e0b' : '#38bdf8',
          isFinisher ? (this.graphicsTier === 'ultra' ? 30 : 20) : 10
        );
      }
    }
  }

  private damageEnemy(e: Enemy, dmg: number, isCrit: boolean = false) {
    e.hp -= dmg;
    e.isHit = true;
    e.hitTimer = 0.2;
    sound.playHit();

    this.addFloatingText(
      e.x + e.width / 2,
      e.y - 10,
      `${isCrit ? 'ضربت کاری! ' : ''}${dmg}`,
      isCrit ? '#ef4444' : '#fbbf24'
    );
  }

  private takePlayerDamage(rawDamage: number) {
    if (this.player.isParrying) {
      sound.playParrySuccess();
      this.screenShake = 8;
      this.spawnParticles(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, '#fbbf24', 25);
      this.addFloatingText(this.player.x + this.player.w / 2, this.player.y - 25, 'دفع برق‌آسا (Parry)!', '#fbbf24');
      this.currentComboCount += 2;
      this.player.rage = Math.min(this.player.maxRage, this.player.rage + 15);
      // Stagger nearby enemies
      this.enemies.forEach(e => {
        if (Math.abs(e.x - this.player.x) < 200) {
          e.hitTimer = 0.8;
          e.isHit = true;
          e.vx = (e.x > this.player.x ? 1 : -1) * 220;
        }
      });
      return;
    }

    const reducedDmg = Math.max(4, Math.round(rawDamage * (1 - this.armorDamageReduction)));
    this.player.hp -= reducedDmg;
    this.player.isInvulnerable = true;
    this.player.invulnTimer = 1.0;
    this.screenShake = 10;
    sound.playHit();

    this.addFloatingText(
      this.player.x + this.player.w / 2,
      this.player.y - 15,
      `-${reducedDmg}`,
      '#ef4444'
    );

    if (this.player.hp <= 0) {
      if (this.hasSimurghFeather && !this.simurghRevived) {
        this.simurghRevived = true;
        this.player.hp = Math.round(this.player.maxHp * 0.5);
        this.player.isInvulnerable = true;
        this.player.invulnTimer = 2.5;
        this.spawnParticles(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, '#fbbf24', 50);
        sound.playSimurghAura();
        this.addFloatingText(this.player.x + this.player.w / 2, this.player.y - 35, 'پر سیمرغ: احیای تهمتن!', '#fef08a');
        return;
      }
      this.player.hp = 0;
      this.stop();
      sound.playDefeat();
      this.onGameOver(this.stageScore, this.stageGoldEarned, this.stageGemsEarned);
    }
  }

  private checkPlatformCollisionX() {
    for (const p of this.platforms) {
      if (p.isGate) continue;
      if (this.player.y + this.player.h > p.y && this.player.y < p.y + p.h) {
        if (this.player.vx > 0 && this.player.x + this.player.w >= p.x && this.player.x < p.x) {
          this.player.x = p.x - this.player.w;
          this.player.vx = 0;
        } else if (this.player.vx < 0 && this.player.x <= p.x + p.w && this.player.x + this.player.w > p.x + p.w) {
          this.player.x = p.x + p.w;
          this.player.vx = 0;
        }
      }
    }
  }

  private checkPlatformCollisionY() {
    this.player.isGrounded = false;
    for (const p of this.platforms) {
      if (p.isGate) continue;
      if (
        this.player.x + this.player.w > p.x &&
        this.player.x < p.x + p.w &&
        this.player.y + this.player.h >= p.y &&
        this.player.y + this.player.h <= p.y + 25 &&
        this.player.vy >= 0
      ) {
        this.player.y = p.y - this.player.h;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.jumpCount = 0;
        return;
      }
    }
  }

  private updateEnemy(e: Enemy, dt: number) {
    if (e.hitTimer > 0) {
      e.hitTimer -= dt;
      if (e.hitTimer <= 0) e.isHit = false;
    }

    if (e.type === 'flying_akvan') {
      e.x += e.vx * e.facing * 50 * dt;
      e.y += Math.sin(performance.now() * 0.003 + e.id) * 40 * dt;
      if (e.x < e.patrolLeft) e.facing = 1;
      else if (e.x > e.patrolRight) e.facing = -1;

      e.attackCooldown -= dt;
      if (e.attackCooldown <= 0) {
        e.attackCooldown = 2.8;
        const dx = (this.player.x + this.player.w / 2) - (e.x + e.width / 2);
        const dy = (this.player.y + this.player.h / 2) - (e.y + e.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < 460) {
          sound.playArrow();
          this.projectiles.push({
            x: e.x + e.width / 2,
            y: e.y + e.height / 2,
            vx: (dx / dist) * 260,
            vy: (dy / dist) * 260,
            radius: 7,
            color: '#a855f7',
            fromPlayer: false,
            damage: e.damage,
            life: 3.5,
          });
        }
      }
      return;
    }

    if (e.isBoss) {
      e.attackCooldown -= dt;
      e.x += e.vx * e.facing * 45 * dt;

      if (e.x < e.patrolLeft) e.facing = 1;
      if (e.x > e.patrolRight) e.facing = -1;

      if (this.player.x < e.x) e.facing = -1;
      else e.facing = 1;

      if (e.attackCooldown <= 0) {
        e.attackCooldown = 3.2;
        sound.playMaceSmash();
        this.screenShake = 14;

        for (let i = 0; i < 3; i++) {
          this.projectiles.push({
            x: e.x + (e.facing === 1 ? e.width : 0),
            y: e.y + 30,
            vx: e.facing * (280 + i * 80),
            vy: -150 - i * 60,
            radius: 12,
            color: this.stage.id === 2 ? '#dc2626' : this.stage.id === 5 ? '#f97316' : '#93c5fd',
            fromPlayer: false,
            damage: e.damage,
            life: 3,
          });
        }
        if (this.graphicsTier !== 'low') {
          this.spawnParticles(e.x + e.width / 2, e.y + e.height, '#60a5fa', 25);
        }
      }
      return;
    }

    e.x += e.vx * e.facing * 50 * dt;
    if (e.x < e.patrolLeft) e.facing = 1;
    if (e.x > e.patrolRight) e.facing = -1;

    if (e.type === 'archer') {
      e.attackCooldown -= dt;
      if (e.attackCooldown <= 0) {
        const distToPlayer = Math.abs(this.player.x - e.x);
        if (distToPlayer < 400) {
          e.attackCooldown = 3.0;
          e.facing = this.player.x < e.x ? -1 : 1;
          sound.playArrow();
          this.projectiles.push({
            x: e.x + (e.facing === 1 ? e.width : 0),
            y: e.y + 20,
            vx: e.facing * 340,
            vy: -30,
            radius: 5,
            color: '#dc2626',
            fromPlayer: false,
            damage: e.damage,
            life: 2.5,
          });
        }
      }
    }
  }

  private spawnShockwave(x: number, y: number) {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: this.graphicsTier === 'ultra' ? 6 : 4,
      color: '#f59e0b',
      alpha: 1,
      life: 0,
      maxLife: 0.45,
      isRing: true,
      ringRadius: 10,
    });
  }

  private spawnParticles(x: number, y: number, color: string, count: number) {
    if (this.graphicsTier === 'low') count = Math.max(2, Math.floor(count * 0.3));
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 180 + 30;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 0.4 + 0.3,
      });
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string) {
    this.floatTexts.push({
      x,
      y,
      text,
      color,
      life: 0,
      maxLife: 1.2,
      vy: -40,
    });
  }

  // RENDER PIPELINE WITH 4 GRAPHICS TIERS
  private render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.save();

    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    ctx.clearRect(0, 0, w, h);

    // Parallax background
    this.renderParallaxBackground(ctx, w, h);

    // Camera space
    ctx.save();
    ctx.translate(-Math.round(this.cameraX), 0);

    this.renderPlatforms(ctx);
    this.renderCollectibles(ctx);
    this.renderEnemies(ctx);
    this.renderPlayer(ctx);
    this.renderProjectiles(ctx);
    this.renderParticles(ctx);
    this.renderFloatingText(ctx);

    ctx.restore();

    // Foreground Weather Particles in Ultra & High
    if (this.graphicsTier === 'ultra' || this.graphicsTier === 'high') {
      this.renderWeatherParticles(ctx);
    }

    ctx.restore();
  }

  private renderParallaxBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const isUltra = this.graphicsTier === 'ultra';
    const isHigh = this.graphicsTier === 'high';
    const time = performance.now() * 0.001;

    // Layer 1: Grand Celestial Sky & Atmosphere
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, this.stage.bgGradient[0]);
    skyGrad.addColorStop(0.7, this.stage.bgGradient[1]);
    skyGrad.addColorStop(1, '#05070f');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Celestial Body (Sun / Moon)
    const moonX = w * 0.72 - this.cameraX * 0.04;
    const moonY = 110;
    const isFireStage = this.stage.id === 2 || this.stage.id === 5;

    // Radial Celestial Corona
    const moonGrad = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 95);
    moonGrad.addColorStop(0, isFireStage ? '#ffedd5' : '#fef08a');
    moonGrad.addColorStop(0.3, isFireStage ? '#f97316' : '#f59e0b');
    moonGrad.addColorStop(0.7, isFireStage ? 'rgba(220, 38, 38, 0.25)' : 'rgba(217, 119, 6, 0.2)');
    moonGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 95, 0, Math.PI * 2);
    ctx.fill();

    // Solid Orb Core
    ctx.fillStyle = isFireStage ? '#ffedd5' : '#fffbeb';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 26, 0, Math.PI * 2);
    ctx.fill();

    // Volumetric God-Rays in High & Ultra Tiers
    if (isHigh || isUltra) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const rayAngles = [-0.55, -0.35, -0.15, 0.1, 0.3, 0.5];
      rayAngles.forEach((angle, idx) => {
        const rayGrad = ctx.createLinearGradient(moonX, moonY, moonX + Math.sin(angle) * 600, moonY + Math.cos(angle) * 600);
        const rayAlpha = (isUltra ? 0.09 : 0.05) + Math.sin(time * 0.8 + idx) * 0.02;
        rayGrad.addColorStop(0, `rgba(254, 240, 138, ${rayAlpha * 1.5})`);
        rayGrad.addColorStop(0.6, `rgba(245, 158, 11, ${rayAlpha})`);
        rayGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(moonX - 10, moonY - 10);
        ctx.lineTo(moonX + Math.sin(angle - 0.08) * 700, moonY + Math.cos(angle - 0.08) * 700);
        ctx.lineTo(moonX + Math.sin(angle + 0.08) * 700, moonY + Math.cos(angle + 0.08) * 700);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    }

    // Low Tier: Streamlined Single Mountain Ridge
    if (this.graphicsTier === 'low') {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w + 200; x += 180) {
        ctx.lineTo(x, 360 + Math.sin(x * 0.02) * 60);
      }
      ctx.lineTo(w, h);
      ctx.fill();
      return;
    }

    // Layer 2: Mighty Alborz Range & Mount Damavand (Parallax Factor: 0.09)
    const mtnOffset = -this.cameraX * 0.09;
    ctx.fillStyle = isFireStage ? '#1c0808' : '#14142b';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 240; x += 160) {
      const peakX = x + (mtnOffset % 160);
      const peakY = 240 + Math.sin(x * 0.015) * 80;
      ctx.lineTo(peakX, peakY);
      ctx.lineTo(peakX + 80, peakY + 70);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Mount Damavand Conical Summit with Snow Mantle
    const damavandX = ((w * 0.46 + mtnOffset) % (w + 400)) - 80;
    const damavandY = 175;
    const damavandW = 260;

    // Mountain Body
    ctx.fillStyle = isFireStage ? '#280c0c' : '#1b1b38';
    ctx.beginPath();
    ctx.moveTo(damavandX - damavandW / 2, h);
    ctx.lineTo(damavandX, damavandY);
    ctx.lineTo(damavandX + damavandW / 2, h);
    ctx.closePath();
    ctx.fill();

    // Damavand Snowy Cap
    ctx.fillStyle = isFireStage ? '#fca5a5' : '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(damavandX - 38, damavandY + 55);
    ctx.lineTo(damavandX, damavandY);
    ctx.lineTo(damavandX + 38, damavandY + 55);
    ctx.lineTo(damavandX + 18, damavandY + 45);
    ctx.lineTo(damavandX, damavandY + 52);
    ctx.lineTo(damavandX - 18, damavandY + 45);
    ctx.closePath();
    ctx.fill();

    // Ascending Sulfur Vapor / Mist Plume from Damavand Crater in High/Ultra
    if (isHigh || isUltra) {
      const vaporY = damavandY - 14 + Math.sin(time * 2) * 4;
      ctx.fillStyle = 'rgba(241, 245, 249, 0.12)';
      ctx.beginPath();
      ctx.arc(damavandX, vaporY, 14, 0, Math.PI * 2);
      ctx.arc(damavandX + 8, vaporY - 12, 20, 0, Math.PI * 2);
      ctx.arc(damavandX - 6, vaporY - 22, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    // Golden Simurgh (سیمرغ) Soaring Silhouetted in Distance
    const simurghX = ((w * 0.65 - this.cameraX * 0.05 + time * 35) % (w + 300)) - 100;
    const simurghY = 135 + Math.sin(time * 1.5) * 18;
    const wingFlap = Math.sin(time * 3.5) * 12;

    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = isUltra ? 8 : 0;
    // Simurgh Body
    ctx.beginPath();
    ctx.ellipse(simurghX, simurghY, 11, 4, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Simurgh Wings
    ctx.beginPath();
    ctx.moveTo(simurghX - 4, simurghY);
    ctx.quadraticCurveTo(simurghX, simurghY - 18 + wingFlap, simurghX + 16, simurghY - 24 + wingFlap);
    ctx.quadraticCurveTo(simurghX + 6, simurghY - 8, simurghX + 4, simurghY);
    ctx.fill();
    // Simurgh Flowing Tail Feathers
    ctx.beginPath();
    ctx.moveTo(simurghX - 10, simurghY);
    ctx.quadraticCurveTo(simurghX - 22, simurghY + 6, simurghX - 32 + Math.sin(time * 3) * 6, simurghY + 12);
    ctx.quadraticCurveTo(simurghX - 20, simurghY + 4, simurghX - 8, simurghY + 2);
    ctx.fill();
    ctx.restore();

    // Layer 3: Ancient Persian Fortresses & Persepolis Pillars (Parallax Factor: 0.24)
    const midOffset = -this.cameraX * 0.24;
    ctx.fillStyle = isFireStage ? '#130404' : '#0b0f19';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 130) {
      const peakX = x + (midOffset % 130);
      const peakY = 360 + Math.cos(x * 0.02) * 45;
      ctx.lineTo(peakX, peakY);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Persepolis Columns (تخت جمشید) & Achaemenid Fortress Merlons (کنگره‌ها)
    const pillarCount = 6;
    for (let pIdx = 0; pIdx < pillarCount; pIdx++) {
      const colX = ((pIdx * 280 + midOffset * 0.8) % (w + 400)) - 60;
      const colBaseY = 460;
      const colHeight = 110;

      // Fortress Wall Crenellations
      ctx.fillStyle = '#090d16';
      ctx.fillRect(colX - 40, colBaseY - colHeight + 35, 80, 16);
      for (let merlon = 0; merlon < 4; merlon++) {
        ctx.fillRect(colX - 35 + merlon * 20, colBaseY - colHeight + 25, 12, 12);
      }

      // Persepolis Column Shaft (Fluted)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(colX - 7, colBaseY - colHeight + 45, 14, colHeight - 45);

      // Fluting Lines
      ctx.fillStyle = '#334155';
      ctx.fillRect(colX - 4, colBaseY - colHeight + 45, 2, colHeight - 45);
      ctx.fillRect(colX + 2, colBaseY - colHeight + 45, 2, colHeight - 45);

      // Double-Bull Column Capital (سرستون تخت جمشید)
      ctx.fillStyle = '#475569';
      ctx.fillRect(colX - 16, colBaseY - colHeight + 38, 32, 8);
      // Left Bull Head
      ctx.beginPath();
      ctx.moveTo(colX - 16, colBaseY - colHeight + 38);
      ctx.lineTo(colX - 22, colBaseY - colHeight + 30);
      ctx.lineTo(colX - 10, colBaseY - colHeight + 36);
      ctx.fill();
      // Right Bull Head
      ctx.beginPath();
      ctx.moveTo(colX + 16, colBaseY - colHeight + 38);
      ctx.lineTo(colX + 22, colBaseY - colHeight + 30);
      ctx.lineTo(colX + 10, colBaseY - colHeight + 36);
      ctx.fill();
    }

    // Layer 4: Floating Atmospheric Fog & Golden Motes (High & Ultra)
    if (isHigh || isUltra) {
      ctx.fillStyle = isFireStage ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.04)';
      const cloudTime = time * 20;
      for (let i = 0; i < 5; i++) {
        const cx = ((i * 300 + cloudTime - this.cameraX * 0.32) % (w + 400)) - 100;
        const cy = 200 + i * 36;
        ctx.beginPath();
        ctx.arc(cx, cy, 65, 0, Math.PI * 2);
        ctx.arc(cx + 55, cy - 8, 80, 0, Math.PI * 2);
        ctx.arc(cx + 110, cy + 2, 55, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private renderPlatforms(ctx: CanvasRenderingContext2D) {
    const isUltra = this.graphicsTier === 'ultra';
    const isHigh = this.graphicsTier === 'high';
    const time = performance.now() * 0.001;

    this.platforms.forEach(p => {
      if (p.x + p.w < this.cameraX - 100 || p.x > this.cameraX + this.canvas.width + 100) return;

      // Gate of Conquest (دروازه فتح شاهنامه با نشان زرین فروهر)
      if (p.isGate) {
        // Portal Stone Pilasters
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // Mystical Threshold Glow Portal
        const portalGrad = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
        portalGrad.addColorStop(0, '#090d16');
        portalGrad.addColorStop(0.5, '#1e3a8a');
        portalGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = portalGrad;
        ctx.beginPath();
        ctx.arc(p.x + p.w / 2, p.y + 36, 26, Math.PI, 0, false);
        ctx.lineTo(p.x + p.w - 8, p.y + p.h);
        ctx.lineTo(p.x + 8, p.y + p.h);
        ctx.closePath();
        ctx.fill();

        // Sculpted Faravahar (فروهر) Winged Sun Emblem atop Archway
        const archTopX = p.x + p.w / 2;
        const archTopY = p.y - 18;
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;

        // Center Faravahar Ring
        ctx.beginPath();
        ctx.arc(archTopX, archTopY, 9, 0, Math.PI * 2);
        ctx.stroke();

        // Left Feathered Wing
        ctx.beginPath();
        ctx.moveTo(archTopX - 9, archTopY);
        ctx.quadraticCurveTo(archTopX - 22, archTopY - 10, archTopX - 34, archTopY - 4);
        ctx.quadraticCurveTo(archTopX - 20, archTopY + 4, archTopX - 9, archTopY + 2);
        ctx.fill();
        ctx.stroke();

        // Right Feathered Wing
        ctx.beginPath();
        ctx.moveTo(archTopX + 9, archTopY);
        ctx.quadraticCurveTo(archTopX + 22, archTopY - 10, archTopX + 34, archTopY - 4);
        ctx.quadraticCurveTo(archTopX + 20, archTopY + 4, archTopX + 9, archTopY + 2);
        ctx.fill();
        ctx.stroke();

        // Threshold Runes Text
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 13px Vazirmatn, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('دروازه فتح', p.x + p.w / 2, p.y - 28);
        ctx.textAlign = 'start';
        return;
      }

      // Stone Support Pillars under floating platforms
      if (p.hasColumn && !p.isGround) {
        const pillarX1 = p.x + 28;
        const pillarX2 = p.x + p.w - 38;
        const pillarH = 140;

        [pillarX1, pillarX2].forEach(colX => {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(colX, p.y + p.h, 16, pillarH);

          // Capital & Base Trim
          ctx.fillStyle = '#334155';
          ctx.fillRect(colX - 4, p.y + p.h, 24, 6);
          ctx.fillRect(colX - 3, p.y + p.h + pillarH - 6, 22, 6);

          // Fluting Lines
          ctx.fillStyle = '#475569';
          ctx.fillRect(colX + 3, p.y + p.h + 6, 2, pillarH - 12);
          ctx.fillRect(colX + 9, p.y + p.h + 6, 2, pillarH - 12);
        });
      }

      // Base Platform Body with Stone Brick Lines
      ctx.fillStyle = this.stage.platformColor;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Chiseled Stone Shadow Bevel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(p.x, p.y + p.h - 4, p.w, 4);

      // Platform Stone Masonry Joint Lines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let bx = p.x + 60; bx < p.x + p.w - 20; bx += 70) {
        ctx.fillRect(bx, p.y + 4, 2, p.h - 8);
      }

      // Royal Gold Upper Trim
      const goldTrimGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 5);
      goldTrimGrad.addColorStop(0, '#fef08a');
      goldTrimGrad.addColorStop(0.5, '#d4af37');
      goldTrimGrad.addColorStop(1, '#92400e');
      ctx.fillStyle = goldTrimGrad;
      ctx.fillRect(p.x, p.y, p.w, 4);

      // Ultra Graphics: Persian Arabesque (اسلیمی و تذهیب) Filigree on stone edge
      if (isUltra) {
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let fx = p.x + 12; fx < p.x + p.w - 12; fx += 26) {
          ctx.arc(fx + 13, p.y + 4, 7, Math.PI, 0, true);
          ctx.moveTo(fx + 10, p.y + 4);
          ctx.lineTo(fx + 16, p.y + 4);
        }
        ctx.stroke();
      }

      // Derafsh Kaviani (درفش کاویانی) Royal Persian Banner
      if (p.hasBanner) {
        const flagPoleX = p.x + 36;
        const flagPoleY = p.y - 75;
        const flagH = 75;

        // Brass Spear-Pole
        ctx.fillStyle = '#b45309';
        ctx.fillRect(flagPoleX - 2, flagPoleY, 4, flagH);

        // Spearhead / Golden Sun Finial
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(flagPoleX, flagPoleY - 14);
        ctx.lineTo(flagPoleX + 6, flagPoleY);
        ctx.lineTo(flagPoleX - 6, flagPoleY);
        ctx.closePath();
        ctx.fill();

        // Quartered Leather/Silk Banner (Red & Purple) with Cloth Wind Ripple
        const bannerW = 48;
        const bannerH = 34;
        const startY = flagPoleY + 4;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(flagPoleX + 2, startY);

        // Upper Waving Curve
        for (let step = 0; step <= bannerW; step += 6) {
          const waveY = Math.sin(time * 5 + step * 0.14) * 4;
          ctx.lineTo(flagPoleX + 2 + step, startY + waveY);
        }

        // Right Edge with Silk Streamer Indentation
        const endWave = Math.sin(time * 5 + bannerW * 0.14) * 4;
        ctx.lineTo(flagPoleX + 2 + bannerW - 10, startY + bannerH / 2 + endWave);
        ctx.lineTo(flagPoleX + 2 + bannerW, startY + bannerH + endWave);

        // Lower Waving Curve back to pole
        for (let step = bannerW; step >= 0; step -= 6) {
          const waveY = Math.sin(time * 5 + step * 0.14) * 4;
          ctx.lineTo(flagPoleX + 2 + step, startY + bannerH + waveY);
        }
        ctx.closePath();

        // Royal Crimson & Imperial Purple Gradient
        const flagGrad = ctx.createLinearGradient(flagPoleX, startY, flagPoleX + bannerW, startY + bannerH);
        flagGrad.addColorStop(0, '#dc2626');
        flagGrad.addColorStop(0.5, '#7e22ce');
        flagGrad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = flagGrad;
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Akhtar-e Kaviani (اختر کاویانی - Four-Point Golden Star)
        const starX = flagPoleX + 18;
        const starY = startY + bannerH / 2 + Math.sin(time * 5 + 18 * 0.14) * 4;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(starX, starY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Four Star Petals
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(starX - 8, starY);
        ctx.lineTo(starX + 8, starY);
        ctx.moveTo(starX, starY - 8);
        ctx.lineTo(starX, starY + 8);
        ctx.stroke();

        // Center Turquoise Gemstone
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(starX, starY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Golden Silk Fringe
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let fStep = 0; fStep <= bannerW; fStep += 5) {
          const fWave = Math.sin(time * 5 + fStep * 0.14) * 4;
          ctx.moveTo(flagPoleX + 2 + fStep, startY + bannerH + fWave);
          ctx.lineTo(flagPoleX + 2 + fStep, startY + bannerH + fWave + 4);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Bronze Tripod Fire Cauldrons & Torches
      if (p.hasTorch && (isUltra || isHigh)) {
        const torchX = p.x + (p.hasBanner ? p.w - 30 : 25);
        const torchY = p.y - 18;

        // Bronze Tripod Legs
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(torchX - 8, p.y);
        ctx.lineTo(torchX, torchY);
        ctx.lineTo(torchX + 8, p.y);
        ctx.stroke();

        // Bronze Brazier Bowl
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(torchX, torchY, 9, 0, Math.PI, false);
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Volumetric Glow Halo in Ultra Tier
        if (isUltra) {
          const glowGrad = ctx.createRadialGradient(torchX, torchY - 6, 2, torchX, torchY - 6, 52);
          glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
          glowGrad.addColorStop(0.4, 'rgba(239, 68, 68, 0.18)');
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(torchX, torchY - 6, 52, 0, Math.PI * 2);
          ctx.fill();
        }

        // Multi-Layered Animated Living Flame
        const flameOffset1 = Math.sin(time * 12 + torchX) * 2.5;
        const flameOffset2 = Math.cos(time * 16 + torchX) * 1.5;

        // Outer Flame (Ruby / Amber)
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(torchX - 7, torchY - 2);
        ctx.quadraticCurveTo(torchX - 5 + flameOffset1, torchY - 14, torchX + flameOffset2, torchY - 22);
        ctx.quadraticCurveTo(torchX + 5 + flameOffset1, torchY - 14, torchX + 7, torchY - 2);
        ctx.closePath();
        ctx.fill();

        // Middle Flame (Vibrant Orange)
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(torchX - 5, torchY - 2);
        ctx.quadraticCurveTo(torchX - 3 + flameOffset2, torchY - 10, torchX + flameOffset1, torchY - 17);
        ctx.quadraticCurveTo(torchX + 3 + flameOffset2, torchY - 10, torchX + 5, torchY - 2);
        ctx.closePath();
        ctx.fill();

        // Inner Flame Core (Yellow-White)
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(torchX - 3, torchY - 2);
        ctx.quadraticCurveTo(torchX, torchY - 8, torchX + flameOffset2, torchY - 12);
        ctx.quadraticCurveTo(torchX, torchY - 8, torchX + 3, torchY - 2);
        ctx.closePath();
        ctx.fill();

        // Ascending Hot Embers in Ultra
        if (isUltra) {
          ctx.fillStyle = '#fbbf24';
          const emberY1 = torchY - 22 - (Math.abs(Math.sin(time * 6 + torchX)) * 22);
          const emberY2 = torchY - 26 - (Math.abs(Math.cos(time * 8 + torchX)) * 26);
          ctx.fillRect(torchX + flameOffset1 * 1.5, emberY1, 2, 2);
          ctx.fillRect(torchX - flameOffset2 * 1.5, emberY2, 1.5, 1.5);
        }
      }
    });
  }

  private renderWeatherParticles(ctx: CanvasRenderingContext2D) {
    this.weatherParticles.forEach(wp => {
      ctx.fillStyle = wp.color;
      ctx.globalAlpha = wp.alpha;
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, wp.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  private renderCollectibles(ctx: CanvasRenderingContext2D) {
    const time = performance.now() * 0.005;
    this.collectibles.forEach(c => {
      if (c.collected) return;
      if (c.x < this.cameraX - 50 || c.x > this.cameraX + this.canvas.width + 50) return;

      const bobY = c.y + Math.sin(time + c.bobOffset) * 6;

      if (c.type === 'gold') {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(c.x, bobY, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 9px Vazirmatn, sans-serif';
        ctx.fillText('زر', c.x - 5, bobY + 3);
      } else if (c.type === 'gem') {
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.moveTo(c.x, bobY - 12);
        ctx.lineTo(c.x + 10, bobY);
        ctx.lineTo(c.x, bobY + 12);
        ctx.lineTo(c.x - 10, bobY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(c.x, bobY + 3, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(c.x - 3, bobY - 9, 6, 6);
        ctx.fillStyle = '#ecfdf5';
        ctx.fillRect(c.x - 1, bobY + 1, 3, 4);
      }
    });
  }

  private renderPlayer(ctx: CanvasRenderingContext2D) {
    const p = this.player;
    const isUltra = this.graphicsTier === 'ultra';
    const isHigh = this.graphicsTier === 'high';
    const time = performance.now() * 0.001;

    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
    if (p.facing === -1) {
      ctx.scale(-1, 1);
    }

    if (p.isInvulnerable && Math.floor(performance.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    const halfW = p.w / 2;
    const halfH = p.h / 2;

    // 1. Dynamic Contact Shadow
    if (isHigh || isUltra) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, halfH + 2, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Divine Farreh Aura (هاله نورانی فرّه ایزدی)
    if (p.rage > 0) {
      const rageRatio = Math.min(1.0, p.rage / p.maxRage);
      const auraRadius = 26 + rageRatio * 20;

      // Soft Radial Farreh Glow
      const auraGrad = ctx.createRadialGradient(0, -4, 10, 0, -4, auraRadius);
      auraGrad.addColorStop(0, `rgba(254, 240, 138, ${0.15 + rageRatio * 0.35})`);
      auraGrad.addColorStop(0.6, `rgba(245, 158, 11, ${0.12 + rageRatio * 0.28})`);
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, -4, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Golden Farreh Ray Petals in High/Ultra
      if (isHigh || isUltra) {
        const rayCount = rageRatio > 0.65 ? 8 : 5;
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.25 + rageRatio * 0.45})`;
        ctx.lineWidth = 1.5;
        for (let r = 0; r < rayCount; r++) {
          const rayAngle = time * 3.0 + (r * Math.PI * 2) / rayCount;
          ctx.beginPath();
          ctx.moveTo(Math.cos(rayAngle) * 18, -4 + Math.sin(rayAngle) * 18);
          ctx.lineTo(Math.cos(rayAngle) * auraRadius, -4 + Math.sin(rayAngle) * auraRadius);
          ctx.stroke();
        }
      }
    }

    // 3. Multi-Segment Billowing Royal Cape
    ctx.fillStyle = this.hero.capeColor;
    const capeWind = Math.sin(p.animFrame * 0.8) * 8;
    const capeVelLag = (p.vx / 320) * -12;
    ctx.beginPath();
    ctx.moveTo(-8, -halfH + 14);
    ctx.quadraticCurveTo(
      -halfW - 12 + capeWind + capeVelLag,
      -halfH + 28,
      -halfW - 18 + capeWind * 1.5 + capeVelLag * 1.4,
      halfH + 4
    );
    ctx.lineTo(-halfW - 4, halfH + 2);
    ctx.quadraticCurveTo(-halfW, halfH - 12, -2, -halfH + 16);
    ctx.closePath();
    ctx.fill();

    // Cape Golden Hem Embroidery in Ultra
    if (isUltra) {
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 4. Legs & Pahlavani Boots
    ctx.fillStyle = '#1e293b';
    const legOffset = p.vx !== 0 ? Math.sin(p.animFrame) * 7 : 0;
    // Left Leg
    ctx.fillRect(-12 + legOffset, halfH - 18, 9, 18);
    // Right Leg
    ctx.fillRect(2 - legOffset, halfH - 18, 9, 18);

    // Leather Boots Trim & Knee Guards
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-13 + legOffset, halfH - 10, 11, 10);
    ctx.fillRect(1 - legOffset, halfH - 10, 11, 10);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-11 + legOffset, halfH - 11, 7, 2);
    ctx.fillRect(3 - legOffset, halfH - 11, 7, 2);

    // Dynamic Idle Breathing sway
    const idleBreath = p.vx === 0 ? Math.sin(time * 3.6) * 1.5 : 0;

    // 5. Torso & Armor (Babr-e Bayan for Rostam / Scale Mail for Sohrab)
    if (this.hero.id === 'rostam') {
      // Babr-e Bayan (ببر بیان) Tawny Tiger Pelt over Golden Chainmail
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-halfW + 4, -halfH + 14 + idleBreath, p.w - 8, halfH + 2);

      // Black Tiger Fur Stripes on Cuirass
      ctx.fillStyle = '#18181b';
      for (let s = 0; s < 4; s++) {
        const sy = -halfH + 17 + idleBreath + s * 6;
        ctx.beginPath();
        ctx.moveTo(-halfW + 5, sy);
        ctx.lineTo(-halfW + 12, sy + 2);
        ctx.lineTo(-halfW + 5, sy + 4);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(halfW - 5, sy + 1);
        ctx.lineTo(halfW - 12, sy + 3);
        ctx.lineTo(halfW - 5, sy + 5);
        ctx.closePath();
        ctx.fill();
      }

      // Golden Lion-Embossed Shoulder Pauldron (سرشانه زرین شیرنشان)
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(-halfW + 2, -halfH + 16 + idleBreath, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (this.hero.id === 'sohrab') {
      // Turquoise & Silver Interlocking Scale Mail (زره پولادین توران)
      ctx.fillStyle = '#0891b2';
      ctx.fillRect(-halfW + 4, -halfH + 14 + idleBreath, p.w - 8, halfH + 2);

      // Scale Mail Pattern
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      for (let scY = -halfH + 16 + idleBreath; scY < 0; scY += 5) {
        for (let scX = -halfW + 7; scX < halfW - 7; scX += 6) {
          ctx.beginPath();
          ctx.arc(scX, scY, 2.5, 0, Math.PI);
          ctx.stroke();
        }
      }

      // Mohreh-ye Rostam (مهره رستم) Glowing Talisman Armlet on Left Arm
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#f87171';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(-halfW + 1, -halfH + 24 + idleBreath, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Silver Shoulder Pauldron
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(-halfW + 2, -halfH + 16 + idleBreath, 5.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Gordafarid Embroidered Persian Leather Armor
      ctx.fillStyle = '#059669';
      ctx.fillRect(-halfW + 4, -halfH + 14 + idleBreath, p.w - 8, halfH + 2);

      // Pearl Embroidery Borders
      ctx.fillStyle = '#f8fafc';
      for (let py = -halfH + 16 + idleBreath; py <= 2; py += 5) {
        ctx.fillRect(-halfW + 5, py, 2, 2);
        ctx.fillRect(halfW - 7, py, 2, 2);
      }
    }

    // Pahlavani Golden Belt with Lion Buckle
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-halfW + 3, -1 + idleBreath, p.w - 6, 5);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 1.5 + idleBreath, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 6. Head & Hyper-Detailed Facial Features
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -halfH + 8 + idleBreath, 11, 0, Math.PI * 2);
    ctx.fill();

    // Detailed Eyes (White Sclera + Iris + Specular Sheen)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, -halfH + 6 + idleBreath, 4, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(3, -halfH + 6 + idleBreath, 2.5, 2.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3.5, -halfH + 6.5 + idleBreath, 1, 1);

    // Eyebrows
    ctx.fillStyle = '#18181b';
    ctx.fillRect(1.5, -halfH + 4 + idleBreath, 5, 1.5);

    // Hero-Specific Facial Characteristics
    if (this.hero.id === 'rostam') {
      // Prominent Persian Warrior Curved Mustache (سبیل رستم دستان)
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -halfH + 11 + idleBreath);
      ctx.quadraticCurveTo(5, -halfH + 12 + idleBreath, 8, -halfH + 9 + idleBreath);
      ctx.stroke();

      // Pahlavani Trimmed Full Beard
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(-6, -halfH + 9 + idleBreath);
      ctx.lineTo(0, -halfH + 18 + idleBreath);
      ctx.lineTo(7, -halfH + 9 + idleBreath);
      ctx.closePath();
      ctx.fill();

      // Veteran Battle Scar
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(4, -halfH + 9 + idleBreath);
      ctx.lineTo(6, -halfH + 13 + idleBreath);
      ctx.stroke();
    } else if (this.hero.id === 'sohrab') {
      // Groomed Young Hero Mustache
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(1, -halfH + 11 + idleBreath);
      ctx.lineTo(7, -halfH + 10 + idleBreath);
      ctx.stroke();

      // Strong Jawline Contour
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(3, -halfH + 13 + idleBreath, 2, 0, Math.PI / 2);
      ctx.stroke();
    } else {
      // Gordafarid Kohl Liner & Crimson Lips
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(1, -halfH + 6 + idleBreath);
      ctx.lineTo(7, -halfH + 5 + idleBreath);
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(3, -halfH + 11 + idleBreath, 3, 1.5);
    }

    // Gordafarid Flowing Raven Hair
    if (this.hero.id === 'gordafarid') {
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.moveTo(-8, -halfH + 4 + idleBreath);
      const hairWave1 = Math.sin(time * 6) * 5;
      const hairWave2 = Math.cos(time * 5) * 6;
      ctx.quadraticCurveTo(-18 + hairWave1, -halfH + 16 + idleBreath, -22 + hairWave2, -halfH + 28 + idleBreath);
      ctx.quadraticCurveTo(-14, -halfH + 18 + idleBreath, -4, -halfH + 8 + idleBreath);
      ctx.closePath();
      ctx.fill();
    }

    // 7. Helmets & Crowns
    if (this.hero.id === 'rostam') {
      // White Div (دیو سپید) Skull Helmet with Curved Horns & Topaz Eyes
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, -halfH + 5 + idleBreath, 12, Math.PI, 0, false);
      ctx.lineTo(12, -halfH + 9 + idleBreath);
      ctx.lineTo(-12, -halfH + 9 + idleBreath);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Specular Light Sheen across Skull Helmet in High/Ultra
      if (isHigh || isUltra) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, -halfH + 4 + idleBreath, 10, -Math.PI * 0.8, -Math.PI * 0.3);
        ctx.stroke();
      }

      // Curved Ivory Horns
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      // Left Horn
      ctx.beginPath();
      ctx.moveTo(-10, -halfH + 4 + idleBreath);
      ctx.quadraticCurveTo(-18, -halfH - 8 + idleBreath, -22, -halfH - 18 + idleBreath);
      ctx.quadraticCurveTo(-13, -halfH - 9 + idleBreath, -5, -halfH + 2 + idleBreath);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Horn
      ctx.beginPath();
      ctx.moveTo(10, -halfH + 4 + idleBreath);
      ctx.quadraticCurveTo(18, -halfH - 8 + idleBreath, 22, -halfH - 18 + idleBreath);
      ctx.quadraticCurveTo(13, -halfH - 9 + idleBreath, 5, -halfH + 2 + idleBreath);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Golden-Topaz Eyes on Div Helmet
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-6, -halfH + 4 + idleBreath, 3, 2.5);
      ctx.fillRect(3, -halfH + 4 + idleBreath, 3, 2.5);
    } else if (this.hero.id === 'sohrab') {
      // Sasanian Royal Steel Helmet with Turquoise Jewel & Simurgh Plume
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(-11, -halfH - 3 + idleBreath, 22, 8);
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(0, -halfH + 1 + idleBreath, 3, 0, Math.PI * 2);
      ctx.fill();

      // Simurgh Peacock Plume Feather
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -halfH - 3 + idleBreath);
      ctx.quadraticCurveTo(Math.sin(time * 5) * 4, -halfH - 14 + idleBreath, -6 + Math.sin(time * 4) * 5, -halfH - 22 + idleBreath);
      ctx.stroke();
    } else {
      // Gordafarid Royal Tiara
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(-10, -halfH - 2, 20, 6);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -halfH + 1, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 8. Weapons & Multi-Layered Glowing Attack Trails
    ctx.save();
    if (p.isAttacking) {
      const swingAngle = (1 - p.attackTimer / 0.3) * Math.PI - 0.5;
      ctx.rotate(swingAngle);
      ctx.translate(14, -10);

      const isFinisher = this.comboStep === 2;

      // Outer Radiant Slash Halo
      ctx.strokeStyle = isFinisher ? 'rgba(245, 158, 11, 0.4)' : 'rgba(254, 240, 138, 0.35)';
      ctx.lineWidth = isFinisher ? 15 : 10;
      ctx.beginPath();
      ctx.arc(0, 0, 39, -0.7, 1.3);
      ctx.stroke();

      // Core Blade Trail Sweep
      ctx.strokeStyle = isFinisher ? '#f59e0b' : '#fef08a';
      ctx.lineWidth = isFinisher ? 6 : 4;
      ctx.beginPath();
      ctx.arc(0, 0, 39, -0.6, 1.2);
      ctx.stroke();

      // Inner White-Hot Sharp Razor Edge
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 39, -0.4, 1.0);
      ctx.stroke();
    } else {
      ctx.translate(10, 4);
    }

    // Hero-Specific Weapon Models
    if (this.hero.id === 'rostam') {
      // Gav-sar (گرز گاوسار - Bull-Headed Mace)
      // Steel Shaft
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, -26, 5, 36);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(-1, -12, 7, 3);
      ctx.fillRect(-1, 0, 7, 3);

      // Sculpted Golden Ox Head
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(2.5, -28, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ox Horns on Mace
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-5, -28);
      ctx.quadraticCurveTo(-14, -34, -12, -42);
      ctx.lineTo(-4, -32);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(10, -28);
      ctx.quadraticCurveTo(19, -34, 17, -42);
      ctx.lineTo(9, -32);
      ctx.fill();

      // Electrical Sparks along Gav-sar in High/Ultra
      if (isHigh || isUltra) {
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 1.5;
        const sparkY = -18 + Math.sin(time * 20) * 12;
        ctx.beginPath();
        ctx.moveTo(1, sparkY);
        ctx.lineTo(4, sparkY - 3);
        ctx.lineTo(0, sparkY - 6);
        ctx.stroke();
      }
    } else if (this.hero.id === 'sohrab') {
      // Curved Damascene Steel Scimitar (شمشیر زرداران)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 4, 10);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(-4, -1, 12, 3);

      // Damascus Curved Blade
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(2, -1);
      ctx.quadraticCurveTo(14, -20, 24, -34);
      ctx.lineTo(18, -36);
      ctx.quadraticCurveTo(10, -20, 0, -1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Gordafarid Recurve Bow (کمان پولادین)
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(6, -10, 20, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Bowstring
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(6, -30);
      ctx.lineTo(6, 10);
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  private renderEnemies(ctx: CanvasRenderingContext2D) {
    this.enemies.forEach(e => {
      if (e.x + e.width < this.cameraX - 100 || e.x > this.cameraX + this.canvas.width + 100) return;

      ctx.save();
      ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
      if (e.facing === -1) {
        ctx.scale(-1, 1);
      }

      if (e.isHit) {
        ctx.fillStyle = '#f87171';
      }

      if (e.isBoss) {
        ctx.fillStyle = e.isHit ? '#ef4444' : this.stage.id === 2 ? '#450a0a' : this.stage.id === 3 ? '#f1f5f9' : '#0f172a';
        ctx.fillRect(-e.width / 2, -e.height / 2 + 20, e.width, e.height - 20);

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, -e.height / 2 + 15, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-10, -e.height / 2 + 10, 6, 6);
        ctx.fillRect(4, -e.height / 2 + 10, 6, 6);

        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(-16, -e.height / 2 + 6);
        ctx.lineTo(-34, -e.height / 2 - 24);
        ctx.lineTo(-8, -e.height / 2 - 4);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(16, -e.height / 2 + 6);
        ctx.lineTo(34, -e.height / 2 - 24);
        ctx.lineTo(8, -e.height / 2 - 4);
        ctx.fill();
      } else if (e.type === 'flying_akvan') {
        ctx.fillStyle = e.isHit ? '#ef4444' : '#7c3aed';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        const wingFlap = Math.sin(performance.now() * 0.015) * 14;
        ctx.fillStyle = '#4c1d95';
        ctx.beginPath();
        ctx.moveTo(-8, -4);
        ctx.lineTo(-26, -20 + wingFlap);
        ctx.lineTo(-12, 6);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(8, -4);
        ctx.lineTo(26, -20 + wingFlap);
        ctx.lineTo(12, 6);
        ctx.fill();
      } else {
        ctx.fillStyle = e.isHit ? '#ef4444' : '#b91c1c';
        ctx.fillRect(-e.width / 2, -e.height / 2 + 12, e.width, e.height - 12);

        ctx.fillStyle = '#450a0a';
        ctx.beginPath();
        ctx.arc(0, -e.height / 2 + 8, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-8, -e.height / 2 - 6, 3, 7);
        ctx.fillRect(5, -e.height / 2 - 6, 3, 7);

        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(8, -6, 18, 4);
      }

      ctx.restore();

      const hpPct = Math.max(0, e.hp / e.maxHp);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(e.x, e.y - 12, e.width, 5);
      ctx.fillStyle = e.isBoss ? '#ef4444' : '#22c55e';
      ctx.fillRect(e.x, e.y - 12, e.width * hpPct, 5);
    });
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D) {
    this.projectiles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(p.x - (p.vx * 0.02), p.y - (p.vy * 0.02), p.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(pt => {
      if (pt.isRing && pt.ringRadius !== undefined) {
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }

  private renderFloatingText(ctx: CanvasRenderingContext2D) {
    ctx.font = 'bold 15px Vazirmatn, sans-serif';
    this.floatTexts.forEach(ft => {
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
    });
  }
}
