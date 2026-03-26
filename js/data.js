// js/data.js
const CARD_W = 90, CARD_H = 120;
const HAND_Y_RATIO = 0.82;
const DUNGEON_Y_RATIO = 0.28;
const HAND_SLOTS = 5;

const ELEMENTS = {
  fire:    { name:'Fire',    icon:'🔥', atk:12, hp:8,  color:'#ff4500', glow:'#ff6b35', rarity:'common' },
  water:   { name:'Water',   icon:'💧', atk:5,  hp:18, color:'#1e90ff', glow:'#00cfff', rarity:'common' },
  wind:    { name:'Wind',    icon:'🌪', atk:9,  hp:10, color:'#a8e6cf', glow:'#d4f5e9', rarity:'common' },
  earth:   { name:'Earth',   icon:'🪨', atk:7,  hp:22, color:'#8B6914', glow:'#c9a227', rarity:'common' },
  lightning:{ name:'Lightning',icon:'⚡',atk:18, hp:6, color:'#f5e642', glow:'#fff176', rarity:'uncommon' },
  shadow:  { name:'Shadow',  icon:'🌑', atk:14, hp:12, color:'#4a0080', glow:'#9c27b0', rarity:'uncommon' },
  ice:     { name:'Ice',     icon:'❄️', atk:10, hp:16, color:'#80d8ff', glow:'#e1f5fe', rarity:'uncommon' },
  nature:  { name:'Nature',  icon:'🌿', atk:8,  hp:20, color:'#2e7d32', glow:'#66bb6a', rarity:'common' },
  arcane:  { name:'Arcane',  icon:'🔮', atk:16, hp:10, color:'#7c4dff', glow:'#b39ddb', rarity:'rare' },
  void:    { name:'Void',    icon:'🕳', atk:20, hp:5,  color:'#212121', glow:'#9e9e9e', rarity:'rare' },
};
const ELEMENT_KEYS = Object.keys(ELEMENTS);

