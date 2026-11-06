"use client";
import { useGame } from "../context/GameContext";

/**
 * Persistent top navigation bar. Rendered above every phase so the player can
 * always reach Help, Settings, Sound, Fullscreen and Pause without breaking flow.
 */
export default function TopBar({ onLogoClick }) {
  const {
    phase,
    settings,
    updateSettings,
    overlay,
    toggleOverlay,
    fullscreen,
    toggleFullscreen,
    togglePause,
  } = useGame();

  const soundOn = settings.sfx || settings.music;
  const inRace = phase === "racing" || phase === "paused";

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-[70] flex justify-center px-3 pt-3">
      <div className="pointer-events-auto flex w-full max-w-[1240px] items-center justify-between gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 backdrop-blur-md">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2.5 rounded-xl px-1.5 py-0.5 text-left transition hover:bg-white/5"
          title="Nouka Baich — main menu"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-600 text-lg shadow-lg">
            🛶
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-black tracking-tight text-white">Nouka Baich</span>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
              Rhythm Boat Racing
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {inRace ? (
            <button
              className="btn btn-ghost btn-sm"
              title={phase === "paused" ? "Resume (Esc)" : "Pause (Esc)"}
              onClick={togglePause}
            >
              {phase === "paused" ? "▶ Resume" : "⏸ Pause"}
            </button>
          ) : null}
          <button
            className="icon-btn"
            data-on={overlay === "howto"}
            title="How to play (H)"
            aria-label="How to play"
            onClick={() => toggleOverlay("howto")}
          >
            ❔
          </button>
          <button
            className="icon-btn"
            data-on={overlay === "settings"}
            title="Settings (P)"
            aria-label="Settings"
            onClick={() => toggleOverlay("settings")}
          >
            ⚙️
          </button>
          <button
            className="icon-btn"
            title="Toggle sound (M)"
            aria-label="Toggle sound"
            onClick={() => updateSettings({ sfx: !soundOn, music: !soundOn })}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            className="icon-btn hidden sm:inline-flex"
            data-on={fullscreen}
            title="Fullscreen"
            aria-label="Toggle fullscreen"
            onClick={toggleFullscreen}
          >
            {fullscreen ? "🗗" : "⛶"}
          </button>
        </div>
      </div>
    </header>
  );
}

