"use client";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";

/**
 * On-screen row control for touch devices. The global tap handler in River
 * ignores taps that land on a <button>, so this never double-fires. A cooldown
 * ring fills over one beat after each stroke to guide timing.
 */
export default function OnScreenPad() {
  const { phase, handlePress, hud } = useGame();
  const [pressing, setPressing] = useState(false);
  const [cool, setCool] = useState(1); // 0..1 fraction elapsed since last stroke
  const beatRef = useRef(700);
  const pressAtRef = useRef(-9999);

  useEffect(() => {
    beatRef.current = hud.beat || 700;
  }, [hud.beat]);

  // Animate the cooldown ring from the last stroke without per-frame re-renders.
  useEffect(() => {
    if (phase !== "racing") return;
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    const loop = (now) => {
      acc += now - last;
      last = now;
      if (acc > 50) {
        acc = 0;
        const frac = Math.min(1, (now - pressAtRef.current) / beatRef.current);
        setCool(frac);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  if (phase !== "racing") return null;

  const ring = Math.max(0, Math.min(1, cool));

  const strike = () => {
    pressAtRef.current = performance.now();
    setCool(0);
    handlePress();
  };

  return (
    <div className="pointer-events-none absolute bottom-[30vh] right-3 z-40 flex justify-center md:hidden">
      <button
        type="button"
        aria-label="Row on the beat"
        className="pointer-events-auto relative grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition active:scale-95"
        onPointerDown={() => {
          setPressing(true);
          strike();
        }}
        onPointerUp={() => setPressing(false)}
        onPointerCancel={() => setPressing(false)}
        onPointerLeave={() => setPressing(false)}
      >

        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from -90deg, rgba(34,211,238,0.85) ${ring * 360}deg, rgba(255,255,255,0.06) 0deg)`,
            mask: "radial-gradient(farthest-side, transparent 66%, #000 68%)",
            WebkitMask: "radial-gradient(farthest-side, transparent 66%, #000 68%)",
            opacity: 0.9,
          }}
        />
        <span
          className={`relative z-10 text-sm font-black tracking-widest text-white transition ${
            pressing ? "scale-110 text-amber-300" : ""
          }`}
        >
          ROW
        </span>
      </button>
    </div>
  );
}
