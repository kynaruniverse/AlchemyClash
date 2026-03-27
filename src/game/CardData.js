/**
 * ALCHEMY CLASH: MASTER CARD DATABASE
 * Defines stats, visual signatures, and ability logic for all cards.
 */

export const CARD_DATABASE = {
    // --- FIRE ELEMENT ---
    'FIRE_DRAGON': { 
        name: 'Inferno Dragon', atk: 5, cost: 3, element: 'FIRE', color: 0xff4422,
        rarity: 'RARE',
        ability: { type: 'BURN_ENEMY', value: 2 },
        texture: 'https://placehold.co/600x900/441111/ff4422?text=INFERNO',
        desc: 'ON REVEAL: -2 Enemy Power in this lane.',
        gradient: [0xff4422, 0x441111]
    },

    // --- WATER ELEMENT ---
    'WATER_SPIRIT': { 
        name: 'Aqua Spirit', atk: 3, cost: 1, element: 'WATER', color: 0x2288ff,
        rarity: 'COMMON',
        ability: { type: 'BOOST_LANE', value: 1 },
        texture: 'https://placehold.co/600x900/111144/2288ff?text=AQUA',
        desc: 'ON REVEAL: +1 Power to all allied cards here.',
        gradient: [0x2288ff, 0x111144]
    },

    // --- EARTH ELEMENT ---
    'EARTH_GOLEM': { 
        name: 'Terra Golem', atk: 8, cost: 5, element: 'EARTH', color: 0x88ff22,
        rarity: 'UNCOMMON',
        ability: null,
        texture: 'https://placehold.co/600x900/114411/88ff22?text=GOLEM',
        desc: 'A massive wall of stone. No special ability.',
        gradient: [0x88ff22, 0x114411]
    },
    'EMERALD_TITAN': { 
        name: 'Emerald Titan', atk: 4, cost: 3, element: 'EARTH', color: 0x00ff88,
        rarity: 'EPIC',
        ability: { type: 'SURGE', value: 4 },
        texture: 'https://placehold.co/600x900/002211/00ff88?text=TITAN',
        desc: 'SURGE: +4 Power if you are already winning this lane.',
        gradient: [0x00ff88, 0x002211]
    },

    // --- WIND ELEMENT ---
    'WIND_REAPER': { 
        name: 'Storm Reaper', atk: 2, cost: 2, element: 'WIND', color: 0xffffff,
        rarity: 'UNCOMMON',
        ability: { type: 'BOOST_LANE', value: 3 },
        texture: 'https://placehold.co/600x900/333333/ffffff?text=REAPER',
        desc: 'ON REVEAL: +3 Power to this lane.',
        gradient: [0xffffff, 0x333333]
    },
    'SHADOW_ASSASSIN': { 
        name: 'Shadow Assassin', atk: 1, cost: 2, element: 'WIND', color: 0xaa00ff,
        rarity: 'RARE',
        ability: { type: 'SPY' },
        texture: 'https://placehold.co/600x900/110022/aa00ff?text=SPY',
        desc: 'ON REVEAL: Move to the enemy side of this lane.',
        gradient: [0xaa00ff, 0x110022]
    },

    // --- VOID ELEMENT (NEW) ---
    'VOID_MAGE': {
        name: 'Void Mage', atk: 0, cost: 1, element: 'VOID', color: 0x000000,
        rarity: 'LEGENDARY',
        ability: { type: 'BOOST_LANE', value: 5 },
        texture: 'https://placehold.co/600x900/000000/5500ff?text=VOID',
        desc: 'ON REVEAL: +5 Power. Risky but powerful.',
        gradient: [0x5500ff, 0x000000]
    }
};
