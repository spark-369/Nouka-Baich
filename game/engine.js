// Pure simulation for the boat race. No React, no DOM — everything lives on a
// plain mutable object ("sim") that the render loop and canvases read directly.

import {
  RACE_LENGTH,
  RACE_TIME_LIMIT,
  MAX_SPEED,
  QUALITY,
  STAMINA,
  DIFFICULTY,
} from "../utils/config";
import { classifyHit, computeAccuracy, computeRank, WINDOWS } from "../utils/rhythm";

const GOOD = WINDOWS.good;

/**
 * Derive the per-stroke impulse (m/s) and the resulting peak speed.
 *
 * Speed decays exponentially (coefficient `drag`). Between strokes the boat
 * covers  I·(1−k)/drag  metres, where  k = exp(−drag·T)  and T is the beat in
 * seconds. Setting the time-averaged speed equal to `cruise` gives
 *     I = cruise · drag · T
 * and the speed sampled immediately after a stroke peaks at
 *     vPeak = I / (1 − k).
 */
function impulseFor(drag, beatMs, cruise) {
  const T = beatMs / 1000;
  const k = Math.exp(-drag * T);
  const impulse = cruise * drag * T;
  return { impulse, k, vPeak: impulse / (1 - k) };
}

export function createSim({ difficulty, startTime = 0 }) {
  const d = DIFFICULTY[difficulty] || DIFFICULTY.normal;
  const { impulse, vPeak } = impulseFor(d.drag, d.beat, d.cruise);
  return {
    difficulty: d.key,
    beat: d.beat,
    drag: d.drag,
    impulse,
    aiSpeed: d.ai,
    aiJitter: d.aiJitter,
    speedScale: Math.round(vPeak * 1.1), // gauge display max
    length: RACE_LENGTH,
    timeLimit: RACE_TIME_LIMIT,
    maxSpeed: MAX_SPEED,

    startTime,
    t: 0,

    player: {
      pos: 0,
      speed: 0,
      stamina: STAMINA.start,
      anim: 0, // 0..1 oar animation phase
      strokeAt: -9999,
      oarSide: 1,
    },
    ai: {
      pos: 0,
      speed: d.ai * 0.85,
      phase: Math.random() * 6.28,
      anim: 0,
    },

    counts: { perfect: 0, great: 0, good: 0, miss: 0 },
    combo: 0,
    maxCombo: 0,
    score: 0,
    strokes: 0,

    ptr: 0, // index of the next unresolved note
    drumPtr: 0, // index of the next beat whose drum should fire
    notes: [], // { i, time }

    lastBeatAt: -9999,
    beatPulse: 0,
    hitPulse: 0,
    missPulse: 0,
    speedFX: 0,

    // Latest judgment, consumed by the rhythm canvas for juicy feedback.
    flash: { judgment: null, error: 0, at: -9999, key: 0 },

    finish: false,
    winner: null,
    reason: null,
    ended: false,
  };
}

export function noteTime(sim, i) {
  return sim.startTime + i * sim.beat;
}

/**
 * Make sure the note schedule covers `now + span` ms, generating on demand.
 */
export function ensureNotes(sim, now, span = 3200) {
  const horizon = now + span;
  let i = sim.notes.length;
  let guard = 0;
  while (noteTime(sim, i) <= horizon && guard < 400) {
    sim.notes.push({ i, time: noteTime(sim, i) });
    i++;
    guard++;
  }
}

/**
 * Register a player tap. Returns { type, key?, error? }.
 * type: "hit" | "miss" | "stray" | "idle"
 */
export function press(sim, now) {
  if (sim.finish) return { type: "idle" };

  const i = sim.ptr;
  const t = noteTime(sim, i);
  const err = now - t;

  // Too early — a harmless stray tap (only a soft tick, no penalty).
  if (err < -GOOD) {
    return { type: "stray" };
  }

  // Already past the note (should normally have been auto-missed).
  if (err > GOOD) {
    return { type: "stray" };
  }

  const key = classifyHit(Math.abs(err)) || "good";

  sim.counts[key]++;
  sim.combo += 1;
  sim.maxCombo = Math.max(sim.maxCombo, sim.combo);
  sim.strokes += 1;

  const base = { perfect: 300, great: 200, good: 100 }[key] || 100;
  sim.score += Math.round(base * (1 + Math.min(sim.combo, 60) * 0.04));

  const imp = sim.impulse * (QUALITY[key] || 0.5);
  sim.player.speed = Math.min(sim.maxSpeed, sim.player.speed + imp);
  sim.player.stamina = Math.min(STAMINA.start, sim.player.stamina + (STAMINA[key] || 0));
  sim.player.anim = 1;
  sim.player.strokeAt = now;
  sim.player.oarSide = -sim.player.oarSide;

  sim.ptr = i + 1;
  sim.hitPulse = 1;
  sim.flash = { judgment: key, error: err, at: now, key: sim.flash.key + 1 };

  return { type: "hit", key, error: err };
}

