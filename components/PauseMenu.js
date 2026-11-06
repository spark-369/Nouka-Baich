"use client";
import { useGame } from "../context/GameContext";
import { DIFFICULTY } from "../utils/config";
import { formatScore } from "../utils/format";

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
      <span className="text-xs uppercase tracking-widest text-[color:var(--text-2)]">{label}</span>
      <span className="font-mono text-sm font-bold" style={{ color: accent || "#fff" }}>
        {value}
      </span>
    </div>
  );
}

export default function PauseMenu() {
  const {
    phase,
    hud,
    togglePause,
    restart,
    resetToMenu,
    difficulty,
    settings,
    updateSettings,
    openOverlay,
  } = useGame();

  if (phase !== "paused") return null;
  const diff = DIFFICULTY[difficulty] || DIFFICULTY.normal;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="glass-hi animate-pop w-[380px] max-w-[92vw] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-wide text-white">Paused</h2>
          <span className="chip">{diff.label}</span>
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
          <Row label="Score" value={formatScore(hud.score)} accent="#fbbf24" />
          <Row label="Combo" value={`x${hud.combo}`} accent="#c084fc" />
          <Row label="Stamina" value={`${Math.round(hud.stamina)}%`} accent="#34d399" />
          <Row label="Progress" value={`${Math.round(hud.playerPct)}%`} accent="#22d3ee" />
        </div>

        <div className="flex flex-col gap-2.5">
          <button className="btn btn-water w-full py-3" onClick={togglePause}>
            ▶ Resume
          </button>
          <button className="btn btn-ghost w-full py-3" onClick={restart}>
            ↻ Restart Race
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button className="btn btn-ghost py-3" onClick={() => openOverlay("settings")}>
              ⚙️ Settings
            </button>
            <button className="btn btn-ghost py-3" onClick={() => openOverlay("howto")}>
              ❔ How to Play
            </button>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5">
            <span className="text-xs text-[color:var(--text-1)]">Sound</span>
            <button
              className="btn btn-ghost px-3 py-1 text-xs"
              onClick={() => updateSettings({ sfx: !settings.sfx, music: !settings.music })}
            >
              {settings.sfx || settings.music ? "🔊 On" : "🔇 Off"}
            </button>
          </div>
          <button className="btn btn-ghost w-full py-3" onClick={resetToMenu}>
            ⌂ Main Menu
          </button>
        </div>

        <p className="mt-4 text-center text-[0.65rem] text-[color:var(--text-2)]">
          Esc to resume · R to restart · H for help
        </p>
      </div>
    </div>
  );
}
