"use client";
import { useGame } from "../context/GameContext";

export default function Boat() {
  const { playerProgress } = useGame();

  return (
    <div
      className="absolute bottom-20 w-36 h-14"
      style={{ left: `${playerProgress}px` }}
    >
      {/* Boat Body */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-b-full rounded-t-xl shadow-lg">
        <div className="absolute inset-x-6 top-0 h-6 bg-gradient-to-r from-yellow-500 via-amber-600 to-red-500 rounded-b-full" />
      </div>

      {/* Boat Front */}
      <div className="absolute left-0 top-3 w-10 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-r-full shadow-sm" />

      {/* Boat Back */}
      <div className="absolute right-0 top-3 w-10 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-l-full shadow-sm" />

      {/* Rowers */}
      <div className="absolute left-12 top-1 w-4 h-8 bg-gradient-to-b from-red-500 via-pink-500 to-purple-500 rounded-full" />
      <div className="absolute left-22 top-1 w-4 h-8 bg-gradient-to-b from-red-500 via-pink-500 to-purple-500 rounded-full" />

      {/* Shadow */}
      <div className="absolute inset-x-10 bottom-0 h-2 bg-black/25 rounded-full blur-sm" />
    </div>
  );
}
