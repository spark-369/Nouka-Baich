"use client";
import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { DIFFICULTY, DIFFICULTY_ORDER } from "../utils/config";
import { loadLeaderboard } from "../utils/storage";
import { formatScore } from "../utils/format";
import { audio } from "../audio/audioManager";

function DiffCard({ d, active, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        audio.unlock();
        audio.click();
        onSelect();
      }}
      className="group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200"
      style={{
        borderColor: active ? `${d.color}` : "var(--border)",
        background: active ? `${d.color}1a` : "rgba(255,255,255,0.03)",
        boxShadow: active ? `0 10px 30px -12px ${d.color}` : "none",
        transform: hover ? "translateY(-2px)" : "none",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-extrabold text-white">{d.label}</span>
        <span
          className="h-3 w-3 rounded-full"
          style={{ background: d.color, boxShadow: `0 0 12px ${d.color}` }}
        />
      </div>
      <p className="mt-1 text-xs text-[color:var(--text-1)]">{d.tagline}</p>
      <div className="mt-3 flex gap-3 font-mono text-[0.65rem] text-[color:var(--text-2)]">
        <span>{Math.round(60000 / d.beat)} BPM</span>
        <span>·</span>
        <span>AI {d.ai.toFixed(0)} u/s</span>
      </div>
      {active && (
        <span className="absolute right-2 top-2 text-[0.55rem] font-bold uppercase tracking-widest text-white/70">
          Selected
        </span>
      )}
    </button>
  );
}

export default function Menu() {
  const { startRace, difficulty, setDifficulty, settings, updateSettings, openOverlay } = useGame();
  const [best, setBest] = useState(0);

  useEffect(() => {
    const board = loadLeaderboard();
    setBest(board.reduce((m, b) => Math.max(m, b.score), 0));
  }, []);

  return (
    <div className="relative flex w-full items-center justify-center">
      <div className="relative z-10 grid w-full max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Hero */}
        <div className="animate-fade-up flex flex-col justify-center">
          <span className="chip mb-4 w-fit">🎵 Rhythm Racing · Bangladesh Classic</span>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl">
            Nouka
            <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent">
              Baich
            </span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--text-1)] sm:text-base">
            Steer your longboat down the river by striking the water in time with the drums.
            Chain <strong className="text-amber-300">PERFECT</strong> strokes to surge ahead of your
            rival and reach the finish line first.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className="btn btn-primary px-7 py-3.5 text-lg"
              onClick={() => {
                audio.unlock();
                audio.click();
                startRace(difficulty);
              }}
            >
              ▶ Start Race
            </button>
            <button
              className="btn btn-ghost px-5 py-3.5 text-base"
              onClick={() => openOverlay("howto")}
            >
              ❔ How to Play
            </button>
            <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className="text-2xl">🏆</span>
              <div className="flex flex-col">
                <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[color:var(--text-2)]">
                  Your Best
                </span>
                <span className="font-mono text-lg font-extrabold text-white">
                  {best ? formatScore(best) : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[color:var(--text-2)]">
            <span className="chip">
              <kbd className="font-mono">Space</kbd> Row
            </span>
            <span className="chip">
              <kbd className="font-mono">Esc</kbd> Pause
            </span>
            <span className="chip">
              <kbd className="font-mono">R</kbd> Restart
            </span>
            <span className="chip">
              <kbd className="font-mono">M</kbd> Mute
            </span>
            <span className="chip">
              <kbd className="font-mono">H</kbd> Help
            </span>
          </div>
        </div>

        {/* Setup panel */}
        <div className="glass-hi animate-fade-up flex flex-col gap-4 p-5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--text-1)]">
              Choose Difficulty
            </h2>
            <p className="mt-0.5 text-xs text-[color:var(--text-2)]">
              Faster drums and a sharper rival as you climb.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {DIFFICULTY_ORDER.map((key) => (
              <DiffCard
                key={key}
                d={DIFFICULTY[key]}
                active={difficulty === key}
                onSelect={() => setDifficulty(key)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Sound</span>
              <span className="text-[0.65rem] text-[color:var(--text-2)]">Drums &amp; effects</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => updateSettings({ sfx: !settings.sfx, music: !settings.music })}
              >
                {settings.sfx || settings.music ? "🔊 On" : "🔇 Off"}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => openOverlay("settings")}>
                ⚙️ More
              </button>
            </div>
          </div>

          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
            className="range"
          />
        </div>
      </div>
    </div>
  );
}
