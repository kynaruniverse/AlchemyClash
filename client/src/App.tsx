// ============================================================
// ALCHEMY CLASH — App Router
// Design: Illuminated Manuscript + Soft Naturalism
// ============================================================

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import TitleScreen from "./pages/TitleScreen";
import DiscoveryToast from "./components/DiscoveryToast";
import FusionScreen from "./pages/FusionScreen";
import BookScreen from "./pages/BookScreen";
import DeckScreen from "./pages/DeckScreen";
import BattleScreen from "./pages/BattleScreen";

function GameRouter(): JSX.Element {
  const { state } = useGame();

  switch (state.screen) {
    case "title":
      return <TitleScreen />;
    case "fusion":
      return <FusionScreen />;
    case "book":
      return <BookScreen />;
    case "deck":
      return <DeckScreen />;
    case "battle":
      return <BattleScreen />;
    default:
      return <TitleScreen />;
  }
}

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <GameProvider>
          <Toaster />
          <DiscoveryToast />
          <GameRouter />
        </GameProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;