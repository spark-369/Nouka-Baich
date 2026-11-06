"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary (App Router). Keeps the game's visual identity
 * even when something unexpected throws during render.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Surface the error to the console in production for diagnostics.
    console.error("[Nouka Baich] Unhandled error:", error);
  }, [error]);

  return (
    <main className="relative grid h-[100dvh] w-full place-items-center overflow-hidden px-4">
      <div className="glass-hi animate-slide-up flex w-full max-w-md flex-col items-center gap-4 p-8 text-center">
        <span className="text-5xl">🌊</span>
        <h1 className="text-2xl font-black tracking-tight text-white">Rough waters</h1>
        <p className="text-sm text-[color:var(--text-1)]">
          Something capsized the game. You can try again — your leaderboard and settings are safe.
        </p>
        <div className="mt-1 flex w-full flex-col gap-2.5 sm:flex-row">
          <button className="btn btn-primary flex-1 py-3" onClick={() => reset()}>
            ↻ Try again
          </button>
          <a className="btn btn-ghost flex-1 py-3" href="/">
            ⌂ Main Menu
          </a>
        </div>
      </div>
    </main>
  );
}
