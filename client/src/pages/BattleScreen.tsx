// ============================================================
// ALCHEMY CLASH — Battle Screen
// Design: Illuminated Manuscript + Soft Naturalism
// 4-lane parchment board, card placement, reveal phase
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { CARDS, ELEMENTS, RARITY_COLORS, getColor, Card, Element } from "@/lib/gameData";
import NavBar from "@/components/NavBar";

const BATTLE_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/battle-arena-bg-C2KamkzQRZVzEycSY5WN7k.webp";
const CARD_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/card-template-bg-AxCKUmDtzwWhDmcqjA3sGc.webp";

type Winner = "player" | "enemy" | "tie" | null;

// ----------------------------------------------------------------------
// BattleCard Component
// ----------------------------------------------------------------------

interface BattleCardProps {
  card: Card | null;
  isEnemy: boolean;
  revealed: boolean;
  winner: Winner;
}

const BattleCard = ({ card, isEnemy, revealed, winner }: BattleCardProps): JSX.Element => {
  const element: Element | undefined = card ? ELEMENTS.find((e) => e.id === card.elementId) : undefined;
  const cardStyle = card ? getColor(card.elementId) : null;
  const rarityColor = card ? RARITY_COLORS[card.rarity as keyof typeof RARITY_COLORS] : undefined;

  if (!card) {
    return (
      <div
        className="w-full h-full rounded-lg flex items-center justify-center"
        style={{
          background: "rgba(245,230,200,0.06)",
          border: "1.5px dashed rgba(212,168,67,0.2)",
          minHeight: 90,
        }}
      >
        <span style={{ color: "rgba(212,168,67,0.2)", fontSize: "1.2rem" }}>
          {isEnemy ? "?" : "+"}
        </span>
      </div>
    );
  }

  const isWinner =
    (winner === "player" && !isEnemy) || (winner === "enemy" && isEnemy);
  const isTie = winner === "tie";

  return (
    <motion.div
      initial={revealed ? { rotateY: 90, opacity: 0 } : {}}
      animate={revealed ? { rotateY: 0, opacity: 1 } : {}}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full h-full rounded-lg overflow-hidden relative"
      style={{
        background: `url(${CARD_BG}) center/cover`,
        border: `1.5px solid ${rarityColor}66`,
        boxShadow: isWinner
          ? `0 0 20px ${cardStyle?.glow}88, 0 0 40px ${cardStyle?.glow}44`
          : isTie
          ? "0 0 10px rgba(212,168,67,0.4)"
          : "none",
        minHeight: 90,
      }}
    >
      <div
        className="absolute inset-0 flex flex-col p-2 gap-0.5"
        style={{ background: "rgba(245,230,200,0.82)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xl">{element?.emoji}</span>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.5rem",
              color: rarityColor,
              letterSpacing: "0.06em",
            }}
          >
            {card.rarity.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.62rem",
            color: "#2d1a06",
            fontWeight: 700,
          }}
        >
          {card.name}
        </div>

        <div
          className="flex gap-1.5"
          style={{
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontSize: "0.65rem",
            color: "#6b4c1e",
          }}
        >
          <span>⚡{card.cost}</span>
          <span>⚔️{card.power}</span>
        </div>

        <div
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "0.52rem",
            color: "#4a2c0a",
            fontStyle: "italic",
          }}
        >
          {card.abilityDescription}
        </div>
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// HandCard Component
// ----------------------------------------------------------------------

interface HandCardProps {
  card: Card;
  onPlay: () => void;
  disabled: boolean;
  isSelected: boolean;
}

