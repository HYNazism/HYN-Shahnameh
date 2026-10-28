import { GraphicsTier, HeroId } from '../types/game';
import { StoryLogicManager } from './StoryLogicManager';

/**
 * Authentic Persian Qahveh-Khaneh Masterpiece Renderer
 * (مکتب نقاشی قهوه‌خانه‌ای اصیل - به شیوه استاد حسین قوللرآقاسی و محمد مدبر)
 *
 * Artistic Pillars:
 * 1. Bold Expressive Contours (خطوط محیطی و قلم‌گیری قوی سیاه و قهوه‌ای سوخته)
 * 2. Warm Traditional Pigments (رنگ‌بندی گرم و سنتی: اخرایی، شنجرفی، روناسی، طلای کهنه، فیروزه‌ای پخته)
 * 3. Exaggerated Theatrical Portraiture (چهره‌پردازی اغراق‌آمیز پهلوانان و دیوان:
 *    ابروهای کمانی پیوسته، چشمان درشت سرمه‌کشیده، سبیل‌های چخماقی بیرون‌زده از رخسار،
 *    ریش دوشاخ رستم، کلاه‌خود کله‌دیو، و دیوان با دندان‌های نیش گرازمانند و تنبان پوست پلنگ)
 */
export interface HeroRenderOptions {
  ctx: CanvasRenderingContext2D;
  heroId: HeroId | string;
  facing: 1 | -1;
  animFrame: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  isAttacking: boolean;
  attackType?: 'light' | 'heavy' | 'special';
  attackTimer?: number;
  isHit?: boolean;
  isParrying?: boolean;
  rageRatio?: number;
  graphicsTier?: GraphicsTier;
  time?: number;
  hasSimurghBoots?: boolean;
  scale?: number;
}

export interface EnemyRenderOptions {
  ctx: CanvasRenderingContext2D;
  type: 'grunt' | 'archer' | 'div_soldier' | 'archer_turani' | 'flying_akvan' | 'boss' | string;
  stageId: number;
  heroId: string;
  width: number;
  height: number;
  vx: number;
  isAttacking: boolean;
  isHit: boolean;
  isBoss?: boolean;
  graphicsTier?: GraphicsTier;
  time?: number;
}

const INK_DARK = '#140b05'; // قلم‌گیری سیاه-قهوه‌ای سوخته سنتی قهوه‌خانه‌ای

