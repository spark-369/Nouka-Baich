"use client";
import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import WorldCanvas from "./WorldCanvas";
import RhythmTrack from "./RhythmTrack";
import PauseMenu from "./PauseMenu";
import CountdownOverlay from "./CountdownOverlay";
import OnScreenPad from "./OnScreenPad";
import { JUDGMENT } from "../utils/rhythm";

// Floating judgment feedback that reacts to sim.flash.
function JudgmentFlash() {
  const { flashRef } = useGame();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let raf = 0;
    let seen = -1;
    const loop = () => {
      const f = flashRef.current;
      if (f && f.key !== seen && f.judgment) {
        seen = f.key;
        const id = f.key;
        setItems((prev) => [...prev.slice(-4), { id, judgment: f.judgment }]);
        setTimeout(() => setItems((prev) => prev.filter((it) => it.id !== id)), 650);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [flashRef]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[18%] z-40 flex flex-col items-center gap-1">
      {items.map((it) => {
        const j = JUDGMENT[it.judgment];
        return (
          <span
            key={it.id}
            className="animate-pop text-4xl font-black italic tracking-tight"
            style={{ color: j.color, textShadow: `0 0 24px ${j.ring}, 0 2px 6px rgba(0,0,0,0.6)` }}
          >
            {j.label}
          </span>
        );
      })}
    </div>
  );
}

function ComboMeter() {
  const { hud } = useGame();
  if (hud.combo < 3) return null;
  const hot = hud.combo >= 20;
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-40 -translate-y-1/2 text-right">
      <div
        className={`font-mono text-5xl font-black leading-none ${hot ? "animate-pulse" : ""}`}
        style={{
          color: hot ? "#fde047" : "#c084fc",
          textShadow: hot
            ? "0 0 30px rgba(253,224,71,0.8)"
            : "0 0 20px rgba(192,132,252,0.6)",
        }}
      >
        x{hud.combo}
      </div>
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-white/70">Combo</div>
    </div>
  );
}

export default function River() {
  const { phase, handlePress } = useGame();
  const active = phase === "racing";

  useEffect(() => {
    if (!active) return;
    const onPointer = (e) => {
      // Ignore taps on interactive controls (pause button etc.)
      if (e.target.closest("button")) return;
      handlePress();
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [active, handlePress]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Animated world */}
      <WorldCanvas />

      {/* Judgment + combo feedback */}
      <JudgmentFlash />
      <ComboMeter />

      {/* Rhythm highway + tap zone */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-3 pb-3">
        <div className="flex w-full max-w-[1100px] cursor-pointer flex-col items-center gap-1">
          <RhythmTrack />
        </div>
      </div>

      {/* Touch row control (mobile) */}
      <OnScreenPad />

      <PauseMenu />
      <CountdownOverlay />
    </div>
  );
}
