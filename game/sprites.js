// Canvas drawing routines for the race world. Pure functions: they take a
// 2D context plus world/screen coordinates and draw. No state, no React.

export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/**
 * A wooden "nouka" longboat. (x, y) is the waterline centre of the hull.
 * opts: { scale, dir (1|−1), oar (0..1), crew (number|false), palette }
 */
export function drawBoat(ctx, x, y, opts = {}) {
  const scale = opts.scale ?? 1;
  const oar = opts.oar ?? 0;
  const pal =
    opts.palette ||
    {
      hull0: "#7c3f12",
      hull1: "#c2681f",
      hull2: "#f0a43a",
      trim: "#fde68a",
      prow: "#ef4444",
      crew: "#f97316",
      crewDark: "#b45309",
    };

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  if (opts.dir === -1) ctx.scale(-1, 1);

  const W = 120;
  const H = 26;

  // --- Wake behind the boat ---
  const wake = ctx.createLinearGradient(-W * 0.7, 0, -W * 0.05, 0);
  wake.addColorStop(0, "rgba(226,246,255,0)");
  wake.addColorStop(1, "rgba(226,246,255,0.5)");
  ctx.fillStyle = wake;
  ctx.beginPath();
  ctx.ellipse(-W * 0.32, H * 0.55, W * 0.42, H * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- Oars (behind hull on the far side) ---
  drawOar(ctx, -18, -4, -1.35 + oar * 0.5, pal, 0.85);
  drawOar(ctx, 22, -4, -1.35 - oar * 0.5, pal, 0.85);

  // --- Hull ---
  const body = new Path2D();
  body.moveTo(-W * 0.5, 0);
  body.quadraticCurveTo(-W * 0.36, H * 0.72, 0, H * 0.78);
  body.quadraticCurveTo(W * 0.36, H * 0.72, W * 0.5, 0);
  body.quadraticCurveTo(W * 0.4, -H * 0.42, 0, -H * 0.46);
  body.quadraticCurveTo(-W * 0.4, -H * 0.42, -W * 0.5, 0);

  const hullGrad = ctx.createLinearGradient(0, -H * 0.5, 0, H);
  hullGrad.addColorStop(0, pal.hull2);
  hullGrad.addColorStop(0.45, pal.hull1);
  hullGrad.addColorStop(1, pal.hull0);
  ctx.fillStyle = hullGrad;
  ctx.fill(body);

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(60,25,5,0.55)";
  ctx.stroke(body);

  // Deck stripe
  ctx.strokeStyle = pal.trim;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-W * 0.42, -H * 0.08);
  ctx.quadraticCurveTo(0, -H * 0.28, W * 0.42, -H * 0.08);
  ctx.stroke();

  // --- Prows (flared ends) ---
  ctx.fillStyle = pal.prow;
  ctx.beginPath();
  ctx.moveTo(W * 0.5, 0);
  ctx.quadraticCurveTo(W * 0.62, -H * 0.5, W * 0.52, -H * 0.85);
  ctx.quadraticCurveTo(W * 0.44, -H * 0.4, W * 0.44, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-W * 0.5, 0);
  ctx.quadraticCurveTo(-W * 0.6, -H * 0.45, -W * 0.52, -H * 0.78);
  ctx.quadraticCurveTo(-W * 0.44, -H * 0.38, -W * 0.44, 0);
  ctx.closePath();
  ctx.fill();

  // --- Crew ---
  if (opts.crew !== false) {
    const n = opts.crew ?? 5;
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const cx = -W * 0.34 + t * W * 0.68;
      const bob = Math.sin(oar * Math.PI * 2 + i * 1.1) * 1.4;
      ctx.fillStyle = i % 2 ? pal.crew : pal.crewDark;
      ctx.beginPath();
      ctx.ellipse(cx, -H * 0.42 + bob, 4.2, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffe9c7";
      ctx.beginPath();
      ctx.arc(cx, -H * 0.72 + bob, 2.8, 0, Math.PI * 2);
      ctx.fill();
      // Paddle shafts to the near side
      ctx.strokeStyle = "rgba(80,45,20,0.9)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx, -H * 0.4 + bob);
      ctx.lineTo(cx + 8, H * 0.2 + bob);
      ctx.stroke();
    }
  }

  // --- Wet line highlight ---
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-W * 0.4, H * 0.12);
  ctx.quadraticCurveTo(0, H * 0.2, W * 0.4, H * 0.12);
  ctx.stroke();

  ctx.restore();
}

