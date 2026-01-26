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
    <div className="flex justify-center items-center mt-6 w-full max-w-xl mx-auto">
      <div className="rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-xl shadow-black/50 overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-extrabold tracking-wide">Leaderboard</h2>
          <span className="text-xs text-gray-300">
            Top scores from your device
          </span>
        </div>

        <div className="px-6 pb-4">
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-bold uppercase">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Score</div>
            <div className="col-span-6">Date</div>
          </div>

          <div className="mt-3">
            {board.length === 0 ? (
              <div className="text-center text-gray-300 py-6">
                No scores yet. Play a race to get on the board!
              </div>
            ) : (
              board.map((b, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-2 items-center px-3 py-2 rounded-lg mb-2 bg-white/5 border border-white/5 hover:bg-white/10 transition"
                >
                  <div className="col-span-1 text-gray-300">{i + 1}</div>
                  <div className="col-span-5 text-white font-bold">
                    {b.score}
                  </div>
                  <div className="col-span-6 text-gray-300">{b.date}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
