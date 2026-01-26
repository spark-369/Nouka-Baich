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

      {/* Finish Line */}
      <div
        className="absolute bottom-0 w-3 bg-white/80 border-x-4 border-red-600 h-[20vh]"
        style={{ left: finishLine }}
      >
        <div className="absolute top-4 -left-6 rotate-90 text-white font-bold">
          FINISH
        </div>
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
