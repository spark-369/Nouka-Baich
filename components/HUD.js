"use client";
import { useGame } from "../context/GameContext";
import { DIFFICULTY } from "../utils/config";
import { formatClock } from "../utils/format";
import { Bar, Gauge, StatChip, DifficultyBadge } from "./UI";

function RaceProgress({ playerPct, aiPct }) {
  return (
    <div className="relative h-8 w-full">
      <div className="absolute inset-x-0 top-3 h-2 rounded-full bg-black/50 ring-1 ring-white/10" />
      {/* Player marker */}
      <div
        className="absolute top-0 z-20 transition-[left] duration-100 ease-linear"
        style={{ left: `calc(${playerPct}% - 12px)` }}
      >
        <div className="h-4 w-6 rounded-sm bg-gradient-to-b from-amber-300 to-orange-600 shadow-lg" />
        <div className="mx-auto h-1.5 w-6 rounded-full bg-black/40 blur-[1px]" />
      </div>
      {/* Rival marker */}
      <div
        className="absolute top-1 z-10 transition-[left] duration-100 ease-linear"
        style={{ left: `calc(${aiPct}% - 10px)` }}
      >
        <div className="h-3 w-5 rounded-sm bg-gradient-to-b from-slate-300 to-slate-600" />
      </div>
      <div className="absolute -right-1 top-1.5 text-lg leading-none">🏁</div>
    </div>
  );
}

export default function HUD() {
  const { hud, difficulty } = useGame();
  const diff = DIFFICULTY[difficulty] || DIFFICULTY.normal;

  const timeCritical = hud.remaining <= 10;
  const staminaLow = hud.stamina <= 25;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[76px] z-30 flex justify-center px-3">
      <div className="pointer-events-auto flex w-full max-w-[1180px] flex-col gap-2">
        <div className="flex items-stretch justify-between gap-2">
          {/* Left cluster */}
          <div className="flex items-center gap-2">
            <Gauge value={hud.speed} max={hud.maxSpeed} unit="KTS" />
            <div className="flex flex-col gap-2">
              <div className="glass rounded-2xl px-3 py-2">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-2)]">
                    Stamina
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      staminaLow ? "text-[color:var(--danger)]" : "text-[color:var(--success)]"
                    }`}
                  >
                    {Math.round(hud.stamina)}%
                  </span>
                </div>
                <Bar
                  value={hud.stamina}
                  color={staminaLow ? "var(--danger)" : "var(--success)"}
                  glow={staminaLow}
                />
              </div>
              <div className="flex gap-2">
                <StatChip label="Combo" value={`x${hud.combo}`} accent="#c084fc" />
                <StatChip label="Best" value={`x${hud.maxCombo}`} accent="#a78bfa" />
              </div>
            </div>
          </div>

          {/* Center: score + timer */}
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="glass-hi flex items-center gap-4 rounded-2xl px-5 py-2">
              <div className="flex flex-col items-center">
                <span className="font-mono text-2xl font-extrabold leading-none text-white tabular-nums">
                  {hud.score.toLocaleString("en-US")}
                </span>
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
                  Score
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col items-center">
                <span
                  className={`font-mono text-2xl font-extrabold leading-none tabular-nums ${
                    timeCritical ? "text-[color:var(--danger)] animate-pulse" : "text-white"
                  }`}
                >
                  {formatClock(hud.remaining)}
                </span>
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
                  Time Left
                </span>
              </div>
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-start gap-2">
            <div className="hidden flex-col items-end gap-2 sm:flex">
              <DifficultyBadge diff={diff} />
              <span className="chip font-mono">
                {Math.round(60000 / hud.beat)} BPM
              </span>
            </div>
          </div>
        </div>

        {/* Race progress */}
        <div className="glass rounded-2xl px-4 py-2">
          <div className="mb-1 flex items-center justify-between text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-2)]">
            <span>Start</span>
            <span className={hud.leader === "player" ? "text-[color:var(--brand-2)]" : ""}>
              {hud.leader === "player" ? "You lead" : "Rival leads"}
            </span>
            <span>Finish</span>
          </div>
          <RaceProgress playerPct={hud.playerPct} aiPct={hud.aiPct} />
        </div>
      </div>
    </div>
  );
}
