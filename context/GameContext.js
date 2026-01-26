"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const DIFFICULTY = {
  easy: { beat: 900, ai: 0.3 },
  normal: { beat: 750, ai: 0.6 },
  hard: { beat: 600, ai: 0.9 },
};

export const GameProvider = ({ children }) => {
  const [difficulty, setDifficulty] = useState("normal");
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [speed, setSpeed] = useState(0);
  const [stamina, setStamina] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [time, setTime] = useState(60);
  const [aiProgress, setAiProgress] = useState(0);

  const gameEndedRef = useRef(false);

  //   PLAYER INPUT

  const hitBeat = () => {
    if (paused || gameOver) return;

    setSpeed((s) => Math.min(s + 0.7, 12));
    setStamina((s) => Math.min(s + 10, 100));
    setCombo((c) => c + 1);
    setScore((sc) => sc + 10 + combo * 2);
  };

  const missBeat = () => {
    if (paused || gameOver) return;

    setSpeed((s) => Math.max(s - 2, 0));
    setStamina((s) => Math.max(s - 5, 0));
    setCombo(0);
  };

  //   TIMER

  useEffect(() => {
    if (!started || paused || gameOver) return;

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) return 0;
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, paused, gameOver]);

  //   AI PROGRESS

  useEffect(() => {
    if (!started || paused || gameOver) return;

    const aiTimer = setInterval(() => {
      setAiProgress((p) => p + DIFFICULTY[difficulty].ai);
    }, 500);

    return () => clearInterval(aiTimer);
  }, [started, paused, gameOver, difficulty]);

  //   GAME OVER CHECK

  useEffect(() => {
    if (gameEndedRef.current) return;

    if (time <= 0 || stamina <= 0) {
      gameEndedRef.current = true;
      setGameOver(true);
      saveScore(score);
    }
  }, [time, stamina, score]);

  //   LEADERBOARD

  const saveScore = (newScore) => {
    if (typeof window === "undefined") return;

    const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    board.push({ score: newScore, date: new Date().toLocaleString() });
    board.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(board.slice(0, 5)));
  };

  //   RESET GAME

  const resetGame = () => {
    gameEndedRef.current = false;
    setSpeed(0);
    setStamina(100);
    setScore(0);
    setCombo(0);
    setTime(60);
    setAiProgress(0);
    setGameOver(false);
    setPaused(false);
    setStarted(false);
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
        aiProgress,

        hitBeat,
        missBeat,
        resetGame,

        beatInterval: DIFFICULTY[difficulty].beat,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
