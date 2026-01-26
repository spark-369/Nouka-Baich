"use client";
import { useGame } from "../context/GameContext";

export default function RivalBoat() {
  const { aiProgress } = useGame();

  return (
    <div
      className="absolute bottom-20 w-36 h-14 mb-[7vh]"
      style={{ left: `${aiProgress}px` }}
    >
      {/* Boat Body */}
      <div className="absolute inset-x-0 bottom-0 h-9 bg-gradient-to-r from-slate-700 via-gray-600 to-slate-500 rounded-b-full rounded-t-xl shadow-lg">
        <div className="absolute inset-x-6 top-0 h-5 bg-gradient-to-r from-slate-600 via-gray-500 to-slate-400 rounded-b-full" />
      </div>

      {/* Boat Front */}
      <div className="absolute left-0 top-3 w-9 h-5 bg-gradient-to-r from-slate-600 to-slate-400 rounded-r-full shadow-sm" />

      {/* Boat Back */}
      <div className="absolute right-0 top-3 w-9 h-5 bg-gradient-to-r from-slate-600 to-slate-400 rounded-l-full shadow-sm" />

      {/* Rival Crew (decorative) */}
      <div className="absolute left-12 top-1 w-4 h-7 bg-gradient-to-b from-white via-slate-200 to-slate-400 rounded-full" />
      <div className="absolute left-22 top-1 w-4 h-7 bg-gradient-to-b from-white via-slate-200 to-slate-400 rounded-full" />

      {/* Shadow */}
      <div className="absolute inset-x-10 bottom-0 h-2 bg-black/25 rounded-full blur-sm" />
    </div>
  );
}
