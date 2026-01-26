"use client";
import { GameProvider } from "../../context/GameContext";
import Menu from "../../components/Menu";
import HUD from "../../components/HUD";
import River from "../../components/River";
import RhythmTrack from "../../components/RhythmTrack";
import Leaderboard from "../../components/Leaderboard";
import { useGame } from "../../context/GameContext";

function Game() {
  const { started } = useGame();
  return started ? (
    <>
      <HUD />
      <River />
      <RhythmTrack />
    </>
  ) : (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
      <Menu />
      <Leaderboard />
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <main className="w-screen h-screen flex flex-col items-center justify-center">
        <Game />
      </main>
    </GameProvider>
  );
}
