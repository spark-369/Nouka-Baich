"use client";
import { useEffect } from "react";
import { useGame } from "../context/GameContext";

export default function HUD() {
  const { speed, stamina, score, combo, time, paused, setPaused } = useGame();

  // ESC key pause toggle
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.code === "Escape") {
        setPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="w-[900px] flex justify-between items-center mb-4 text-sm font-bold">
      <div className="flex gap-3 items-center">
        <span className="px-3 py-1 rounded-md bg-black/40 border border-white/10 backdrop-blur-sm">
          Speed: <span className="text-cyan-300">{speed.toFixed(1)}</span>
        </span>

        <span className="px-3 py-1 rounded-md bg-black/40 border border-white/10 backdrop-blur-sm">
          Stamina: <span className="text-emerald-300">{stamina}%</span>
        </span>

        <span className="px-3 py-1 rounded-md bg-black/40 border border-white/10 backdrop-blur-sm">
          Combo: <span className="text-purple-300">x{combo}</span>
        </span>
      </div>

      <div className="flex gap-3 items-center">
        <span className="px-3 py-1 rounded-md bg-black/40 border border-white/10 backdrop-blur-sm">
          Time: <span className="text-yellow-300">{time}s</span>
        </span>

        <span className="px-3 py-1 rounded-md bg-black/40 border border-white/10 backdrop-blur-sm">
          Score: <span className="text-white">{score}</span>
        </span>

        <button
          onClick={() => setPaused(!paused)}
          className="px-4 py-1 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-transform"
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
