// ============================================================
// ALCHEMY CLASH — Deck Builder (UPGRADED)
// Premium tactile deck building experience
// ============================================================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { CARDS, ELEMENTS, RARITY_COLORS, Card, Element } from "@/lib/gameData";
import NavBar from "@/components/NavBar";

const CARD_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/card-template-bg-AxCKUmDtzwWhDmcqjA3sGc.webp";

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

const getElementByCardId = (cardId: string): Element | undefined => {
  const card = CARDS.find((c) => c.id === cardId);
  return ELEMENTS.find((e) => e.id === card?.elementId);
};

// ----------------------------------------------------------------------
// DeckCard Component (UPGRADED)
// ----------------------------------------------------------------------

interface DeckCardProps {
  card: Card;
  selected: boolean;
  inDeck: number;
  onSelect: () => void;
  onAdd: () => void;
  onRemove: () => void;
}

const DeckCard = ({
  card,
  selected,
  inDeck,
  onSelect,
  onAdd,
  onRemove,
}: DeckCardProps): JSX.Element => {
  const element = ELEMENTS.find((e) => e.id === card.elementId);
  const rarityColor = RARITY_COLORS[card.rarity as keyof typeof RARITY_COLORS];

  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.03 }}
      onClick={onSelect}
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: `url(${CARD_BG}) center/cover`,
        border: selected
          ? `2px solid ${rarityColor}`
          : `1px solid ${rarityColor}55`,
        boxShadow: selected
          ? `0 0 25px ${rarityColor}66`
          : `0 4px 12px rgba(0,0,0,0.25)`,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Card: ${card.name}`}
    >
      <div className="p-3" style={{ background: "rgba(245,230,200,0.85)" }}>
        <div className="flex justify-between items-center">
          <span className="text-2xl">{element?.emoji}</span>
          {inDeck > 0 && (
            <span
              className="px-2 py-0.5 text-xs rounded"
              style={{
                background: "#d4a843",
                color: "#1a0f00",
                fontFamily: "'Cinzel'",
              }}
            >
              ×{inDeck}
            </span>
          )}
        </div>

        <div className="mt-1 font-bold text-xs" style={{ fontFamily: "'Cinzel'" }}>
          {card.name}
        </div>

        <div className="text-[10px] mt-1 opacity-70">
          ⚡ {card.cost} · ⚔️ {card.power}
        </div>

        {/* EXPANDED */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-[10px]"
            >
              <p className="italic opacity-80">{card.abilityDescription}</p>

              <div className="flex gap-1 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd();
                  }}
                  className="flex-1 py-1 rounded text-[10px]"
                  style={{
                    background: "#d4a843",
                    color: "#1a0f00",
                  }}
                >
                  Add
                </button>

                {inDeck > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="flex-1 py-1 rounded text-[10px]"
                    style={{
                      background: "#8b3a2a",
                      color: "#fff",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function DeckScreen(): JSX.Element {
  const { state, addCardToDeck, removeCardFromDeck, startBattle } = useGame();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Cards that have been discovered (their element is discovered)
  const discoveredCards = CARDS.filter((c) =>
    state.discoveredElements.has(c.elementId)
  );

  // Current deck as an array of Card objects (filtered out any undefined)
  const deckCards = state.playerDeck
    .map((id) => CARDS.find((c) => c.id === id))
    .filter((c): c is Card => c !== undefined);

  // Helper to count how many copies of a card are in the deck
  const countInDeck = (id: string): number =>
    state.playerDeck.filter((x) => x === id).length;

  // Deck statistics
  const deckStats = useMemo(() => {
    const total = deckCards.length;
    const avgCost =
      total > 0
        ? (deckCards.reduce((sum, c) => sum + c.cost, 0) / total).toFixed(1)
        : "0";
    return { total, avgCost };
  }, [deckCards]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0800]">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — COLLECTION */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2
            className="text-lg mb-3"
            style={{ fontFamily: "'Cinzel'", color: "#d4a843" }}
          >
            Your Collection
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {discoveredCards.map((card) => (
              <DeckCard
                key={card.id}
                card={card}
                selected={selectedCardId === card.id}
                inDeck={countInDeck(card.id)}
                onSelect={() =>
                  setSelectedCardId(selectedCardId === card.id ? null : card.id)
                }
                onAdd={() => addCardToDeck(card.id)}
                onRemove={() => removeCardFromDeck(card.id)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — DECK */}
        <div className="w-72 p-4 border-l border-yellow-900/30 flex flex-col">
          <h3 style={{ fontFamily: "'Cinzel'", color: "#d4a843" }}>
            Deck ({deckStats.total}/14)
          </h3>

          {/* Deck Stats */}
          <div className="text-xs opacity-70 mt-2">Avg Cost: {deckStats.avgCost}</div>

          {/* Deck stack preview */}
          <div className="relative h-32 mt-4">
            {deckCards.slice(0, 6).map((card, index) => {
              const element = getElementByCardId(card.id);
              return (
                <div
                  key={index}
                  className="absolute w-20 h-28 rounded-lg flex items-center justify-center text-xl"
                  style={{
                    left: index * 6,
                    top: index * 3,
                    background: "#f5e6c8",
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {element?.emoji}
                </div>
              );
            })}
          </div>

          {/* Deck list */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-1">
            {deckCards.map((card, index) => (
              <div
                key={index}
                className="flex justify-between text-xs px-2 py-1 rounded"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <span>{card.name}</span>
                <button
                  onClick={() => removeCardFromDeck(card.id)}
                  aria-label={`Remove ${card.name} from deck`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Play button */}
          <button
            onClick={startBattle}
            disabled={deckStats.total < 3}
            className="mt-3 py-3 rounded font-bold transition-colors duration-200"
            style={{
              background: deckStats.total >= 3 ? "#8b3a2a" : "#333",
              color: "#fff",
              cursor: deckStats.total >= 3 ? "pointer" : "not-allowed",
            }}
          >
            Enter Battle
          </button>
        </div>
      </div>
    </div>
  );
}