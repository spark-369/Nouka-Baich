// Local persistence for settings + leaderboard. Safe to import on the server.

const SETTINGS_KEY = "nouka:settings:v2";
const LEADERBOARD_KEY = "nouka:leaderboard:v2";
const LEGACY_LEADERBOARD_KEY = "leaderboard";

export const defaultSettings = {
  sfx: true,
  music: true,
  volume: 0.7,
  reduceMotion: false,
};

export function loadSettings() {
  if (typeof window === "undefined") return { ...defaultSettings };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore quota errors */
  }
}

function normalise(entry) {
  return {
    score: Math.round(entry.score || 0),
    difficulty: entry.difficulty || "normal",
    accuracy: Math.round(entry.accuracy || 0),
    maxCombo: Math.round(entry.maxCombo || 0),
    perfect: entry.perfect || 0,
    great: entry.great || 0,
    good: entry.good || 0,
    miss: entry.miss || 0,
    won: !!entry.won,
    date: entry.date || Date.now(),
  };
}

export function loadLeaderboard() {
  if (typeof window === "undefined") return [];
  try {
    let raw = window.localStorage.getItem(LEADERBOARD_KEY);
    // Migrate legacy shape if present.
    if (!raw) {
      raw = window.localStorage.getItem(LEGACY_LEADERBOARD_KEY);
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalise).sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

/**
 * Insert a score entry and persist the top N (by score).
 * Returns { board, rank } where rank is the 1-based position of the new entry
 * (or 0 when it did not make the board).
 */
export function addScore(entry, limit = 10) {
  const board = loadLeaderboard();
  const normalised = normalise(entry);
  board.push(normalised);
  board.sort((a, b) => b.score - a.score);
  const trimmed = board.slice(0, limit);
  const index = trimmed.indexOf(normalised);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
      window.localStorage.removeItem(LEGACY_LEADERBOARD_KEY);
    } catch {
      /* ignore */
    }
  }
  return { board: trimmed, rank: index >= 0 ? index + 1 : 0 };
}

export function clearLeaderboard() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEADERBOARD_KEY);
    window.localStorage.removeItem(LEGACY_LEADERBOARD_KEY);
  } catch {
    /* ignore */
  }
}
