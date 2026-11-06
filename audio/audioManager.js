// Lightweight WebAudio manager. Synthesises all SFX (no extra assets) and
// plays the bundled drum loop for the rhythm track. The AudioContext is created
// lazily on the first user gesture so browsers allow playback.

let ctx = null;
let master = null;
let sfxGain = null;
let drumEl = null;
let drumBuffer = null;
let drumDecoding = false;

const state = {
  sfx: true,
  music: true,
  volume: 0.7,
};

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
    master = ctx.createGain();
    master.gain.value = state.volume;
    master.connect(ctx.destination);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 1;
    sfxGain.connect(master);

    drumEl = new Audio("/drum.mp3");
    drumEl.preload = "auto";
    drumEl.volume = Math.min(1, state.volume);
    decodeDrum();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function decodeDrum() {
  if (drumBuffer || drumDecoding || !ctx) return;
  drumDecoding = true;
  fetch("/drum.mp3")
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("no drum"))))
    .then((buf) => ctx.decodeAudioData(buf))
    .then((decoded) => {
      drumBuffer = decoded;
    })
    .catch(() => {
      drumDecoding = false;
    });
}

function blip(freq, dur = 0.12, type = "sine", gain = 0.22, when = 0, slideTo = null) {
  const c = ensure();
  if (!c || !state.sfx) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(sfxGain);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

export const audio = {
  unlock() {
    ensure();
  },

  setSfx(on) {
    state.sfx = !!on;
  },

  setMusic(on) {
    state.music = !!on;
  },

  setVolume(v) {
    state.volume = Math.max(0, Math.min(1, v));
    if (master) master.gain.value = state.volume;
    if (drumEl) drumEl.volume = Math.min(1, state.volume);
  },

  playDrum() {
    if (!state.music) return;
    const c = ensure();
    if (!c) return;
    if (drumBuffer) {
      const src = c.createBufferSource();
      src.buffer = drumBuffer;
      const g = c.createGain();
      g.gain.value = state.volume;
      src.connect(g);
      g.connect(master);
      src.start();
      return;
    }
    if (drumEl) {
      try {
        drumEl.currentTime = 0;
        drumEl.play().catch(() => {});
      } catch {
        /* ignore */
      }
    }
  },

  perfect() {
    blip(1046, 0.1, "triangle", 0.26);
    blip(1568, 0.14, "triangle", 0.18, 0.04);
  },
  great() {
    blip(880, 0.11, "triangle", 0.22);
  },
  good() {
    blip(620, 0.1, "triangle", 0.18);
  },
  miss() {
    blip(180, 0.16, "sawtooth", 0.14, 0, 110);
  },
  stray() {
    blip(300, 0.05, "sine", 0.05);
  },
  beep(go = false) {
    blip(go ? 1046 : 587, go ? 0.35 : 0.12, "square", 0.16);
  },
  click() {
    blip(520, 0.05, "square", 0.08);
  },
  win() {
    [523, 659, 784, 1046].forEach((f, i) => blip(f, 0.35, "triangle", 0.2, i * 0.11));
  },
  lose() {
    [440, 392, 330, 262].forEach((f, i) => blip(f, 0.4, "sawtooth", 0.14, i * 0.13));
  },
};
