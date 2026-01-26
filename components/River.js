"use client";
import { useGame } from "../context/GameContext";
import Boat from "./Boat";
import RivalBoat from "./RivalBoat";
import PauseMenu from "./PauseMenu";

export default function River() {
  const { speed, finishLine, playerWon, aiWon, gameOver } = useGame();

  return (
    <div className="relative w-[80vw] h-[80vh] bg-blue-500 rounded overflow-hidden">
      {/* River background */}
      <div
        className="absolute inset-0 bg-[url('/river.png')] bg-cover"
        style={{
          animation: `river ${Math.max(2, 8 - speed / 2)}s linear infinite`,
        }}
      />

      {/* Finish Pole with Card */}
      <div
        className="absolute bottom-0 flex flex-col items-center"
        style={{ left: finishLine - 950 + "vh" }}
      >
        {/* FINISH Card */}
        <div
          className="mb-2 px-6 py-2 bg-red-600 text-white font-extrabold 
                  tracking-widest rounded-md shadow-xl border-4 border-white"
        >
          FINISH
        </div>

        {/* Pole */}
        <div className="w-2 h-[28vh] bg-gradient-to-b from-orange-200 to-gray-600 rounded-full shadow-lg" />
      </div>

      {/* Boats */}
      <Boat />
      <RivalBoat />

      {/* UI */}
      <PauseMenu />

      {/* Game Over Overlay */}
      {(gameOver || playerWon || aiWon) && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-4xl font-bold">
          {playerWon && "🏆 YOU WIN!"}
          {aiWon && "🤖 AI WINS!"}
          {gameOver && !playerWon && !aiWon && "Race Over"}
        </div>
      )}
    </div>
  );
}
