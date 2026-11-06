"use client";
import { useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import {
  drawBoat,
  drawBuoy,
  drawGantry,
  drawBank,
  drawHills,
  drawWater,
} from "../game/sprites";
import { RACE_LENGTH } from "../utils/config";

const PLAYER_PALETTE = {
  hull0: "#7c3f12",
  hull1: "#c2681f",
  hull2: "#f0a43a",
  trim: "#fde68a",
  prow: "#ef4444",
  crew: "#f97316",
  crewDark: "#b45309",
};

const RIVAL_PALETTE = {
  hull0: "#1e293b",
  hull1: "#334155",
  hull2: "#64748b",
  trim: "#cbd5e1",
  prow: "#0ea5e9",
  crew: "#e2e8f0",
  crewDark: "#94a3b8",
};

// The full 1000 m course should always span the same number of screen widths,
// so the start and finish line read as a consistent "distance" on any display
// instead of a fixed pixel length. Boat/gantry/buoy sizes ride the same factor.
const COURSE_SCREENS = 2.4; // start→finish spans this many screen widths
const REF_W = 1200; // reference viewport width for sprite scale
const BUOY_STEP = 200;

export default function WorldCanvas() {
  const { simRef, phase } = useGame();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let last = performance.now();
    let dpr = 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const render = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      timeRef.current += dt;

      const W = canvas.width;
      const H = canvas.height;
      const cw = W / dpr;
      const ch = H / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const sim = simRef.current;
      const t = timeRef.current;

      // ---- Camera & world scale (screen-proportional) ----
      // Derived from the viewport so start→finish always spans COURSE_SCREENS
      // widths, with everything else scaled to match.
      const ppm = cw / (RACE_LENGTH / COURSE_SCREENS); // pixels per metre
      const sceneScale = Math.min(1.25, Math.max(0.7, cw / REF_W));
      const playerPos = sim ? sim.player.pos : 0;
      const targetMetres = playerPos - (cw * 0.34) / ppm;
      cameraRef.current += (targetMetres - cameraRef.current) * Math.min(1, dt * 6);
      const cam = cameraRef.current;
      const toX = (metres) => (metres - cam) * ppm;

      // ---- Sky / parallax ----
      const skyGrad = ctx.createLinearGradient(0, 0, 0, ch * 0.75);
      skyGrad.addColorStop(0, "#071223");
      skyGrad.addColorStop(0.55, "#0d2b40");
      skyGrad.addColorStop(1, "#12475c");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, cw, ch * 0.75);

      const sun = ctx.createRadialGradient(cw * 0.72, ch * 0.16, 10, cw * 0.72, ch * 0.16, ch * 0.5);
      sun.addColorStop(0, "rgba(255, 214, 153, 0.34)");
      sun.addColorStop(1, "rgba(255, 214, 153, 0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, cw, ch * 0.75);

      const horizonY = ch * 0.42;
      drawHills(ctx, -120, cw + 240, horizonY + 6, "#0c2b26", 1.3);
      drawHills(ctx, -60, cw + 120, horizonY + 22, "#0a3a30", 3.1);
      // Parallax banks scroll at a fixed fraction of the world flow (ppm), so
      // depth reads consistently on every screen size.
      drawBank(ctx, -80 - ((cam * 0.18 * ppm) % 200), cw + 260, 90, horizonY + 30, 2.2, 0.85);
      drawBank(ctx, -80 - ((cam * 0.4 * ppm) % 160), cw + 260, 70, horizonY + 46, 5.4, 0.95);

      // ---- Water band ----
      const waterTop = horizonY + 30;
      const waterH = ch - waterTop;
      drawWater(ctx, 0, waterTop, cw, waterH, {
        speed: sim ? sim.player.speed : 0,
        t,
        seed: 1.7,
      });

      // Speed streaks near the player lane
      if (sim && sim.player.speed > 12) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 14; i++) {
          const off = ((t * (120 + sim.player.speed * 8) + i * 137) % (cw + 300)) - 300;
          const y = waterTop + 40 + ((i * 53) % Math.max(40, waterH - 60));
          ctx.strokeStyle = `rgba(200, 240, 255, ${0.05 + (sim.player.speed / 60) * 0.14})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(cw - off, y);
          ctx.lineTo(cw - off + 60 + sim.player.speed, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ---- Distant bank reflection strip ----
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#06231c";
      ctx.fillRect(0, waterTop, cw, 26);
      ctx.restore();

      // ---- Start & finish gantries + buoys ----
      const gantryTop = waterTop - 96 * sceneScale;
      const gantryBottom = ch - 6;
      const startX = toX(0);
      if (startX > -160 * sceneScale && startX < cw + 160 * sceneScale) {
        drawGantry(ctx, startX, gantryTop, gantryBottom, {
          color: "#0ea5e9",
          label: "START",
          scale: sceneScale,
        });
      }
      const finishX = toX(RACE_LENGTH);
      if (finishX > -160 * sceneScale && finishX < cw + 160 * sceneScale) {
        drawGantry(ctx, finishX, gantryTop, gantryBottom, {
          color: "#ef4444",
          label: "FINISH",
          scale: sceneScale,
        });
      }
      for (let m = BUOY_STEP; m < RACE_LENGTH; m += BUOY_STEP) {
        const bx = toX(m);
        if (bx < -40 || bx > cw + 40) continue;
        const by = waterTop + waterH * 0.34 + Math.sin(t * 1.6 + m) * 3;
        drawBuoy(ctx, bx, by, { scale: 0.9 * sceneScale, color: m % 400 === 0 ? "#f59e0b" : "#f97316" });
      }

      // ---- Boats ----
      const lanePlayer = waterTop + waterH * 0.6;
      const laneRival = waterTop + waterH * 0.32;

      if (sim) {
        drawBoat(ctx, toX(sim.ai.pos), laneRival, {
          scale: 0.62 * sceneScale,
          dir: 1,
          oar: sim.ai.anim,
          palette: RIVAL_PALETTE,
          crew: 5,
        });

        const bob = Math.sin(t * 3 + sim.player.anim * 6) * 1.6;
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.45)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;
        drawBoat(ctx, toX(sim.player.pos), lanePlayer + bob, {
          scale: 1 * sceneScale,
          dir: 1,
          oar: sim.player.anim,
          palette: PLAYER_PALETTE,
          crew: 5,
        });
        ctx.restore();

        if (sim.hitPulse > 0.01) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.strokeStyle = `rgba(253, 224, 71, ${sim.hitPulse * 0.55})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            toX(sim.player.pos),
            lanePlayer,
            (60 + (1 - sim.hitPulse) * 60) * sceneScale,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.restore();
        }
      }

      // ---- Vignette ----
      const vig = ctx.createRadialGradient(cw / 2, ch / 2, ch * 0.35, cw / 2, ch / 2, ch * 0.9);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, cw, ch);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [simRef, phase]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export { PLAYER_PALETTE, RIVAL_PALETTE };
