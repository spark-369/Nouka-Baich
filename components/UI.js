"use client";

// Small presentational primitives shared across screens.

export function StatChip({ label, value, accent = "var(--text-0)", sub, mono = true }) {
  return (
    <div className="glass flex min-w-[92px] flex-col gap-0.5 rounded-2xl px-3.5 py-2">
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-2)]">
        {label}
      </span>
      <span
        className={`text-lg font-extrabold leading-none ${mono ? "font-mono" : ""}`}
        style={{ color: accent }}
      >
        {value}
      </span>
      {sub ? <span className="text-[0.6rem] text-[color:var(--text-2)]">{sub}</span> : null}
    </div>
  );
}

export function Bar({ value, max = 100, color = "var(--water-2)", height = 10, glow = false }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="relative w-full overflow-hidden rounded-full bg-black/50 ring-1 ring-white/10"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-150 ease-out"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: glow ? `0 0 14px ${color}` : "none",
        }}
      />
    </div>
  );
}

export function Gauge({ value, max, label, unit }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 42;
  const arc = (240 / 360) * 2 * Math.PI * r;
  return (
    <div className="relative grid h-[104px] w-[104px] place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${arc} 999`}
          transform="rotate(150 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${pct * arc} 999`}
          transform="rotate(150 50 50)"
          style={{ transition: "stroke-dasharray 0.15s ease-out" }}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>
      </svg>
      <div className="z-10 flex flex-col items-center">
        <span className="font-mono text-2xl font-extrabold leading-none text-white">
          {Math.round(value)}
        </span>
        <span className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-[color:var(--text-2)]">
          {unit || label}
        </span>
      </div>
    </div>
  );
}

export function DifficultyBadge({ diff }) {
  const style = diff?.color || "var(--water-2)";
  return (
    <span
      className="chip"
      style={{ color: style, borderColor: `${style}55`, background: `${style}14` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: style }} />
      {diff?.label || "Racer"}
    </span>
  );
}
