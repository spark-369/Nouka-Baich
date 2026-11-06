"use client";
import { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { DIFFICULTY, DIFFICULTY_ORDER } from "../utils/config";
import { clearLeaderboard } from "../utils/storage";

function Field({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-bold text-white">{label}</div>
        {hint ? <div className="text-[0.68rem] text-[color:var(--text-2)]">{hint}</div> : null}
      </div>
      <div className="flex flex-none items-center">{children}</div>
    </div>
  );
}

function Toggle({ on, onClick, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="switch"
      data-on={on}
      onClick={onClick}
    />
  );
}

export default function SettingsPanel() {
  const {
    overlay,
    closeOverlay,
    settings,
    updateSettings,
    difficulty,
    setDifficulty,
    fullscreen,
    toggleFullscreen,
  } = useGame();

  const open = overlay === "settings";

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, closeOverlay]);

  if (!open) return null;

  return (
    <div className="scrim animate-fade" onClick={closeOverlay}>
      <div
        className="glass-hi animate-slide-up w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">Settings</h2>
            <p className="text-[0.7rem] text-[color:var(--text-2)]">
              Tune the experience — saved automatically.
            </p>
          </div>
          <button className="icon-btn" aria-label="Close settings" onClick={closeOverlay}>
            ✕
          </button>
        </div>

        <div className="max-h-[64vh] overflow-y-auto px-6 py-2">
          {/* Audio */}
          <h3 className="pt-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
            Audio
          </h3>
          <Field label="Sound effects" hint="Strokes, hits and UI feedback">
            <Toggle
              label="Sound effects"
              on={settings.sfx}
              onClick={() => updateSettings({ sfx: !settings.sfx })}
            />
          </Field>
          <Field label="Music / drums" hint="The rhythmic drum loop">
            <Toggle
              label="Music"
              on={settings.music}
              onClick={() => updateSettings({ music: !settings.music })}
            />
          </Field>
          <Field label="Master volume" hint={`${Math.round(settings.volume * 100)}%`}>
            <input
              aria-label="Master volume"
              type="range"
              className="range w-40"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
            />
          </Field>

          {/* Display */}
          <h3 className="pt-5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
            Display
          </h3>
          <Field label="Fullscreen" hint="Immersive, distraction-free racing">
            <Toggle label="Fullscreen" on={fullscreen} onClick={toggleFullscreen} />
          </Field>
          <Field label="Reduce motion" hint="Minimise animations and transitions">
            <Toggle
              label="Reduce motion"
              on={settings.reduceMotion}
              onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
            />
          </Field>

          {/* Difficulty */}
          <h3 className="pt-5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
            Difficulty
          </h3>
          <Field label="Course" hint="Applies to your next race">
            <div className="seg">
              {DIFFICULTY_ORDER.map((key) => (
                <button
                  key={key}
                  data-on={difficulty === key}
                  onClick={() => setDifficulty(key)}
                  style={difficulty === key ? { color: DIFFICULTY[key].color } : undefined}
                >
                  {DIFFICULTY[key].label}
                </button>
              ))}
            </div>
          </Field>

          {/* Data */}
          <h3 className="pt-5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
            Data
          </h3>
          <Field label="Leaderboard" hint="Top 10 runs stored on this device">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (typeof window !== "undefined") {
                  const ok = window.confirm("Clear the local leaderboard? This cannot be undone.");
                  if (!ok) return;
                }
                clearLeaderboard();
                window.dispatchEvent(new Event("storage"));
              }}
            >
              Clear scores
            </button>
          </Field>
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <button className="btn btn-primary w-full py-3" onClick={closeOverlay}>
            ✓ Done
          </button>
        </div>
      </div>
    </div>
  );
}
