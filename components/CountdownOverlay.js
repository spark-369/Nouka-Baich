"use client";
import { useGame } from "../context/GameContext";
import { DIFFICULTY } from "../utils/config";

export default function CountdownOverlay() {
  const { phase, countdown, difficulty, hud } = useGame();
  if (phase !== "countdown") return null;
  const diff = DIFFICULTY[difficulty] || DIFFICULTY.normal;
  const label = countdown > 3 ? "GET READY" : countdown > 0 ? String(countdown) : "GO!";

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/50" />

      <div key={label} className="animate-count relative z-10 text-center">
        <div
          className="text-[10rem] font-black leading-none text-white"
          style={{ textShadow: `0 0 60px ${diff.color}, 0 0 20px rgba(255,255,255,0.6)` }}
        >
          {label}
        </div>
      </div>

      <div className="glass relative z-10 mt-4 flex flex-col items-center rounded-2xl px-6 py-3">
        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--text-2)]">
          {diff.label} Course
        </span>
        <span className="mt-0.5 font-mono text-sm text-white">
          {Math.round(60000 / hud.beat)} BPM · {diff.ai.toFixed(0)} u/s rival
        </span>
      </div>

      <p className="relative z-10 mt-5 animate-pulse text-sm font-bold tracking-widest text-white/80">
        STRIKE ON THE BEAT
      </p>
    </div>
  );
}
