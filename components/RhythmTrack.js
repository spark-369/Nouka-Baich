"use client";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";
import { isPerfectHit } from "../utils/rhythm";

export default function RhythmTrack() {
  const { hitBeat, missBeat, beatInterval, gameOver, paused } = useGame();

  const [beat, setBeat] = useState(Date.now());
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize drum audio + beat loop
  useEffect(() => {
    audioRef.current = new Audio("/drum.mp3");

    if (paused || gameOver) return;

    intervalRef.current = setInterval(() => {
      setBeat(Date.now());
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }, beatInterval);

    return () => clearInterval(intervalRef.current);
  }, [beatInterval, paused, gameOver]);

  // Handle hit/miss
  const trigger = () => {
    if (paused || gameOver) return;

    const now = Date.now();
    isPerfectHit(now, beat) ? hitBeat() : missBeat();
  };

  // Keyboard + Touch input
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") trigger();
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchstart", trigger);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", trigger);
    };
  }, [paused, gameOver, beat]);

  return (
    <div className="mt-4 text-center">
      <p className="font-bold">
        {paused ? "Game Paused" : "Tap / Press SPACE on Drum Beat"}
      </p>
    </div>
  );
}
