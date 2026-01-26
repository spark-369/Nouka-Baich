"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const DIFFICULTY = {
  easy: { beat: 900, ai: 0.9 },
  normal: { beat: 750, ai: 1.8 },
  hard: { beat: 600, ai: 2.7 },
};

export const GameProvider = ({ children }) => {
  const [difficulty, setDifficulty] = useState("easy");
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [speed, setSpeed] = useState(0);
  const [stamina, setStamina] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [time, setTime] = useState(60);

  const [playerProgress, setPlayerProgress] = useState(100);
  const [aiProgress, setAiProgress] = useState(0);

  const [finishLine, setFinishLine] = useState(1100);
  const [playerWon, setPlayerWon] = useState(false);
  const [aiWon, setAiWon] = useState(false);

  const gameEndedRef = useRef(false);

  // PLAYER INPUT

  const hitBeat = () => {
    if (paused || gameOver) return;

    setSpeed((s) => Math.min(s + 0.2, 1100));
    setStamina((s) => Math.min(s + 8, 100));
    setCombo((c) => c + 1);
    setScore((sc) => sc + 10 + combo * 2);
  };

  const missBeat = () => {
    if (paused || gameOver) return;
    setSpeed((s) => Math.max(s - 0.2, 0));
    setStamina((s) => Math.max(s - 3, 0));
    setCombo(0);
  };

  // PLAYER MOVEMENT

  useEffect(() => {
    if (!started || paused || gameOver) return;

    const move = setInterval(() => {
      setPlayerProgress((p) => Math.min(p + speed, 1100));
    }, 100);

    return () => clearInterval(move);
  }, [speed, started, paused, gameOver]);

  // TIMER

  useEffect(() => {
    if (!started || paused || gameOver) return;

    const timer = setInterval(() => {
      setTime((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, paused, gameOver]);

  // AI PROGRESS

  useEffect(() => {
    if (!started || paused || gameOver) return;

    const aiTimer = setInterval(() => {
      setAiProgress((p) => Math.min(p + DIFFICULTY[difficulty].ai, 1100));
    }, 50);

    return () => clearInterval(aiTimer);
  }, [started, paused, gameOver, difficulty]);

  // GAME OVER

  useEffect(() => {
    if (gameEndedRef.current) return;

    if (time <= 0 || stamina <= 0) {
      gameEndedRef.current = true;
      setGameOver(true);
      saveScore(score);
    }
  }, [time, stamina, score]);

  // Player Won

  useEffect(() => {
    if (playerProgress >= finishLine) {
      gameEndedRef.current = true;
      setPlayerWon(true);
      setGameOver(true);
      saveScore(score);
    }
  }, [time, stamina, score]);

  // AI Won

  useEffect(() => {
    if (aiProgress >= finishLine) {
      gameEndedRef.current = true;
      setAiWon(true);
      setGameOver(true);
      saveScore(score);
    }
  }, [time, stamina, score]);

  // LEADERBOARD

  const saveScore = (newScore) => {
    if (typeof window === "undefined") return;

    const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    board.push({
      score: newScore,
      difficulty,
      date: new Date().toLocaleString(),
    });
    board.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(board.slice(0, 5)));
  };

  // RESET

  const resetGame = () => {
    gameEndedRef.current = false;
    setSpeed(0);
    setStamina(100);
    setScore(0);
    setCombo(0);
    setTime(60);
    setPlayerProgress(0);
    setAiProgress(0);
    setGameOver(false);
    setPaused(false);
    setStarted(false);
    setAiWon(false);
    setPlayerWon(false);
  };

  return (
    <GameContext.Provider
      value={{
        difficulty,
        setDifficulty,
        started,
        setStarted,
        paused,
        setPaused,
        gameOver,

        speed,
        stamina,
        score,
        combo,
        time,

        playerProgress,
        aiProgress,

        hitBeat,
        missBeat,
        resetGame,

        beatInterval: DIFFICULTY[difficulty].beat,

        finishLine,
        playerWon,
        aiWon,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
