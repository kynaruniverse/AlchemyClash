// ============================================================
// ALCHEMY CLASH — Navigation Bar
// Design: Illuminated Manuscript + Soft Naturalism
// Persistent top nav with screen links and stats
// ============================================================

import { useGame, GameScreen } from "@/contexts/GameContext";
import { motion } from "framer-motion";

interface NavItem {
  screen: GameScreen;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { screen: "title", label: "Home", icon: "🏠" },
  { screen: "fusion", label: "Fusion", icon: "⚗️" },
  { screen: "book", label: "Book", icon: "📖" },
  { screen: "deck", label: "Deck", icon: "🃏" },
  { screen: "battle", label: "Battle", icon: "⚔️" },
];

export default function NavBar(): JSX.Element {
  const { state, setScreen } = useGame();

  return (
    <nav
      className="flex items-center justify-between px-4 py-2 z-50"
      style={{
        background: "rgba(20,10,0,0.92)",
        borderBottom: "1px solid rgba(212,168,67,0.25)",
        backdropFilter: "blur(8px)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        className="text-sm font-bold tracking-widest uppercase"
        style={{
          fontFamily: "'Cinzel', serif",
          color: "#d4a843",
          letterSpacing: "0.15em",
          textShadow: "0 0 10px rgba(212,168,67,0.4)",
        }}
      >
        ⚗️ Alchemy Clash
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.screen}
            type="button"
            onClick={() => setScreen(item.screen)}
            className="px-2 py-1 text-xs rounded transition-all duration-150"
            style={{
              fontFamily: "'Cinzel', serif",
              color: state.screen === item.screen ? "#d4a843" : "rgba(245,230,200,0.55)",
              background: state.screen === item.screen
                ? "rgba(212,168,67,0.12)"
                : "transparent",
              border: state.screen === item.screen
                ? "1px solid rgba(212,168,67,0.3)"
                : "1px solid transparent",
              letterSpacing: "0.06em",
              fontSize: "0.65rem",
            }}
            aria-current={state.screen === item.screen ? "page" : undefined}
            aria-label={`${item.label} page`}
          >
            <span className="mr-1" aria-hidden="true">
              {item.icon}
            </span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div
        className="flex items-center gap-3 text-xs"
        style={{
          fontFamily: "'Crimson Pro', 'Crimson Text', Georgia, serif",
          color: "rgba(212,168,67,0.7)",
        }}
      >
        <span title="Essence" aria-label="Essence points">
          ✨ {state.essence}
        </span>
        <span
          title="Discoveries"
          className="hidden sm:inline"
          aria-label="Total discoveries"
        >
          ⚗️ {state.totalDiscoveries}
        </span>
      </div>
    </nav>
  );
}