const FUSIONS = {
  'fire+water':      { id:'steam',    name:'Steam Wraith',   icon:'💨', atk:10, hp:18, color:'#b0bec5', glow:'#eceff1' },
  'fire+wind':       { id:'firestorm',name:'Firestorm',      icon:'🌪🔥',atk:22, hp:8, color:'#ff6d00', glow:'#ffab40' },
  'fire+earth':      { id:'magma',    name:'Magma Golem',    icon:'🌋', atk:15, hp:20, color:'#bf360c', glow:'#ff7043' },
  'fire+lightning':  { id:'inferno',  name:'Inferno God',    icon:'☄️', atk:24, hp:9,  color:'#e53935', glow:'#ff8f00' },
  'fire+shadow':     { id:'hellfire', name:'Hellfire Wraith',icon:'👹', atk:25, hp:12, color:'#880e4f', glow:'#f06292' },
  'fire+ice':        { id:'slush',    name:'Slush Beast',    icon:'🧊🔥',atk:12, hp:20, color:'#80cbc4', glow:'#b2dfdb' },
  'fire+nature':     { id:'wildfire', name:'Wildfire Drake', icon:'🐉', atk:20, hp:16, color:'#ff8f00', glow:'#ffd54f' },
  'fire+arcane':     { id:'phoenix',  name:'Arcane Phoenix', icon:'🦅', atk:28, hp:14, color:'#e040fb', glow:'#ea80fc' },
  'fire+void':       { id:'obliteron',name:'Obliteron',      icon:'💀', atk:28, hp:7,  color:'#37474f', glow:'#ff3d00' },
  'water+wind':      { id:'typhoon',  name:'Typhoon Serpent',icon:'🌊', atk:16, hp:22, color:'#0288d1', glow:'#4fc3f7' },
  'water+earth':     { id:'swamp',    name:'Swamp Titan',    icon:'🐊', atk:10, hp:30, color:'#558b2f', glow:'#9ccc65' },
  'water+lightning': { id:'storm',    name:'Storm Elemental',icon:'⛈', atk:22, hp:16, color:'#1565c0', glow:'#42a5f5' },
  'water+shadow':    { id:'abyss',    name:'Abyssal Horror', icon:'🦑', atk:18, hp:24, color:'#1a237e', glow:'#7986cb' },
  'water+ice':       { id:'glacier',  name:'Glacier Giant',  icon:'🏔', atk:12, hp:36, color:'#b3e5fc', glow:'#e1f5fe' },
  'water+arcane':    { id:'tidecaller',name:'Tidecaller',    icon:'🧜', atk:20, hp:28, color:'#00838f', glow:'#4dd0e1' },
  'wind+earth':      { id:'sandstorm',name:'Sandstorm Lord', icon:'🏜', atk:14, hp:20, color:'#f9a825', glow:'#fdd835' },
  'wind+lightning':  { id:'tempest',  name:'Tempest Djinn',  icon:'🌩', atk:26, hp:12, color:'#c5cae9', glow:'#9fa8da' },
  'wind+shadow':     { id:'wraith',   name:'Void Wraith',    icon:'👻', atk:22, hp:14, color:'#4527a0', glow:'#7e57c2' },
  'wind+ice':        { id:'blizzard', name:'Blizzard Drake', icon:'🐲', atk:18, hp:22, color:'#e3f2fd', glow:'#bbdefb' },
  'wind+arcane':     { id:'sylph',    name:'Arcane Sylph',   icon:'🧚', atk:24, hp:16, color:'#ce93d8', glow:'#f3e5f5' },
  'earth+shadow':    { id:'golem',    name:'Shadow Golem',   icon:'🗿', atk:16, hp:32, color:'#424242', glow:'#757575' },
  'earth+ice':       { id:'tundra',   name:'Tundra Colossus',icon:'🦣', atk:14, hp:38, color:'#78909c', glow:'#b0bec5' },
  'earth+lightning': { id:'quake',    name:'Thunder Quake',  icon:'⚡🪨',atk:24, hp:22, color:'#795548', glow:'#a1887f' },
  'lightning+shadow':{ id:'darkbolt', name:'Darkbolt Demon', icon:'😈', atk:32, hp:10, color:'#6a1b9a', glow:'#ab47bc' },
  'lightning+ice':   { id:'frostbolt',name:'Frostbolt Titan',icon:'❄⚡',atk:26, hp:18, color:'#4dd0e1', glow:'#b2ebf2' },
  'shadow+ice':      { id:'lich',     name:'Lich Lord',      icon:'💀', atk:28, hp:24, color:'#311b92', glow:'#7c4dff' },
  'shadow+arcane':   { id:'umbra',    name:'Umbra Archon',   icon:'🌘', atk:30, hp:20, color:'#1a237e', glow:'#7986cb' },
  'shadow+void':     { id:'annihil',  name:'Annihilator',    icon:'🕳👹',atk:30, hp:10, color:'#000000', glow:'#b71c1c' },
  'arcane+void':     { id:'singularity',name:'Singularity',  icon:'🌌', atk:32, hp:13, color:'#311b92', glow:'#9c27b0' },
  'nature+fire':     { id:'wildfire2',name:'Wildfire Spirit',icon:'🌲🔥',atk:18,hp:18, color:'#e65100', glow:'#ffb74d' },
  'nature+water':    { id:'lifesurge',name:'Life Surge',     icon:'🌊🌿',atk:12,hp:32, color:'#00695c', glow:'#80cbc4' },
  'nature+lightning':{ id:'thornstorm',name:'Thornstorm',    icon:'🌿⚡',atk:24,hp:16, color:'#388e3c', glow:'#aed581' },
  'nature+arcane':   { id:'treant',   name:'Arcane Treant',  icon:'🌳', atk:22, hp:28, color:'#1b5e20', glow:'#81c784' },
};

function getFusionKey(a, b) {
  const sorted = [a, b].sort();
  return sorted.join('+');
}

