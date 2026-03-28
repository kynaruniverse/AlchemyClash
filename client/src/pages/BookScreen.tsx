// ============================================================
// ALCHEMY CLASH — Alchemy Book Screen (UPGRADED)
// Design: Illuminated Manuscript + Soft Naturalism (Refined)
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  ELEMENTS,
  CARDS,
  ElementCategory,
  RARITY_COLORS,
  getColor,
  Element,
  Card,
} from "@/lib/gameData";
import NavBar from "@/components/NavBar";

const BOOK_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/alchemy-book-cover-KP56ab5CaYiwaeEKXD59K3.webp";
const CARD_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/card-template-bg-AxCKUmDtzwWhDmcqjA3sGc.webp";

type PageType = ElementCategory | "cards";

interface Category {
  id: PageType;
  label: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: "base", label: "Base Elements", icon: "🌍" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "materials", label: "Materials", icon: "⚙️" },
  { id: "life", label: "Life", icon: "✨" },
  { id: "magic", label: "Magic", icon: "🌟" },
  { id: "advanced", label: "Advanced", icon: "🏆" },
  { id: "cards", label: "Cards", icon: "🃏" },
];

// ----------------------------------------------------------------------
// Subcomponents
// ----------------------------------------------------------------------

interface CategoryButtonProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton = ({
  category,
  isActive,
  onClick,
}: CategoryButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded transition-all"
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "0.7rem",
        background: isActive ? "rgba(212,168,67,0.2)" : "transparent",
        color: isActive ? "#d4a843" : "rgba(245,230,200,0.6)",
        border: isActive
          ? "1px solid rgba(212,168,67,0.4)"
          : "1px solid transparent",
      }}
      aria-label={category.label}
      aria-current={isActive ? "page" : undefined}
    >
      {category.icon} {category.label}
    </button>
  );
};

interface ElementCardProps {
  element: Element;
  isDiscovered: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const ElementCard = ({
  element,
  isDiscovered,
  isSelected,
  onClick,
}: ElementCardProps): JSX.Element => {
  const colors = getColor(element.id);

  return (
    <motion.button
      onClick={onClick}
      whileHover={isDiscovered ? { scale: 1.08 } : {}}
      className="p-3 rounded-lg text-center"
      style={{
        background: "rgba(255,255,255,0.4)",
        border: isSelected
          ? "2px solid #d4a843"
          : "1px solid rgba(45,26,6,0.2)",
        opacity: isDiscovered ? 1 : 0.3,
      }}
      disabled={!isDiscovered}
      aria-label={isDiscovered ? element.name : "Unknown element"}
    >
      <div
        className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-xl"
        style={{
          background: isDiscovered
            ? `radial-gradient(circle, ${colors.glow}66, ${colors.bg})`
            : "rgba(0,0,0,0.1)",
        }}
      >
        {isDiscovered ? element.emoji : "?"}
      </div>

      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.6rem",
        }}
      >
        {isDiscovered ? element.name : "???"}
      </div>
    </motion.button>
  );
};

