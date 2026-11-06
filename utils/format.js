// Small formatting helpers shared across the UI.

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function formatClock(seconds) {
  const s = Math.max(0, seconds || 0);
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const tenths = Math.floor((s * 10) % 10);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${tenths}`;
}

export function formatScore(n) {
  return Math.round(n || 0).toLocaleString("en-US");
}

export function formatPct(n) {
  return `${Math.round(n || 0)}%`;
}

export function formatDate(ts) {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}
