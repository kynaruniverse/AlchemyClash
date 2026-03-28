// ============================================================
// ALCHEMY CLASH — Game State Context (Upgraded)
// Clean ability system + bug fixes + scalable structure
// ============================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ELEMENTS, CARDS, getFusionResult, Card, Element } from "@/lib/gameData";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type GameScreen = "title" | "fusion" | "book" | "deck" | "battle" | "victory";

export interface BattleLane {
  playerCard: Card | null;
  enemyCard: Card | null;
  playerPower: number;
  enemyPower: number;
  winner: "player" | "enemy" | "tie" | null;
}

export interface BattleState {
  lanes: BattleLane[];
  playerEnergy: number;
  enemyEnergy: number;
  turn: number;
  phase: "placement" | "reveal" | "result";
  playerHand: Card[];
  playerDeck: Card[];
  enemyDeck: Card[];
  gameOver: boolean;
  winner: "player" | "enemy" | null;
}

export interface GameState {
  screen: GameScreen;
  discoveredElements: Set<string>;
  playerDeck: string[];
  essence: number;
  battlesWon: number;
  totalDiscoveries: number;
  fusionAnimation: { elementA: string; elementB: string; result: string | null } | null;
  newDiscovery: string | null;
  battle: BattleState | null;
}

interface GameContextType {
  state: GameState;
  setScreen: (screen: GameScreen) => void;
  tryFuse: (a: string, b: string) => { success: boolean; result: string | null };
  addCardToDeck: (id: string) => void;
  removeCardFromDeck: (id: string) => void;
  startBattle: () => void;
  placeCard: (id: string, lane: number) => void;
  endPlacement: () => void;
  clearFusionAnimation: () => void;
  clearNewDiscovery: () => void;
  getDiscoveredElements: () => Element[];
  getDiscoveredCards: () => Card[];
}

// ----------------------------------------------------------------------
// Initial State
// ----------------------------------------------------------------------

const initialState: GameState = {
  screen: "title",
  discoveredElements: new Set(["fire", "water", "earth", "air"]),
  playerDeck: [],
  essence: 0,
  battlesWon: 0,
  totalDiscoveries: 4,
  fusionAnimation: null,
  newDiscovery: null,
  battle: null,
};

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildEnemyDeck(availableCards: Card[]): Card[] {
  const source = availableCards.length ? availableCards : CARDS.slice(0, 4);
  return Array.from({ length: 8 }, () => ({
    ...source[Math.floor(Math.random() * source.length)],
  }));
}

// ----------------------------------------------------------------------
// Ability System (clean + scalable)
// ----------------------------------------------------------------------

type AbilityFn = (laneIndex: number, lanes: BattleLane[], battle: BattleState) => void;

const cardAbilities: Record<string, AbilityFn> = {
  wizard: (laneIndex, lanes) => {
    if (laneIndex > 0) lanes[laneIndex - 1].playerPower += 1;
    if (laneIndex < lanes.length - 1) lanes[laneIndex + 1].playerPower += 1;
  },

  firebolt: (laneIndex, lanes) => {
    lanes[laneIndex].enemyPower = Math.max(0, lanes[laneIndex].enemyPower - 2);
  },

  golem: (laneIndex, lanes) => {
    lanes[laneIndex].playerPower = Math.max(3, lanes[laneIndex].playerPower);
  },

  forest_guardian: (laneIndex, lanes) => {
    const natureCount = lanes.filter(
      (lane) =>
        lane.playerCard &&
        ELEMENTS.find((e) => e.id === lane.playerCard!.elementId)?.category === "nature"
    ).length;
    lanes[laneIndex].playerPower += Math.max(0, natureCount - 1);
  },

  phoenix: (laneIndex, lanes) => {
    if (lanes[laneIndex].playerPower < lanes[laneIndex].enemyPower) {
      lanes[laneIndex].playerPower += 2;
    }
  },

  thunder_hawk: (_, lanes) => {
    lanes.forEach((lane) => {
      lane.enemyPower = Math.max(0, lane.enemyPower - 1);
    });
  },

  storm_knight: (laneIndex, lanes) => {
    const winning = lanes.filter((lane) => lane.playerPower > lane.enemyPower).length;
    if (winning >= 2) lanes[laneIndex].playerPower += 3;
  },
};

