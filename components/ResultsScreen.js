"use client";
import { useGame } from "../context/GameContext";
import { DIFFICULTY } from "../utils/config";
import { JUDGMENT } from "../utils/rhythm";
import { formatScore, formatClock } from "../utils/format";
import { Bar } from "./UI";

const RANK_COLORS = {
  S: "#fde047",
  A: "#4ade80",
  B: "#38bdf8",
  C: "#fbbf24",
  D: "#94a3b8",
};

function StatTile({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-2)]">
        {label}
      </div>
      <div className="font-mono text-lg font-extrabold" style={{ color: accent || "#fff" }}>
        {value}
      </div>
    </div>
  );
}

export default function ResultsScreen() {
  const { phase, results, restart, resetToMenu, openOverlay } = useGame();
  if (phase !== "results" || !results) return null;

  const diff = DIFFICULTY[results.difficulty] || DIFFICULTY.normal;
  const rankColor = RANK_COLORS[results.rank] || "#fff";
  const { counts } = results;
  const total = results.total || 1;

  const headline = results.won ? "VICTORY" : results.reason === "exhausted" ? "EXHAUSTED" : "DEFEATED";
  const subtitle =
    results.reason === "finish"
      ? results.won
        ? "You crossed the finish line first!"
        : "Your rival reached the finish first."
      : results.reason === "exhausted"
        ? "Your crew ran out of stamina."
        : "The river closed before you finished.";

  const shareRun = async () => {
    const text =
      `🛶 Nouka Baich — ${headline}\n` +
      `${diff.label} · Rank ${results.rank}\n` +
      `Score ${formatScore(results.score)} · ${Math.round(results.accuracy)}% accuracy · x${results.maxCombo} combo`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Nouka Baich", text });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        window.alert("Run copied to your clipboard!");
      }
    } catch {
      /* user cancelled the share sheet */
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-md">
      <div className="glass-hi animate-pop w-full max-w-2xl overflow-hidden">
        {/* Banner */}
        <div
          className="relative flex items-center justify-between px-6 py-5"
          style={{
            background: `linear-gradient(120deg, ${rankColor}22, transparent 60%)`,
          }}
        >
          <div>
            <h2 className="text-4xl font-black tracking-tight text-white">{headline}</h2>
            <p className="mt-1 text-sm text-[color:var(--text-1)]">{subtitle}</p>
          </div>
          <div
            className="grid h-24 w-24 place-items-center rounded-3xl border-2"
            style={{ borderColor: rankColor, background: `${rankColor}18` }}
          >
            <span
              className="text-5xl font-black leading-none"
              style={{ color: rankColor, textShadow: `0 0 30px ${rankColor}` }}
            >
              {results.rank}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Big score */}
          <div className="mb-4 flex items-end justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
            <div>
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[color:var(--text-2)]">
                Final Score
              </div>
              <div className="font-mono text-4xl font-black text-white tabular-nums">
                {formatScore(results.score)}
              </div>
            </div>
            <div className="text-right">
              <div className="chip mb-1">{diff.label}</div>
              {results.rank > 0 ? (
                <div className="text-xs font-bold text-amber-300">
                  #{results.rank} on leaderboard
                </div>
              ) : (
                <div className="text-xs text-[color:var(--text-2)]">Not top 10</div>
              )}
            </div>
          </div>

          {/* Accuracy bar */}
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-[color:var(--text-1)]">
              <span>Accuracy</span>
              <span className="font-mono font-bold text-white">{Math.round(results.accuracy)}%</span>
            </div>
            <Bar value={results.accuracy} color={rankColor} height={12} glow />
          </div>

          {/* Stat tiles */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile label="Max Combo" value={`x${results.maxCombo}`} accent="#c084fc" />
            <StatTile label="Race Time" value={formatClock(results.time)} accent="#22d3ee" />
            <StatTile label="Strokes" value={results.strokes} accent="#fbbf24" />
            <StatTile label="Notes" value={total} accent="#a5b4fc" />
          </div>

          {/* Judgment breakdown */}
          <div className="mb-5 grid grid-cols-4 gap-2">
            {["perfect", "great", "good", "miss"].map((k) => (
              <div
                key={k}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center"
                style={{ borderColor: `${JUDGMENT[k].color}44` }}
              >
                <div
                  className="text-[0.55rem] font-bold uppercase tracking-[0.14em]"
                  style={{ color: JUDGMENT[k].color }}
                >
                  {JUDGMENT[k].label}
                </div>
                <div className="font-mono text-xl font-extrabold text-white">{counts[k]}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button className="btn btn-primary flex-1 py-3 text-base" onClick={restart}>
              ↻ Race Again
            </button>
            <button className="btn btn-ghost flex-1 py-3 text-base" onClick={shareRun}>
              ⇪ Share
            </button>
            <button className="btn btn-ghost flex-1 py-3 text-base" onClick={resetToMenu}>
              ⌂ Main Menu
            </button>
          </div>
          <p className="mt-3 text-center text-[0.65rem] text-[color:var(--text-2)]">
            Press Space to race again · R to restart · Esc for menu ·{" "}
            <button className="underline hover:text-white" onClick={() => openOverlay("settings")}>
              settings
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
