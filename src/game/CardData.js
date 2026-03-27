/**
 * ALCHEMY CLASH: AAA MASTER CARD DATABASE (UPGRADED)
 * Defines stats, visuals, rarity, and integrated ability hooks.
 */

export const CARD_DATABASE = {
    // --- FIRE ELEMENT ---
    'FIRE_DRAGON': { 
        name: 'Inferno Dragon',
        atk: 5,
        cost: 3,
        element: 'FIRE',
        color: 0xff4422,
        rarity: 'RARE',
        ability: { type: 'BURN_ENEMY', value: 2 },
        texture: 'assets/cards/inferno_dragon.png',
        desc: 'ON REVEAL: -2 Enemy Power in this lane.',
        gradient: [0xff4422, 0x441111],
        edgeGlowIntensity: 0.3,
        impactVFXColor: 0xff4422,
        soundCue: 'FIRE_ROAR'
    },

    // --- WATER ELEMENT ---
    'WATER_SPIRIT': { 
        name: 'Aqua Spirit',
        atk: 3,
        cost: 1,
        element: 'WATER',
        color: 0x2288ff,
        rarity: 'COMMON',
        ability: { type: 'BOOST_LANE', value: 1 },
        texture: 'assets/cards/water_spirit.png',
        desc: 'ON REVEAL: +1 Power to all allied cards here.',
        gradient: [0x2288ff, 0x111144],
        edgeGlowIntensity: 0.1,
        impactVFXColor: 0x2288ff,
        soundCue: 'WATER_SPLASH'
    },

    // --- EARTH ELEMENT ---
    'EARTH_GOLEM': { 
        name: 'Terra Golem',
        atk: 8,
        cost: 5,
        element: 'EARTH',
        color: 0x88ff22,
        rarity: 'UNCOMMON',
        ability: { type: 'NONE' },
        texture: 'assets/cards/terra_golem.png',
        desc: 'A massive wall of stone. No special ability.',
        gradient: [0x88ff22, 0x114411],
        edgeGlowIntensity: 0.15,
        impactVFXColor: 0x88ff22,
        soundCue: 'STONE_THUD'
    },
    'EMERALD_TITAN': { 
        name: 'Emerald Titan',
        atk: 4,
        cost: 3,
        element: 'EARTH',
        color: 0x00ff88,
        rarity: 'EPIC',
        ability: { type: 'SURGE', value: 4 },
        texture: 'assets/cards/emerald_titan.png',
        desc: 'SURGE: +4 Power if you are already winning this lane.',
        gradient: [0x00ff88, 0x002211],
        edgeGlowIntensity: 0.4,
        impactVFXColor: 0x00ff88,
        soundCue: 'EARTH_ROAR'
    },

    // --- WIND ELEMENT ---
    'WIND_REAPER': { 
        name: 'Storm Reaper',
        atk: 2,
        cost: 2,
        element: 'WIND',
        color: 0xffffff,
        rarity: 'UNCOMMON',
        ability: { type: 'BOOST_LANE', value: 3 },
        texture: 'assets/cards/wind_reaper.png',
        desc: 'ON REVEAL: +3 Power to this lane.',
        gradient: [0xffffff, 0x333333],
        edgeGlowIntensity: 0.2,
        impactVFXColor: 0xffffff,
        soundCue: 'WIND_WHOOSH'
    },
    'SHADOW_ASSASSIN': { 
        name: 'Shadow Assassin',
        atk: 1,
        cost: 2,
        element: 'WIND',
        color: 0xaa00ff,
        rarity: 'RARE',
        ability: { type: 'SPY' },
        texture: 'assets/cards/shadow_assassin.png',
        desc: 'ON REVEAL: Move to the enemy side of this lane.',
        gradient: [0xaa00ff, 0x110022],
        edgeGlowIntensity: 0.35,
        impactVFXColor: 0xaa00ff,
        soundCue: 'SHADOW_SLICE'
    },

    // --- VOID ELEMENT (NEW) ---
    'VOID_MAGE': {
        name: 'Void Mage',
        atk: 0,
        cost: 1,
        element: 'VOID',
        color: 0x000000,
        rarity: 'LEGENDARY',
        ability: { type: 'BOOST_LANE', value: 5 },
        texture: 'assets/cards/void_mage.png',
        desc: 'ON REVEAL: +5 Power. Risky but powerful.',
        gradient: [0x5500ff, 0x000000],
        edgeGlowIntensity: 0.6,
        impactVFXColor: 0x5500ff,
        soundCue: 'VOID_CHIME'
    }
};