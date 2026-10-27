// Persian Miniature & Dark Fantasy Particle and VFX Engine
import { GraphicsTier } from '../types';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'spark' | 'ink' | 'divine_gold' | 'flame' | 'smoke' | 'blood' | 'petal' | 'shockwave';
  rotation?: number;
  vRot?: number;
  radius?: number;
}

export interface SlashTrailPoint {
  x: number;
  y: number;
  alpha: number;
  width: number;
  color: string;
}

export interface SlashTrail {
  points: SlashTrailPoint[];
  color: string;
  glowColor: string;
  maxPoints: number;
}

export class ParticleEngine {
  private particles: Particle[] = [];
  private slashTrails: SlashTrail[] = [];
  public screenShake: number = 0;
  public hitStopFrames: number = 0;
  public graphicsTier: GraphicsTier = 'ultra';

  constructor(tier: GraphicsTier = 'ultra') {
    this.graphicsTier = tier;
  }

  public setTier(tier: GraphicsTier) {
    this.graphicsTier = tier;
  }

  public triggerHitStop(frames: number = 5) {
    this.hitStopFrames = Math.max(this.hitStopFrames, frames);
  }

  public addScreenShake(amount: number = 8) {
    this.screenShake = Math.max(this.screenShake, amount);
  }

  // Divine Kayanian Aura / فر کیانی
  public emitDivineFarreh(x: number, y: number, count: number = 8) {
    const maxMultiplier = this.graphicsTier === 'low' ? 0.3 : this.graphicsTier === 'medium' ? 0.6 : 1.0;
    const actualCount = Math.ceil(count * maxMultiplier);

    for (let i = 0; i < actualCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 2.5;
      const colors = ['#f59e0b', '#fbbf24', '#fef08a', '#d97706'];
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2, // Floats upward
        size: 2.5 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.9,
        life: 0,
        maxLife: 25 + Math.random() * 20,
        type: 'divine_gold',
      });
    }
  }

  // Persian Miniature Ink Splash (نقش‌مایه اساطیری / قطره جوهر زرین)
  public emitInkSplash(x: number, y: number, color: string = '#d97706', count: number = 10) {
    const maxMultiplier = this.graphicsTier === 'low' ? 0.4 : 1.0;
    const actualCount = Math.ceil(count * maxMultiplier);

    for (let i = 0; i < actualCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color,
        alpha: 0.85,
        life: 0,
        maxLife: 20 + Math.random() * 15,
        type: 'ink',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  // Steel Clash Sparks (برخورد شمشیرها و جرقه پولاد)
  public emitClashSparks(x: number, y: number, count: number = 16) {
    this.addScreenShake(6);
    this.triggerHitStop(4);

    const actualCount = this.graphicsTier === 'low' ? 6 : count;
    for (let i = 0; i < actualCount; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 1.5;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 1.5 + Math.random() * 3,
        color: Math.random() > 0.4 ? '#ffffff' : '#fbbf24',
        alpha: 1.0,
        life: 0,
        maxLife: 15 + Math.random() * 12,
        type: 'spark',
      });
    }

    // Shockwave ring
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 6,
      radius: 8,
      color: '#fef08a',
      alpha: 0.9,
      life: 0,
      maxLife: 12,
      type: 'shockwave',
    });
  }

  // Fiery Flame Trail for Flaming Mace
  public emitFireWave(x: number, y: number, dir: 1 | -1) {
    const count = this.graphicsTier === 'low' ? 3 : 8;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 15,
        y: y + (Math.random() - 0.5) * 20,
        vx: dir * (3 + Math.random() * 4),
        vy: (Math.random() - 0.5) * 2 - 1,
        size: 4 + Math.random() * 6,
        color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
        alpha: 0.9,
        life: 0,
        maxLife: 18 + Math.random() * 10,
        type: 'flame',
      });
    }
  }

  // Start or Update a dynamic weapon slash trail
  public recordSlashTrail(x: number, y: number, color: string = '#fbbf24', width: number = 6) {
    if (this.slashTrails.length === 0) {
      this.slashTrails.push({
        points: [],
        color,
        glowColor: '#f59e0b',
        maxPoints: 8,
      });
    }
    const trail = this.slashTrails[0];
    trail.points.unshift({ x, y, alpha: 1.0, width, color });
    if (trail.points.length > trail.maxPoints) {
      trail.points.pop();
    }
  }

  public clearSlashTrails() {
    this.slashTrails = [];
  }

  public update() {
    if (this.hitStopFrames > 0) {
      this.hitStopFrames--;
      return; // Freeze world motion during hit-stop
    }

    if (this.screenShake > 0) {
      this.screenShake *= 0.88;
      if (this.screenShake < 0.3) this.screenShake = 0;
    }

    // Update slash trail alpha fade
    for (const trail of this.slashTrails) {
      for (const pt of trail.points) {
        pt.alpha *= 0.82;
      }
      trail.points = trail.points.filter(pt => pt.alpha > 0.05);
    }
    this.slashTrails = this.slashTrails.filter(t => t.points.length > 0);

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.type === 'spark') {
        p.vy += 0.3; // Gravity on sparks
        p.vx *= 0.95;
      } else if (p.type === 'flame') {
        p.vy -= 0.15; // Rises
        p.size *= 0.96;
      } else if (p.type === 'divine_gold') {
        p.vy -= 0.05;
        p.size *= 0.98;
      } else if (p.type === 'shockwave' && p.radius !== undefined) {
        p.radius += 4.5;
      }

      p.alpha = 1.0 - p.life / p.maxLife;
    }
  }

  public render(ctx: CanvasRenderingContext2D, cameraX: number = 0, cameraY: number = 0) {
    ctx.save();

    // 1. Render dynamic weapon slash trails with smooth Bezier curve
    for (const trail of this.slashTrails) {
      if (trail.points.length < 2) continue;
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = trail.glowColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < trail.points.length - 1; i++) {
        const p1 = trail.points[i];
        const p2 = trail.points[i + 1];
        ctx.beginPath();
        ctx.moveTo(p1.x - cameraX, p1.y - cameraY);
        ctx.lineTo(p2.x - cameraX, p2.y - cameraY);
        ctx.strokeStyle = trail.color;
        ctx.globalAlpha = p1.alpha * 0.75;
        ctx.lineWidth = p1.width * p1.alpha;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Render particles
    for (const p of this.particles) {
      const screenX = p.x - cameraX;
      const screenY = p.y - cameraY;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

      if (p.type === 'shockwave' && p.radius) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (p.type === 'divine_gold') {
        // Star sparkle
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'flame') {
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ea580c';
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'ink') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, p.size, p.size * 0.6, p.rotation || 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sparks / blood
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  public getShakeOffset(): { x: number; y: number } {
    if (this.screenShake <= 0.05) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.screenShake * 2,
      y: (Math.random() - 0.5) * this.screenShake * 2,
    };
  }
}
