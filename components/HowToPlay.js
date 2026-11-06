"use client";
import { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { JUDGMENT, WINDOWS } from "../utils/rhythm";

function ControlKey({ keys, label }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0">
      <span className="text-sm text-[color:var(--text-1)]">{label}</span>
      <span className="flex items-center gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="rounded-md border border-white/15 bg-white/10 px-2 py-1 font-mono text-[0.7rem] font-bold text-white"
          >
            {k}
          </kbd>
        ))}
      </span>
    </div>
  );
}

export default function HowToPlay() {
  const { overlay, closeOverlay, toggleOverlay } = useGame();
  const open = overlay === "howto";

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
        className="glass-hi animate-slide-up w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="How to play"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">How to Play</h2>
            <p className="text-[0.7rem] text-[color:var(--text-2)]">
              Row on the beat to drive your longboat.
            </p>
          </div>
          <button className="icon-btn" aria-label="Close how to play" onClick={closeOverlay}>
            ✕
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <section>
              <h3 className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
                Objective
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--text-1)]">
                Reach the finish line before your rival. You move only when you strike the water{" "}
                <strong className="text-amber-300">in time with the drums</strong> — clean, timely
                strokes build a <strong className="text-white">combo</strong> and burn less{" "}
                <strong className="text-white">stamina</strong>.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
                Controls
              </h3>
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-1.5">
                <ControlKey keys={["Space", "↑", "F"]} label="Row / strike" />
                <ControlKey keys={["Tap"]} label="Row (touch)" />
                <ControlKey keys={["Esc"]} label="Pause / resume" />
                <ControlKey keys={["R"]} label="Restart race" />
                <ControlKey keys={["M"]} label="Mute / unmute" />
                <ControlKey keys={["H"]} label="This help" />
                <ControlKey keys={["P"]} label="Settings" />
              </div>
            </section>
          </div>

          <section className="mt-5">
            <h3 className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
              Timing &amp; Judgements
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["perfect", "great", "good", "miss"].map((k) => {
                const j = JUDGMENT[k];
                const win = WINDOWS[k];
                return (
                  <div
                    key={k}
                    className="rounded-2xl border px-3 py-2.5 text-center"
                    style={{ borderColor: `${j.color}55`, background: `${j.color}12` }}
                  >
                    <div
                      className="text-[0.6rem] font-black uppercase tracking-[0.14em]"
                      style={{ color: j.color }}
                    >
                      {j.label}
                    </div>
                    <div className="mt-1 font-mono text-lg font-extrabold text-white">
                      +{j.score}
                    </div>
                    <div className="text-[0.6rem] text-[color:var(--text-2)]">
                      {win ? `±${win} ms` : "no input"}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-5">
            <h3 className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
              Pro Tips
            </h3>
            <ul className="grid gap-1.5 text-sm text-[color:var(--text-1)] sm:grid-cols-2">
              <li className="flex gap-2">
                <span className="text-emerald-300">›</span> Watch the note lane — strike as the
                marker crosses the hit line.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-300">›</span> Missing resets your combo and drains
                stamina fast. Smoothness wins.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-300">›</span> Keep stamina above zero — running dry
                ends your race.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-300">›</span> A streak of PERFECT hits unlocks your
                fastest cruise speed.
              </li>
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-white/10 px-6 py-4 sm:flex-row">
          <button className="btn btn-ghost flex-1 py-3" onClick={() => toggleOverlay("settings")}>
            ⚙️ Settings
          </button>
          <button className="btn btn-primary flex-1 py-3" onClick={closeOverlay}>
            Got it — let&apos;s row
          </button>
        </div>
      </div>
    </div>
  );
}
