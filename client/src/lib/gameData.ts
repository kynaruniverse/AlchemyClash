// ============================================================
// ALCHEMY CLASH — Game Data v2 (Evolved)
// Locations, enhanced cards, and new mechanics
// ============================================================

// ----------------------------------------------------------------------
// Type Definitions
// ----------------------------------------------------------------------

export type ElementCategory = "base" | "nature" | "materials" | "life" | "magic" | "advanced";
export type Rarity = "common" | "uncommon" | "rare" | "legendary";
export type CardType = "creature" | "spell" | "artifact";
export type LocationEffect = "fire_bonus" | "water_bonus" | "nature_bonus" | "magic_bonus" | "neutral" | "chaos";

export interface Element {
  id: string;
  name: string;
  emoji: string;
  category: ElementCategory;
  tag: string;
  tier: number;
  isCard: boolean;
  discovered: boolean;
}

export interface Card {
  id: string;
  name: string;
  emoji: string;
  elementId: string;
  cost: number;
  power: number;
  type: CardType;
  rarity: Rarity;
  abilityDescription: string;
  flavorText: string;
  ability?: {
    name: string;
    trigger: "on_play" | "on_reveal" | "passive";
    effect: string;
  };
}

export interface Location {
  id: string;
  name: string;
  emoji: string;
  effect: LocationEffect;
  description: string;
  powerModifier: number; // -2, -1, 0, +1, +2
  costModifier: number;
}

export interface Color {
  bg: string;
  glow: string;
  text: string;
}

// ----------------------------------------------------------------------
// Locations
// ----------------------------------------------------------------------

export const LOCATIONS: Location[] = [
  {
    id: "arcane_spire",
    name: "Arcane Spire",
    emoji: "🔮",
    effect: "magic_bonus",
    description: "Magic cards gain +2 power here",
    powerModifier: 2,
    costModifier: 0,
  },
  {
    id: "wildwood",
    name: "Wildwood",
    emoji: "🌲",
    effect: "nature_bonus",
    description: "Nature creatures cost -1 essence",
    powerModifier: 0,
    costModifier: -1,
  },
  {
    id: "volcanic_crater",
    name: "Volcanic Crater",
    emoji: "🌋",
    effect: "fire_bonus",
    description: "Fire cards gain +1 power, deal 1 damage to opponent",
    powerModifier: 1,
    costModifier: 0,
  },
  {
    id: "crystal_cavern",
    name: "Crystal Cavern",
    emoji: "💎",
    effect: "magic_bonus",
    description: "Creatures here cannot be defeated",
    powerModifier: 0,
    costModifier: 0,
  },
  {
    id: "chaos_realm",
    name: "Chaos Realm",
    emoji: "⚡",
    effect: "chaos",
    description: "Random card gains +3 power",
    powerModifier: 0,
    costModifier: 0,
  },
];

// ----------------------------------------------------------------------
// Elements (Base + Tier 2 + Advanced)
// ----------------------------------------------------------------------

