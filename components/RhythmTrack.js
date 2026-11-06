"use client";
import { useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";

const GOOD = 190; // ms — matches WINDOWS.good in utils/rhythm
const LOOKAHEAD = 2200; // ms of notes visible on screen

export default function RhythmTrack() {
  const { simRef } = useGame();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
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
      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const sim = simRef.current;

      if (!sim) {
        raf = requestAnimationFrame(render);
        return;
      }

      // Hit line at 22% from the left.
      const lineX = cw * 0.22;
      const pxPerMs = (cw * 0.62) / LOOKAHEAD;

      // Background lane
      ctx.save();
      const laneGrad = ctx.createLinearGradient(0, 0, cw, 0);
      laneGrad.addColorStop(0, "rgba(6, 16, 30, 0.10)");
      laneGrad.addColorStop(1, "rgba(6, 16, 30, 0.55)");
      ctx.fillStyle = laneGrad;
      ctx.fillRect(0, ch * 0.12, cw, ch * 0.76);
      ctx.restore();

      const centerY = ch / 2;
      const noteH = Math.min(74, ch * 0.6);

      // Beat grid lines
      ctx.save();
      ctx.strokeStyle = "rgba(148, 182, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < sim.notes.length; i++) {
        const note = sim.notes[i];
        const x = lineX + (note.time - now) * pxPerMs;
        if (x < lineX - 4) continue;
        if (x > cw + 20) break;
        ctx.beginPath();
        ctx.moveTo(x, centerY - noteH * 0.62);
        ctx.lineTo(x, centerY + noteH * 0.62);
        ctx.stroke();
      }
      ctx.restore();

      // Note markers
      for (let i = sim.ptr; i < sim.notes.length; i++) {
        const note = sim.notes[i];
        const dtMs = note.time - now;
        const x = lineX + dtMs * pxPerMs;
        if (x < lineX - 30) continue;
        if (x > cw + 40) break;
        const closeness = Math.max(0, 1 - Math.abs(dtMs) / GOOD);
        ctx.save();
        const g = ctx.createLinearGradient(x - 5, 0, x + 5, 0);
        g.addColorStop(0, "rgba(34, 211, 238, 0.25)");
        g.addColorStop(0.5, `rgba(34, 211, 238, ${0.7 + closeness * 0.3})`);
        g.addColorStop(1, "rgba(34, 211, 238, 0.25)");
        ctx.fillStyle = g;
        ctx.shadowColor = "rgba(34, 211, 238, 0.8)";
        ctx.shadowBlur = 8 + closeness * 16;
        const w = 8 + closeness * 8;
        ctx.fillRect(x - w / 2, centerY - noteH / 2, w, noteH);
        ctx.restore();
      }

      // Judgment window band
      ctx.save();
      ctx.fillStyle = "rgba(253, 224, 71, 0.06)";
      const bandW = 2 * GOOD * pxPerMs;
      ctx.fillRect(lineX - bandW / 2, centerY - noteH / 2, bandW, noteH);
      ctx.restore();

      // Hit line
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(lineX, centerY - noteH * 0.72);
      ctx.lineTo(lineX, centerY + noteH * 0.72);
      ctx.stroke();
      // Target diamond
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(lineX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [simRef]);

  return (
    <div
      ref={wrapRef}
      onPointerDown={(e) => e.preventDefault()}
      className="relative h-[26vh] min-h-[150px] w-full max-w-[1100px] select-none"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
        <span className="chip">SPACE / TAP — row on the beat</span>
      </div>
    </div>
  );
}
