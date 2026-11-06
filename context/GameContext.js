"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { audio } from "../audio/audioManager";
import { createSim, step, press, computeStats, ensureNotes } from "../game/engine";
import {
  loadSettings,
  saveSettings,
  addScore,
  defaultSettings,
} from "../utils/storage";
import { MAX_SPEED, RACE_TIME_LIMIT } from "../utils/config";

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const COUNTDOWN_MS = 3000;

const initialHud = () => ({
  speed: 0,
  maxSpeed: MAX_SPEED,
  stamina: 100,
  score: 0,
  combo: 0,
  maxCombo: 0,
  time: 0,
  timeLimit: RACE_TIME_LIMIT,
  remaining: RACE_TIME_LIMIT,
  playerPct: 0,
  aiPct: 0,
  leader: "player",
  beat: 700,
});

/**
 * Phases: "menu" | "countdown" | "racing" | "paused" | "results"
 */
export const GameProvider = ({ children }) => {
  const [phase, setPhase] = useState("menu");
  const [difficulty, setDifficulty] = useState("normal");
  const [countdown, setCountdown] = useState(0);
  const [results, setResults] = useState(null);
  const [hud, setHud] = useState(initialHud);
  const [settings, setSettings] = useState(defaultSettings);
  const [overlay, setOverlay] = useState(null); // null | "settings" | "howto"
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false); // false until persisted settings load

  const simRef = useRef(null);
  const flashRef = useRef({ judgment: null, error: 0, at: -9999, key: 0 });
  const phaseRef = useRef(phase);
  const overlayRef = useRef(overlay);
  const countdownRef = useRef(null);
  const pauseAtRef = useRef(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    overlayRef.current = overlay;
  }, [overlay]);

  // Load persisted settings once on mount.
  useEffect(() => {
    setSettings(loadSettings());
    loadedRef.current = true;
    setReady(true);
  }, []);

  // Push settings into the audio layer, and persist (after initial load).
  useEffect(() => {
    audio.setSfx(settings.sfx);
    audio.setMusic(settings.music);
    audio.setVolume(settings.volume);
    if (loadedRef.current) saveSettings(settings);
  }, [settings]);

  // Reflect the reduced-motion preference on the document root so CSS can
  // disable animation without a React re-render per frame.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("reduce-motion", !!settings.reduceMotion);
  }, [settings.reduceMotion]);

  // Track fullscreen state (covers ESC-initiated exits from the browser).
  useEffect(() => {
    const sync = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    sync();
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    } catch {
      /* fullscreen may be blocked by the browser */
    }
  }, []);

  // Overlays (settings / how-to-play). Opening one mid-race pauses the game.
  const openOverlay = useCallback((name) => {
    if (phaseRef.current === "racing") {
      pauseAtRef.current = performance.now();
      setPhase("paused");
    }
    setOverlay(name);
    audio.click();
  }, []);

  const closeOverlay = useCallback(() => setOverlay(null), []);

  const toggleOverlay = useCallback((name) => {
    setOverlay((cur) => {
      if (cur === name) return null;
      if (phaseRef.current === "racing") {
        pauseAtRef.current = performance.now();
        setPhase("paused");
      }
      audio.click();
      return name;
    });
  }, []);


  const updateSettings = useCallback(
    (patch) => setSettings((s) => ({ ...s, ...patch })),
    []
  );

  // ------------------------------------------------------------------
  // Race lifecycle
  // ------------------------------------------------------------------
  const startRace = useCallback(
    (diff) => {
      const d = diff || difficulty;
      audio.unlock();
      const now = performance.now();
      const startTime = now + COUNTDOWN_MS;
      const sim = createSim({ difficulty: d, startTime });
      ensureNotes(sim, now, COUNTDOWN_MS + 2400);
      simRef.current = sim;
      flashRef.current = { judgment: null, error: 0, at: -9999, key: 0 };
      countdownRef.current = null;
      setResults(null);
      setDifficulty(d);
      setHud({
        ...initialHud(),
        maxSpeed: sim.speedScale,
        beat: sim.beat,
        timeLimit: sim.timeLimit,
        remaining: sim.timeLimit,
      });
      setCountdown(COUNTDOWN_MS / 1000);
      setOverlay(null);
      setPhase("countdown");
    },
    [difficulty]
  );

  const resetToMenu = useCallback(() => {
    simRef.current = null;
    setResults(null);
    setCountdown(0);
    setHud(initialHud());
    setOverlay(null);
    setPhase("menu");
  }, []);

  const restart = useCallback(() => startRace(difficulty), [startRace, difficulty]);

  const togglePause = useCallback(() => {
    setPhase((p) => {
      if (p === "racing") {
        pauseAtRef.current = performance.now();
        return "paused";
      }
      if (p === "paused") {
        const sim = simRef.current;
        if (sim) {
          const delta = performance.now() - pauseAtRef.current;
          sim.startTime += delta;
        }
        return "racing";
      }
      return p;
    });
  }, []);

  const pause = useCallback(() => {
    if (phaseRef.current === "racing") {
      pauseAtRef.current = performance.now();
      setPhase("paused");
    }
  }, []);

  // ------------------------------------------------------------------
  // Input
  // ------------------------------------------------------------------
  const handlePress = useCallback(() => {
    const sim = simRef.current;
    if (!sim || phaseRef.current !== "racing") return;
    const res = press(sim, performance.now());
    flashRef.current = sim.flash;
    if (res.type === "hit" && audio[res.key]) audio[res.key]();
    else if (res.type === "stray") audio.stray();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat) return;
      const p = phaseRef.current;
      const modalOpen = !!overlayRef.current;

      // Escape always closes an open modal; nothing else passes through while open.
      if (e.code === "Escape") {
        if (modalOpen) {
          setOverlay(null);
          return;
        }
        if (p === "racing" || p === "paused") togglePause();
        return;
      }
      if (e.code === "KeyH") {
        toggleOverlay("howto");
        return;
      }
      if (e.code === "KeyP") {
        toggleOverlay("settings");
        return;
      }
      if (modalOpen) return; // swallow gameplay shortcuts while a dialog is open

      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyF") {
        e.preventDefault();
        if (p === "racing") handlePress();
        else if (p === "menu") {
          audio.click();
          startRace();
        } else if (p === "results") restart();
      } else if (e.code === "KeyR") {
        if (p === "racing" || p === "paused" || p === "results") startRace(difficulty);
      } else if (e.code === "KeyM") {
        setSettings((s) => ({ ...s, sfx: !s.sfx, music: !s.music }));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePress, startRace, restart, togglePause, toggleOverlay, difficulty]);

  // Auto-pause when the window loses focus mid-race.
  useEffect(() => {
    const onHide = () => {
      if (phaseRef.current === "racing") pause();
    };
    const onVisibility = () => {
      if (document.hidden) onHide();
    };
    window.addEventListener("blur", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pause]);

  // ------------------------------------------------------------------
  // End of race
  // ------------------------------------------------------------------
  const endRace = useCallback((sim) => {
    const stats = computeStats(sim);
    const entry = {
      score: stats.score,
      difficulty: stats.difficulty,
      accuracy: Math.round(stats.accuracy),
      maxCombo: stats.maxCombo,
      perfect: stats.counts.perfect,
      great: stats.counts.great,
      good: stats.counts.good,
      miss: stats.counts.miss,
      won: stats.won,
      date: Date.now(),
    };
    let rank = 0;
    try {
      rank = addScore(entry).rank;
    } catch {
      /* storage may be unavailable */
    }
    if (stats.won) audio.win();
    else audio.lose();
    setResults({ ...stats, rank });
    setPhase("results");
  }, []);

  // ------------------------------------------------------------------
  // Main loop
  // ------------------------------------------------------------------
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let hudAccum = 0;

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const sim = simRef.current;

      if (sim && phaseRef.current === "racing") {
        const { drums } = step(sim, dt, now);
        if (drums > 0) audio.playDrum();
        // Surface the latest judgment (including auto-misses) to overlays.
        flashRef.current = sim.flash;

        // Throttle React HUD updates to ~24fps; canvases render at full rate.
        hudAccum += dt;
        if (hudAccum >= 1 / 24 || sim.finish) {
          hudAccum = 0;
          const disp = Math.max(0, (now - sim.startTime) / 1000);
          const remaining = Math.max(0, sim.timeLimit - disp);
          const playerPct = Math.min(100, (sim.player.pos / sim.length) * 100);
          const aiPct = Math.min(100, (sim.ai.pos / sim.length) * 100);

          setHud({
            speed: sim.player.speed,
            maxSpeed: sim.speedScale,
            stamina: sim.player.stamina,
            score: Math.round(sim.score),
            combo: sim.combo,
            maxCombo: sim.maxCombo,
            time: disp,
            timeLimit: sim.timeLimit,
            remaining,
            playerPct,
            aiPct,
            leader: playerPct >= aiPct ? "player" : "ai",
            beat: sim.beat,
          });
        }

        if (sim.finish && !sim.ended) {
          sim.ended = true;
          endRace(sim);
        }
      } else if (sim && phaseRef.current === "countdown") {
        const remainingMs = sim.startTime - now;
        const secs = Math.max(0, Math.ceil(remainingMs / 1000));
        if (countdownRef.current !== secs) {
          countdownRef.current = secs;
          setCountdown(secs);
          if (secs > 0) audio.beep(false);
        }
        if (remainingMs <= 0) {
          audio.beep(true);
          setCountdown(0);
          setPhase("racing");
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [endRace]);

  return (
    <GameContext.Provider
      value={{
        phase,
        started: phase !== "menu",
        difficulty,
        setDifficulty,
        countdown,
        results,
        hud,
        settings,
        updateSettings,
        simRef,
        flashRef,

        // UI shell state (overlays + fullscreen + boot readiness).
        overlay,
        openOverlay,
        closeOverlay,
        toggleOverlay,
        fullscreen,
        toggleFullscreen,
        ready,

        startRace,
        resetToMenu,
        restart,
        togglePause,
        pause,
        handlePress,
        press: handlePress,

        // Legacy aliases kept for compatibility with older components.
        paused: phase === "paused",
        setPaused: (v) => {
          const want = typeof v === "function" ? v(phaseRef.current === "paused") : v;
          if (want) pause();
          else if (phaseRef.current === "paused") togglePause();
        },
        gameOver: phase === "results",
        setStarted: () => {},
        resetGame: resetToMenu,
        finishLine: 1000,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