export const ELEMENTS: Element[] = [
  // Tier 1 — Base Elements
  { id: "fire", name: "Fire", emoji: "🔥", category: "base", tag: "element", tier: 1, isCard: false, discovered: true },
  { id: "water", name: "Water", emoji: "💧", category: "base", tag: "element", tier: 1, isCard: false, discovered: true },
  { id: "earth", name: "Earth", emoji: "🪨", category: "base", tag: "element", tier: 1, isCard: false, discovered: true },
  { id: "air", name: "Air", emoji: "💨", category: "base", tag: "element", tier: 1, isCard: false, discovered: true },

  // Tier 2 — Nature
  { id: "steam", name: "Steam", emoji: "☁️", category: "nature", tag: "compound", tier: 2, isCard: false, discovered: false },
  { id: "mud", name: "Mud", emoji: "🟤", category: "nature", tag: "compound", tier: 2, isCard: false, discovered: false },
  { id: "plant", name: "Plant", emoji: "🌿", category: "nature", tag: "life", tier: 2, isCard: false, discovered: false },
  { id: "sand", name: "Sand", emoji: "🏜️", category: "nature", tag: "material", tier: 2, isCard: false, discovered: false },

  // Tier 2 — Materials
  { id: "lava", name: "Lava", emoji: "🌋", category: "materials", tag: "extreme", tier: 2, isCard: false, discovered: false },
  { id: "storm", name: "Storm", emoji: "⛈️", category: "materials", tag: "extreme", tier: 2, isCard: false, discovered: false },
  { id: "lightning", name: "Lightning", emoji: "⚡", category: "materials", tag: "energy", tier: 2, isCard: false, discovered: false },
  { id: "ice", name: "Ice", emoji: "❄️", category: "materials", tag: "extreme", tier: 2, isCard: false, discovered: false },
  { id: "smoke", name: "Smoke", emoji: "💨", category: "materials", tag: "gas", tier: 2, isCard: false, discovered: false },
  { id: "dust", name: "Dust", emoji: "✨", category: "materials", tag: "particle", tier: 2, isCard: false, discovered: false },
  { id: "stone", name: "Stone", emoji: "🪨", category: "materials", tag: "solid", tier: 2, isCard: false, discovered: false },
  { id: "metal", name: "Metal", emoji: "⚙️", category: "materials", tag: "solid", tier: 2, isCard: false, discovered: false },
  { id: "glass", name: "Glass", emoji: "🔷", category: "materials", tag: "solid", tier: 2, isCard: false, discovered: false },
  { id: "wood", name: "Wood", emoji: "🪵", category: "materials", tag: "organic", tier: 2, isCard: false, discovered: false },
  { id: "ash", name: "Ash", emoji: "🩶", category: "materials", tag: "residue", tier: 2, isCard: false, discovered: false },
  { id: "crystal", name: "Crystal", emoji: "💜", category: "materials", tag: "mineral", tier: 2, isCard: false, discovered: false },

  // Tier 2 — Life
  { id: "life", name: "Life", emoji: "✨", category: "life", tag: "essence", tier: 2, isCard: false, discovered: false },
  { id: "seed", name: "Seed", emoji: "🌱", category: "life", tag: "growth", tier: 2, isCard: false, discovered: false },
  { id: "beast", name: "Beast", emoji: "🐺", category: "life", tag: "creature", tier: 2, isCard: false, discovered: false },
  { id: "human", name: "Human", emoji: "🧑", category: "life", tag: "humanoid", tier: 2, isCard: false, discovered: false },
  { id: "spirit", name: "Spirit", emoji: "👻", category: "life", tag: "ethereal", tier: 2, isCard: false, discovered: false },

  // Tier 2 — Magic
  { id: "magic", name: "Magic", emoji: "🌟", category: "magic", tag: "arcane", tier: 2, isCard: false, discovered: false },
  { id: "rune", name: "Rune", emoji: "📿", category: "magic", tag: "symbol", tier: 2, isCard: false, discovered: false },
  { id: "potion", name: "Potion", emoji: "🧪", category: "magic", tag: "brew", tier: 2, isCard: false, discovered: false },
  { id: "energy_core", name: "Energy Core", emoji: "⚡", category: "magic", tag: "power", tier: 2, isCard: false, discovered: false },

  // Tier 3 — Advanced (Battle Cards)
  { id: "wizard", name: "Wizard", emoji: "🧙", category: "advanced", tag: "mage", tier: 3, isCard: true, discovered: false },
  { id: "golem", name: "Golem", emoji: "🗿", category: "advanced", tag: "construct", tier: 3, isCard: true, discovered: false },
  { id: "firebolt", name: "Firebolt", emoji: "🔥", category: "advanced", tag: "spell", tier: 3, isCard: true, discovered: false },
  { id: "storm_knight", name: "Storm Knight", emoji: "⚡", category: "advanced", tag: "warrior", tier: 3, isCard: true, discovered: false },
  { id: "forest_guardian", name: "Forest Guardian", emoji: "🌳", category: "advanced", tag: "protector", tier: 3, isCard: true, discovered: false },
  { id: "sea_serpent", name: "Sea Serpent", emoji: "🐉", category: "advanced", tag: "beast", tier: 3, isCard: true, discovered: false },
  { id: "phoenix", name: "Phoenix", emoji: "🔥", category: "advanced", tag: "mythic", tier: 3, isCard: true, discovered: false },
  { id: "crystal_mage", name: "Crystal Mage", emoji: "💎", category: "advanced", tag: "mage", tier: 3, isCard: true, discovered: false },
  { id: "iron_golem", name: "Iron Golem", emoji: "⚙️", category: "advanced", tag: "construct", tier: 3, isCard: true, discovered: false },
  { id: "thunder_hawk", name: "Thunder Hawk", emoji: "🦅", category: "advanced", tag: "beast", tier: 3, isCard: true, discovered: false },
];