function drawOar(ctx, x, y, angle, pal, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = pal.hull0;
  ctx.lineWidth = 2.6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 26);
  ctx.stroke();
  ctx.fillStyle = pal.prow;
  ctx.beginPath();
  ctx.ellipse(0, 27, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A floating course buoy used for sprint markers along the river. */
export function drawBuoy(ctx, x, y, opts = {}) {
  const scale = opts.scale ?? 1;
  const color = opts.color || "#f97316";
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Reflection
  ctx.fillStyle = "rgba(226,246,255,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 6, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-9, 4);
  ctx.quadraticCurveTo(0, 12, 9, 4);
  ctx.quadraticCurveTo(0, -14, -9, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Stripe + light
  ctx.fillStyle = "#fef3c7";
  ctx.fillRect(-7, -4, 14, 3);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, -12, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Start / finish gantry: an arch with banner crossing the river. */
export function drawGantry(ctx, x, top, bottom, opts = {}) {
  const color = opts.color || "#ef4444";
  const label = opts.label || "FINISH";
  const s = opts.scale ?? 1; // scene scale — keeps proportions across screens
  const width = 150 * s;
  const postW = 8 * s;
  const bannerH = 40 * s;
  const chevW = 22 * s;
  ctx.save();

  // Posts
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(x - width / 2, top, postW, bottom - top);
  ctx.fillRect(x + width / 2 - postW, top, postW, bottom - top);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(x - width / 2, top, 3 * s, bottom - top);
  ctx.fillRect(x + width / 2 - postW, top, 3 * s, bottom - top);

  // Banner
  const grad = ctx.createLinearGradient(0, top, 0, top + bannerH);
  grad.addColorStop(0, color);
  grad.addColorStop(1, shade(color, -0.28));
  ctx.fillStyle = grad;
  roundRect(ctx, x - width / 2, top, width, bannerH, 6 * s);
  ctx.fill();

  // Chevron stripes
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, x - width / 2, top, width, bannerH, 6 * s);
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  for (let i = -2; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(x - width / 2 + i * chevW, top + bannerH);
    ctx.lineTo(x - width / 2 + i * chevW + chevW / 2, top);
    ctx.lineTo(x - width / 2 + i * chevW + chevW, top);
    ctx.lineTo(x - width / 2 + i * chevW + chevW / 2, top + bannerH);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Label
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${Math.round(20 * s)}px var(--font-geist-sans), system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, top + bannerH / 2 + 1);

  ctx.restore();
}

/** Parallax far-bank tree line / canopy. */
export function drawBank(ctx, x, width, height, y, seed, dark = 0.55) {
  ctx.save();
  ctx.fillStyle = `rgba(6, 24, 20, ${dark})`;
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  const step = 40;
  for (let i = 0; i <= width; i += step) {
    const h = 30 + Math.sin((x + i) * 0.013 + seed) * 22 + Math.sin((x + i) * 0.05) * 8;
    ctx.quadraticCurveTo(x + i, y - h, x + i + step / 2, y - h * 0.7);
  }
  ctx.lineTo(x + width, y + height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Distant hills behind the bank. */
export function drawHills(ctx, x, width, y, color, seed) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  const step = 120;
  for (let i = 0; i <= width; i += step) {
    const h = 90 + Math.sin((x + i) * 0.004 + seed) * 60;
    ctx.quadraticCurveTo(x + i + step / 2, y - h, x + i + step, y);
  }
  ctx.lineTo(x + width, y + 400);
  ctx.lineTo(x, y + 400);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Animated water surface band with specular streaks. */
export function drawWater(ctx, x, y, w, h, { speed = 0, t = 0, seed = 0 } = {}) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#0b4f6c");
  g.addColorStop(0.4, "#0e6f8e");
  g.addColorStop(1, "#062b3d");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);

  // Moving specular streaks
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const count = 26;
  for (let i = 0; i < count; i++) {
    const r = (Math.sin(i * 12.9898 + seed) * 43758.5453) % 1;
    const rr = r - Math.floor(r);
    const speedFactor = 0.4 + rr * 0.6;
    const px = x + ((((t * (40 + speed * 6) * speedFactor) + rr * w) % (w + 200)) - 200);
    const py = y + ((i / count) * h + Math.sin(t * 0.8 + i) * 4);
    const alpha = 0.05 + rr * 0.12;
    ctx.fillStyle = `rgba(190, 238, 255, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(px, py, 40 + rr * 60, 1.4 + rr, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Utility: darken/lighten a hex colour by ratio (−1..1). */
export function shade(hex, ratio) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  if (ratio < 0) {
    r = Math.round(r * (1 + ratio));
    g = Math.round(g * (1 + ratio));
    b = Math.round(b * (1 + ratio));
  } else {
    r = Math.round(r + (255 - r) * ratio);
    g = Math.round(g + (255 - g) * ratio);
    b = Math.round(b + (255 - b) * ratio);
  }
  return `rgb(${r},${g},${b})`;
}
