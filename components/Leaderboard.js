"use client";
import { useEffect, useState } from "react";
import { loadLeaderboard, clearLeaderboard } from "../utils/storage";
import { DIFFICULTY } from "../utils/config";
import { formatScore, formatDate } from "../utils/format";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ onClose }) {
  const [board, setBoard] = useState([]);

  const refresh = () => setBoard(loadLeaderboard());

  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleClear = () => {
    if (typeof window !== "undefined" && !window.confirm("Clear the local leaderboard?")) return;
    clearLeaderboard();
    refresh();
  };

  return (
    <div className="glass-hi flex w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <h2 className="text-lg font-extrabold leading-none text-white">Leaderboard</h2>
            <span className="text-[0.65rem] text-[color:var(--text-2)]">Top 10 · saved locally</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {board.length > 0 && (
            <button className="chip hover:text-white" onClick={handleClear}>
              Clear
            </button>
          )}
          {onClose && (
            <button className="btn btn-ghost px-3 py-1 text-xs" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[46vh] overflow-y-auto px-3 py-2">
        {board.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="text-4xl opacity-60">🛶</span>
            <p className="text-sm text-[color:var(--text-1)]">
              No races yet — your scores will appear here.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {board.map((b, i) => {
              const diff = DIFFICULTY[b.difficulty] || DIFFICULTY.normal;
              return (
                <li
                  key={i}
                  className="grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition hover:bg-white/10"
                >
                  <span className="text-center text-lg">
                    {MEDALS[i] || (
                      <span className="font-mono text-sm text-[color:var(--text-2)]">{i + 1}</span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-white">
                        {formatScore(b.score)}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider"
                        style={{ background: `${diff.color}22`, color: diff.color }}
                      >
                        {diff.label}
                      </span>
                    </div>
                    <div className="mt-0.5 flex gap-3 font-mono text-[0.65rem] text-[color:var(--text-2)]">
                      <span>{b.accuracy}% acc</span>
                      <span>x{b.maxCombo}</span>
                      <span className={b.won ? "text-emerald-300" : ""}>
                        {b.won ? "Won" : "Lost"}
                      </span>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-right text-[0.65rem] text-[color:var(--text-2)]">
                    {formatDate(b.date)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