// ----------------------------------------------------------------------
// Cards (Battle Cards with Abilities)
// ----------------------------------------------------------------------

export const CARDS: Card[] = [
  {
    id: "wizard",
    name: "Wizard",
    emoji: "🧙",
    elementId: "wizard",
    cost: 3,
    power: 4,
    type: "creature",
    rarity: "uncommon",
    abilityDescription: "Adjacent lanes gain +1 power",
    flavorText: "Masters of the arcane arts, wizards amplify the strength of nearby allies.",
    ability: { name: "Amplify", trigger: "passive", effect: "adjacent_plus_1" },
  },
  {
    id: "golem",
    name: "Golem",
    emoji: "🗿",
    elementId: "golem",
    cost: 4,
    power: 3,
    type: "creature",
    rarity: "uncommon",
    abilityDescription: "Cannot be reduced below 3 power",
    flavorText: "Ancient constructs of stone and magic, golems are nearly indestructible.",
    ability: { name: "Fortified", trigger: "passive", effect: "min_power_3" },
  },
  {
    id: "firebolt",
    name: "Firebolt",
    emoji: "🔥",
    elementId: "firebolt",
    cost: 2,
    power: 5,
    type: "spell",
    rarity: "common",
    abilityDescription: "Deals 2 damage to opponent when played",
    flavorText: "A searing blast of pure fire that scorches everything in its path.",
    ability: { name: "Burn", trigger: "on_play", effect: "opponent_minus_2" },
  },
  {
    id: "storm_knight",
    name: "Storm Knight",
    emoji: "⚡",
    elementId: "storm_knight",
    cost: 3,
    power: 6,
    type: "creature",
    rarity: "rare",
    abilityDescription: "Gains +2 power on Volcanic Crater",
    flavorText: "Born from thunder and fury, storm knights command the very elements.",
    ability: { name: "Tempest", trigger: "passive", effect: "location_bonus" },
  },
  {
    id: "forest_guardian",
    name: "Forest Guardian",
    emoji: "🌳",
    elementId: "forest_guardian",
    cost: 2,
    power: 3,
    type: "creature",
    rarity: "uncommon",
    abilityDescription: "Costs 1 less on Wildwood",
    flavorText: "Protectors of ancient forests, they are strongest in their natural habitat.",
    ability: { name: "Rooted", trigger: "passive", effect: "location_cost_reduce" },
  },
  {
    id: "sea_serpent",
    name: "Sea Serpent",
    emoji: "🐉",
    elementId: "sea_serpent",
    cost: 4,
    power: 5,
    type: "creature",
    rarity: "rare",
    abilityDescription: "Opponent's creatures lose -1 power",
    flavorText: "Colossal creatures from the deep, sea serpents weaken all who oppose them.",
    ability: { name: "Pressure", trigger: "passive", effect: "opponent_minus_1" },
  },
  {
    id: "phoenix",
    name: "Phoenix",
    emoji: "🔥",
    elementId: "phoenix",
    cost: 5,
    power: 4,
    type: "creature",
    rarity: "legendary",
    abilityDescription: "If defeated, returns with +2 power",
    flavorText: "Mythical bird of rebirth, the phoenix rises stronger from defeat.",
    ability: { name: "Reborn", trigger: "on_reveal", effect: "resurrect_plus_2" },
  },
  {
    id: "crystal_mage",
    name: "Crystal Mage",
    emoji: "💎",
    elementId: "crystal_mage",
    cost: 3,
    power: 5,
    type: "creature",
    rarity: "rare",
    abilityDescription: "Gains +1 power for each magic card in deck",
    flavorText: "Crystalline mages draw power from the very fabric of magic itself.",
    ability: { name: "Resonance", trigger: "passive", effect: "scale_with_magic" },
  },
  {
    id: "iron_golem",
    name: "Iron Golem",
    emoji: "⚙️",
    elementId: "iron_golem",
    cost: 4,
    power: 7,
    type: "creature",
    rarity: "rare",
    abilityDescription: "Costs +1 essence, but gains +2 power",
    flavorText: "Forged in ancient furnaces, iron golems are the ultimate warriors.",
    ability: { name: "Ironclad", trigger: "passive", effect: "cost_power_tradeoff" },
  },
  {
    id: "thunder_hawk",
    name: "Thunder Hawk",
    emoji: "🦅",
    elementId: "thunder_hawk",
    cost: 2,
    power: 4,
    type: "creature",
    rarity: "uncommon",
    abilityDescription: "Strikes first before opponent's card",
    flavorText: "Swift as lightning, thunder hawks strike with devastating speed.",
    ability: { name: "Swift Strike", trigger: "on_reveal", effect: "strike_first" },
  },
];

