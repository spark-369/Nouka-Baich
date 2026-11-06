"use client";
import { useEffect, useState } from "react";
import { GameProvider, useGame } from "../../context/GameContext";
import Menu from "../../components/Menu";
import HUD from "../../components/HUD";
import River from "../../components/River";
import Leaderboard from "../../components/Leaderboard";
import ResultsScreen from "../../components/ResultsScreen";
import TopBar from "../../components/TopBar";
import SettingsPanel from "../../components/SettingsPanel";
import HowToPlay from "../../components/HowToPlay";
import BootSplash from "../../components/BootSplash";

function Shell() {
  const { phase, ready, resetToMenu, overlay } = useGame();
  const [showSplash, setShowSplash] = useState(false);

  // Only surface the boot splash if startup is slow, so fast loads never flash.
  useEffect(() => {
    if (ready) return;
    const id = setTimeout(() => setShowSplash(true), 220);
    return () => clearTimeout(id);
  }, [ready]);

  if (!ready && showSplash) {
    return <BootSplash label="Rigging the longboat" />;
  }

  const handleLogoClick = () => {
    if (phase !== "menu") resetToMenu();
  };

  return (
    <>
      <TopBar onLogoClick={handleLogoClick} />

      {phase === "menu" ? (
        <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 pb-4 pt-[92px]">
            <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center gap-6 lg:flex-row lg:items-center">
              <div className="flex w-full flex-col lg:flex-1">
                <Menu />
              </div>
              <div className="w-full lg:w-[380px]">
                <Leaderboard />
              </div>
            </div>
          </div>
          <footer className="shrink-0 px-4 pb-3 text-center text-[0.65rem] text-[color:var(--text-2)]">
            Nouka Baich · crafted with Next.js · Powered by Shyhoon
          </footer>
        </main>
      ) : (
        <main className="relative h-[100dvh] w-full overflow-hidden">
          <HUD />
          <River />
          <ResultsScreen />
        </main>
      )}

      {/* Global overlays */}
      <SettingsPanel />
      <HowToPlay />

      {/* Screen-reader live region for phase changes */}
      <span aria-live="polite" className="sr-only">
        {overlay ? `Dialog open: ${overlay}` : phase}
      </span>
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}