export class QahvehKhanehRenderer {
  /**
   * Renders a Pahlavan hero in authentic Qahveh-Khaneh style with bold contours,
   * warm oil pigments, and exaggerated expressive facial features.
   */
  public static renderHero(opts: HeroRenderOptions) {
    const {
      ctx,
      heroId,
      facing,
      animFrame,
      vx,
      isGrounded,
      isAttacking,
      attackType = 'light',
      attackTimer = 0,
      isHit = false,
      isParrying = false,
      rageRatio = 0,
      graphicsTier = 'ultra',
      time = performance.now() * 0.001,
      hasSimurghBoots = false,
      scale = 1.35,
    } = opts;

    const isHigh = graphicsTier === 'high' || graphicsTier === 'ultra';
    const isUltra = graphicsTier === 'ultra';

    ctx.save();

    if (facing === -1) {
      ctx.scale(-1, 1);
    }

    // Scale anchored at the feet (+26)
    ctx.translate(0, 26);
    ctx.scale(scale, scale);
    ctx.translate(0, -26);

    const isMoving = Math.abs(vx) > 12;
    const stride = isMoving && isGrounded ? Math.sin(animFrame * 1.35) * 11 : 0;
    const kneeBend = isMoving && isGrounded ? Math.abs(Math.cos(animFrame * 1.35)) * 3 : 0;
    const idleBreath = !isMoving && isGrounded ? Math.sin(time * 3.2) * 1.5 : 0;
    const bodyLean = isAttacking ? 0.15 : isMoving ? 0.07 : 0;

    ctx.rotate(bodyLean);

    // Warm dark sepia ground shadow
    ctx.fillStyle = 'rgba(20, 11, 5, 0.58)';
    ctx.beginPath();
    ctx.ellipse(0, 27, 23, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // -------------------------------------------------------------
    // 1. WARM GOLDEN FARREH-YE IZADI HALO (شمسه و فرّه ایزدی قهوه‌خانه‌ای)
    // -------------------------------------------------------------
    if (rageRatio > 0.1 || isParrying || heroId === 'esfandiar') {
      const effectiveRage = heroId === 'esfandiar' ? Math.max(0.65, rageRatio) : rageRatio;
      const auraR = 40 + effectiveRage * 20 + (isParrying ? 14 : 0);
      const auraGrad = ctx.createRadialGradient(0, -10 + idleBreath, 6, 0, -10 + idleBreath, auraR);
      auraGrad.addColorStop(0, `rgba(253, 224, 71, ${0.28 + effectiveRage * 0.35})`);
      auraGrad.addColorStop(0.6, `rgba(180, 83, 9, ${0.18 + effectiveRage * 0.25})`);
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, -10 + idleBreath, auraR, 0, Math.PI * 2);
      ctx.fill();

      if (isHigh) {
        ctx.save();
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.38 + effectiveRage * 0.45})`;
        ctx.lineWidth = 1.6;
        const rays = 14;
        for (let r = 0; r < rays; r++) {
          const ang = time * 1.6 + (r * Math.PI * 2) / rays;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * 16, -12 + idleBreath + Math.sin(ang) * 16);
          ctx.lineTo(Math.cos(ang) * (auraR - 3), -12 + idleBreath + Math.sin(ang) * (auraR - 3));
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // -------------------------------------------------------------
    // 2. WARM TRADITIONAL CLOAK & SHAWL (ردا و شال پهلوانی با قلم‌گیری ضخیم)
    // -------------------------------------------------------------
    this.drawBattleCloak(ctx, heroId, stride, vx, idleBreath, time);

    // -------------------------------------------------------------
    // 3. OFF-HAND ARM & CHAHAR-GOL SHIELD (بازوی چپ و سپر کرگدنی چهارگل)
    // -------------------------------------------------------------
    this.drawBackArmAndShield(ctx, heroId, stride, idleBreath, isParrying);

    // -------------------------------------------------------------
    // 4. PAHLAVANI SHALVAR, GREAVES & BOOTS (شلوار، ساق‌بند و چکمه سنتی)
    // -------------------------------------------------------------
    this.drawArmoredLegs(ctx, heroId, stride, kneeBend, idleBreath, hasSimurghBoots);

    // -------------------------------------------------------------
    // 5. BROAD CHEST, BABR-E BAYAN & CHAHAR-AINEH (سینه ستبر، ببر بیان و چهارآینه)
    // -------------------------------------------------------------
    this.drawDetailedTorso(ctx, heroId, idleBreath, isHit, isUltra);

    // -------------------------------------------------------------
    // 6. EXAGGERATED QAHVEH-KHANEH PORTRAIT HEAD (چهره‌پردازی اغراق‌آمیز پهلوانی)
    // -------------------------------------------------------------
    this.drawExaggeratedPahlavanHead(ctx, heroId, idleBreath, time);

    // -------------------------------------------------------------
    // 7. MUSCULAR FRONT ARM, BAZUBAND & WEAPON (بازوی راست، بازوبند و سلاح)
    // -------------------------------------------------------------
    this.drawFrontArmAndWeapon(
      ctx,
      heroId,
      isAttacking,
      attackType,
      attackTimer,
      stride,
      idleBreath,
      isUltra,
      time
    );

    if (isHit) {
      ctx.fillStyle = 'rgba(185, 28, 28, 0.38)';
      ctx.beginPath();
      ctx.arc(0, -8, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Renders enemies and bosses filtered by StoryLogicManager so that every stage
   * and hero combination displays historically coherent opponents in Qahveh-Khaneh style.
   */
  public static renderEnemy(opts: EnemyRenderOptions) {
    const {
      ctx,
      type,
      stageId,
      heroId,
      vx,
      isAttacking,
      isHit,
      isBoss,
      graphicsTier = 'ultra',
      time = performance.now() * 0.001,
    } = opts;

    const animFrame = time * 8;
    const stride = Math.abs(vx) > 5 ? Math.sin(animFrame) * 9.5 : 0;
    const breath = Math.sin(time * 3.5) * 1.8;

    if (isBoss) {
      if (stageId === 4) {
        const bossHeroId = heroId === 'sohrab' ? 'gordafarid' : 'sohrab';
        this.renderHero({
          ctx,
          heroId: bossHeroId,
          facing: 1,
          animFrame,
          vx,
          vy: 0,
          isGrounded: true,
          isAttacking,
          attackType: 'heavy',
          attackTimer: isAttacking ? (time % 0.5) : 0,
          isHit,
          rageRatio: 0.7,
          graphicsTier,
          time,
          scale: 1.44,
        });
        return;
      }

      if (stageId === 6) {
        this.renderHero({
          ctx,
          heroId: 'esfandiar',
          facing: 1,
          animFrame,
          vx,
          vy: 0,
          isGrounded: true,
          isAttacking,
          attackType: 'heavy',
          attackTimer: isAttacking ? (time % 0.5) : 0,
          isHit,
          rageRatio: 0.9,
          graphicsTier,
          time,
          scale: 1.48,
        });
        return;
      }

      if (stageId === 2) {
        this.drawBossZahhak(ctx, stride, breath, isAttacking, isHit, time);
        return;
      }

      if (stageId === 3) {
        this.drawBossDivSepid(ctx, stride, breath, isAttacking, isHit, time);
        return;
      }

      this.drawBossWarlord(ctx, stageId, stride, breath, isAttacking, isHit, time);
      return;
    }

    // Consult StoryLogicManager for stage + hero coherent enemy faction
    // Stages 1, 2, 3: Mazandaran Demons & Zahhak's Serpent Cultists
    // Stage 4: If player is Sohrab -> Iranian Fortress Sentinels; if Rostam/Gordafarid -> Turanian Raiders
    // Stage 6: Kayanian Royal Immortal Guards
    // Stages 5, 7: Turanian Heavy Raiders
    if (type === 'flying_akvan') {
      const isHumanWarStage = stageId >= 4;
      this.drawAerialThreat(ctx, breath, isHit, time, isHumanWarStage);
      return;
    }

    if (type === 'archer' || type === 'archer_turani') {
      const isIranianDefender = (stageId === 4 && heroId === 'sohrab') || stageId === 6;
      const isDemonStage = stageId <= 3;
      this.drawQahvehKhanehArcher(
        ctx,
        stride,
        breath,
        isAttacking,
        isHit,
        time,
        isIranianDefender ? 'iranian' : isDemonStage ? 'demon' : 'turanian'
      );
      return;
    }

    // Melee Vanguard ('grunt' | 'div_soldier')
    if (stageId <= 3) {
      this.drawMazandaranDivSoldier(ctx, stride, breath, isAttacking, isHit, time, stageId === 2);
    } else if ((stageId === 4 && heroId === 'sohrab') || stageId === 6) {
      this.drawIranianFortressSentinel(ctx, stride, breath, isAttacking, isHit, time, stageId === 6);
    } else {
      this.drawTuranianSteppeRaider(ctx, stride, breath, isAttacking, isHit, time);
    }
  }

  // ============================================================================
  // HERO SUB-RENDERERS (QAHVEH-KHANEH WARM PALETTE & BOLD CONTOURS)
  // ============================================================================

  private static drawBattleCloak(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    stride: number,
    vx: number,
    idleBreath: number,
    time: number
  ) {
    const wind = Math.min(18, Math.abs(vx) * 0.06) + Math.sin(time * 5.5) * 3.5;

    ctx.save();
    const grad = ctx.createLinearGradient(-6, -22, -32 - wind, 24);
    if (heroId === 'rostam') {
      grad.addColorStop(0, '#7c2d12'); // Warm burnt sienna & madder crimson
      grad.addColorStop(0.5, '#991b1b');
      grad.addColorStop(1, '#450a0a');
    } else if (heroId === 'sohrab') {
      grad.addColorStop(0, '#991b1b'); // Royal pomegranate crimson & warm ochre
      grad.addColorStop(0.5, '#b91c1c');
      grad.addColorStop(1, '#450a0a');
    } else if (heroId === 'esfandiar') {
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#451a03');
    } else {
      grad.addColorStop(0, '#92400e'); // Saffron-ochre Persian silk
      grad.addColorStop(0.5, '#d97706');
      grad.addColorStop(1, '#451a03');
    }

    ctx.fillStyle = grad;
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.1;

    ctx.beginPath();
    ctx.moveTo(-8, -19 + idleBreath);
    ctx.bezierCurveTo(
      -22 - wind * 0.5,
      -8 + idleBreath,
      -28 - wind,
      10,
      -26 - wind + stride * 0.3,
      23
    );
    ctx.lineTo(-10 + stride * 0.2, 20);
    ctx.quadraticCurveTo(-14, 2, -6, -15 + idleBreath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Traditional Qahveh-Khaneh golden border trim
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-9, -18 + idleBreath);
    ctx.bezierCurveTo(
      -20 - wind * 0.5,
      -7 + idleBreath,
      -25 - wind,
      9,
      -24 - wind + stride * 0.3,
      21
    );
    ctx.stroke();
    ctx.restore();
  }

  private static drawBackArmAndShield(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    stride: number,
    idleBreath: number,
    isParrying: boolean
  ) {
    ctx.save();
    const armSwing = isParrying ? -0.6 : -stride * 0.04;
    ctx.translate(10, -14 + idleBreath);
    ctx.rotate(armSwing);

    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(-3, 0, 7, 15, 3);
    ctx.fill();
    ctx.stroke();

    // Traditional Rhino-Hide & Brass Chahar-Gol Shield (سپر کرگدنی چهارگل قهوه‌خانه‌ای)
    if (isParrying || heroId === 'rostam' || heroId === 'sohrab') {
      const shieldX = isParrying ? 8 : 5;
      const shieldY = isParrying ? 2 : 8;

      ctx.save();
      ctx.translate(shieldX, shieldY);

      ctx.fillStyle = '#451a03';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 6.5, 13.5, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner brass rim
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.8, 11, 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // 4 Golden Bosses (چهارگل زرین)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(1, 0, 2.5, 0, Math.PI * 2);
      ctx.arc(0, -6, 1.7, 0, Math.PI * 2);
      ctx.arc(0, 6, 1.7, 0, Math.PI * 2);
      ctx.fill();

      if (isParrying) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(4, 0, 17, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  private static drawArmoredLegs(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    stride: number,
    kneeBend: number,
    idleBreath: number,
    hasSimurghBoots: boolean
  ) {
    const trouserColor =
      heroId === 'rostam'
        ? '#451a03' // Warm dark leather-brown shalvar
        : heroId === 'sohrab'
        ? '#7f1d1d' // Warm crimson riding breeches
        : heroId === 'esfandiar'
        ? '#78350f'
        : '#064e3b';

    const greaveColor =
      heroId === 'rostam'
        ? '#b45309'
        : heroId === 'sohrab'
        ? '#d97706'
        : heroId === 'esfandiar'
        ? '#eab308'
        : '#b45309';

    const legs = [
      { offset: -6 - stride * 0.85, isFront: false },
      { offset: 4 + stride * 0.85, isFront: true },
    ];

    legs.forEach((leg) => {
      const lx = leg.offset;
      const ly = 7 + idleBreath - (leg.isFront ? kneeBend * 0.5 : 0);

      // Muscular thigh with bold Qahveh-Khaneh contour
      ctx.fillStyle = trouserColor;
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(lx - 4.2, ly);
      ctx.quadraticCurveTo(lx - 6.5, ly + 6, lx - 4.2, ly + 11);
      ctx.lineTo(lx + 4.2, ly + 11);
      ctx.quadraticCurveTo(lx + 6.5, ly + 6, lx + 4.2, ly);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Brass Knee Poleyn (زانوبند مفرغی قهوه‌خانه‌ای)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(lx, ly + 11, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Embossed Warm Bronze Greave (ساق‌بند زرکوب)
      ctx.fillStyle = greaveColor;
      ctx.beginPath();
      ctx.moveTo(lx - 4, ly + 11);
      ctx.lineTo(lx + 4, ly + 11);
      ctx.lineTo(lx + 3.2, 23);
      ctx.lineTo(lx - 3.2, 23);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Upturned Persian Leather Boot (چاروق و چکمه نوک‌برگشته سنتی)
      ctx.fillStyle = hasSimurghBoots ? '#eab308' : '#450a0a';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(lx - 3.5, 22);
      ctx.lineTo(lx + 4, 22);
      ctx.lineTo(lx + 9, 25.5);
      ctx.quadraticCurveTo(lx + 11.5, 25.5, lx + 10.5, 22);
      ctx.lineTo(lx + 6, 26.5);
      ctx.lineTo(lx - 4, 26.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }

  private static drawDetailedTorso(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    idleBreath: number,
    isHit: boolean,
    isUltra: boolean
  ) {
    const sw = heroId === 'rostam' ? 22 : heroId === 'sohrab' ? 19 : 17;
    const waist = heroId === 'rostam' ? 13.5 : 11.5;
    const topY = -18 + idleBreath;
    const botY = 7 + idleBreath;

    ctx.save();
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.2;

    // 1. Armored Tassets / Skirt (برگستوان و دامن زره)
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(-waist, botY - 1);
    ctx.lineTo(waist, botY - 1);
    ctx.lineTo(waist + 3.5, botY + 7.5);
    ctx.lineTo(-waist - 3.5, botY + 7.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = heroId === 'rostam' ? '#b45309' : heroId === 'sohrab' ? '#991b1b' : '#047857';
    for (let tx = -waist + 1; tx < waist - 2; tx += 6) {
      ctx.fillRect(tx, botY, 5, 5.5);
      ctx.strokeRect(tx, botY, 5, 5.5);
    }

    // 2. Broad Muscular V-Taper Cuirass with Warm Qahveh-Khaneh Pigments
    const torsoGrad = ctx.createLinearGradient(-sw, topY, sw, botY);
    if (isHit) {
      torsoGrad.addColorStop(0, '#ef4444');
      torsoGrad.addColorStop(1, '#7f1d1d');
    } else if (heroId === 'rostam') {
      // Warm Ochre & Burnt Sienna Babr-e Bayan Tiger Pelt
      torsoGrad.addColorStop(0, '#92400e');
      torsoGrad.addColorStop(0.35, '#ea580c');
      torsoGrad.addColorStop(0.7, '#d97706');
      torsoGrad.addColorStop(1, '#451a03');
    } else if (heroId === 'sohrab') {
      // Warm Turquoise, Lapis & Gold-Rimmed Royal Cuirass
      torsoGrad.addColorStop(0, '#0e7490');
      torsoGrad.addColorStop(0.45, '#0891b2');
      torsoGrad.addColorStop(0.8, '#b45309');
      torsoGrad.addColorStop(1, '#451a03');
    } else if (heroId === 'esfandiar') {
      torsoGrad.addColorStop(0, '#92400e');
      torsoGrad.addColorStop(0.4, '#f59e0b');
      torsoGrad.addColorStop(0.8, '#b45309');
      torsoGrad.addColorStop(1, '#451a03');
    } else {
      // Gordafarid Warm Emerald, Crimson & Gold Brocade Cuirass
      torsoGrad.addColorStop(0, '#065f46');
      torsoGrad.addColorStop(0.5, '#059669');
      torsoGrad.addColorStop(0.85, '#b45309');
      torsoGrad.addColorStop(1, '#451a03');
    }

    ctx.fillStyle = torsoGrad;
    ctx.beginPath();
    ctx.moveTo(-sw, topY);
    ctx.lineTo(sw, topY);
    ctx.quadraticCurveTo(sw - 2, (topY + botY) * 0.5, waist, botY);
    ctx.lineTo(-waist, botY);
    ctx.quadraticCurveTo(-sw + 2, (topY + botY) * 0.5, -sw, topY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Traditional Qahveh-Khaneh Chest Ornamentation
    if (heroId === 'rostam') {
      // Bold Expressive Tiger Stripes of Babr-e Bayan (خطوط درشت پوست ببر بیان)
      ctx.fillStyle = INK_DARK;
      for (let i = 0; i < 5; i++) {
        const sy = topY + 3 + i * 4.2;
        ctx.beginPath();
        ctx.moveTo(-sw + 2, sy);
        ctx.lineTo(-sw + 12, sy + 1.6);
        ctx.lineTo(-sw + 2, sy + 3.2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(sw - 2, sy);
        ctx.lineTo(sw - 12, sy + 1.6);
        ctx.lineTo(sw - 2, sy + 3.2);
        ctx.fill();
      }

      // Chahar-Aineh (چهارآینه زرکوب سینه)
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-8.5, topY + 4, 17, 12, 2);
      ctx.fill();
      ctx.stroke();

      // Inner crimson jewel on breastplate
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(0, topY + 10, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (heroId === 'sohrab') {
      if (isUltra) {
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.0;
        for (let row = topY + 4; row < botY - 2; row += 4) {
          for (let col = -sw + 5; col <= sw - 5; col += 4.5) {
            ctx.beginPath();
            ctx.arc(col, row, 2.1, 0, Math.PI);
            ctx.stroke();
          }
        }
      }

      // Golden Sun-Medallion on Sohrab's Chest
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, topY + 10, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Golden Tazhib Rosette on Breastplate
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, topY + 2);
      ctx.lineTo(8.5, topY + 11);
      ctx.lineTo(0, botY - 2);
      ctx.lineTo(-8.5, topY + 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(0, topY + 11, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Embossed Lion Shoulder Pauldrons (سرشانه‌های زرین شیرنشان با قلم‌گیری ضخیم)
    [-sw + 1, sw - 1].forEach((px, idx) => {
      const dir = idx === 0 ? -1 : 1;
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.ellipse(px, topY + 2, 8, 5.8, dir * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(px, topY + 1.5, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Pahlavani Kamarband & Shawl (شال کمر و کمربند زرین پهلوانی)
    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 1.8;
    ctx.fillRect(-waist, botY - 3.5, waist * 2, 5);
    ctx.strokeRect(-waist, botY - 3.5, waist * 2, 5);

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, botY - 1, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Exaggerated Expressive Qahveh-Khaneh Facial Portraiture (چهره‌پردازی اغراق‌آمیز قهوه‌خانه‌ای):
   * - Bold black contours, warm sun-baked skin tones, dramatic arched connected sword-brows,
   *   large kohl-rimmed almond eyes, and oversized sweeping handlebar mustaches / forked beard.
   */
  private static drawExaggeratedPahlavanHead(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    idleBreath: number,
    time: number
  ) {
    const headY = -28 + idleBreath;

    ctx.save();

    // 1. Chainmail Camail / Aventail (زره زنجیری گردن‌آویز مغفر)
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-12, headY - 1);
    ctx.lineTo(-15, headY + 11.5);
    ctx.lineTo(15, headY + 11.5);
    ctx.lineTo(12, headY - 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    for (let cy = headY + 2; cy <= headY + 9; cy += 2.8) {
      for (let cx = -11; cx <= 9; cx += 3.5) {
        ctx.fillRect(cx, cy, 1.4, 1.4);
      }
    }

    // 2. Sculpted Warm Terracotta/Wheat Face with Bold Ink Contour
    const skinGrad = ctx.createLinearGradient(-9, headY - 6, 11, headY + 9);
    if (heroId === 'rostam') {
      skinGrad.addColorStop(0, '#c2410c');
      skinGrad.addColorStop(0.45, '#ea580c');
      skinGrad.addColorStop(0.8, '#d97706');
      skinGrad.addColorStop(1, '#7c2d12');
    } else {
      skinGrad.addColorStop(0, '#ea580c');
      skinGrad.addColorStop(0.5, '#fb923c');
      skinGrad.addColorStop(1, '#9a3412');
    }

    ctx.fillStyle = skinGrad;
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    ctx.moveTo(-8.5, headY - 6.5);
    ctx.lineTo(9.5, headY - 6.5);
    ctx.lineTo(11, headY + 1); // Strong cheekbone
    ctx.lineTo(8, headY + 8); // Angular jaw
    ctx.lineTo(1, headY + 10); // Chin
    ctx.lineTo(-7.5, headY + 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Warm ruddy cheek blush typical of Qahveh-Khaneh oil portraits (سرخی گونه پهلوانی)
    ctx.fillStyle = 'rgba(185, 28, 28, 0.35)';
    ctx.beginPath();
    ctx.arc(2.5, headY + 2, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Prominent Aquiline Persian Nose (بینی عقابی قلم‌گیری‌شده)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(8.5, headY - 3.5);
    ctx.lineTo(12.5, headY + 1.5);
    ctx.lineTo(8.5, headY + 2.5);
    ctx.fill();
    ctx.stroke();

    // 3. EXAGGERATED LARGE ALMOND KOHL-RIMMED EYES (چشمان درشت بادامی سرمه‌کشیده)
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0.5, headY - 1.8);
    ctx.quadraticCurveTo(4.8, headY - 4.2, 8.8, headY - 1.5);
    ctx.quadraticCurveTo(4.8, headY + 0.6, 0.5, headY - 1.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Fierce Iris & Highlight
    ctx.fillStyle = INK_DARK;
    ctx.beginPath();
    ctx.arc(5.5, headY - 1.8, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(5.8, headY - 2.5, 1.0, 1.0);

    // 4. EXAGGERATED ARCHED CONNECTED SWORD-BROWS (ابروهای کمانی پیوسته و اخم پهلوانی)
    ctx.fillStyle = INK_DARK;
    ctx.beginPath();
    ctx.moveTo(-4, headY - 3.2);
    ctx.quadraticCurveTo(4.5, headY - 7.2, 10.2, headY - 3.2);
    ctx.lineTo(9.5, headY - 1.6);
    ctx.quadraticCurveTo(4.5, headY - 4.8, -4, headY - 1.8);
    ctx.closePath();
    ctx.fill();

    // Heroic furrow lines between brows (خطوط اخم پیشانی)
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(7.5, headY - 5.5);
    ctx.lineTo(7.5, headY - 2.8);
    ctx.stroke();

    // 5. Hero-Specific Exaggerated Beards, Mustaches & Helmets
    if (heroId === 'rostam') {
      // Iconic Two-Forked Flowing Beard of Rostam (ریش دوشاخ پرپشت و بلند تهمتن)
      ctx.fillStyle = INK_DARK;
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-8, headY + 1);
      ctx.bezierCurveTo(-10, headY + 12, -6, headY + 19, -2.5, headY + 21);
      ctx.lineTo(1.5, headY + 12.5); // Deep V-fork in beard
      ctx.lineTo(6.5, headY + 21);
      ctx.bezierCurveTo(10, headY + 18, 11, headY + 11, 9, headY + 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Exaggerated Giant Sweeping Handlebar Mustache extending past the face! (سبیل چخماقی تاب‌داده تا بناگوش)
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(8.5, headY + 3.2);
      ctx.bezierCurveTo(2, headY + 6, -8, headY + 6.5, -14, headY + 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(8.5, headY + 3.2);
      ctx.bezierCurveTo(12, headY + 5, 15, headY + 4, 16.5, headY + 1);
      ctx.stroke();

      this.drawMasterpieceRostamHelm(ctx, headY);
    } else if (heroId === 'sohrab') {
      // Exaggerated Young Pahlavan Curled Handlebar Mustache (سبیل تاب‌داده جوان‌پهلوان)
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(8, headY + 3.4);
      ctx.bezierCurveTo(3, headY + 5.2, -5, headY + 5, -9.5, headY + 1.5);
      ctx.stroke();

      this.drawMasterpieceSohrabHelm(ctx, headY, time);
    } else if (heroId === 'esfandiar') {
      // Royal curled beard & sweeping mustache
      ctx.fillStyle = INK_DARK;
      ctx.beginPath();
      ctx.moveTo(-6.5, headY + 2);
      ctx.lineTo(-5.5, headY + 15);
      ctx.lineTo(7.5, headY + 15);
      ctx.lineTo(8.5, headY + 3);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(8, headY + 3);
      ctx.quadraticCurveTo(-2, headY + 6, -11, headY + 1.5);
      ctx.stroke();

      this.drawMasterpieceEsfandiarHelm(ctx, headY, time);
    } else {
      // Gordafarid: Crimson Qahveh-Khaneh lips, beauty mole (خال هندو), and long whipping braids
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.ellipse(6.8, headY + 4.5, 2.3, 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Traditional Persian beauty mark on cheek
      ctx.fillStyle = INK_DARK;
      ctx.beginPath();
      ctx.arc(3.5, headY + 3.2, 0.7, 0, Math.PI * 2);
      ctx.fill();

      const hairWave = Math.sin(time * 6.5) * 4.5;
      ctx.fillStyle = INK_DARK;
      ctx.beginPath();
      ctx.moveTo(-6, headY + 2);
      ctx.bezierCurveTo(
        -19,
        headY + 8,
        -25 + hairWave,
        headY + 20,
        -21 + hairWave * 1.3,
        headY + 31
      );
      ctx.bezierCurveTo(-12 + hairWave, headY + 22, -10, headY + 12, -2, headY + 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-16 + hairWave * 0.5, headY + 15, 3.8, 2.2);
      ctx.fillRect(-19 + hairWave * 0.9, headY + 23, 3.8, 2.2);

      this.drawMasterpieceGordafaridHelm(ctx, headY);
    }

    ctx.restore();
  }

  private static drawMasterpieceRostamHelm(ctx: CanvasRenderingContext2D, headY: number) {
    // Sculpted Monstrous Div-e Sepid Skull Helmet (کلاه‌خود کله‌دیو با دندان و شاخ)
    const helmGrad = ctx.createLinearGradient(-12, headY - 19, 12, headY);
    helmGrad.addColorStop(0, '#fef3c7'); // Warm aged ivory
    helmGrad.addColorStop(0.65, '#d6d3d1');
    helmGrad.addColorStop(1, '#78716c');

    ctx.fillStyle = helmGrad;
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, headY - 3, 12.5, Math.PI, 0);
    ctx.lineTo(12.5, headY - 1);
    ctx.lineTo(-12.5, headY - 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Div Teeth along the Helmet Rim (ردیف دندان‌های کله‌دیو بر پیشانی مغفر)
    ctx.fillStyle = '#fffbeb';
    for (let tx = -9; tx <= 7; tx += 4) {
      ctx.beginPath();
      ctx.moveTo(tx, headY - 3.5);
      ctx.lineTo(tx + 2, headY - 0.5);
      ctx.lineTo(tx + 4, headY - 3.5);
      ctx.fill();
      ctx.stroke();
    }

    // Glaring Crimson Eyes & Ears on the Div Helmet
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(-3, headY - 8.5, 2.5, 0, Math.PI * 2);
    ctx.arc(5.5, headY - 8.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Exaggerated Curved Ivory Horns with Gold Bands
    [-1, 1].forEach((dir) => {
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(dir * 7, headY - 8);
      ctx.bezierCurveTo(
        dir * 20,
        headY - 19,
        dir * 27,
        headY - 27,
        dir * 22,
        headY - 34
      );
      ctx.bezierCurveTo(
        dir * 16,
        headY - 26,
        dir * 12,
        headY - 16,
        dir * 3,
        headY - 11
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(dir * 22, headY - 33, 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  private static drawMasterpieceSohrabHelm(
    ctx: CanvasRenderingContext2D,
    headY: number,
    time: number
  ) {
    const helmGrad = ctx.createLinearGradient(-11, headY - 21, 11, headY);
    helmGrad.addColorStop(0, '#fef08a');
    helmGrad.addColorStop(0.5, '#d97706');
    helmGrad.addColorStop(1, '#78350f');

    ctx.fillStyle = helmGrad;
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-11.5, headY - 2);
    ctx.quadraticCurveTo(-10, headY - 14, 0, headY - 22);
    ctx.quadraticCurveTo(10, headY - 14, 11.5, headY - 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-11.5, headY - 4.5, 23, 3.2);
    ctx.strokeRect(-11.5, headY - 4.5, 23, 3.2);

    const wave = Math.sin(time * 7) * 3.5;
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, headY - 22);
    ctx.bezierCurveTo(-8, headY - 32, -23, headY - 29 + wave, -27, headY - 17 + wave);
    ctx.quadraticCurveTo(-14, headY - 21 + wave * 0.5, -2, headY - 19);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  private static drawMasterpieceEsfandiarHelm(
    ctx: CanvasRenderingContext2D,
    headY: number,
    time: number
  ) {
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-11, headY - 2);
    ctx.lineTo(-12.5, headY - 14);
    ctx.lineTo(-5, headY - 9);
    ctx.lineTo(0, headY - 18);
    ctx.lineTo(5, headY - 9);
    ctx.lineTo(12.5, headY - 14);
    ctx.lineTo(11, headY - 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, headY - 6, 3, 0, Math.PI * 2);
    ctx.fill();

    const wave = Math.sin(time * 6) * 2.5;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, headY - 18);
    ctx.quadraticCurveTo(-14, headY - 27 + wave, -21, headY - 18 + wave);
    ctx.lineTo(-3, headY - 15);
    ctx.fill();
    ctx.stroke();
  }

  private static drawMasterpieceGordafaridHelm(ctx: CanvasRenderingContext2D, headY: number) {
    ctx.fillStyle = '#b45309';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, headY - 3, 11.5, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(-11.5, headY - 2.5);
    ctx.lineTo(-3, headY - 5.5);
    ctx.lineTo(1, headY - 14);
    ctx.lineTo(5, headY - 5.5);
    ctx.lineTo(11.5, headY - 2.5);
    ctx.lineTo(11.5, headY - 0.5);
    ctx.lineTo(-11.5, headY - 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(1, headY - 5, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private static drawFrontArmAndWeapon(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    isAttacking: boolean,
    attackType: string,
    attackTimer: number,
    stride: number,
    idleBreath: number,
    isUltra: boolean,
    time: number
  ) {
    let armAngle = -0.25 + stride * 0.03;
    if (isAttacking) {
      const progress = 1 - Math.max(0, Math.min(1, attackTimer / 0.32));
      armAngle = -1.65 + Math.sin(progress * Math.PI) * 2.75;
    }

    ctx.save();
    ctx.translate(-8, -13 + idleBreath);
    ctx.rotate(armAngle);

    // Muscular Upper Arm with Bold Ink Outline
    ctx.fillStyle =
      heroId === 'rostam'
        ? '#c2410c'
        : heroId === 'sohrab'
        ? '#0e7490'
        : heroId === 'esfandiar'
        ? '#d97706'
        : '#047857';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(-4.8, -2, 9.6, 12.5, 4);
    ctx.fill();
    ctx.stroke();

    // Mohreh-ye Rostam (بازوبند یاقوت‌نشان مهره رستم)
    if (heroId === 'sohrab' || heroId === 'rostam') {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-5.2, 3, 10.4, 3.8);
      ctx.strokeRect(-5.2, 3, 10.4, 3.8);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 4.9, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Steel & Brass Forearm Vambrace (ساعدبند زرکوب)
    ctx.translate(0, 9.5);
    ctx.rotate(isAttacking ? 0.35 : 0.65);

    ctx.fillStyle = '#b45309';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-4.2, 0);
    ctx.lineTo(4.2, 0);
    ctx.lineTo(3.4, 12);
    ctx.lineTo(-3.4, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Clenched Fist
    ctx.translate(0, 12);
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, 2, 4.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.rotate(Math.PI * 0.45);

    if (heroId === 'rostam') {
      // GAV-SAR MACE (گرز گاوسار با سردیس اغراق‌آمیز گاومیش جنگی)
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.0;
      ctx.fillRect(-2.8, -38, 5.6, 46);
      ctx.strokeRect(-2.8, -38, 5.6, 46);

      ctx.fillStyle = '#fbbf24';
      for (let ry = -10; ry >= -34; ry -= 8) {
        ctx.fillRect(-3.4, ry, 6.8, 2.4);
      }

      const maceGrad = ctx.createRadialGradient(-2, -45, 2, 0, -45, 12);
      maceGrad.addColorStop(0, '#fde047');
      maceGrad.addColorStop(0.55, '#d97706');
      maceGrad.addColorStop(1, '#78350f');

      ctx.fillStyle = maceGrad;
      ctx.beginPath();
      ctx.moveTo(-7.5, -37);
      ctx.lineTo(-10, -47);
      ctx.lineTo(-5.5, -53);
      ctx.lineTo(5.5, -53);
      ctx.lineTo(10, -47);
      ctx.lineTo(7.5, -37);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glaring Bull Eyes & Snout
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-5.5, -47, 3, 2.2);
      ctx.fillRect(2.5, -47, 3, 2.2);

      // Curved Ivory Bull Horns on Mace
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.moveTo(-7.5, -48);
      ctx.quadraticCurveTo(-17, -55, -15, -63);
      ctx.quadraticCurveTo(-10, -56, -4, -52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(7.5, -48);
      ctx.quadraticCurveTo(17, -55, 15, -63);
      ctx.quadraticCurveTo(10, -56, 4, -52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (heroId === 'sohrab') {
      // DAMASCUS SHAMSHIR
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, 0, 4, 9);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 10, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-9.5, -1);
      ctx.lineTo(9.5, -1);
      ctx.lineTo(7.5, -4.2);
      ctx.lineTo(-7.5, -4.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-2.8, -4);
      ctx.bezierCurveTo(-1, -24, 6.5, -40, 17, -55);
      ctx.bezierCurveTo(11.5, -38, 5.5, -22, 2.8, -4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.quadraticCurveTo(3.5, -25, 10.5, -42);
      ctx.stroke();
    } else {
      // KAYANIAN WAR-SPEAR
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 1.8;
      ctx.fillRect(-2.2, -46, 4.4, 64);
      ctx.strokeRect(-2.2, -46, 4.4, 64);

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(0, -45);
      ctx.lineTo(-10, -38 + Math.sin(time * 8) * 3);
      ctx.lineTo(-3, -36);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(0, -65);
      ctx.lineTo(6, -49);
      ctx.lineTo(0, -45);
      ctx.lineTo(-6, -49);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    if (isAttacking && isUltra) {
      ctx.strokeStyle =
        attackType === 'heavy' ? 'rgba(185, 28, 28, 0.82)' : 'rgba(217, 119, 6, 0.8)';
      ctx.lineWidth = attackType === 'heavy' ? 6.5 : 4.5;
      ctx.beginPath();
      ctx.arc(0, -25, 36, -Math.PI * 0.75, Math.PI * 0.25);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ============================================================================
  // EXAGGERATED QAHVEH-KHANEH ENEMIES & BOSSES (دیوان، مرزبانان و سپاه توران)
  // ============================================================================

  /**
   * Mazandarani War-Demon / Zahhak Cultist with Exaggerated Qahveh-Khaneh Demon Face:
   * - Spotted leopard-skin waistcloth (تنبان پوست پلنگ خال‌دار سنتی دیوان)
   * - Brass wrist/ankle bells (زنگوله مفرغی دیو)
   * - Oversized boar tusks, bulging fiery eyes, pointed ears, and bold black contours
   */
  private static drawMazandaranDivSoldier(
    ctx: CanvasRenderingContext2D,
    stride: number,
    breath: number,
    isAttacking: boolean,
    isHit: boolean,
    time: number,
    isZahhakCultist: boolean = false
  ) {
    ctx.save();
    ctx.scale(1.25, 1.25);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.1;

    // Shadow
    ctx.fillStyle = 'rgba(20, 11, 5, 0.52)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Muscular Demon Legs with Brass Ankle Bells (خلخال و زنگوله مفرغی دیو در نقاشی قهوه‌خانه‌ای)
    [-6 - stride * 0.6, 5 + stride * 0.6].forEach((lx) => {
      ctx.fillStyle = isZahhakCultist ? '#451a03' : '#7c2d12';
      ctx.beginPath();
      ctx.moveTo(lx - 4.2, 6);
      ctx.lineTo(lx + 4.2, 6);
      ctx.lineTo(lx + 3.2, 21);
      ctx.lineTo(lx - 3.2, 21);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Ankle Cuff & Bell
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(lx - 3.8, 16.5, 7.6, 2.8);
      ctx.strokeRect(lx - 3.8, 16.5, 7.6, 2.8);
    });

    // Spotted Leopard-Pelt Loincloth (تنبان پوست پلنگ خال‌دار دیوان قهوه‌خانه‌ای)
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(-13, 3);
    ctx.lineTo(13, 3);
    ctx.lineTo(15, 14);
    ctx.lineTo(4, 10);
    ctx.lineTo(0, 15.5);
    ctx.lineTo(-5, 10);
    ctx.lineTo(-15, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Leopard spots on loincloth
    ctx.fillStyle = INK_DARK;
    [-8, -3, 3, 8].forEach((sx) => {
      ctx.beginPath();
      ctx.arc(sx, 7.5, 1.4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Hulking Warm Terracotta-Crimson Muscular Demon Torso
    const skinGrad = ctx.createLinearGradient(-17, -18, 17, 6);
    skinGrad.addColorStop(0, isHit ? '#ef4444' : isZahhakCultist ? '#7f1d1d' : '#9a3412');
    skinGrad.addColorStop(0.5, isHit ? '#f87171' : isZahhakCultist ? '#991b1b' : '#c2410c');
    skinGrad.addColorStop(1, '#450a0a');

    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.moveTo(-17.5, -16 + breath);
    ctx.lineTo(17.5, -16 + breath);
    ctx.lineTo(11.5, 5 + breath);
    ctx.lineTo(-11.5, 5 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Exaggerated Pectoral & Belly Contours (خطوط قلم‌گیری عضلات شکم و سینه دیو)
    ctx.beginPath();
    ctx.moveTo(-12, -7 + breath);
    ctx.quadraticCurveTo(-5, -3 + breath, 0, -8 + breath);
    ctx.quadraticCurveTo(5, -3 + breath, 12, -7 + breath);
    ctx.stroke();

    // EXAGGERATED GROTESQUE QAHVEH-KHANEH DEMON HEAD (چهره‌پردازی اغراق‌آمیز دیو)
    const headY = -24 + breath;
    ctx.fillStyle = isZahhakCultist ? '#7f1d1d' : '#b45309';
    ctx.beginPath();
    ctx.arc(0, headY, 10.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pointed Demon Ears with Brass Rings (گوش‌های تیز دیو با حلقه زرین)
    ctx.beginPath();
    ctx.moveTo(-9, headY - 2);
    ctx.lineTo(-16, headY - 7);
    ctx.lineTo(-9, headY + 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bulging Bloodshot Yellow-Red Demon Eyes (چشمان ورقلمبیده و شعله‌ور دیو)
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(3.5, headY - 2.5, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(4.2, headY - 2.5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Wide Snarling Mouth & Oversized Boar Tusks (دهان گشاد و دندان‌های نیش گرازمانند بیرون‌زده)
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(-2, headY + 2.5, 9.5, 4);
    ctx.strokeRect(-2, headY + 2.5, 9.5, 4);

    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(0, headY + 5);
    ctx.lineTo(-2, headY - 1);
    ctx.lineTo(2.5, headY + 4);
    ctx.moveTo(5.5, headY + 5);
    ctx.lineTo(8.5, headY - 1.5);
    ctx.lineTo(8, headY + 5);
    ctx.fill();
    ctx.stroke();

    // Curved Striated Demon Horns
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(-5, headY - 8);
    ctx.quadraticCurveTo(-16, headY - 19, -11, headY - 26);
    ctx.quadraticCurveTo(-6, headY - 17, 0, headY - 9);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(4, headY - 8);
    ctx.quadraticCurveTo(15, headY - 19, 12, headY - 26);
    ctx.quadraticCurveTo(7, headY - 17, 1, headY - 9);
    ctx.fill();
    ctx.stroke();

    // Swinging Clawed Arm & Heavy Spiked Mace/Cleaver
    ctx.save();
    ctx.translate(8, -11 + breath);
    const swing = isAttacking ? Math.sin(time * 18) * 1.45 : 0.25;
    ctx.rotate(swing);

    ctx.fillStyle = '#9a3412';
    ctx.fillRect(-3.2, 0, 6.4, 12);
    ctx.strokeRect(-3.2, 0, 6.4, 12);

    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(23, 3);
    ctx.lineTo(27, 14);
    ctx.lineTo(2, 16.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  /**
   * Turanian Steppe Raider (طلایه‌دار شمشیرزن سپاه توران - برای مراحل ۴، ۵ و ۷)
   */
  private static drawTuranianSteppeRaider(
    ctx: CanvasRenderingContext2D,
    stride: number,
    breath: number,
    isAttacking: boolean,
    isHit: boolean,
    time: number
  ) {
    ctx.save();
    ctx.scale(1.24, 1.24);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;

    ctx.fillStyle = 'rgba(20, 11, 5, 0.5)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 16, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    [-5 - stride * 0.6, 4 + stride * 0.6].forEach((lx) => {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(lx - 3.5, 6, 7, 15);
      ctx.strokeRect(lx - 3.5, 6, 7, 15);
    });

    // Warm Ochre & Crimson Turanian Lamellar Coat
    ctx.fillStyle = isHit ? '#ef4444' : '#9a3412';
    ctx.beginPath();
    ctx.moveTo(-14, -15 + breath);
    ctx.lineTo(14, -15 + breath);
    ctx.lineTo(11, 8 + breath);
    ctx.lineTo(-11, 8 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Exaggerated Turanian Warrior Face with Long Drooping Mustache (سبیل آویخته تورانی)
    const headY = -22 + breath;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(0, headY, 8.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Furrowed slanting brows & drooping mustache
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-2, headY - 3);
    ctx.lineTo(7, headY - 1.5);
    ctx.moveTo(6, headY + 2.5);
    ctx.quadraticCurveTo(1, headY + 4, -4, headY + 9);
    ctx.stroke();

    // Fur-Trimmed Conical Bronze Helmet
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(-9.5, headY - 2);
    ctx.lineTo(0, headY - 17);
    ctx.lineTo(9.5, headY - 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#451a03';
    ctx.fillRect(-10, headY - 4.5, 20, 3.8);
    ctx.strokeRect(-10, headY - 4.5, 20, 3.8);

    // Curved Turanian Scimitar
    ctx.save();
    ctx.translate(8, -9 + breath);
    ctx.rotate(isAttacking ? Math.sin(time * 18) * 1.4 : 0.3);
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.quadraticCurveTo(14, 2, 22, -12);
    ctx.quadraticCurveTo(12, -2, 0, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * Iranian Fortress Sentinel / Kayanian Royal Guard (مرزبان دژ سپید / گارد جاویدان کیانی)
   * Used when Sohrab attacks Dej-e Sepid (Stage 4) or in Stage 6!
   */
  private static drawIranianFortressSentinel(
    ctx: CanvasRenderingContext2D,
    stride: number,
    breath: number,
    isAttacking: boolean,
    isHit: boolean,
    time: number,
    isKayanianGold: boolean = false
  ) {
    ctx.save();
    ctx.scale(1.24, 1.24);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;

    ctx.fillStyle = 'rgba(20, 11, 5, 0.5)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 16, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    [-5 - stride * 0.6, 4 + stride * 0.6].forEach((lx) => {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(lx - 3.5, 6, 7, 15);
      ctx.strokeRect(lx - 3.5, 6, 7, 15);
    });

    // Warm Golden-Bronze & Madder Crimson Sasanian Cuirass
    ctx.fillStyle = isHit ? '#ef4444' : isKayanianGold ? '#d97706' : '#047857';
    ctx.beginPath();
    ctx.moveTo(-14, -15 + breath);
    ctx.lineTo(14, -15 + breath);
    ctx.lineTo(10, 8 + breath);
    ctx.lineTo(-10, 8 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bearded Iranian Guard Head & Spangenhelm
    const headY = -22 + breath;
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(0, headY, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pahlavani beard & handlebar mustache
    ctx.fillStyle = INK_DARK;
    ctx.fillRect(-5, headY + 2, 11, 6);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, headY - 2, 9.2, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Spear & Round Brass Shield
    ctx.save();
    ctx.translate(8, -8 + breath);
    ctx.rotate(isAttacking ? Math.sin(time * 18) * 1.2 : 0.15);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-10, -2, 28, 3);
    ctx.strokeRect(-10, -2, 28, 3);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(24, -0.5);
    ctx.lineTo(17, -4);
    ctx.lineTo(17, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * Faction-Aware Qahveh-Khaneh Ranged Unit (کماندار تورانی، مرزبان ایرانی یا جادوگر مازندران)
   */
  private static drawQahvehKhanehArcher(
    ctx: CanvasRenderingContext2D,
    stride: number,
    breath: number,
    isAttacking: boolean,
    isHit: boolean,
    time: number,
    faction: 'turanian' | 'iranian' | 'demon'
  ) {
    ctx.save();
    ctx.scale(1.22, 1.22);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;

    ctx.fillStyle = 'rgba(20, 11, 5, 0.48)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 15, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    [-5 - stride * 0.5, 4 + stride * 0.5].forEach((lx) => {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(lx - 3, 6, 6, 15);
      ctx.strokeRect(lx - 3, 6, 6, 15);
    });

    ctx.fillStyle = isHit
      ? '#ef4444'
      : faction === 'iranian'
      ? '#065f46'
      : faction === 'demon'
      ? '#7f1d1d'
      : '#b45309';
    ctx.beginPath();
    ctx.moveTo(-12.5, -15 + breath);
    ctx.lineTo(12.5, -15 + breath);
    ctx.lineTo(9.5, 7 + breath);
    ctx.lineTo(-9.5, 7 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const headY = -22 + breath;
    ctx.fillStyle = faction === 'demon' ? '#c2410c' : '#fb923c';
    ctx.beginPath();
    ctx.arc(0, headY, 8.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Exaggerated Brow & Mustache
    ctx.fillStyle = INK_DARK;
    ctx.fillRect(1.5, headY - 3, 5, 2.2);
    ctx.beginPath();
    ctx.moveTo(7, headY + 2.5);
    ctx.quadraticCurveTo(1, headY + 4.5, -6, headY + 2);
    ctx.stroke();

    // Pointed Bronze Helm
    ctx.fillStyle = faction === 'iranian' ? '#f59e0b' : '#92400e';
    ctx.beginPath();
    ctx.moveTo(-9, headY - 2);
    ctx.lineTo(0, headY - 16);
    ctx.lineTo(9, headY - 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Composite Recurve Bow
    ctx.save();
    ctx.translate(9, -6 + breath);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, 0, 14, -Math.PI * 0.48, Math.PI * 0.48);
    ctx.stroke();

    const pull = isAttacking ? -7 : -2;
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(1, -14);
    ctx.lineTo(pull, 0);
    ctx.lineTo(1, 14);
    ctx.stroke();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(pull, 0);
    ctx.lineTo(17, 0);
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  /**
   * Aerial Threat: Winged Akvan Demon (Stages 1-3) or War-Falcon (Stages 4-7)
   */
  private static drawAerialThreat(
    ctx: CanvasRenderingContext2D,
    breath: number,
    isHit: boolean,
    time: number,
    isWarFalcon: boolean
  ) {
    ctx.save();
    ctx.scale(1.25, 1.25);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;

    const flap = Math.sin(time * 15) * 16;

    [-1, 1].forEach((dir) => {
      ctx.fillStyle = isHit ? '#ef4444' : isWarFalcon ? '#92400e' : '#7f1d1d';
      ctx.beginPath();
      ctx.moveTo(dir * 6, -4);
      ctx.lineTo(dir * 28, -18 + flap);
      ctx.quadraticCurveTo(dir * 22, -2 + flap * 0.5, dir * 18, 8);
      ctx.quadraticCurveTo(dir * 11, 4, dir * 5, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = isHit ? '#f87171' : isWarFalcon ? '#b45309' : '#9a3412';
    ctx.beginPath();
    ctx.ellipse(0, 2 + breath * 0.5, 11, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(0, -10, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-5, -12, 3.8, 2.8);
    ctx.fillRect(1.5, -12, 3.8, 2.8);

    if (!isWarFalcon) {
      ctx.fillStyle = INK_DARK;
      ctx.beginPath();
      ctx.moveTo(-6, -15);
      ctx.lineTo(-14, -24);
      ctx.lineTo(-2, -17);
      ctx.moveTo(6, -15);
      ctx.lineTo(14, -24);
      ctx.lineTo(2, -17);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Stage 2 Boss: ZAHHAK THE SERPENT KING (ضحاک ماردوش با چهره اغراق‌آمیز و مارهای کبرا)
   */
  private static drawBossZahhak(
    ctx: CanvasRenderingContext2D,
    stride: number,
    breath: number,
    isAttacking: boolean,
    isHit: boolean,
    time: number
  ) {
    ctx.save();
    ctx.scale(1.42, 1.42);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.2;

    const aura = ctx.createRadialGradient(0, -5, 8, 0, -5, 48);
    aura.addColorStop(0, 'rgba(185, 28, 28, 0.48)');
    aura.addColorStop(0.6, 'rgba(180, 83, 9, 0.28)');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -5, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isHit ? '#ef4444' : '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(-18, -18 + breath);
    ctx.lineTo(18, -18 + breath);
    ctx.lineTo(22 + stride * 0.3, 26);
    ctx.lineTo(-22 - stride * 0.3, 26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(-15, -17 + breath);
    ctx.lineTo(15, -17 + breath);
    ctx.lineTo(10, 8 + breath);
    ctx.lineTo(-10, 8 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // TWO WRITHING BLACK COBRAS ON ZAHHAK'S SHOULDERS
    [-1, 1].forEach((dir) => {
      const wave1 = Math.sin(time * 6 + dir) * 5;
      const wave2 = Math.cos(time * 5 + dir) * 4;
      const sx = dir * 15;
      const sy = -16 + breath;

      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 7.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(
        sx + dir * 14,
        sy - 8 + wave1,
        sx + dir * 10,
        sy - 22 + wave2,
        sx + dir * 18,
        sy - 28 + wave1
      );
      ctx.stroke();

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      const hx = sx + dir * 18;
      const hy = sy - 28 + wave1;
      ctx.fillStyle = INK_DARK;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(hx, hy, 6, 4.2, dir * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(hx + dir * 1, hy - 2, 2.5, 2.2);

      if (Math.sin(time * 14 + dir) > 0) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(hx + dir * 5, hy);
        ctx.lineTo(hx + dir * 11, hy - 2.5);
        ctx.moveTo(hx + dir * 5, hy);
        ctx.lineTo(hx + dir * 11, hy + 2.5);
        ctx.stroke();
      }
    });

    // Exaggerated Tyrant Face of Zahhak
    const headY = -27 + breath;
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, headY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Forked black beard & sweeping cruel mustache
    ctx.fillStyle = INK_DARK;
    ctx.beginPath();
    ctx.moveTo(-7.5, headY + 2);
    ctx.lineTo(0, headY + 15);
    ctx.lineTo(7.5, headY + 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.fillRect(1.5, headY - 3, 5, 2.8);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(3, headY - 3, 2.2, 2.8);

    // Jagged Babylonian Crown
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-11.5, headY - 4);
    ctx.lineTo(-13, headY - 16);
    ctx.lineTo(-5, headY - 9);
    ctx.lineTo(0, headY - 18);
    ctx.lineTo(5, headY - 9);
    ctx.lineTo(13, headY - 16);
    ctx.lineTo(11.5, headY - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(14, -8 + breath);
    ctx.rotate(isAttacking ? Math.sin(time * 18) * 1.5 : 0.2);
    ctx.fillStyle = INK_DARK;
    ctx.fillRect(-2.2, -36, 4.4, 52);
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.quadraticCurveTo(18, -42, 22, -26);
    ctx.quadraticCurveTo(12, -32, 0, -28);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * Stage 3 Boss: DIV-E SEPID OF MAZANDARAN (دیو سپید با چهره‌پردازی اغراق‌آمیز قهوه‌خانه‌ای)
   */
  private static drawBossDivSepid(
    ctx: CanvasRenderingContext2D,
    stride: number,
    breath: number,
    isAttacking: boolean,
    isHit: boolean,
    time: number
  ) {
    ctx.save();
    ctx.scale(1.48, 1.48);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.3;

    [-8 - stride * 0.5, 7 + stride * 0.5].forEach((lx) => {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(lx - 5.2, 6, 10.4, 20);
      ctx.strokeRect(lx - 5.2, 6, 10.4, 20);

      // Brass Ankle Bell Cuff
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(lx - 5.5, 19, 11, 3);
      ctx.strokeRect(lx - 5.5, 19, 11, 3);
    });

    // Spotted Leopard Waistcloth & Skull Belt
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-17.5, 2, 35, 9.5);
    ctx.strokeRect(-17.5, 2, 35, 9.5);
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(0, 6.5, 4.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Colossal Warm Parchment-White Muscular Torso with Bold Ink Shading
    const bodyGrad = ctx.createLinearGradient(-22, -22, 22, 6);
    bodyGrad.addColorStop(0, isHit ? '#ef4444' : '#fffbeb');
    bodyGrad.addColorStop(0.6, isHit ? '#dc2626' : '#fef3c7');
    bodyGrad.addColorStop(1, '#d6d3d1');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(-22.5, -20 + breath);
    ctx.lineTo(22.5, -20 + breath);
    ctx.lineTo(15.5, 4 + breath);
    ctx.lineTo(-15.5, 4 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Exaggerated Chest & Ribcage Inking
    ctx.beginPath();
    ctx.moveTo(-16, -9 + breath);
    ctx.quadraticCurveTo(-7, -3 + breath, 0, -10 + breath);
    ctx.quadraticCurveTo(7, -3 + breath, 16, -9 + breath);
    ctx.moveTo(0, -10 + breath);
    ctx.lineTo(0, 2 + breath);
    ctx.stroke();

    // Exaggerated Monstrous Head of Div-e Sepid
    const headY = -29 + breath;
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(0, headY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bulging Blood-Red & Gold Demon Eyes
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-8, headY - 4, 6, 4);
    ctx.fillRect(2, headY - 4, 6, 4);
    ctx.strokeRect(-8, headY - 4, 6, 4);
    ctx.strokeRect(2, headY - 4, 6, 4);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-6, headY - 3.5, 3, 3);
    ctx.fillRect(4, headY - 3.5, 3, 3);

    // Oversized Curved Boar Tusks & Snarling Jaw
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.moveTo(-6, headY + 7);
    ctx.lineTo(-9, headY - 1);
    ctx.lineTo(-2, headY + 6);
    ctx.moveTo(3, headY + 6);
    ctx.lineTo(9, headY - 1);
    ctx.lineTo(7, headY + 7);
    ctx.fill();
    ctx.stroke();

    // Giant Spiraled Ram Horns
    [-1, 1].forEach((dir) => {
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.moveTo(dir * 9, headY - 6);
      ctx.bezierCurveTo(
        dir * 27,
        headY - 18,
        dir * 33,
        headY - 31,
        dir * 22,
        headY - 39
      );
      ctx.bezierCurveTo(
        dir * 16,
        headY - 28,
        dir * 14,
        headY - 16,
        dir * 5,
        headY - 10
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Millstone War-Club
    ctx.save();
    ctx.translate(16, -12 + breath);
    ctx.rotate(isAttacking ? Math.sin(time * 16) * 1.6 : 0.3);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-4, -38, 8, 46);
    ctx.strokeRect(-4, -38, 8, 46);

    ctx.fillStyle = '#57534e';
    ctx.beginPath();
    ctx.roundRect(-11.5, -48, 23, 18, 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * Stage 1, 5, 7 Boss: Towering Armored Warlord / Afrasiab
   */
  private static drawBossWarlord(
    ctx: CanvasRenderingContext2D,
    stageId: number,
    stride: number,
    breath: number,
    isAttacking: boolean,
    isHit: boolean,
    time: number
  ) {
    ctx.save();
    ctx.scale(1.42, 1.42);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 2.2;

    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(-14, -18 + breath);
    ctx.lineTo(-28, 24);
    ctx.lineTo(-8, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    [-7 - stride * 0.5, 6 + stride * 0.5].forEach((lx) => {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(lx - 4, 6, 8, 19);
      ctx.strokeRect(lx - 4, 6, 8, 19);
    });

    ctx.fillStyle = isHit ? '#ef4444' : stageId === 1 ? '#991b1b' : '#78350f';
    ctx.beginPath();
    ctx.moveTo(-19, -18 + breath);
    ctx.lineTo(19, -18 + breath);
    ctx.lineTo(13, 7 + breath);
    ctx.lineTo(-13, 7 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const headY = -26 + breath;
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.arc(0, headY, 11.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Exaggerated Mustache & Glaring Eyes
    ctx.fillStyle = '#fde047';
    ctx.fillRect(1, headY - 3, 5.5, 2.8);
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(8, headY + 3.5);
    ctx.quadraticCurveTo(0, headY + 6, -12, headY + 1);
    ctx.stroke();

    // Horned War-Crown
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-11, headY - 4);
    ctx.lineTo(-18, headY - 22);
    ctx.lineTo(-4, headY - 9);
    ctx.lineTo(0, headY - 18);
    ctx.lineTo(4, headY - 9);
    ctx.lineTo(18, headY - 22);
    ctx.lineTo(11, headY - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(14, -10 + breath);
    ctx.rotate(isAttacking ? Math.sin(time * 16) * 1.5 : 0.25);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2.5, -42, 5, 54);
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.quadraticCurveTo(18, -44, 16, -20);
    ctx.quadraticCurveTo(8, -24, 0, -24);
    ctx.moveTo(0, -32);
    ctx.quadraticCurveTo(-18, -44, -16, -20);
    ctx.quadraticCurveTo(-8, -24, 0, -24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}