// ----------------------------------------------------------------------
// Rarity Colors
// ----------------------------------------------------------------------

export const RARITY_COLORS: Record<Rarity, string> = {
  common: "#a8a29e",
  uncommon: "#16a34a",
  rare: "#2563eb",
  legendary: "#d4a843",
};

// ----------------------------------------------------------------------
// Element Colors (Warm Parchment Palette)
// ----------------------------------------------------------------------

export const ELEMENT_COLORS: Record<string, Color> = {
  fire: { bg: "#c2410c", glow: "#ff6b2b", text: "#fff" },
  water: { bg: "#1d4ed8", glow: "#60a5fa", text: "#fff" },
  earth: { bg: "#78350f", glow: "#d97706", text: "#fff" },
  air: { bg: "#64748b", glow: "#cbd5e1", text: "#fff" },
  steam: { bg: "#94a3b8", glow: "#e2e8f0", text: "#1e293b" },
  mud: { bg: "#713f12", glow: "#a16207", text: "#fff" },
  dust: { bg: "#a8a29e", glow: "#d6d3d1", text: "#1c1917" },
  lava: { bg: "#991b1b", glow: "#ef4444", text: "#fff" },
  storm: { bg: "#3730a3", glow: "#818cf8", text: "#fff" },
  plant: { bg: "#15803d", glow: "#4ade80", text: "#fff" },
  lightning: { bg: "#a16207", glow: "#fbbf24", text: "#fff" },
  ice: { bg: "#0e7490", glow: "#67e8f9", text: "#fff" },
  sand: { bg: "#b45309", glow: "#fcd34d", text: "#fff" },
  smoke: { bg: "#374151", glow: "#9ca3af", text: "#fff" },
  stone: { bg: "#57534e", glow: "#a8a29e", text: "#fff" },
  metal: { bg: "#3f3f46", glow: "#a1a1aa", text: "#fff" },
  glass: { bg: "#0891b2", glow: "#a5f3fc", text: "#fff" },
  wood: { bg: "#92400e", glow: "#d97706", text: "#fff" },
  ash: { bg: "#1c1917", glow: "#78716c", text: "#fff" },
  crystal: { bg: "#6d28d9", glow: "#c4b5fd", text: "#fff" },
  life: { bg: "#059669", glow: "#6ee7b7", text: "#fff" },
  seed: { bg: "#65a30d", glow: "#bef264", text: "#fff" },
  beast: { bg: "#b45309", glow: "#fbbf24", text: "#fff" },
  human: { bg: "#c2410c", glow: "#fb923c", text: "#fff" },
  spirit: { bg: "#7c3aed", glow: "#ddd6fe", text: "#fff" },
  magic: { bg: "#7e22ce", glow: "#e879f9", text: "#fff" },
  rune: { bg: "#4338ca", glow: "#a5b4fc", text: "#fff" },
  potion: { bg: "#be185d", glow: "#f9a8d4", text: "#fff" },
  energy_core: { bg: "#b45309", glow: "#fde047", text: "#fff" },
  wizard: { bg: "#6b21a8", glow: "#d8b4fe", text: "#fff" },
  golem: { bg: "#44403c", glow: "#a8a29e", text: "#fff" },
  firebolt: { bg: "#c2410c", glow: "#fbbf24", text: "#fff" },
  storm_knight: { bg: "#312e81", glow: "#818cf8", text: "#fff" },
  forest_guardian: { bg: "#14532d", glow: "#86efac", text: "#fff" },
  sea_serpent: { bg: "#134e4a", glow: "#5eead4", text: "#fff" },
  phoenix: { bg: "#991b1b", glow: "#fca5a5", text: "#fff" },
  crystal_mage: { bg: "#5b21b6", glow: "#c4b5fd", text: "#fff" },
  iron_golem: { bg: "#1f2937", glow: "#9ca3af", text: "#fff" },
  thunder_hawk: { bg: "#78350f", glow: "#fde047", text: "#fff" },
};

