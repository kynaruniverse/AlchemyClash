export const CARD_DATABASE = {
    'FIRE_DRAGON': { 
        name: 'Inferno Dragon', atk: 5, cost: 3, element: 'FIRE', color: 0xff4422,
        ability: { type: 'BURN_ENEMY', value: 2 },
        texture: 'https://placehold.co/600x900/441111/ff4422?text=INFERNO',
        desc: 'ON REVEAL: -2 Enemy Power here.'
    },
    'WATER_SPIRIT': { 
        name: 'Aqua Spirit', atk: 3, cost: 1, element: 'WATER', color: 0x2288ff,
        ability: { type: 'BOOST_LANE', value: 1 },
        texture: 'https://placehold.co/600x900/111144/2288ff?text=AQUA',
        desc: 'ON REVEAL: +1 Power to this lane.'
    },
    'EARTH_GOLEM': { 
        name: 'Terra Golem', atk: 8, cost: 5, element: 'EARTH', color: 0x88ff22,
        ability: null,
        texture: 'https://placehold.co/600x900/114411/88ff22?text=GOLEM',
        desc: 'A massive wall of stone.'
    },
    'WIND_REAPER': { 
        name: 'Storm Reaper', atk: 2, cost: 2, element: 'WIND', color: 0xffffff,
        ability: { type: 'BOOST_LANE', value: 3 },
        texture: 'https://placehold.co/600x900/333333/ffffff?text=REAPER',
        desc: 'ON REVEAL: +3 Power to this lane.'
    }
};
