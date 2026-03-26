/**
 * FUSIONGOD Master Database
 * Updated for Asset Tinting & Visual Variety
 */

const ELEMENT_DATA = {
    'fire': { 
        id: 'fire', 
        name: 'Fire', 
        traits: ['aggressive', 'hot'], 
        atk: 10, hp: 5, 
        color: 0xff4500, // Deep Orange
        glow: 0xff0000   // Red Glow
    },
    'water': { 
        id: 'water', 
        name: 'Water', 
        traits: ['fluid', 'cold'], 
        atk: 5, hp: 15, 
        color: 0x1e90ff, // Dodger Blue
        glow: 0x00ffff   // Cyan Glow
    },
    'wolf': { 
        id: 'wolf', 
        name: 'Wolf', 
        traits: ['beast', 'fast'], 
        atk: 8, hp: 12, 
        color: 0x8b4513, // Saddle Brown
        glow: 0xffd700   // Gold Glow
    }
};

const DUNGEON_DATA = {
    'slime': { 
        name: 'Slime', 
        hp: 15, 
        atk: 5, 
        color: 0x00ff00, 
        type: 'enemy',
        description: 'Sticky and weak.'
    },
    'goblin': { 
        name: 'Goblin', 
        hp: 25, 
        atk: 10, 
        color: 0x7cfc00, 
        type: 'enemy',
        description: 'Fast and greedy.'
    },
    'gold_stash': { 
        name: 'Gold Pile', 
        gold: 50, 
        type: 'loot', 
        color: 0xffd700,
        description: 'Shiny treasure!'
    },
    'spike_trap': { 
        name: 'Spikes', 
        damage: 20, 
        type: 'hazard', 
        color: 0x808080,
        description: 'Watch your step.'
    }
};

const FUSION_NAMES = {
    prefixes: { 
        'fire': 'Inferno', 
        'water': 'Tidal', 
        'wolf': 'Dire',
        'hybrid': 'Ancient' 
    },
    suffixes: { 
        'fire': 'Blaze', 
        'water': 'Hydra', 
        'wolf': 'Fang',
        'hybrid': 'Titan' 
    }
};

/**
 * AAA Tip: Use this helper to get a random dungeon card
 */
function getRandomDungeonKey() {
    const keys = Object.keys(DUNGEON_DATA);
    return keys[Math.floor(Math.random() * keys.length)];
}
