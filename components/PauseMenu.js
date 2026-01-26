"use client";
import { useGame } from "../context/GameContext";

export default function PauseMenu() {
  const { paused, setPaused, setStarted } = useGame();

  if (!paused) return null;

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-50">
      <h2 className="text-3xl font-bold mb-6">Paused</h2>

      <button
        onClick={() => setPaused(false)}
        className="mb-4 px-6 py-2 bg-green-600 rounded"
      >
        Resume
      </button>

      <button
        onClick={() => {
          setPaused(false);
          setStarted(false);
          window.location.reload();
        }}
        className="px-6 py-2 bg-red-600 rounded"
      >
        Main Menu
      </button>
    </div>
  );
}
