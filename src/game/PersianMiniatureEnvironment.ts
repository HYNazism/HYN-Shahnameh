import { GraphicsTier } from '../types/game';

/**
 * Persian Miniature Environment Renderer (نگارگری حماسی شاهنامه)
 * 
 * Provides an authentic Persian miniature visual aesthetic for battlegrounds,
 * with dynamic multi-layer parallax scrolling shifting across iconic Shahnameh realms:
 * - Stage 1 & 6: The Golden Plains of Zabol (دشت‌های زرین زابلستان، سروهای ناز و تخت جمشید)
 * - Stage 2: Mount Damavand & Zahhak's Lair (کوه آتشین دماوند و طلسم ماران)
 * - Stage 3: The Dark Caves of Mazandaran (غارهای تاریک و مهیب مازندران، بلورها و چشمان دیوان)
 * - Stage 4: The White Fortress of Dej-e Sepid (دژ سپید و مرزهای صخره‌ای ایران و توران)
 * - Stage 5: Siavashgard & The Sacred Pyre of Fire (کاخ فیروزه‌ای سیاوش‌گرد و گلستان آتش)
 * - Stage 7: The Gorges of Kabulistan & Eternal Plane Tree (دره کابلستان و چنار کهنسال رستم)
 */
export class PersianMiniatureEnvironment {
  private starSeeds: Array<{ x: number; y: number; size: number; alpha: number }> = [];
  private sporeSeeds: Array<{ x: number; y: number; speed: number; radius: number; hue: number }> = [];

  constructor() {
    // Generate deterministic celestial star points for night skies
    for (let i = 0; i < 70; i++) {
      this.starSeeds.push({
        x: (i * 137.5) % 1600,
        y: (i * 83.1) % 450,
        size: (i % 3 === 0) ? 2.2 : (i % 2 === 0) ? 1.6 : 1.0,
        alpha: 0.35 + ((i % 5) * 0.15),
      });
    }

    // Generate spore/crystal dust particles for Mazandaran cave
    for (let i = 0; i < 40; i++) {
      this.sporeSeeds.push({
        x: (i * 97) % 1800,
        y: (i * 71) % 500,
        speed: 0.4 + (i % 4) * 0.25,
        radius: 1.5 + (i % 3) * 1.2,
        hue: (i % 2 === 0) ? 175 : 150, // Cyan & Emerald bioluminescence
      });
    }
  }

  /**
   * Main render entry point for dynamic Persian miniature battle environment
   */
  public render(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    cameraX: number,
    stageId: number,
    graphicsTier: GraphicsTier,
    time: number
  ) {
    const isUltra = graphicsTier === 'ultra';
    const isHigh = graphicsTier === 'high';

    // Route to appropriate Persian landscape archetype
    switch (stageId) {
      case 3:
        // Dark Caves of Mazandaran (غارهای مازندران)
        this.renderMazandaranCave(ctx, w, h, cameraX, isUltra, isHigh, time);
        break;

      case 2:
        // Mount Damavand & Zahhak's Lair (دماوند و دژ ضحاک)
        this.renderDamavandVolcano(ctx, w, h, cameraX, isUltra, isHigh, time);
        break;

      case 4:
        // Dej-e Sepid Fortress (دژ سپید)
        this.renderDejeSepidFortress(ctx, w, h, cameraX, isUltra, isHigh, time);
        break;

      case 5:
        // Siavashgard & Fire Plains (کوه آتش سیاوش و کاخ فیروزه‌ای)
        this.renderSiavashgardPyre(ctx, w, h, cameraX, isUltra, isHigh, time);
        break;

      case 7:
        // Kabulistan Ravine & Sacred Plane Tree (کابلستان و چنار کهنسال)
        this.renderKabulistanGorge(ctx, w, h, cameraX, isUltra, isHigh, time);
        break;

      case 1:
      case 6:
      default:
        // Golden Plains of Zabol (دشت‌های زابلستان)
        this.renderZabolPlains(ctx, w, h, cameraX, isUltra, isHigh, time);
        break;
    }

    // Tahmasbi Coral Crags & Zar-Afshan Gold Sky Flecks
    this.renderZarAfshanSkyFlecks(ctx, w, h, cameraX, time);
    this.renderTahmasbiCoralCrags(ctx, w, h, cameraX, stageId);

    // Atmospheric miniature manuscript border illumination (جدول‌کشی و لچک تذهیب حاشیه‌ای)
    this.renderMiniatureIlluminatedTrim(ctx, w, h);
  }

