"use client";

/**
 * Full-screen boot loader shown while the app bundles/chunks. Matches the
 * game's visual identity so there is never a white flash on first paint.
 */
export default function BootSplash({ label = "Loading" }) {
  return (
    <main className="relative grid h-[100dvh] w-full place-items-center overflow-hidden">
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid h-20 w-20 place-items-center">
          <span
            className="absolute inset-0 rounded-full border-2 border-white/10 border-t-[color:var(--water-2)]"
            style={{ animation: "spinSlow 0.9s linear infinite" }}
          />
          <span className="text-3xl">🛶</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-bold uppercase tracking-[0.34em] text-white">
            Nouka Baich
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.24em] text-[color:var(--text-2)]">
            {label}
          </span>
        </div>
        <div className="sweep h-1.5 w-48 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/10">
          <div className="shimmer h-full w-full" />
        </div>
      </div>
    </main>
  );
}
