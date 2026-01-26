"use client";
import { useState, useEffect } from "react";

export default function Leaderboard() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("leaderboard");
    if (stored) {
      setBoard(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="flex justify-center items-center mt-6 w-full max-w-2xl mx-auto">
      <div className="w-full rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-white/10">
          <h2 className="text-xl font-extrabold tracking-wide text-white">
            Leaderboard
          </h2>
          <span className="text-xs text-gray-300">Top scores (local)</span>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          {/* Table Head */}
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-bold uppercase pb-2 border-b border-white/10">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Score</div>
            <div className="col-span-3">Difficulty</div>
            <div className="col-span-4">Date</div>
          </div>

          {/* Rows */}
          <div className="mt-3 space-y-2">
            {board.length === 0 ? (
              <div className="text-center text-gray-300 py-6">
                No scores yet. Play a race to get on the board!
              </div>
            ) : (
              board.map((b, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-2 items-center px-3 py-2 rounded-lg
                             bg-white/5 border border-white/5
                             hover:bg-white/10 transition"
                >
                  <div className="col-span-1 text-gray-300 font-semibold">
                    {i + 1}
                  </div>

                  <div className="col-span-4 text-white font-bold">
                    {b.score}
                  </div>

                  <div className="col-span-3 text-cyan-300 font-semibold capitalize">
                    {b.difficulty || "Normal"}
                  </div>

                  <div className="col-span-4 text-gray-300 text-xs">
                    {b.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