  /**
   * Zar-Afshan (افشان ورق طلای ۲۴ عیار و غبار نبرد در آسمان نگارگری)
   */
  private renderZarAfshanSkyFlecks(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    time: number
  ) {
    ctx.save();
    for (let i = 0; i < this.starSeeds.length; i += 2) {
      const s = this.starSeeds[i];
      const fx = (((s.x - camX * 0.08 + Math.sin(time * 0.7 + i) * 10) % w) + w) % w;
      const fy = (s.y * 1.35) % (h * 0.68);
      ctx.fillStyle = i % 3 === 0 ? 'rgba(253, 224, 71, 0.42)' : 'rgba(217, 119, 6, 0.28)';
      ctx.fillRect(fx, fy, s.size * 1.15, s.size * 1.15);
    }
    ctx.restore();
  }

  /**
   * Shahnameh of Shah Tahmasp Swirling Coral Crags (صخره‌های مرجانی پیچان مکتب تبریز با رگه‌های لاجورد و طلا)
   */
  private renderTahmasbiCoralCrags(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    stageId: number
  ) {
    ctx.save();
    const cragOffset = -camX * 0.16;
    const palette =
      stageId === 2
        ? { base: '#082f49', vein: '#38bdf8', gold: '#fbbf24' }
        : stageId === 3 || stageId === 6
        ? { base: '#3b0764', vein: '#f43f5e', gold: '#f59e0b' }
        : stageId === 4
        ? { base: '#31102f', vein: '#c084fc', gold: '#fde047' }
        : { base: '#1e1b4b', vein: '#818cf8', gold: '#d4af37' };

    for (let i = 0; i < 6; i++) {
      const cx = (((i * 260 + cragOffset) % (w + 320)) + (w + 320)) % (w + 320) - 60;
      const cy = 382 + Math.sin(i * 2.1) * 16;

      ctx.fillStyle = palette.base;
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(cx - 38, cy + 45);
      ctx.bezierCurveTo(cx - 42, cy + 5, cx - 18, cy - 28, cx - 4, cy - 16);
      ctx.bezierCurveTo(cx + 6, cy - 38, cx + 32, cy - 22, cx + 26, cy + 4);
      ctx.bezierCurveTo(cx + 44, cy + 12, cx + 40, cy + 36, cx + 36, cy + 45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner mineral pigment spiral whorl (گره سنگی طهماسبی)
      ctx.strokeStyle = palette.vein;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx + 6, cy - 8, 8, 0, Math.PI * 1.45);
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // ENVIRONMENT 1: THE GOLDEN PLAINS OF ZABOL (دشت‌های زرین زابلستان)
  // =========================================================================
  private renderZabolPlains(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    isUltra: boolean,
    isHigh: boolean,
    time: number
  ) {
    // Layer 1: Lapis Lazuli to Amber Gold Miniature Sky (آسمان زرین و لاجوردی)
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0a1931');
    sky.addColorStop(0.35, '#18385f');
    sky.addColorStop(0.68, '#854d0e');
    sky.addColorStop(0.88, '#d97706');
    sky.addColorStop(1, '#fde68a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Radiant Miniature Gilded Sun (خورشید زرین با پرتوهای اسلیمی)
    const sunX = w * 0.76 - camX * 0.02;
    const sunY = 95;
    this.renderMiniatureGildedSun(ctx, sunX, sunY, isUltra, isHigh, time);

    // Persian Miniature Ribbon Clouds (ابرهای پیچان و تاش‌دار نگارگری)
    this.renderCurlingMiniatureClouds(ctx, w, camX * 0.035, '#fef08a', 'rgba(217, 119, 6, 0.45)', time, [
      { xRatio: 0.15, y: 70, scale: 1.1 },
      { xRatio: 0.48, y: 110, scale: 0.85 },
      { xRatio: 0.85, y: 60, scale: 1.3 },
    ]);

    // Distant Stepped Mountain Cliffs of Sistan (صخره‌های مطبق نگارگری - Parallax 0.07)
    const farOffset = -camX * 0.07;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 140) {
      const px = x + (farOffset % 140);
      const py = 230 + Math.sin(x * 0.012) * 45;
      ctx.lineTo(px, py);
      ctx.lineTo(px + 45, py + 12);
      ctx.lineTo(px + 80, py - 18);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Stylized Mount Damavand in distance with snowcap
    const damavandX = ((w * 0.38 + farOffset) % (w + 500)) - 100;
    this.renderDamavandPeak(ctx, damavandX, 170, 240, h, '#334155', '#e2e8f0');

    // Soaring Golden Simurgh (سیمرغ پرگشوده با بال‌های زمرد و زر)
    const simurghX = ((w * 0.62 - camX * 0.04 + time * 32) % (w + 350)) - 120;
    const simurghY = 120 + Math.sin(time * 1.8) * 15;
    this.renderMiniatureSimurgh(ctx, simurghX, simurghY, time, isUltra);

    // Midground: Rolling Golden Hills & Achaemenid Columns (تپه‌های زابل و ستون‌های تخت جمشید - Parallax 0.22)
    const midOffset = -camX * 0.22;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 110) {
      const px = x + (midOffset % 110);
      const py = 350 + Math.cos(x * 0.018) * 35;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Persian Cypress Trees (سروهای راست‌قامت زابلستان) & Persepolis Columns
    const featureCount = 5;
    for (let i = 0; i < featureCount; i++) {
      const posX = ((i * 320 + midOffset) % (w + 400)) - 80;
      const groundY = 380 + Math.sin(i * 1.7) * 20;

      // Draw Cypress Tree
      this.drawPersianCypress(ctx, posX, groundY, 110, 22);

      // Draw Persepolis Fluted Column alongside some cypresses
      if (i % 2 === 0) {
        this.drawPersepolisColumn(ctx, posX + 80, groundY + 15, 85);
      }
    }

    // Near Foreground: Flowering Pomegranate Bushes & Golden Steppe Grass (Parallax 0.45)
    const nearOffset = -camX * 0.45;
    this.renderMiniatureShrubsAndFlowers(ctx, w, h, nearOffset, '#064e3b', '#f43f5e', '#fbbf24');
  }

  // =========================================================================
  // ENVIRONMENT 2: THE DARK CAVES OF MAZANDARAN (غارهای تاریک و مهیب مازندران)
  // =========================================================================
  private renderMazandaranCave(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    isUltra: boolean,
    isHigh: boolean,
    time: number
  ) {
    // Layer 1: Pitch-black to Abyssal Teal Subterranean Void
    const cavernGrad = ctx.createLinearGradient(0, 0, 0, h);
    cavernGrad.addColorStop(0, '#020617');
    cavernGrad.addColorStop(0.3, '#041d24');
    cavernGrad.addColorStop(0.65, '#022c22');
    cavernGrad.addColorStop(1, '#020617');
    ctx.fillStyle = cavernGrad;
    ctx.fillRect(0, 0, w, h);

    // Deep Cave Bioluminescent Horizon Glow
    const glowY = h * 0.55;
    const abyssGlow = ctx.createRadialGradient(w * 0.5, glowY, 50, w * 0.5, glowY, w * 0.7);
    abyssGlow.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
    abyssGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
    abyssGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = abyssGlow;
    ctx.fillRect(0, 0, w, h);

    // Layer 2: Massive Jagged Stalactites on Cavern Ceiling (قندیل‌های سنگی سقف غار - Parallax 0.06)
    const ceilOffset = -camX * 0.06;
    ctx.fillStyle = '#06131d';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    for (let x = w + 160; x >= -160; x -= 90) {
      const px = x + (ceilOffset % 90);
      const stalactiteLen = 70 + Math.sin(x * 0.04) * 45;
      ctx.lineTo(px, stalactiteLen);
      ctx.lineTo(px - 30, 20);
    }
    ctx.closePath();
    ctx.fill();

    // Cyan crystal tips on stalactites
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    for (let x = 0; x <= w + 200; x += 180) {
      const px = x + (ceilOffset % 180);
      const py = 75 + Math.sin(x * 0.04) * 40;
      ctx.beginPath();
      ctx.moveTo(px, py - 18);
      ctx.lineTo(px, py);
      ctx.stroke();
    }

    // Layer 3: Cavern Archways & Glowing Mineral Crystals (ستون‌های سنگی و بلورها - Parallax 0.20)
    const midOffset = -camX * 0.20;
    ctx.fillStyle = '#09151e';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 120) {
      const px = x + (midOffset % 120);
      const py = 320 + Math.cos(x * 0.02) * 50;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Monolithic Natural Pillars with Glowing Crystals & Blinking Demon Eyes
    const pillarCount = 5;
    for (let i = 0; i < pillarCount; i++) {
      const px = ((i * 340 + midOffset) % (w + 450)) - 70;
      const baseGroundY = 460;

      // Heavy Jagged Cave Column
      ctx.fillStyle = '#030a10';
      ctx.beginPath();
      ctx.moveTo(px - 35, baseGroundY);
      ctx.lineTo(px - 22, 60);
      ctx.lineTo(px + 22, 60);
      ctx.lineTo(px + 35, baseGroundY);
      ctx.closePath();
      ctx.fill();

      // Glowing Cyan & Emerald Crystals clustered on column sides
      this.drawBioluminescentCrystalCluster(ctx, px - 24, baseGroundY - 80, '#06b6d4', isUltra);
      this.drawBioluminescentCrystalCluster(ctx, px + 22, baseGroundY - 140, '#10b981', isUltra);

      // Blinking Demonic Eyes in Cave Crevices (چشمان اهریمنی دیوان مازندران)
      const blinkCycle = Math.sin(time * 2 + i * 2.3);
      if (blinkCycle > 0.1) {
        ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = isUltra ? 8 : 4;
        const eyeY = baseGroundY - 180 + Math.sin(i) * 30;
        ctx.fillRect(px - 8, eyeY, 4, 3);
        ctx.fillRect(px + 4, eyeY, 4, 3);
        ctx.shadowBlur = 0;
      }
    }

    // Subterranean Spores & Drifting Fog Motes (ذرات شناور در تاریکی غار)
    if (isHigh || isUltra) {
      this.renderCaveSporeParticles(ctx, w, h, camX, time);
    }

    // Near Stalagmites rising from ground (قندیل‌های کف غار - Parallax 0.40)
    const nearOffset = -camX * 0.40;
    ctx.fillStyle = '#02060c';
    for (let x = 0; x <= w + 160; x += 110) {
      const px = x + (nearOffset % 110);
      const py = 430;
      const height = 45 + Math.sin(x * 0.05) * 25;
      ctx.beginPath();
      ctx.moveTo(px - 14, py);
      ctx.lineTo(px, py - height);
      ctx.lineTo(px + 14, py);
      ctx.closePath();
      ctx.fill();
    }
  }

  // =========================================================================
  // ENVIRONMENT 3: MOUNT DAMAVAND & ZAHHAK'S LAIR (دماوند و دژ ضحاک ماردوش)
  // =========================================================================
  private renderDamavandVolcano(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    isUltra: boolean,
    isHigh: boolean,
    time: number
  ) {
    // Fiery volcanic skies
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#2d0606');
    sky.addColorStop(0.4, '#4c0519');
    sky.addColorStop(0.75, '#7f1d1d');
    sky.addColorStop(1, '#ea580c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Eerie Crimson Moon veiled in smoke
    const moonX = w * 0.8 - camX * 0.025;
    const moonY = 85;
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 24, 0, Math.PI * 2);
    ctx.fill();

    // Miniature Volcanic Smoke Plumes
    this.renderCurlingMiniatureClouds(ctx, w, camX * 0.04, '#1c1917', 'rgba(239, 68, 68, 0.4)', time, [
      { xRatio: 0.25, y: 80, scale: 1.2 },
      { xRatio: 0.65, y: 95, scale: 0.9 },
    ]);

    // Mount Damavand silhouette with molten fissures (Parallax 0.08)
    const farOffset = -camX * 0.08;
    const damavandX = ((w * 0.5 + farOffset) % (w + 400)) - 100;
    this.renderDamavandPeak(ctx, damavandX, 150, 300, h, '#2a0909', '#f87171');

    // Zahhak's Black Fortress Battlements & Iron Chains (دژ سیاه و زنجیرهای ضحاک - Parallax 0.24)
    const midOffset = -camX * 0.24;
    ctx.fillStyle = '#170505';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 130) {
      const px = x + (midOffset % 130);
      const py = 360 + Math.sin(x * 0.02) * 40;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Braziers with Green Alchemical Flames (آتشدان‌های اهریمنی ضحاک)
    for (let i = 0; i < 4; i++) {
      const bx = ((i * 380 + midOffset) % (w + 400)) - 50;
      const by = 385;
      this.drawAlchemicalBrazier(ctx, bx, by, time, isUltra);
    }
  }

  // =========================================================================
  // ENVIRONMENT 4: THE WHITE FORTRESS OF DEJ-E SEPID (دژ سپید)
  // =========================================================================
  private renderDejeSepidFortress(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    isUltra: boolean,
    isHigh: boolean,
    time: number
  ) {
    // Dusk twilight sky of the Persian frontier
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1e1b4b');
    sky.addColorStop(0.35, '#3b0764');
    sky.addColorStop(0.65, '#831843');
    sky.addColorStop(0.85, '#9d174d');
    sky.addColorStop(1, '#fbcfe8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Crescent Moon of Destiny
    const moonX = w * 0.78 - camX * 0.02;
    const moonY = 80;
    this.renderMiniatureCrescentMoon(ctx, moonX, moonY);

    // Miniature Lavender Clouds
    this.renderCurlingMiniatureClouds(ctx, w, camX * 0.035, '#fce7f3', 'rgba(157, 23, 77, 0.4)', time, [
      { xRatio: 0.2, y: 75, scale: 1.0 },
      { xRatio: 0.7, y: 110, scale: 1.2 },
    ]);

    // Border Mountain Ridges (Parallax 0.08)
    const farOffset = -camX * 0.08;
    ctx.fillStyle = '#2e1065';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 140) {
      const px = x + (farOffset % 140);
      const py = 250 + Math.sin(x * 0.015) * 50;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Majestic White Bastions of Dej-e Sepid (باروهای سفید دژ سپید - Parallax 0.24)
    const midOffset = -camX * 0.24;
    for (let i = 0; i < 4; i++) {
      const fortX = ((i * 380 + midOffset) % (w + 450)) - 90;
      const fortBaseY = 410;
      this.drawDejeSepidTower(ctx, fortX, fortBaseY, time);
    }
  }

  // =========================================================================
  // ENVIRONMENT 5: SIAVASHGARD & THE PYRE OF FIRE (کوه آتش سیاوش و کاخ فیروزه‌ای)
  // =========================================================================
  private renderSiavashgardPyre(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    isUltra: boolean,
    isHigh: boolean,
    time: number
  ) {
    // Flaming golden sunset
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1c1917');
    sky.addColorStop(0.3, '#7c2d12');
    sky.addColorStop(0.65, '#ea580c');
    sky.addColorStop(1, '#fde047');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Golden Clouds
    this.renderCurlingMiniatureClouds(ctx, w, camX * 0.035, '#fef08a', 'rgba(234, 88, 12, 0.4)', time, [
      { xRatio: 0.3, y: 65, scale: 1.2 },
      { xRatio: 0.8, y: 90, scale: 1.0 },
    ]);

    // Turquoise Domes of Siavashgard in Distance (گنبدهای فیروزه‌ای سیاوش‌گرد - Parallax 0.12)
    const farOffset = -camX * 0.12;
    for (let i = 0; i < 3; i++) {
      const dx = ((i * 450 + farOffset) % (w + 400)) - 60;
      this.drawTurquoiseDome(ctx, dx, 220, 70);
    }

    // Sacred Mountain of Fire & Miraculous Roses (کوه آتش مقدس و گلستان - Parallax 0.25)
    const midOffset = -camX * 0.25;
    ctx.fillStyle = '#431407';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 110) {
      const px = x + (midOffset % 110);
      const py = 350 + Math.sin(x * 0.02) * 35;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Sacred Flames turning into Blooming Flowers (شکوفه‌های آتش)
    this.renderMiniatureShrubsAndFlowers(ctx, w, h, midOffset, '#15803d', '#ef4444', '#fbbf24');
  }

  // =========================================================================
  // ENVIRONMENT 7: KABULISTAN GORGE & THE ANCIENT PLANE TREE (کابلستان و چنار کهنسال)
  // =========================================================================
  private renderKabulistanGorge(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    isUltra: boolean,
    isHigh: boolean,
    time: number
  ) {
    // Deep midnight mystical indigo sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#020617');
    sky.addColorStop(0.4, '#0f172a');
    sky.addColorStop(0.75, '#1e1b4b');
    sky.addColorStop(1, '#312e81');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Stars of Destiny
    ctx.fillStyle = '#f8fafc';
    this.starSeeds.forEach((s) => {
      const sx = (s.x - camX * 0.015) % w;
      const posX = sx < 0 ? sx + w : sx;
      ctx.globalAlpha = s.alpha * (0.8 + Math.sin(time * 2 + s.x) * 0.2);
      ctx.beginPath();
      ctx.arc(posX, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Colossal Ancient Plane Tree (چنار کهنسال شاهنامه - Parallax 0.20)
    const midOffset = -camX * 0.20;
    const treeX = ((w * 0.55 + midOffset) % (w + 500)) - 100;
    this.drawAncientPlaneTree(ctx, treeX, 420);
  }

  // =========================================================================
  // HELPER METHODS: AUTHENTIC PERSIAN MINIATURE ART ELEMENTS
  // =========================================================================

  /**
   * Persian Gilded Sun (خورشید طلایی نگارگری)
   */
  private renderMiniatureGildedSun(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isUltra: boolean,
    isHigh: boolean,
    time: number
  ) {
    // Outer golden aura corona
    const sunGrad = ctx.createRadialGradient(x, y, 10, x, y, 85);
    sunGrad.addColorStop(0, '#fffbeb');
    sunGrad.addColorStop(0.3, '#fde047');
    sunGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.25)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(x, y, 85, 0, Math.PI * 2);
    ctx.fill();

    // Solid core sun orb
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Stylized Persian sunbeams (شعاع‌های زرین نگارگری)
    if (isHigh || isUltra) {
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1.5;
      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i * (Math.PI * 2) / rayCount) + (time * 0.08);
        const r1 = 28;
        const r2 = 52 + Math.sin(time * 3 + i) * 6;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * r1, y + Math.sin(angle) * r1);
        ctx.lineTo(x + Math.cos(angle) * r2, y + Math.sin(angle) * r2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /**
   * Persian Miniature Gilded Crescent Moon (هلال ماه زرین نگارگری)
   */
  private renderMiniatureCrescentMoon(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Halo glow
    const halo = ctx.createRadialGradient(x, y, 6, x, y, 40);
    halo.addColorStop(0, 'rgba(254, 240, 138, 0.5)');
    halo.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    // Golden Crescent
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Cutout with background color to form elegant crescent
    ctx.fillStyle = '#2e1065';
    ctx.beginPath();
    ctx.arc(x + 7, y - 4, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Persian Miniature Ribbon Cloud Scrolls (ابرهای پیچان و تاش‌دار نگارگری)
   */
  private renderCurlingMiniatureClouds(
    ctx: CanvasRenderingContext2D,
    w: number,
    offset: number,
    fillColor: string,
    strokeColor: string,
    time: number,
    clouds: Array<{ xRatio: number; y: number; scale: number }>
  ) {
    ctx.save();
    clouds.forEach((c) => {
      const cx = ((w * c.xRatio + offset) % (w + 300)) - 100;
      const cy = c.y + Math.sin(time * 0.8 + c.xRatio * 5) * 6;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(c.scale, c.scale);

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;

      // Authentic Chinese/Persian ribbon cloud spiral (ابر تاش‌دار تیموری)
      ctx.beginPath();
      ctx.moveTo(-60, 0);
      ctx.quadraticCurveTo(-40, -22, -15, -18);
      ctx.quadraticCurveTo(0, -32, 25, -20);
      ctx.quadraticCurveTo(55, -26, 70, -5);
      ctx.quadraticCurveTo(80, 15, 60, 20);
      ctx.quadraticCurveTo(40, 25, 20, 16);
      ctx.quadraticCurveTo(-10, 24, -35, 15);
      ctx.quadraticCurveTo(-65, 18, -60, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner curling tail
      ctx.beginPath();
      ctx.moveTo(35, -5);
      ctx.quadraticCurveTo(55, 4, 45, 14);
      ctx.stroke();

      ctx.restore();
    });
    ctx.restore();
  }

  /**
   * Persian Miniature Cypress Tree (سرو ناز نگارگری)
   */
  private drawPersianCypress(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    height: number,
    width: number
  ) {
    // Wooden trunk
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 3, baseY - 20, 6, 20);

    // Layered pointed cypress foliage (فرم شعله‌ای سرو ناز)
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.moveTo(x, baseY - height);
    ctx.quadraticCurveTo(x + width, baseY - height * 0.45, x + width * 0.65, baseY - 18);
    ctx.lineTo(x - width * 0.65, baseY - 18);
    ctx.quadraticCurveTo(x - width, baseY - height * 0.45, x, baseY - height);
    ctx.closePath();
    ctx.fill();

    // Emerald highlight on one side for miniature depth
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.moveTo(x, baseY - height);
    ctx.quadraticCurveTo(x + width * 0.65, baseY - height * 0.45, x + width * 0.4, baseY - 18);
    ctx.lineTo(x, baseY - 18);
    ctx.lineTo(x, baseY - height);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Persepolis Fluted Column with Double-Bull Capital (سرستون تخت جمشید)
   */
  private drawPersepolisColumn(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    height: number
  ) {
    // Base plinth
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 16, baseY - 12, 32, 12);

    // Fluted Column Shaft
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 9, baseY - height, 18, height - 12);

    // Fluting grooves
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 4, baseY - height, 3, height - 12);
    ctx.fillRect(x + 2, baseY - height, 3, height - 12);

    // Double-Bull Capital (سرستون هخامنشی)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 18, baseY - height - 10, 36, 10);
    // Left bull head
    ctx.beginPath();
    ctx.moveTo(x - 18, baseY - height - 10);
    ctx.lineTo(x - 26, baseY - height - 18);
    ctx.lineTo(x - 10, baseY - height - 14);
    ctx.fill();
    // Right bull head
    ctx.beginPath();
    ctx.moveTo(x + 18, baseY - height - 10);
    ctx.lineTo(x + 26, baseY - height - 18);
    ctx.lineTo(x + 10, baseY - height - 14);
    ctx.fill();
  }

  /**
   * Soaring Simurgh (سیمرغ پرگشوده با پرهای رنگارنگ نگارگری)
   */
  private renderMiniatureSimurgh(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number,
    isUltra: boolean
  ) {
    const wingFlap = Math.sin(time * 3.5) * 12;

    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = isUltra ? 8 : 0;

    // Body
    ctx.beginPath();
    ctx.ellipse(x, y, 11, 4, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Wings with Emerald and Gold trim
    ctx.beginPath();
    ctx.moveTo(x - 4, y);
    ctx.quadraticCurveTo(x, y - 18 + wingFlap, x + 18, y - 24 + wingFlap);
    ctx.quadraticCurveTo(x + 6, y - 8, x + 4, y);
    ctx.fill();

    // Trailing Persian Phoenix Feathers (دم پرپیچ‌وخم سیمرغ)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.quadraticCurveTo(x - 24, y + 6, x - 36 + Math.sin(time * 3) * 6, y + 14);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 2);
    ctx.quadraticCurveTo(x - 20, y + 10, x - 32 + Math.sin(time * 3 + 1) * 6, y + 22);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Damavand Conical Peak with Snowcap
   */
  private renderDamavandPeak(
    ctx: CanvasRenderingContext2D,
    x: number,
    topY: number,
    width: number,
    h: number,
    bodyColor: string,
    capColor: string
  ) {
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, h);
    ctx.lineTo(x, topY);
    ctx.lineTo(x + width / 2, h);
    ctx.closePath();
    ctx.fill();

    // Snow Mantle
    ctx.fillStyle = capColor;
    ctx.beginPath();
    ctx.moveTo(x - 35, topY + 50);
    ctx.lineTo(x, topY);
    ctx.lineTo(x + 35, topY + 50);
    ctx.lineTo(x + 16, topY + 42);
    ctx.lineTo(x, topY + 48);
    ctx.lineTo(x - 16, topY + 42);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Bioluminescent Crystal Clusters for Mazandaran Cave
   */
  private drawBioluminescentCrystalCluster(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    isUltra: boolean
  ) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isUltra ? 10 : 4;

    // Prismatic crystals poking out
    for (let c = 0; c < 3; c++) {
      const angle = (c - 1) * 0.35;
      const len = 18 - c * 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.sin(angle) * len, y - Math.cos(angle) * len);
      ctx.lineTo(x + Math.sin(angle) * len + 4, y - Math.cos(angle) * len + 3);
      ctx.lineTo(x + 4, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Drifting Cave Spore Particles
   */
  private renderCaveSporeParticles(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    camX: number,
    time: number
  ) {
    this.sporeSeeds.forEach((sp) => {
      const px = ((sp.x - camX * 0.35 + time * 15 * sp.speed) % (w + 100)) - 50;
      const py = (sp.y + Math.sin(time * sp.speed + sp.x) * 20) % h;
      ctx.fillStyle = `hsla(${sp.hue}, 90%, 65%, 0.45)`;
      ctx.beginPath();
      ctx.arc(px, py, sp.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Dej-e Sepid Fortified White Tower (برج دژ سپید)
   */
  private drawDejeSepidTower(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    time: number
  ) {
    // White stone bastion
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(x - 30, baseY - 120, 60, 120);

    // Crenellations (کنگره‌های دژ)
    ctx.fillStyle = '#e2e8f0';
    for (let c = 0; c < 3; c++) {
      ctx.fillRect(x - 28 + c * 20, baseY - 132, 14, 12);
    }

    // Persian Arrow Slit
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(x - 3, baseY - 90, 6, 24);

    // Fluttering Royal Iranian Banner
    const wave = Math.sin(time * 3 + x) * 6;
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, baseY - 132);
    ctx.lineTo(x, baseY - 165);
    ctx.stroke();

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(x, baseY - 165);
    ctx.lineTo(x + 26, baseY - 157 + wave);
    ctx.lineTo(x, baseY - 149);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Turquoise Palace Dome for Siavashgard (گنبد فیروزه‌ای سیاوش‌گرد)
   */
  private drawTurquoiseDome(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) {
    // Persian pointed onion dome
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI, 0, false);
    ctx.quadraticCurveTo(x, y - radius * 1.5, x, y - radius * 1.5);
    ctx.fill();

    // Golden Spire on Dome
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 2, y - radius * 1.7, 4, radius * 0.35);
    ctx.beginPath();
    ctx.arc(x, y - radius * 1.7, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Alchemical Brazier for Zahhak
   */
  private drawAlchemicalBrazier(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number,
    isUltra: boolean
  ) {
    // Iron Tripod
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.lineTo(x, y - 25);
    ctx.lineTo(x + 12, y);
    ctx.stroke();

    // Brazier Bowl
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x, y - 25, 14, 0, Math.PI);
    ctx.fill();

    // Green alchemical flame
    const flameH = 18 + Math.sin(time * 6 + x) * 6;
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = isUltra ? 10 : 4;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 25);
    ctx.quadraticCurveTo(x, y - 25 - flameH, x + 8, y - 25);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /**
   * Ancient Plane Tree of Kabulistan (چنار کهنسال شاهنامه)
   */
  private drawAncientPlaneTree(ctx: CanvasRenderingContext2D, x: number, baseY: number) {
    // Massive gnarled trunk
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(x - 45, baseY);
    ctx.quadraticCurveTo(x - 30, baseY - 120, x - 15, baseY - 200);
    ctx.lineTo(x + 15, baseY - 200);
    ctx.quadraticCurveTo(x + 30, baseY - 120, x + 45, baseY);
    ctx.closePath();
    ctx.fill();

    // Twisting branches
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(x - 15, baseY - 190);
    ctx.quadraticCurveTo(x - 70, baseY - 240, x - 110, baseY - 220);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 15, baseY - 190);
    ctx.quadraticCurveTo(x + 70, baseY - 240, x + 110, baseY - 220);
    ctx.stroke();

    // Foliage canopy in miniature style
    ctx.fillStyle = 'rgba(21, 128, 61, 0.7)';
    ctx.beginPath();
    ctx.arc(x - 100, baseY - 230, 45, 0, Math.PI * 2);
    ctx.arc(x, baseY - 260, 60, 0, Math.PI * 2);
    ctx.arc(x + 100, baseY - 230, 45, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Flowering Shrubs and Persian Miniature Flora
   */
  private renderMiniatureShrubsAndFlowers(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    offset: number,
    leafColor: string,
    flowerColor: string,
    goldColor: string
  ) {
    ctx.save();
    for (let x = 0; x <= w + 160; x += 90) {
      const px = x + (offset % 90);
      const py = 450 + Math.sin(x * 0.03) * 15;

      // Small round miniature shrub
      ctx.fillStyle = leafColor;
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.arc(px + 10, py - 6, 12, 0, Math.PI * 2);
      ctx.fill();

      // Flower blossom dots (شکوفه‌های گل سرخ یا انار)
      ctx.fillStyle = flowerColor;
      ctx.beginPath();
      ctx.arc(px - 4, py - 4, 3, 0, Math.PI * 2);
      ctx.arc(px + 8, py - 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Gold stamen center
      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.arc(px - 4, py - 4, 1.2, 0, Math.PI * 2);
      ctx.arc(px + 8, py - 10, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Illuminated Manuscript Jadval & Lachak Border Frame (جدول‌کشی زرین و لچک‌های چهارگوشه نسخه خطی شاهنامه)
   */
  private renderMiniatureIlluminatedTrim(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();

    // Outer & Inner Gold Jadval Ruling Lines (جدول‌کشی دولایه زرین و لاجوردی)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    ctx.lineWidth = 2.2;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.0;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Corner Lachak Medallions (لچک‌های تذهیب در ۴ گوشه کادر نبرد)
    const corners = [
      { x: 10, y: 10, sx: 1, sy: 1 },
      { x: w - 10, y: 10, sx: -1, sy: 1 },
      { x: 10, y: h - 10, sx: 1, sy: -1 },
      { x: w - 10, y: h - 10, sx: -1, sy: -1 },
    ];

    corners.forEach((c) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.sx, c.sy);

      ctx.fillStyle = 'rgba(9, 19, 44, 0.85)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(38, 0);
      ctx.quadraticCurveTo(18, 12, 0, 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(11, 11, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }
}
