// Central tunables for Nouka Baich. Distances are in abstract "metres" (world
// units) and speeds are metres/second.

export const RACE_LENGTH = 1000; // metres
export const RACE_TIME_LIMIT = 100; // seconds before the river closes

export const MAX_SPEED = 90; // hard cap on the player's boat speed

// Stamina economy.
export const STAMINA = {
  start: 100,
  drain: 2.6, // passive drain per second
  perfect: 2.4,
  great: 1.7,
  good: 1.1,
  miss: 7,
  missSpeedMul: 0.9, // speed multiplier applied on a miss
};

// `cruise` is the steady-state speed (m/s) achieved by an all-PERFECT run.
// The engine derives per-judgment impulses so Great/Good runs are proportionally
// slower. `ai` is the rival's average speed (m/s). Beats are in milliseconds.
export const DIFFICULTY = {
  easy: {
    key: "easy",
    label: "Novice",
    tagline: "Calm waters, forgiving current",
    beat: 860,
    cruise: 15.0,
    ai: 12.0,
    aiJitter: 0.5,
    drag: 1.6,
    color: "#4ade80",
  },
  normal: {
    key: "normal",
    label: "Racer",
    tagline: "Balanced currents, keen rival",
    beat: 700,
    cruise: 18.6,
    ai: 16.0,
    aiJitter: 0.8,
    drag: 1.6,
    color: "#38bdf8",
  },
  hard: {
    key: "hard",
    label: "Champion",
    tagline: "Rapids, ruthless champion",
    beat: 540,
    cruise: 21.6,
    ai: 19.5,
    aiJitter: 1.1,
    drag: 1.6,
    color: "#fb7185",
  },
};

// Speed multiplier (relative to a perfect run) for weaker judgments.
export const QUALITY = { perfect: 1.0, great: 0.88, good: 0.72 };


export const DIFFICULTY_ORDER = ["easy", "normal", "hard"];
