// Rhythm timing model for Nouka Baich.
// All windows are in milliseconds (absolute distance from the ideal beat).

export const WINDOWS = {
  perfect: 55,
  great: 110,
  good: 190,
};

// Judgment table: score value, oar impulse (speed added), stamina restore, colour.
export const JUDGMENT = {
  perfect: { label: "PERFECT", score: 300, impulse: 1, stamina: 7, color: "#fde047", ring: "#fbbf24" },
  great: { label: "GREAT", score: 200, impulse: 0.62, stamina: 4, color: "#4ade80", ring: "#22c55e" },
  good: { label: "GOOD", score: 100, impulse: 0.32, stamina: 2, color: "#38bdf8", ring: "#0ea5e9" },
  miss: { label: "MISS", score: 0, impulse: 0, stamina: 0, color: "#fb7185", ring: "#f43f5e" },
};

export const JUDGMENT_ORDER = ["perfect", "great", "good", "miss"];

/**
 * Classify a hit given the absolute timing error in ms.
 * Returns a judgment key or null when the press is outside every window.
 */
export function classifyHit(absMs) {
  if (absMs <= WINDOWS.perfect) return "perfect";
  if (absMs <= WINDOWS.great) return "great";
  if (absMs <= WINDOWS.good) return "good";
  return null;
}

/**
 * Weighted accuracy (0-100) from judgment counts.
 */
export function computeAccuracy({ perfect = 0, great = 0, good = 0, miss = 0 }) {
  const total = perfect + great + good + miss;
  if (!total) return 0;
  return (perfect * 100 + great * 70 + good * 40) / total;
}

/**
 * Letter rank from a finished run.
 */
export function computeRank({ won, accuracy, miss, total }) {
  const missRate = total > 0 ? miss / total : 1;
  if (won && accuracy >= 95 && missRate <= 0.04) return "S";
  if (won && accuracy >= 88) return "A";
  if (accuracy >= 78) return "B";
  if (accuracy >= 60) return "C";
  return "D";
}

// Legacy helper kept for backwards compatibility.
export const isPerfectHit = (now, beat) => Math.abs(now - beat) < 250;
