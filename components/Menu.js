"use client";
import { useGame } from "../context/GameContext";

export default function Menu() {
  const { setStarted, setDifficulty } = useGame();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-black via-slate-900 to-gray-900 text-white">
      <div className="w-[420px] p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/50">
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide">
          Nouka Baich
        </h1>

        <p className="text-sm text-gray-300 mb-6">
          rhythm based boat racing game
        </p>

        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
          <select
            className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform"
        >
          Start Race
        </button>

        <div className="mt-5 text-xs text-gray-400">Powered By Shyhoon</div>
      </div>
    </div>
  );
}
