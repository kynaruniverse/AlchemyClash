/**
 * FUSIONGOD - Main Engine (Phase 2 Complete + Folders Set Up)
 * All managers are now proper classes + full EventBus
 */

import './core/EventBus.js';
import './database.js';                    // ← This line fixes the white screen
import Card from './entities/Card.js';
import HandManager from './managers/HandManager.js';
import UIManager from './managers/UIManager.js';
import FusionManager from './managers/FusionManager.js';
import DungeonManager from './managers/DungeonManager.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 450, height: 800 },
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('card-frame', 'https://labs.phaser.io/assets/sprites/cardBack_red.png');
    this.load.image('particle-flare', 'https://labs.phaser.io/assets/sprites/muzzleflash2.png');
}

function create() {
    console.log("FUSIONGOD v3.90.0 Phase 2 + Folders Ready ⚡");

    this.playerStats = { hp: 100, maxHp: 100, gold: 0, depth: 1 };
    this.discoveredEntries = JSON.parse(localStorage.getItem('fusion_discovery')) || ['fire', 'water', 'wolf'];

    // Instantiate all managers
    this.handManager = new HandManager(this);
    this.uiManager = new UIManager(this);
    this.fusionManager = new FusionManager(this);
    this.dungeonManager = new DungeonManager(this);

    // HUD
    this.hpText = this.add.text(20, 20, '', { fontFamily: 'Orbitron', fontSize: '24px', color: '#ff4b2b' });
    this.goldText = this.add.text(20, 50, '', { fontFamily: 'Orbitron', fontSize: '20px', color: '#ffd700' });
    this.uiManager.updateHUD();

    // Hand area background
    this.add.rectangle(225, 700, 400, 150, 0x1a1a1a).setStrokeStyle(2, 0xffd700, 0.5);

    // Spawn starting cards
    new Card(this, 150, 700, ELEMENT_DATA['fire'], true);
    new Card(this, 300, 700, ELEMENT_DATA['wolf'], true);

    // Fill dungeon
    this.dungeonManager.fillRow();

    // Global EventBus listeners
    this.eventBus.on('card-dragend', ({ card }) => {
        if (card.isPlayerCard) this.handManager.organize();
    });

    this.eventBus.on('fusion-complete', () => this.handManager.organize());
    this.eventBus.on('dungeon-updated', () => {
        this.dungeonManager.fillRow();
        this.handManager.organize();
    });

    console.log("All managers loaded and listening");
}

function update() {}