# 🛶 Nouka Baich — Rhythm Boat Racing

> Strike the water **on the beat**, chain **PERFECT** strokes, and out-row your rival down the river in this rhythm-based boat racing game inspired by the traditional Bangladeshi *nouka baich* (boat race).

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-087ea4?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)](#license--credits)

---

## 📖 Table of Contents

- [About the Game](#-about-the-game)
- [Features](#-features)
- [Gameplay](#-gameplay)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Configuration Reference](#-configuration-reference)
- [Data & Persistence](#-data--persistence)
- [Controls & Shortcuts](#-controls--shortcuts)
- [Accessibility](#-accessibility)
- [SEO, PWA & App Shell](#-seo-pwa--app-shell)
- [Browser Support](#-browser-support)
- [License & Credits](#-license--credits)

---

## 🎯 About the Game

**Nouka Baich** is a browser-based rhythm racing game. You pilot a long wooden *nouka* down a 1 km river course and drive it forward by striking the water **in time with an on-screen rhythm track and a drum loop**. Clean, well-timed strokes build combos, replenish stamina, and produce your fastest cruise speed; sloppy timing (or no timing at all) slows the boat and drains your crew's stamina until the race ends.

The experience is fully client-side — no backend, no accounts, no network calls at runtime — and runs as an installable Progressive Web App shell with local leaderboards, audio synthesis, and canvas rendering.

**At a glance**

| | |
|---|---|
| **Genre** | Rhythm / music / racing |
| **Players** | Single player vs. AI rival |
| **Course** | 1,000 m river, 100 s time limit |
| **Runtime** | 100% client-side (Next.js App Router) |
| **Audio** | Web Audio API (synthesised SFX + drum loop) |
| **Rendering** | HTML5 Canvas 2D (world + rhythm highway) |
| **Persistence** | `localStorage` (settings + top-10 leaderboard) |

---

## ✨ Features

- **Rhythm-core gameplay** — Judgment windows (PERFECT / GREAT / GOOD / MISS) with ±55 / ±110 / ±190 ms accuracy bands.
- **Stamina economy** — Every stroke costs/tops-up stamina; running dry ends your run instantly.
- **Combo & score multipliers** — Consecutive clean hits amplify your score (up to a ×3.4 cap at 60 combo).
- **Live rival AI** — A sinusoidal-wobble opponent that races toward the finish with per-difficulty speed and jitter.
- **Three difficulty courses** — *Novice*, *Racer*, and *Champion* change beat tempo, cruise speed, and rival strength.
- **Procedural canvas world** — Parallax sky/hills/banks, animated water, buoys, and start/finish gantries — all drawn in code, no sprite assets.
- **Synthesised audio** — All sound effects are generated with the Web Audio API; only the drum loop ships as an asset.
- **Local leaderboard** — Top 10 runs persisted on-device with difficulty, accuracy, combo, and win/loss.
- **Full settings panel** — SFX, music, master volume, fullscreen, reduce-motion, difficulty, and data reset.
- **Responsive & touch-ready** — On-screen row pad for mobile, tap-anywhere row control, and a dedicated touch cooldown ring.
- **Accessible** — Focus-safe modal dialogs, `aria-live` phase announcements, `prefers-reduced-motion` support, and a user-toggled reduce-motion mode.
- **Installable PWA shell** — Web app manifest, apple-web-app metadata, boot splash, and a route-level error boundary.
- **Zero-asset UI** — Every icon is an emoji/SVG and all typography is served via `next/font`.

---

## 🎮 Gameplay

### Objective
Reach the **1,000 m finish line before your rival**. There is a secondary **100-second time limit** — if the river "closes" first, the boat that is furthest along wins.

### How you move
Your boat only accelerates when you **strike on the beat**. The rhythm track scrolls note markers right-to-left toward a hit line; press when a marker crosses the line. The closer your press is to the ideal beat, the better the judgment — and the stronger the oar impulse.

### Judgments & scoring

| Judgment | Timing window | Score | Oar impulse | Stamina | Color |
|---|---|---|---|---|---|
| **PERFECT** | ±55 ms | +300 | ×1.00 | +2.4 | 🟡 `#fde047` |
| **GREAT** | ±110 ms | +200 | ×0.88 | +1.7 | 🟢 `#4ade80` |
| **GOOD** | ±190 ms | +100 | ×0.72 | +1.1 | 🔵 `#38bdf8` |
| **MISS** | — (no input in window) | 0 | ×0 (×0.9 speed) | −7 | 🔴 `#fb7185` |

- **Combo bonus:** `score += base × (1 + min(combo, 60) × 0.04)` — up to a **×3.4** multiplier.
- **Accuracy:** `(perfect×100 + great×70 + good×40) / totalNotes` (0–100).
- **Oar impulse** is the `QUALITY` multiplier applied to the difficulty's base per-stroke impulse.
- **Presses more than 190 ms early or late** are treated as a harmless **stray tap** (soft tick, no penalty).

### Stamina
Stamina starts at **100** and drains passively at **2.6/s**. Perfect/great/good strokes restore it; a miss costs **7** and also applies a **×0.9** speed penalty. If stamina hits **0**, your run ends as **EXHAUSTED**.

### Ranks
Awarded at the results screen from your final accuracy, miss rate, and win/loss:

| Rank | Condition |
|---|---|
| **S** | Won **and** accuracy ≥ 95% **and** miss rate ≤ 4% |
| **A** | Won **and** accuracy ≥ 88% |
| **B** | Accuracy ≥ 78% |
| **C** | Accuracy ≥ 60% |
| **D** | Anything else |

### Difficulty courses

| Course | Beat | BPM | Perfect cruise | Rival speed | Rival jitter |
|---|---|---|---|---|---|
| **Novice** (`easy`) | 860 ms | ~70 | 15.0 m/s | 12.0 m/s | ±0.5 |
| **Racer** (`normal`) | 700 ms | ~86 | 18.6 m/s | 16.0 m/s | ±0.8 |
| **Champion** (`hard`) | 540 ms | ~111 | 21.6 m/s | 19.5 m/s | ±1.1 |

> *Cruise* is the steady-state speed achieved by an all-PERFECT run. Weaker judgments scale the per-stroke impulse down proportionally (GREAT = ×0.88, GOOD = ×0.72).

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.1.4](https://nextjs.org/) (App Router) |
| **UI library** | [React 19.2.3](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/postcss` + a custom CSS design system |
| **Fonts** | `next/font/google` — Geist & Geist Mono |
| **Rendering** | HTML5 Canvas 2D API (`WorldCanvas`, `RhythmTrack`) |
| **Audio** | Web Audio API (`audioManager`, synthesised oscillators + decoded drum loop) |
| **State** | React Context (`GameContext`) + mutable simulation object held in a `ref` |
| **Language** | JavaScript (no TypeScript) — ESM modules |
| **Tooling** | Next.js CLI, PostCSS, npm |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 20.9.0** (required by Next.js 16)
- **npm** (or a compatible package manager such as `pnpm` / `yarn`)
- A modern browser with Web Audio + Canvas support

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/spark-369/Rhythm-Based-Boat-Racing-Game.git

# 2. Enter the project directory
cd Rhythm-Based-Boat-Racing-Game

# 3. Install dependencies
npm install
```

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server at [http://localhost:3000](http://localhost:3000) with hot reload |
| `npm run build` | Create an optimised production build |
| `npm run start` | Serve the production build (run `build` first) |

> **First-time audio note:** Browsers block `AudioContext` until a user gesture. The game unlocks audio on the first click/tap (e.g. selecting a difficulty or pressing **Start Race**), so sound begins naturally at the menu.

---

## 📁 Project Structure

The project keeps the game logic split from the Next.js `src/` app shell: **React-free engines and utilities** live at the repo root, while **UI components and the App Router** live under `src/`.

```
v1/
├── audio/
│   └── audioManager.js      # Lazy Web Audio manager: synthesised SFX + drum loop
├── components/              # Reusable React UI (all "use client")
│   ├── BootSplash.js        # Branded boot loader (slow-start only)
│   ├── CountdownOverlay.js  # "GET READY / 3-2-1 / GO!" countdown
│   ├── HUD.js               # Speed gauge, stamina, score, timer, race progress
│   ├── HowToPlay.js         # Help modal (objective, controls, judgments, tips)
│   ├── Leaderboard.js       # Local top-10 board with medals
│   ├── Menu.js              # Main menu: hero, difficulty picker, quick sound
│   ├── OnScreenPad.js       # Touch "ROW" button with beat cooldown ring
│   ├── PauseMenu.js         # Pause overlay with live stats
│   ├── ResultsScreen.js     # Post-race summary, rank badge, share, replay
│   ├── RhythmTrack.js       # Canvas rhythm highway + hit line
│   ├── River.js             # In-race layout: world, feedback, track, pause
│   ├── SettingsPanel.js     # Settings modal (audio/display/difficulty/data)
│   ├── TopBar.js            # Persistent nav (pause, help, settings, sound, fullscreen)
│   ├── UI.js                # Presentational primitives (StatChip, Bar, Gauge, Badge)
│   └── WorldCanvas.js       # Canvas race world (parallax, boats, gantries, buoys)
├── context/
│   └── GameContext.js       # Central state hub: phases, sim ref, main rAF loop
├── game/
│   ├── engine.js            # Pure, React-free race simulation (the "sim")
│   └── sprites.js           # Pure Canvas drawing routines (boat, buoy, gantry, water)
├── src/
│   └── app/
│       ├── layout.js        # Root layout: metadata, viewport, fonts
│       ├── page.js          # Home route: GameProvider + app shell
│       ├── globals.css      # Tailwind import + design-system CSS
│       ├── loading.js       # Route loading UI (BootSplash)
│       ├── error.js         # Route error boundary
│       ├── not-found.js     # 404 page
│       ├── manifest.js      # PWA web app manifest
│       └── robots.js        # robots.txt route
├── utils/
│   ├── config.js            # Central tunables (race, stamina, difficulty, quality)
│   ├── format.js            # Formatting helpers (time, clock, score, %, date)
│   ├── rhythm.js            # Timing windows, judgments, accuracy, rank
│   └── storage.js           # localStorage: settings + leaderboard (SSR-safe)
├── public/
│   ├── drum.mp3             # The drum loop used as rhythmic music
│   └── icon.svg             # App icon (manifest + favicon)
├── jsconfig.json            # Path alias: "@/*" → "./src/*"
├── next.config.mjs          # Next.js configuration
├── postcss.config.mjs       # Tailwind PostCSS plugin
├── package.json
└── README.md
```

---

## 🏗 Architecture

The game is built around a small number of well-separated concerns:

### 1. The simulation (`game/engine.js`)
A **pure, React-free, DOM-free** mutable object (the "sim") holds all race state: player/rival position & speed, stamina, judgment counts, combo, score, and the generated note schedule. Core functions:

| Function | Purpose |
|---|---|
| `createSim({ difficulty, startTime })` | Build a fresh simulation from a difficulty preset |
| `noteTime(sim, i)` | Absolute timestamp (ms) of beat `i` |
| `ensureNotes(sim, now, span)` | Lazily extend the note schedule ahead of time |
| `press(sim, now)` | Resolve a tap → `{ type: "hit" \| "miss" \| "stray" \| "idle", key, error }` |
| `step(sim, dt, now)` | Advance physics, fire drums, auto-miss, check finish conditions |
| `computeStats(sim)` | Final score, accuracy, rank, counts, and positions |

**Physics model:** Speed decays exponentially (`drag`) between strokes. The engine derives the per-stroke impulse so that an all-PERFECT run averages the difficulty's `cruise` speed:
```
I = cruise · drag · T          (T = beat in seconds)
vPeak = I / (1 − e^(−drag·T))
```
This keeps every difficulty balanced while letting weaker judgments scale the impulse down.

### 2. Central state & game loop (`context/GameContext.js`)
`GameProvider` is the single source of truth. It owns:
- **Phase machine:** `menu → countdown → racing → paused → results`
- A `simRef` holding the live simulation object (so the render loop reads it without re-rendering React).
- `flashRef` — the latest judgment, streamed to UI overlays.
- The **main `requestAnimationFrame` loop** that calls `step(...)`, plays drums, and throttles React HUD updates to ~24 fps while canvases render at full rate.

State is exposed to all components via the `useGame()` hook.

### 3. Input handling
Keyboard listeners live in `GameContext` (Space/↑/F/…); pointer input is captured globally by `River` (taps anywhere row) and by the dedicated `OnScreenPad` (mobile). The global tap handler ignores taps landing on `<button>` elements to avoid double-firing.

### 4. Rendering (`components/WorldCanvas.js`, `RhythmTrack.js`, `game/sprites.js`)
Two independent canvases, each with its own rAF loop and `ResizeObserver`:
- **WorldCanvas** — camera follows the player at ~34% from the left; `COURSE_SCREENS` keeps the full course spanning a consistent number of screen widths on any display.
- **RhythmTrack** — a scrolling hit line with a 2,200 ms lookahead and a highlighted judgment band.

`game/sprites.js` contains pure draw functions (`drawBoat`, `drawBuoy`, `drawGantry`, `drawBank`, `drawHills`, `drawWater`).

### 5. Audio (`audio/audioManager.js`)
A lazy singleton that creates the `AudioContext` on the first user gesture (browser requirement). SFX are synthesised from oscillators (`blip()`); the music loop is `public/drum.mp3`, decoded into an `AudioBuffer` for low-latency, overlapping playback.

### 6. Persistence (`utils/storage.js`)
SSR-safe helpers that read/write `localStorage`, including a migration path for a legacy leaderboard key.

---

## ⚙️ Configuration Reference

Most gameplay tuning lives in **`utils/config.js`**:

| Constant | Default | Meaning |
|---|---|---|
| `RACE_LENGTH` | `1000` | Course length in metres (world units) |
| `RACE_TIME_LIMIT` | `100` | Seconds before the river closes |
| `MAX_SPEED` | `90` | Hard cap on the player's speed |
| `STAMINA.start` | `100` | Starting stamina |
| `STAMINA.drain` | `2.6` | Passive drain per second |
| `STAMINA.perfect/great/good` | `2.4 / 1.7 / 1.1` | Stamina restored per judgment |
| `STAMINA.miss` | `7` | Stamina lost per miss |
| `STAMINA.missSpeedMul` | `0.9` | Speed multiplier on a miss |
| `DIFFICULTY.<key>.beat` | `860 / 700 / 540` | Beat interval (ms) |
| `DIFFICULTY.<key>.cruise` | `15.0 / 18.6 / 21.6` | Perfect-run steady speed (m/s) |
| `DIFFICULTY.<key>.ai` | `12.0 / 16.0 / 19.5` | Rival average speed (m/s) |
| `DIFFICULTY.<key>.aiJitter` | `0.5 / 0.8 / 1.1` | Rival speed wobble amplitude |
| `DIFFICULTY.<key>.drag` | `1.6` | Exponential drag coefficient |
| `QUALITY` | `{ perfect: 1.0, great: 0.88, good: 0.72 }` | Impulse multiplier per judgment |
| `DIFFICULTY_ORDER` | `["easy","normal","hard"]` | Menu ordering |

Rhythm timing and scoring live in **`utils/rhythm.js`**:

| Constant | Value | Meaning |
|---|---|---|
| `WINDOWS.perfect` | `55` | ± ms for PERFECT |
| `WINDOWS.great` | `110` | ± ms for GREAT |
| `WINDOWS.good` | `190` | ± ms for GOOD |
| `JUDGMENT.<key>.score` | `300 / 200 / 100 / 0` | Score per judgment |
| `JUDGMENT.<key>.color` | hex | UI color per judgment |
| `COUNTDOWN_MS` (in `GameContext`) | `3000` | Pre-race countdown duration |

> **Design note:** `RhythmTrack`'s `GOOD` and `LOOKAHEAD` constants mirror `WINDOWS.good` and are intentionally kept local to avoid importing game logic into a render loop. If you change the timing windows, update both places.

---

## 💾 Data & Persistence

Everything is stored on-device in `localStorage` — no server, no analytics.

| Key | Contents |
|---|---|
| `nouka:settings:v2` | `{ sfx, music, volume, reduceMotion }` |
| `nouka:leaderboard:v2` | Array of up to 10 normalised score entries |
| `leaderboard` *(legacy)* | Auto-migrated into `nouka:leaderboard:v2` on first load |

**Leaderboard entry shape:**
```json
{
  "score": 12480,
  "difficulty": "normal",
  "accuracy": 92,
  "maxCombo": 47,
  "perfect": 52, "great": 9, "good": 3, "miss": 2,
  "won": true,
  "date": 1736000000000
}
```
Scores are sorted descending and trimmed to the top 10. You can clear them from **Settings → Data → Clear scores** or the **Leaderboard → Clear** button.

---

## ⌨️ Controls & Shortcuts

| Action | Keys / Input |
|---|---|
| **Row / strike** | `Space`, `ArrowUp`, or `F` — or tap/click anywhere, or the on-screen **ROW** pad |
| **Start race** (menu) | `Space` / row keys, or **Start Race** button |
| **Race again** (results) | `Space` / row keys, or **Race Again** |
| **Pause / resume** | `Esc` |
| **Restart race** | `R` |
| **Mute / unmute** | `M` (toggles both SFX and music) |
| **How to play** | `H` |
| **Settings** | `P` |
| **Close any modal** | `Esc` |

> While a modal dialog is open, gameplay shortcuts are swallowed so typing/keys don't leak into the race. The race **auto-pauses** when the window loses focus or the tab is hidden.

---

## ♿ Accessibility

- **Focus-safe dialogs:** modals use `role="dialog"`, `aria-modal="true"`, labelled buttons, and `Esc`-to-close.
- **Live announcements:** a visually hidden `aria-live="polite"` region announces phase and overlay changes to screen readers.
- **Reduced motion:** respects the OS `prefers-reduced-motion` media query *and* offers a persisted **Reduce motion** toggle that toggles a `reduce-motion` class on `<html>`.
- **Semantic controls:** toggles expose `role="switch"` + `aria-checked`; sliders/icon buttons carry descriptive `aria-label`s.
- **Touch & keyboard parity:** every core action is reachable by both keyboard and touch.

---

## 🔎 SEO, PWA & App Shell

- **Metadata** (`src/app/layout.js`): title, description, keywords, OpenGraph, and Twitter card metadata.
- **Viewport**: fixed `device-width`, `maximumScale: 1`, `userScalable: false`, theme color `#05070f` — tuned like a game viewport.
- **PWA** (`src/app/manifest.js`): installable standalone app with `icon.svg`, dark theme, and `games`/`entertainment` categories.
- **Apple web app**: `capable`, `black-translucent` status bar, and app title.
- **Robots** (`src/app/robots.js`): allow all crawlers.
- **App shell**: `BootSplash` is shown during cold route loads and — via `loading.js` — while chunks download, so there is never a white flash. `error.js` provides a themed route-level error boundary, and `not-found.js` a themed 404.

---

## 🌐 Browser Support

The game targets current desktop and mobile browsers:

| Browser | Notes |
|---|---|
| ✅ Chrome / Edge (Chromium) | Full support (reference target) |
| ✅ Firefox | Full support |
| ✅ Safari (macOS & iOS) | Web Audio unlocks on first tap (`webkitAudioContext` fallback included) |
| ✅ Android Chrome | Touch row pad enabled |

**Requirements:** Web Audio API, Canvas 2D, `ResizeObserver`, and `requestAnimationFrame`. Fullscreen and `navigator.share` are used opportunistically and degrade gracefully when unavailable.

---

## 📄 License & Credits

- **Game, code, and design:** © **Shyhoon** — crafted with Next.js. *Powered by Shyhoon.*
- **Project name:** `my-app` (private, `UNLICENSED`) — see `package.json`.
- **Fonts:** Geist & Geist Mono via `next/font/google` (Google Fonts).
- **Drum loop:** `public/drum.mp3`.

> ⚠️ This repository has no explicit open-source license file. Unless one is added, all rights are reserved by the author. Replace this section with your chosen license if you intend to distribute the project.

---

<p align="center"><em>Row on the beat. Win the race. 🛶</em></p>