// ----------------------------------------------------------------------
// Context Provider
// ----------------------------------------------------------------------

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem("alchemyClash_save");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialState,
          ...parsed,
          discoveredElements: new Set(parsed.discoveredElements || ["fire", "water", "earth", "air"]),
          screen: "title",
        };
      }
    } catch {
      // ignore
    }
    return initialState;
  });

  // Persist to localStorage on state changes (excluding runtime-only fields)
  useEffect(() => {
    localStorage.setItem(
      "alchemyClash_save",
      JSON.stringify({
        discoveredElements: Array.from(state.discoveredElements),
        playerDeck: state.playerDeck,
        essence: state.essence,
        battlesWon: state.battlesWon,
        totalDiscoveries: state.totalDiscoveries,
      })
    );
  }, [state]);

  // ----------------------------------------------------------------------
  // Actions
  // ----------------------------------------------------------------------

  const setScreen = useCallback((screen: GameScreen) => {
    setState((s) => ({ ...s, screen }));
  }, []);

  const tryFuse = useCallback((a: string, b: string) => {
    const result = getFusionResult(a, b);

    if (!result) {
      setState((s) => ({
        ...s,
        fusionAnimation: { elementA: a, elementB: b, result: null },
      }));
      return { success: false, result: null };
    }

    setState((s) => {
      const known = s.discoveredElements.has(result);
      const set = new Set(s.discoveredElements);
      set.add(result);

      return {
        ...s,
        discoveredElements: set,
        essence: s.essence + (known ? 1 : 5),
        totalDiscoveries: set.size,
        fusionAnimation: { elementA: a, elementB: b, result },
        newDiscovery: known ? null : result,
      };
    });

    return { success: true, result };
  }, []);

  const addCardToDeck = useCallback((id: string) => {
    setState((s) => {
      if (s.playerDeck.length >= 14) return s;
      return { ...s, playerDeck: [...s.playerDeck, id] };
    });
  }, []);

  const removeCardFromDeck = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      playerDeck: s.playerDeck.filter((c) => c !== id),
    }));
  }, []);

  const startBattle = useCallback(() => {
    setState((s) => {
      const discovered = CARDS.filter((c) => s.discoveredElements.has(c.elementId));

      const playerDeck =
        s.playerDeck.length >= 3
          ? s.playerDeck.map((id) => CARDS.find((c) => c.id === id)!).filter(Boolean)
          : discovered.length
          ? discovered
          : CARDS.slice(0, 5);

      const shuffled = shuffle(playerDeck);

      const battle: BattleState = {
        lanes: Array(4)
          .fill(null)
          .map(() => ({
            playerCard: null,
            enemyCard: null,
            playerPower: 0,
            enemyPower: 0,
            winner: null,
          })),
        playerEnergy: 6,
        enemyEnergy: 6,
        turn: 1,
        phase: "placement",
        playerHand: shuffled.slice(0, 3),
        playerDeck: shuffled.slice(3),
        enemyDeck: shuffle(buildEnemyDeck(discovered)),
        gameOver: false,
        winner: null,
      };

      return { ...s, screen: "battle", battle };
    });
  }, []);

  const placeCard = useCallback((id: string, laneIndex: number) => {
    setState((s) => {
      if (!s.battle || s.battle.phase !== "placement") return s;

      const card = s.battle.playerHand.find((c) => c.id === id);
      if (!card || s.battle.playerEnergy < card.cost) return s;
      if (s.battle.lanes[laneIndex].playerCard) return s;

      const lanes = s.battle.lanes.map((lane, i) =>
        i === laneIndex ? { ...lane, playerCard: card, playerPower: card.power } : lane
      );

      return {
        ...s,
        battle: {
          ...s.battle,
          lanes,
          playerHand: s.battle.playerHand.filter((c) => c !== card),
          playerEnergy: s.battle.playerEnergy - card.cost,
        },
      };
    });
  }, []);

  const endPlacement = useCallback(() => {
    setState((s) => {
      if (!s.battle) return s;

      const battle = { ...s.battle };
      const lanes = battle.lanes.map((l) => ({ ...l }));

      let energy = battle.enemyEnergy;
      const enemyDeck = [...battle.enemyDeck];

      // Sort enemy deck by power (descending) to pick strongest affordable card
      const sorted = [...enemyDeck].sort((a, b) => b.power - a.power);

      lanes.forEach((lane, i) => {
        if (!lane.enemyCard) {
          const pick = sorted.find((c) => c.cost <= energy);
          if (pick) {
            lane.enemyCard = pick;
            lane.enemyPower = pick.power;
            energy -= pick.cost;
          }
        }
      });

      // Apply abilities
      lanes.forEach((lane, i) => {
        const ability = lane.playerCard && cardAbilities[lane.playerCard.id];
        if (ability) ability(i, lanes, battle);
      });

      // Determine winners
      lanes.forEach((lane) => {
        lane.winner =
          lane.playerPower > lane.enemyPower
            ? "player"
            : lane.enemyPower > lane.playerPower
            ? "enemy"
            : "tie";
      });

      const playerWins = lanes.filter((l) => l.winner === "player").length;
      const enemyWins = lanes.filter((l) => l.winner === "enemy").length;

      const winner =
        playerWins >= 3
          ? "player"
          : enemyWins >= 3
          ? "enemy"
          : playerWins > enemyWins
          ? "player"
          : "enemy";

      return {
        ...s,
        essence: s.essence + (winner === "player" ? 10 : 2),
        battlesWon: winner === "player" ? s.battlesWon + 1 : s.battlesWon,
        battle: {
          ...battle,
          lanes,
          enemyEnergy: energy,
          enemyDeck,
          phase: "reveal",
          gameOver: true,
          winner,
        },
      };
    });
  }, []);

  const clearFusionAnimation = useCallback(() => {
    setState((s) => ({ ...s, fusionAnimation: null }));
  }, []);

  const clearNewDiscovery = useCallback(() => {
    setState((s) => ({ ...s, newDiscovery: null }));
  }, []);

  const getDiscoveredElements = useCallback(() => {
    return ELEMENTS.filter((e) => state.discoveredElements.has(e.id));
  }, [state.discoveredElements]);

  const getDiscoveredCards = useCallback(() => {
    return CARDS.filter((c) => state.discoveredElements.has(c.elementId));
  }, [state.discoveredElements]);

  // ----------------------------------------------------------------------
  // Provider Value
  // ----------------------------------------------------------------------

  const value: GameContextType = {
    state,
    setScreen,
    tryFuse,
    addCardToDeck,
    removeCardFromDeck,
    startBattle,
    placeCard,
    endPlacement,
    clearFusionAnimation,
    clearNewDiscovery,
    getDiscoveredElements,
    getDiscoveredCards,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}