"use client";
import { useGame } from "../context/GameContext";
import Boat from "./Boat";
import RivalBoat from "./RivalBoat";
import PauseMenu from "./PauseMenu";

export default function River() {
  const { speed, aiProgress, gameOver } = useGame();

  return (
    <div className="relative w-[80vw] h-[80vh] bg-blue-500 rounded overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/river.png')] bg-cover"
        style={{
          animation: `river ${Math.max(2, 8 - speed / 2)}s linear infinite`,
        }}
      />
      <Boat />
      <RivalBoat progress={aiProgress} />
      <PauseMenu />
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl">
          Race Over
        </div>
      )}
    </div>
  );
}