const HandCard = ({ card, onPlay, disabled, isSelected }: HandCardProps): JSX.Element => {
  const element = ELEMENTS.find((e) => e.id === card.elementId);
  const rarityColor = RARITY_COLORS[card.rarity as keyof typeof RARITY_COLORS];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.06, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onPlay}
      disabled={disabled}
      className="relative rounded-lg overflow-hidden flex-shrink-0"
      style={{
        width: 72,
        background: `url(${CARD_BG}) center/cover`,
        border: isSelected
          ? `2px solid gold`
          : `1.5px solid ${rarityColor}66`,
        boxShadow: isSelected
          ? `0 0 12px gold`
          : `0 2px 8px rgba(0,0,0,0.3)`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <div className="p-1.5" style={{ background: "rgba(245,230,200,0.82)" }}>
        <div className="text-lg text-center">{element?.emoji}</div>
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.5rem",
            color: "#2d1a06",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {card.name}
        </div>
        <div
          className="flex justify-center gap-1"
          style={{
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontSize: "0.55rem",
            color: "#6b4c1e",
          }}
        >
          <span>⚡{card.cost}</span>
          <span>⚔️{card.power}</span>
        </div>
      </div>
    </motion.button>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function BattleScreen(): JSX.Element {
  const { state, setScreen, startBattle, placeCard, endPlacement } = useGame();

  const [selectedHandCard, setSelectedHandCard] = useState<string | null>(null);
  const [revealDone, setRevealDone] = useState(false);

  // Start battle if not already started
  useEffect(() => {
    if (!state.battle) {
      startBattle();
    }
  }, [state.battle, startBattle]);

  // Reveal animation timing
  useEffect(() => {
    if (state.battle?.phase === "reveal") {
      const timer = setTimeout(() => setRevealDone(true), 1200);
      return () => clearTimeout(timer);
    }
    setRevealDone(false);
  }, [state.battle?.phase]);

  // Loading state while battle is being prepared
  if (!state.battle) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#0f0800" }}>
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div
            style={{
              color: "rgba(245,230,200,0.5)",
              fontFamily: "'Cinzel', serif",
            }}
          >
            Preparing battle...
          </div>
        </div>
      </div>
    );
  }

  const battle = state.battle;
  const isPlacement = battle.phase === "placement";
  const isReveal = battle.phase === "reveal";
  const isGameOver = battle.winner !== null;

  // Handle lane click during placement
  const handleLaneClick = (laneIndex: number) => {
    if (!isPlacement || !selectedHandCard) return;
    const lane = battle.lanes[laneIndex];
    if (lane.playerCard) return; // Lane already filled
    placeCard(selectedHandCard, laneIndex);
    setSelectedHandCard(null);
  };

  // Count wins for display
  const playerWins = battle.lanes.filter((l) => l.winner === "player").length;
  const enemyWins = battle.lanes.filter((l) => l.winner === "enemy").length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0800" }}>
      <NavBar />

      {/* Arena */}
      <div
        className="flex-1 relative overflow-hidden flex flex-col"
        style={{
          backgroundImage: `url(${BATTLE_BG})`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col h-full p-3 gap-3">
          {/* Score display */}
          <div className="flex justify-between items-center px-4 text-yellow-300/80 text-sm">
            <span>🏆 Player: {playerWins}</span>
            <span>Enemy: {enemyWins} 🏆</span>
          </div>

          {/* Lanes */}
          <div className="flex gap-2 flex-1">
            {battle.lanes.map((lane, i) => {
              const isSelectedLane =
                selectedHandCard !== null && !lane.playerCard && isPlacement;

              return (
                <div key={i} className="flex-1 flex flex-col gap-2">
                  {/* Enemy card */}
                  <BattleCard
                    card={isReveal ? lane.enemyCard : null}
                    isEnemy
                    revealed={isReveal}
                    winner={lane.winner}
                  />

                  {/* Player card - clickable during placement */}
                  <div
                    onClick={() => handleLaneClick(i)}
                    style={{
                      outline: isSelectedLane ? "2px solid gold" : "none",
                      cursor: isPlacement && selectedHandCard && !lane.playerCard ? "pointer" : "default",
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Lane ${i + 1} - ${
                      lane.playerCard ? "Card placed" : "Empty"
                    }`}
                  >
                    <BattleCard
                      card={lane.playerCard}
                      isEnemy={false}
                      revealed={isReveal}
                      winner={lane.winner}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Player hand during placement */}
          {isPlacement && (
            <div className="flex gap-2 overflow-x-auto p-2">
              {battle.playerHand.map((card) => (
                <HandCard
                  key={card.id}
                  card={card}
                  onPlay={() =>
                    setSelectedHandCard(
                      selectedHandCard === card.id ? null : card.id
                    )
                  }
                  disabled={battle.playerEnergy < card.cost}
                  isSelected={selectedHandCard === card.id}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-4 p-2">
            {isPlacement && (
              <button
                onClick={endPlacement}
                className="px-6 py-2 rounded-lg font-semibold text-black"
                style={{
                  background: "linear-gradient(135deg, #d4a843, #b8892f)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  transition: "transform 0.1s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              >
                End Turn
              </button>
            )}

            {isReveal && revealDone && isGameOver && (
              <div className="flex gap-4">
                <button
                  onClick={startBattle}
                  className="px-6 py-2 rounded-lg font-semibold text-black"
                  style={{
                    background: "linear-gradient(135deg, #d4a843, #b8892f)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  Battle Again
                </button>
                <button
                  onClick={() => setScreen("fusion")}
                  className="px-6 py-2 rounded-lg font-semibold text-black"
                  style={{
                    background: "linear-gradient(135deg, #8b3a2a, #6a2c1f)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  Return to Fusion
                </button>
              </div>
            )}

            {isReveal && !revealDone && (
              <div className="text-yellow-300/80 animate-pulse">
                Revealing cards...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}