function resolveMiss(sim, now) {
  sim.counts.miss++;
  sim.combo = 0;
  sim.player.speed = Math.max(0, sim.player.speed * STAMINA.missSpeedMul);
  sim.player.stamina = Math.max(0, sim.player.stamina - STAMINA.miss);
  sim.missPulse = 1;
  sim.flash = { judgment: "miss", error: 0, at: now, key: sim.flash.key + 1 };
}

/**
 * Advance the simulation by dt seconds. Returns { drums } where drums is how
 * many beats fired this frame (so the caller can play the drum sound).
 */
export function step(sim, dt, now) {
  if (sim.finish) return { drums: 0 };

  sim.t += dt;

  ensureNotes(sim, now, 3400);

  // Fire drum beats that have arrived.
  let drums = 0;
  while (sim.drumPtr < sim.notes.length && noteTime(sim, sim.drumPtr) <= now) {
    sim.lastBeatAt = noteTime(sim, sim.drumPtr);
    sim.beatPulse = 1;
    sim.drumPtr++;
    drums++;
    if (drums > 8) break; // safety against long tab suspensions
  }

  // Auto-miss notes that slipped past their window.
  let guard = 0;
  while (sim.ptr < sim.notes.length && now > noteTime(sim, sim.ptr) + GOOD && guard < 6) {
    resolveMiss(sim, now);
    sim.ptr++;
    guard++;
  }

  // Player physics — exponential drag keeps steady-state speed ≈ impulse/(drag*beat).
  sim.player.speed = Math.max(0, sim.player.speed * Math.max(0, 1 - sim.drag * dt));
  sim.player.pos += sim.player.speed * dt;
  sim.player.anim = Math.max(0, sim.player.anim - dt * 2.4);
  sim.player.stamina = Math.max(0, sim.player.stamina - STAMINA.drain * dt);
  sim.speedFX = Math.min(1.4, sim.player.speed / 40);

  // Rival AI with a gentle sinusoidal wobble so the race breathes.
  sim.ai.phase += dt;
  const wob = Math.sin(sim.ai.phase * 0.6) * 0.8 + Math.sin(sim.ai.phase * 1.7) * 0.4;
  const target = sim.aiSpeed + wob * sim.aiJitter;
  sim.ai.speed += (target - sim.ai.speed) * Math.min(1, dt * 1.4);
  sim.ai.pos += sim.ai.speed * dt;
  sim.ai.anim = (sim.ai.anim + dt * sim.ai.speed * 0.16) % 1;

  // Decay feedback pulses.
  sim.beatPulse = Math.max(0, sim.beatPulse - dt * 3.4);
  sim.hitPulse = Math.max(0, sim.hitPulse - dt * 3.0);
  sim.missPulse = Math.max(0, sim.missPulse - dt * 3.0);

  // Finish conditions.
  if (!sim.finish) {
    if (sim.player.pos >= sim.length) {
      sim.finish = true;
      sim.winner = "player";
      sim.reason = "finish";
    } else if (sim.ai.pos >= sim.length) {
      sim.finish = true;
      sim.winner = "ai";
      sim.reason = "finish";
    } else if (sim.player.stamina <= 0) {
      sim.finish = true;
      sim.winner = "ai";
      sim.reason = "exhausted";
    } else if (sim.t >= sim.timeLimit) {
      sim.finish = true;
      sim.winner = sim.player.pos >= sim.ai.pos ? "player" : "ai";
      sim.reason = "timeout";
    }
  }

  return { drums };
}

export function computeStats(sim) {
  const { counts } = sim;
  const total = counts.perfect + counts.great + counts.good + counts.miss;
  const accuracy = computeAccuracy(counts);
  const won = sim.winner === "player";
  const rank = computeRank({ won, accuracy, miss: counts.miss, total });
  return {
    won,
    winner: sim.winner,
    reason: sim.reason,
    score: Math.round(sim.score),
    accuracy,
    rank,
    counts: { ...counts },
    maxCombo: sim.maxCombo,
    total,
    strokes: sim.strokes,
    time: sim.t,
    difficulty: sim.difficulty,
    playerPos: sim.player.pos,
    aiPos: sim.ai.pos,
  };
}

export { GOOD };