interface CardItemProps {
  card: Card;
  isDiscovered: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const CardItem = ({
  card,
  isDiscovered,
  isSelected,
  onClick,
}: CardItemProps): JSX.Element => {
  const element = ELEMENTS.find((e) => e.id === card.elementId);
  const rarityColor = RARITY_COLORS[card.rarity as keyof typeof RARITY_COLORS];

  return (
    <motion.button
      onClick={onClick}
      whileHover={isDiscovered ? { scale: 1.05 } : {}}
      className="rounded-lg overflow-hidden"
      style={{
        background: isDiscovered ? `url(${CARD_BG}) center/cover` : "#000",
        border: `2px solid ${rarityColor}`,
        opacity: isDiscovered ? 1 : 0.25,
      }}
      disabled={!isDiscovered}
      aria-label={isDiscovered ? card.name : "Unknown card"}
    >
      {isDiscovered && (
        <div className="p-3 bg-[rgba(245,230,200,0.85)]">
          <div className="flex justify-between">
            <span className="text-2xl">{element?.emoji}</span>
            <span style={{ color: rarityColor, fontSize: "0.6rem" }}>
              {card.rarity}
            </span>
          </div>

          <div className="mt-1 font-bold text-sm">{card.name}</div>

          <div className="text-xs mt-1 flex gap-2">
            <span>⚡ {card.cost}</span>
            <span>⚔️ {card.power}</span>
          </div>

          <div className="text-xs italic mt-2">{card.abilityDescription}</div>
        </div>
      )}
    </motion.button>
  );
};

interface DetailPanelProps {
  element?: Element | null;
  card?: Card | null;
  onClose: () => void;
}

const DetailPanel = ({ element, card, onClose }: DetailPanelProps): JSX.Element | null => {
  if (!element && !card) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-6 p-5 rounded-lg relative"
      style={{
        background: "rgba(245,230,200,0.95)",
        border: "2px solid rgba(212,168,67,0.4)",
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        aria-label="Close details"
      >
        ✕
      </button>

      {element && (
        <>
          <h3 className="text-lg font-bold">{element.name}</h3>
          <p className="italic text-sm">
            Tier {element.tier} · {element.category}
          </p>
        </>
      )}

      {card && (
        <>
          <h3 className="text-lg font-bold">{card.name}</h3>
          <p className="italic text-sm mt-1">{card.flavorText}</p>
          <div className="mt-3 text-sm">
            <strong>Ability:</strong> {card.abilityDescription}
          </div>
        </>
      )}
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function BookScreen(): JSX.Element {
  const { state } = useGame();
  const [activePage, setActivePage] = useState<PageType>("base");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const discoveredSet = state.discoveredElements;

  // Data for current page
  const pageElements =
    activePage !== "cards"
      ? ELEMENTS.filter((e) => e.category === activePage)
      : [];

  const pageCards =
    activePage === "cards"
      ? CARDS.filter((c) => discoveredSet.has(c.elementId))
      : [];

  const discoveredOnPage =
    activePage === "cards"
      ? pageCards.length
      : pageElements.filter((e) => discoveredSet.has(e.id)).length;

  const totalOnPage = activePage === "cards" ? CARDS.length : pageElements.length;

  const selectedElement = selectedId
    ? ELEMENTS.find((e) => e.id === selectedId)
    : null;
  const selectedCard = selectedId
    ? CARDS.find((c) => c.id === selectedId)
    : null;

  const handleCategoryClick = (id: PageType) => {
    setActivePage(id);
    setSelectedId(null);
  };

  const handleCloseDetail = () => setSelectedId(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0800" }}>
      <NavBar />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div
          className="md:w-52 flex md:flex-col gap-2 p-3 overflow-x-auto md:overflow-y-auto"
          style={{
            background: "rgba(20,10,0,0.9)",
            borderRight: "1px solid rgba(212,168,67,0.2)",
          }}
        >
          <div
            className="hidden md:block w-full h-32 rounded mb-3 bg-cover bg-center"
            style={{ backgroundImage: `url(${BOOK_BG})`, opacity: 0.85 }}
            aria-label="Book decoration"
          />

          {CATEGORIES.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isActive={activePage === category.id}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div
          className="flex-1 overflow-y-auto p-5"
          style={{
            background: "linear-gradient(135deg, #f5e6c8 0%, #e8d0a0 100%)",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.3rem",
                  color: "#2d1a06",
                }}
              >
                {CATEGORIES.find((c) => c.id === activePage)?.icon}{" "}
                {CATEGORIES.find((c) => c.id === activePage)?.label}
              </h2>
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "0.8rem",
                  color: "#6b4c1e",
                  fontStyle: "italic",
                }}
              >
                {discoveredOnPage} / {totalOnPage} discovered
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-32 h-2 rounded-full overflow-hidden bg-black/10">
              <div
                className="h-full"
                style={{
                  width: `${(discoveredOnPage / totalOnPage) * 100}%`,
                  background: "linear-gradient(90deg, #d4a843, #f5c842)",
                }}
              />
            </div>
          </div>

          {/* ELEMENT GRID */}
          {activePage !== "cards" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {pageElements.map((element) => {
                const isDiscovered = discoveredSet.has(element.id);
                return (
                  <ElementCard
                    key={element.id}
                    element={element}
                    isDiscovered={isDiscovered}
                    isSelected={selectedId === element.id}
                    onClick={() => isDiscovered && setSelectedId(element.id)}
                  />
                );
              })}
            </div>
          )}

          {/* CARD GRID */}
          {activePage === "cards" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {CARDS.map((card) => {
                const isDiscovered = discoveredSet.has(card.elementId);
                return (
                  <CardItem
                    key={card.id}
                    card={card}
                    isDiscovered={isDiscovered}
                    isSelected={selectedId === card.id}
                    onClick={() => isDiscovered && setSelectedId(card.id)}
                  />
                );
              })}
            </div>
          )}

          {/* DETAIL PANEL */}
          <AnimatePresence>
            {selectedId && (selectedElement || selectedCard) && (
              <DetailPanel
                element={selectedElement}
                card={selectedCard}
                onClose={handleCloseDetail}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}