// ----------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------

/**
 * Returns the color scheme for a given element ID.
 * Defaults to a parchment-like fallback if ID is not found.
 */
export function getColor(id: string): Color {
  return ELEMENT_COLORS[id] || { bg: "#4a2c0a", glow: "#d4a843", text: "#fff" };
}

/**
 * Finds an element by its ID.
 * @returns Element object or undefined if not found.
 */
export function getElementById(id: string): Element | undefined {
  return ELEMENTS.find((e) => e.id === id);
}

/**
 * Finds a card by its ID.
 * @returns Card object or undefined if not found.
 */
export function getCardById(id: string): Card | undefined {
  return CARDS.find((c) => c.id === id);
}

/**
 * Finds a location by its ID.
 * @returns Location object or undefined if not found.
 */
export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id);
}

// ----------------------------------------------------------------------
// Fusion Recipes
// ----------------------------------------------------------------------

export const FUSIONS: Record<string, string> = {
  "fire+water": "steam",
  "water+fire": "steam",
  "fire+earth": "lava",
  "earth+fire": "lava",
  "water+air": "steam",
  "air+water": "steam",
  "earth+water": "mud",
  "water+earth": "mud",
  "earth+air": "dust",
  "air+earth": "dust",
  "fire+air": "smoke",
  "air+fire": "smoke",
  "water+ice": "ice",
  "ice+water": "ice",
  "fire+lightning": "storm",
  "lightning+fire": "storm",
  "earth+stone": "stone",
  "stone+earth": "stone",
  "fire+metal": "metal",
  "metal+fire": "metal",
  "water+sand": "glass",
  "sand+water": "glass",
  "earth+crystal": "crystal",
  "crystal+earth": "crystal",
  "life+seed": "plant",
  "seed+life": "plant",
  "life+magic": "spirit",
  "magic+life": "spirit",
  "magic+rune": "rune",
  "rune+magic": "rune",
  "magic+potion": "potion",
  "potion+magic": "potion",
  "energy_core+magic": "energy_core",
  "magic+energy_core": "energy_core",
};

/**
 * Determines the result of fusing two elements.
 * @param elementAId ID of the first element.
 * @param elementBId ID of the second element.
 * @returns The ID of the resulting element, or null if no valid fusion.
 */
export function getFusionResult(elementAId: string, elementBId: string): string | null {
  const key = `${elementAId}+${elementBId}`;
  return FUSIONS[key] || null;
}