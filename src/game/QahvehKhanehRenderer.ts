import { GraphicsTier, HeroId } from '../types/game';

/**
 * Authentic Persian Qahveh-Khaneh Traditional Epic Hero Renderer
 * (مکتب نقاشی قهوه‌خانه‌ای و پرده‌خوانی اصیل شاهنامه - حسین قوللرآقاسی و محمد مدبر)
 *
 * Renders heroes with formidable pahlavani anatomy:
 * - Broad muscular shoulders and chest (کتف و سینه ستبر پهلوانی)
 * - Sculpted facial contours, flowing mustaches, kohl-rimmed fierce eyes (ابروهای کمانی و سبیل شاهانه)
 * - Authentic historical arms: Babr-e Bayan pelt, Gav-Sar mace, Mohreh-ye Rostam armlet,
 *   Sasanian turquoise scale cuirass, and damascened weapons.
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
}

export class QahvehKhanehRenderer {
  /**
   * Main rendering function for a Pahlavan in Qahveh-Khaneh traditional style
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
    } = opts;

    const isHigh = graphicsTier === 'high' || graphicsTier === 'ultra';
    const isUltra = graphicsTier === 'ultra';

    ctx.save();

    // Flip horizontally if facing left
    if (facing === -1) {
      ctx.scale(-1, 1);
    }

    // Hit reaction flash & camera stagger
    if (isHit) {
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
    }

    // Walking / Running leg swing
    const isMoving = Math.abs(vx) > 15;
    const stride = isMoving && isGrounded ? Math.sin(animFrame * 1.2) * 12 : 0;
    const idleBreath = !isMoving && isGrounded ? Math.sin(time * 3.5) * 1.8 : 0;

    // -------------------------------------------------------------
    // 1. DIVINE FARREH AURA (فرّه ایزدی و انوار پهلوانی)
    // -------------------------------------------------------------
    if (rageRatio > 0.1 || isParrying) {
      const auraR = 36 + rageRatio * 18 + (isParrying ? 12 : 0);
      const auraGrad = ctx.createRadialGradient(0, -6 + idleBreath, 6, 0, -6 + idleBreath, auraR);
      auraGrad.addColorStop(0, `rgba(254, 240, 138, ${0.2 + rageRatio * 0.4})`);
      auraGrad.addColorStop(0.65, `rgba(245, 158, 11, ${0.15 + rageRatio * 0.3})`);
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, -6 + idleBreath, auraR, 0, Math.PI * 2);
      ctx.fill();

      // Qahveh-Khaneh gold petal rays around head
      if (isHigh) {
        ctx.save();
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.35 + rageRatio * 0.45})`;
        ctx.lineWidth = 1.6;
        const rayCount = 7;
        for (let r = 0; r < rayCount; r++) {
          const ang = time * 2.5 + (r * Math.PI * 2) / rayCount;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * 14, -6 + idleBreath + Math.sin(ang) * 14);
          ctx.lineTo(Math.cos(ang) * (auraR - 2), -6 + idleBreath + Math.sin(ang) * (auraR - 2));
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // -------------------------------------------------------------
    // 2. FLOWING ROYAL SILK CAPE (شنل ابریشمی پهلوانی)
    // -------------------------------------------------------------
    this.drawCape(ctx, heroId, stride, vx, idleBreath, isUltra);

    // -------------------------------------------------------------
    // 3. PAHLAVANI LEGS & EMBROIDERED BOOTS (شلوار و پای‌افزار پهلوانی)
    // -------------------------------------------------------------
    this.drawPahlavaniLegs(ctx, heroId, stride, idleBreath, hasSimurghBoots, isUltra);

    // -------------------------------------------------------------
    // 4. FORMIDABLE MUSCULAR TORSO & ARMOR (سینه و کتف ستبر پهلوانی)
    // -------------------------------------------------------------
    this.drawTorsoAndArmor(ctx, heroId, idleBreath, isHit, isUltra);

    // -------------------------------------------------------------
    // 5. PAHLAVANI HEAD, FACE & MUSTACHE (سر، سیمای اسطوره‌ای و سبیل شاهانه)
    // -------------------------------------------------------------
    this.drawHeadAndFace(ctx, heroId, idleBreath, isUltra);

    // -------------------------------------------------------------
    // 6. HISTORICAL ARMS & WEAPONS (سلاح‌ها و ادوات رزمی تاریخی)
    // -------------------------------------------------------------
    this.drawWeapon(ctx, heroId, isAttacking, attackType, attackTimer, idleBreath, isUltra, time);

    ctx.restore();
  }

  /**
   * Flowing Cape with authentic Persian miniature drapery
   */
  private static drawCape(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    stride: number,
    vx: number,
    idleBreath: number,
    isUltra: boolean
  ) {
    const capeColor =
      heroId === 'rostam'
        ? '#7f1d1d' // Deep crimson silk
        : heroId === 'sohrab'
        ? '#0369a1' // Turanian turquoise ocean silk
        : heroId === 'gordafarid'
        ? '#d97706' // Saffron gold royal cape
        : '#475569';

    ctx.save();
    ctx.fillStyle = capeColor;

    const windSway = Math.sin(stride * 0.15) * 8 - (vx / 300) * 14;

    ctx.beginPath();
    ctx.moveTo(-10, -18 + idleBreath);
    ctx.quadraticCurveTo(-26 + windSway, -4, -32 + windSway * 1.4, 26);
    ctx.lineTo(-14, 24);
    ctx.quadraticCurveTo(-18, 4, -4, -16 + idleBreath);
    ctx.closePath();
    ctx.fill();

    // Gold embroidered hem (حاشیه زرین شنل در نسخه اولترا)
    if (isUltra) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-26 + windSway, -4);
      ctx.lineTo(-32 + windSway * 1.4, 26);
      ctx.lineTo(-14, 24);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Powerful pahlavani legs with anatomical curvature and curved leather boots
   */
  private static drawPahlavaniLegs(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    stride: number,
    idleBreath: number,
    hasSimurghBoots: boolean,
    isUltra: boolean
  ) {
    const legColor =
      heroId === 'rostam'
        ? '#1e293b' // Dark iron pahlavani breeches
        : heroId === 'sohrab'
        ? '#0c4a6e' // Cyan-tinted royal silk breeches
        : '#064e3b'; // Jade green silk riding trousers

    // Back leg
    ctx.fillStyle = legColor;
    ctx.beginPath();
    ctx.moveTo(-9 - stride, 8 + idleBreath);
    ctx.quadraticCurveTo(-13 - stride * 0.8, 16, -11 - stride, 25);
    ctx.lineTo(-4 - stride, 25);
    ctx.quadraticCurveTo(-4 - stride * 0.8, 16, -2 - stride, 8 + idleBreath);
    ctx.closePath();
    ctx.fill();

    // Front leg
    ctx.beginPath();
    ctx.moveTo(1 + stride, 8 + idleBreath);
    ctx.quadraticCurveTo(5 + stride * 0.8, 16, 7 + stride, 25);
    ctx.lineTo(14 + stride, 25);
    ctx.quadraticCurveTo(12 + stride * 0.8, 16, 8 + stride, 8 + idleBreath);
    ctx.closePath();
    ctx.fill();

    // Traditional Persian curved pointed leather boots (چکمه‌های نوک‌برگشته صفوی)
    const bootColor = hasSimurghBoots ? '#eab308' : '#78350f';
    const bootTrim = hasSimurghBoots ? '#fef08a' : '#d97706';

    [
      { x: -11 - stride, w: 9 },
      { x: 7 + stride, w: 9 },
    ].forEach((b) => {
      ctx.fillStyle = bootColor;
      ctx.beginPath();
      ctx.moveTo(b.x, 18);
      ctx.lineTo(b.x + b.w, 18);
      ctx.lineTo(b.x + b.w + 4, 26);
      // Curved Persian upturned toe (نوک برگشته سنتی)
      ctx.quadraticCurveTo(b.x + b.w + 7, 26, b.x + b.w + 6, 23);
      ctx.lineTo(b.x, 26);
      ctx.closePath();
      ctx.fill();

      // Gold knee guard rim
      ctx.fillStyle = bootTrim;
      ctx.fillRect(b.x, 17, b.w, 2.5);
    });
  }

  /**
   * Muscular Pahlavan Torso, Broad Shoulders, and Detailed Historical Armor
   */
  private static drawTorsoAndArmor(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    idleBreath: number,
    isHit: boolean,
    isUltra: boolean
  ) {
    // Broad, heroic shoulder base (کتف و سینه ستبر پهلوانی)
    const shoulderWidth = heroId === 'rostam' ? 38 : heroId === 'sohrab' ? 34 : 30;
    const halfSw = shoulderWidth / 2;

    if (heroId === 'rostam') {
      // -------------------------------------------------------
      // ROSTAM: Babr-e Bayan (ببر بیان) Tiger Pelt & Golden Chainmail
      // -------------------------------------------------------
      // Inner Chainmail
      ctx.fillStyle = isHit ? '#ef4444' : '#b45309';
      ctx.beginPath();
      ctx.moveTo(-halfSw, -16 + idleBreath);
      ctx.lineTo(halfSw, -16 + idleBreath);
      ctx.lineTo(halfSw - 5, 8 + idleBreath);
      ctx.lineTo(-halfSw + 5, 8 + idleBreath);
      ctx.closePath();
      ctx.fill();

      // Babr-e Bayan Tawny Tiger Pelt Vest
      ctx.fillStyle = isHit ? '#f87171' : '#d97706';
      ctx.beginPath();
      ctx.moveTo(-halfSw + 2, -16 + idleBreath);
      ctx.lineTo(halfSw - 2, -16 + idleBreath);
      ctx.lineTo(halfSw - 6, 7 + idleBreath);
      ctx.lineTo(-halfSw + 6, 7 + idleBreath);
      ctx.closePath();
      ctx.fill();

      // Bold Tiger Fur Stripes (خطوط پوست ببر بیان)
      ctx.fillStyle = '#18181b';
      for (let s = 0; s < 5; s++) {
        const sy = -13 + idleBreath + s * 4;
        ctx.beginPath();
        ctx.moveTo(-halfSw + 3, sy);
        ctx.lineTo(-halfSw + 11, sy + 2);
        ctx.lineTo(-halfSw + 3, sy + 3.5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(halfSw - 3, sy);
        ctx.lineTo(halfSw - 11, sy + 2);
        ctx.lineTo(halfSw - 3, sy + 3.5);
        ctx.closePath();
        ctx.fill();
      }

      // Golden Lion-Embossed Shoulder Pauldrons (سرشانه زرین شیرنشان)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(-halfSw + 1, -15 + idleBreath, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(halfSw - 1, -15 + idleBreath, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Heavy Pahlavani Golden Belt with Lion Buckle (کمربند زرین پهلوانی)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-halfSw + 6, 5 + idleBreath, shoulderWidth - 12, 5);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 7.5 + idleBreath, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (heroId === 'sohrab') {
      // -------------------------------------------------------
      // SOHRAB: Turanian Turquoise Scale Armor (زره پولادین و فیروزه‌ای)
      // -------------------------------------------------------
      ctx.fillStyle = isHit ? '#ef4444' : '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-halfSw, -16 + idleBreath);
      ctx.lineTo(halfSw, -16 + idleBreath);
      ctx.lineTo(halfSw - 4, 8 + idleBreath);
      ctx.lineTo(-halfSw + 4, 8 + idleBreath);
      ctx.closePath();
      ctx.fill();

      // Fine Interlocking Scale Mail Pattern
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 1;
      for (let y = -12 + idleBreath; y <= 4; y += 4) {
        for (let x = -halfSw + 5; x <= halfSw - 5; x += 5) {
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI);
          ctx.stroke();
        }
      }

      // Mohreh-ye Rostam (مهره رستم) Armlet on Right Arm with Glowing Ruby
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#f87171';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(halfSw + 1, -8 + idleBreath, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Silver Shoulder Pauldrons
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(-halfSw + 1, -15 + idleBreath, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(halfSw - 1, -15 + idleBreath, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Silk Sash Belt
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-halfSw + 5, 5 + idleBreath, shoulderWidth - 10, 5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-2, 5 + idleBreath, 4, 8);
    } else {
      // -------------------------------------------------------
      // GORDAFARID: Chased Emerald Jade Armor (زره یشمی زرنگار)
      // -------------------------------------------------------
      ctx.fillStyle = isHit ? '#ef4444' : '#059669';
      ctx.beginPath();
      ctx.moveTo(-halfSw, -16 + idleBreath);
      ctx.lineTo(halfSw, -16 + idleBreath);
      ctx.lineTo(halfSw - 5, 8 + idleBreath);
      ctx.lineTo(-halfSw + 5, 8 + idleBreath);
      ctx.closePath();
      ctx.fill();

      // Gold Filigree Rosette on Breastplate (گل و بوته زرین روی سینه)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, -6 + idleBreath, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(0, -6 + idleBreath, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Pearl Trim along Collar and Belt
      ctx.fillStyle = '#f8fafc';
      for (let x = -halfSw + 3; x <= halfSw - 3; x += 4) {
        ctx.fillRect(x, -16 + idleBreath, 2, 2);
        ctx.fillRect(x, 6 + idleBreath, 2, 2);
      }
    }
  }

  /**
   * Head, Fierce Mythic Face, Pahlavani Mustache, and Distinctive Helmet
   */
  private static drawHeadAndFace(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    idleBreath: number,
    isUltra: boolean
  ) {
    const headY = -24 + idleBreath;

    // Muscular neck
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, headY + 7, 10, 6);

    // Formidable sculpted jawline (فرم چهره پهلوانی)
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, headY, 11, 0, Math.PI * 2);
    ctx.fill();

    // Dark almond kohl-rimmed eyes (چشمان سرمه‌کشیده حماسی)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(1, headY - 2, 5, 3.5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(3, headY - 2, 2.5, 3.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3.5, headY - 1.5, 1, 1);

    // Arched connected eyebrows (ابروهای کمانی پیوسته)
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-2, headY - 4);
    ctx.quadraticCurveTo(3, headY - 6, 7, headY - 3.5);
    ctx.lineTo(7, headY - 2.5);
    ctx.quadraticCurveTo(3, headY - 4.5, -2, headY - 3);
    ctx.closePath();
    ctx.fill();

    if (heroId === 'rostam') {
      // -------------------------------------------------------
      // ROSTAM: Majestic Handlebar Mustache & Curled Beard
      // -------------------------------------------------------
      // Magnificent Flowing Mustache (سبیل پرپشت تاب‌داده شاهانه)
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-2, headY + 3.5);
      ctx.quadraticCurveTo(4, headY + 5, 9, headY + 1.5);
      ctx.stroke();

      // Pahlavani Full Wavy Beard (ریش مجعد تهمتن)
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(-8, headY + 2);
      ctx.quadraticCurveTo(0, headY + 17, 8, headY + 2);
      ctx.lineTo(4, headY + 8);
      ctx.lineTo(-4, headY + 8);
      ctx.closePath();
      ctx.fill();

      // Battle Scar
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(3, headY + 2);
      ctx.lineTo(5, headY + 6);
      ctx.stroke();

      // Div Sepid Skull Helmet with Majestic Curved Horns (کلاه‌خود دیو سپید)
      this.drawRostamDivHelmet(ctx, headY);
    } else if (heroId === 'sohrab') {
      // -------------------------------------------------------
      // SOHRAB: Young Royal Hero Visage & Sasanian Plumed Helmet
      // -------------------------------------------------------
      // Youthful trimmed mustache
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, headY + 3);
      ctx.quadraticCurveTo(4, headY + 4, 8, headY + 2);
      ctx.stroke();

      // Sasanian Spangenhelm with Peacock Plume (کلاه‌خود سیمین با پر طاووس)
      this.drawSohrabHelmet(ctx, headY);
    } else {
      // -------------------------------------------------------
      // GORDAFARID: Warrior Maiden Tiara & Raven Braided Tresses
      // -------------------------------------------------------
      // Crimson lips
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(2, headY + 4, 4, 1.8);

      // Braided raven hair framing the face (گیسوان بافته مشکی)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, headY - 3, 11.5, Math.PI, 0);
      ctx.fill();

      // Left & right braids
      ctx.fillRect(-13, headY - 1, 4, 18);
      ctx.fillRect(9, headY - 1, 4, 18);

      // Golden Tiara (دیهیم زرین پهلوانی)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-11, headY - 7, 22, 4);
      ctx.beginPath();
      ctx.moveTo(0, headY - 12);
      ctx.lineTo(-5, headY - 7);
      ctx.lineTo(5, headY - 7);
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * Rostam's Div Skull Helmet with authentic ivory horn curvature
   */
  private static drawRostamDivHelmet(ctx: CanvasRenderingContext2D, headY: number) {
    // Ivory Skull Cap
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, headY - 3, 12, Math.PI, 0);
    ctx.lineTo(12, headY + 1);
    ctx.lineTo(-12, headY + 1);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Curved Ram Horns (شاخ‌های پیچ‌خورده دیو سپید)
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;

    // Left horn
    ctx.beginPath();
    ctx.moveTo(-10, headY - 2);
    ctx.quadraticCurveTo(-22, headY - 16, -24, headY - 24);
    ctx.quadraticCurveTo(-15, headY - 12, -4, headY - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right horn
    ctx.beginPath();
    ctx.moveTo(10, headY - 2);
    ctx.quadraticCurveTo(22, headY - 16, 24, headY - 24);
    ctx.quadraticCurveTo(15, headY - 12, 4, headY - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Topaz Eyes on skull forehead
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-6, headY - 2, 3, 2.5);
    ctx.fillRect(3, headY - 2, 3, 2.5);
  }

  /**
   * Sohrab's Sasanian Silver Spangenhelm with Red Plume
   */
  private static drawSohrabHelmet(ctx: CanvasRenderingContext2D, headY: number) {
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(0, headY - 3, 12, Math.PI, 0);
    ctx.lineTo(12, headY + 1);
    ctx.lineTo(0, headY - 15);
    ctx.lineTo(-12, headY + 1);
    ctx.closePath();
    ctx.fill();

    // Golden Nasal Bar and Brow band
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-11, headY - 3, 22, 3.5);
    ctx.fillRect(-1.5, headY - 2, 3, 7);

    // Flowing Red Horsehair Plume (پر سرخ کلاه‌خود)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, headY - 15);
    ctx.quadraticCurveTo(-12, headY - 28, -20, headY - 22);
    ctx.lineTo(-4, headY - 17);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Historical Persian Arms with Multi-Frame Attack Animation
   */
  private static drawWeapon(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    isAttacking: boolean,
    attackType: string = 'light',
    attackTimer: number,
    idleBreath: number,
    isUltra: boolean,
    time: number
  ) {
    const swingAngle = isAttacking
      ? attackType === 'heavy'
        ? Math.sin(attackTimer * 14) * 1.8
        : Math.sin(attackTimer * 20) * 1.4
      : 0.3;

    ctx.save();
    ctx.translate(14, -6 + idleBreath);
    ctx.rotate(swingAngle);

    if (heroId === 'rostam') {
      // -------------------------------------------------------
      // ROSTAM: The Bull-Headed Mace (گرز گاوسار سام نریمان)
      // -------------------------------------------------------
      // Steel fluted haft
      ctx.fillStyle = '#475569';
      ctx.fillRect(-3, -36, 6, 42);

      // Gold inlay rings on haft
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-4, -28, 8, 3);
      ctx.fillRect(-4, -14, 8, 3);

      // Sculpted Heavy Bronze Bull Head (سردیس گاوسار)
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(0, -42, 10, 0, Math.PI * 2);
      ctx.fill();

      // Bull Horns on Mace Head (شاخ‌های گاو روی گرز)
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(-6, -45);
      ctx.lineTo(-14, -54);
      ctx.lineTo(-4, -48);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(6, -45);
      ctx.lineTo(14, -54);
      ctx.lineTo(4, -48);
      ctx.closePath();
      ctx.fill();
    } else if (heroId === 'sohrab') {
      // -------------------------------------------------------
      // SOHRAB: Curved Damascus Scimitar (شمشیر دمشقی)
      // -------------------------------------------------------
      // Curved blade
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(14, -24, 22, -44);
      ctx.lineTo(19, -44);
      ctx.quadraticCurveTo(11, -22, -2, 0);
      ctx.closePath();
      ctx.fill();

      // Golden crossguard & hilt
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-6, -2, 12, 4);
      ctx.fillRect(-2, -8, 4, 8);
    } else {
      // -------------------------------------------------------
      // GORDAFARID: Royal Recurve Bow & Golden Spear
      // -------------------------------------------------------
      // Golden Spear Shaft
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-2, 12);
      ctx.lineTo(12, -48);
      ctx.stroke();

      // Leaf-shaped spear blade
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(12, -48);
      ctx.lineTo(8, -42);
      ctx.lineTo(12, -32);
      ctx.lineTo(16, -42);
      ctx.closePath();
      ctx.fill();

      // Saffron Pennon / Tassel (منگوله زعفرانی سنان)
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(12, -32);
      ctx.lineTo(18, -26 + Math.sin(time * 6) * 3);
      ctx.lineTo(12, -24);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}