function getFusion(idA, idB) {
  const key = getFusionKey(idA, idB);
  if (FUSIONS[key]) return { ...FUSIONS[key], isFusion: true };
  const ea = ELEMENTS[idA] || {}, eb = ELEMENTS[idB] || {};
  return {
    id: 'hybrid_' + idA + '_' + idB,
    name: (ea.name || 'Ancient') + '-' + (eb.name || 'Beast'),
    icon: '✨',
    atk: Math.round(((ea.atk||10) + (eb.atk||10)) * 0.7),
    hp:  Math.round(((ea.hp||10)  + (eb.hp||10))  * 0.7),
    color: '#c0a060',
    glow: '#ffd700',
    isFusion: true,
  };
}

const DUNGEON_POOL = [
  { id:'slime',    name:'Slime',       icon:'🟢', atk:4,  hp:14, type:'enemy',  color:'#00e676', glow:'#69f0ae', desc:'Gross and slimy.' },
  { id:'goblin',   name:'Goblin',      icon:'👺', atk:8,  hp:22, type:'enemy',  color:'#76ff03', glow:'#ccff90', desc:'Cunning creature.' },
  { id:'orc',      name:'Orc Warrior', icon:'🪓', atk:14, hp:35, type:'enemy',  color:'#558b2f', glow:'#9ccc65', desc:'Brute force.' },
  { id:'vampire',  name:'Vampire',     icon:'🧛', atk:16, hp:28, type:'enemy',  color:'#880e4f', glow:'#f48fb1', desc:'Drains your life.' },
  { id:'lich',     name:'Lich',        icon:'💀', atk:20, hp:40, type:'enemy',  color:'#4527a0', glow:'#7e57c2', desc:'Undead sorcerer.' },
  { id:'dragon',   name:'Dragon',      icon:'🐉', atk:28, hp:60, type:'enemy',  color:'#b71c1c', glow:'#ef9a9a', desc:'Ancient terror.' },
  { id:'demon',    name:'Demon Lord',  icon:'👿', atk:32, hp:80, type:'enemy',  color:'#4a148c', glow:'#ce93d8', desc:'Harbinger of doom.' },
  { id:'chest',    name:'Treasure',    icon:'💰', gold:40,        type:'loot',   color:'#ffd700', glow:'#ffe082', desc:'Gold awaits!' },
  { id:'gem',      name:'Gem Cache',   icon:'💎', gold:80,        type:'loot',   color:'#00bcd4', glow:'#b2ebf2', desc:'Precious stones.' },
  { id:'potion',   name:'Elixir',      icon:'🧪', heal:30,        type:'heal',   color:'#e040fb', glow:'#f48fb1', desc:'Restores 30 HP.' },
  { id:'spikes',   name:'Spike Trap',  icon:'⚠️', damage:15,      type:'hazard', color:'#616161', glow:'#bdbdbd', desc:'Watch your step.' },
  { id:'curse',    name:'Curse Orb',   icon:'🔴', damage:25,      type:'hazard', color:'#b71c1c', glow:'#ef9a9a', desc:'Dark magic.' },
];

function getRandomDungeonCard(depth) {
  if (depth >= 8 && Math.random() < 0.18) {
    return { id:'boss', name:'Ancient Wyrm', icon:'🐉', atk:45, hp:110, type:'enemy', color:'#b71c1c', glow:'#ef9a9a', desc:'The depths awaken.' };
  }
  const enemies = DUNGEON_POOL.filter(d => d.type === 'enemy');
  const others  = DUNGEON_POOL.filter(d => d.type !== 'enemy');
  const pool = depth < 3 ? [...enemies.slice(0,3), ...others]
             : depth < 6 ? [...enemies.slice(0,5), ...others]
             : [...enemies, ...others.filter(d => d.type !== 'heal')];
  const base = pool[Math.floor(Math.random() * pool.length)];
  const scaled = { ...base };
  if (scaled.type === 'enemy' && depth > 1) {
    const mult = 1 + (depth - 1) * 0.25;
    scaled.atk = Math.round(scaled.atk * mult);
    scaled.hp  = Math.round(scaled.hp  * mult);
  }
  return scaled;
}