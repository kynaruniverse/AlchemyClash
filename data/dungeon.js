/**
 * FUSIONGOD - Clean Dungeon Data (Phase 3)
 */
export const DUNGEON_DATA = {
    'slime': { name: 'Slime', hp: 15, atk: 5, color: 0x00ff00, type: 'enemy', description: 'Sticky and weak.' },
    'goblin': { name: 'Goblin', hp: 25, atk: 10, color: 0x7cfc00, type: 'enemy', description: 'Fast and greedy.' },
    'gold_stash': { name: 'Gold Pile', gold: 50, type: 'loot', color: 0xffd700, description: 'Shiny treasure!' },
    'spike_trap': { name: 'Spikes', damage: 20, type: 'hazard', color: 0x808080, description: 'Watch your step.' }
};

export function getRandomDungeonKey() {
    const keys = Object.keys(DUNGEON_DATA);
    return keys[Math.floor(Math.random() * keys.length)];
}