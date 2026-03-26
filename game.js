/**
 * FUSIONGOD - Main Engine (Phase 6 + Interaction Fix + Crisp Rendering)
 */

import './core/EventBus.js';
import Card from './entities/Card.js';
import HandManager from './managers/HandManager.js';
import UIManager from './managers/UIManager.js';
import FusionManager from './managers/FusionManager.js';
import DungeonManager from './managers/DungeonManager.js';
import { ELEMENT_DATA } from './data/elements.js';
import { DUNGEON_DATA, getRandomDungeonKey } from './data/dungeon.js';
import { FUSION_NAMES } from './data/fusions.js';
import { CONSTANTS } from './core/Constants.js';
import SaveSystem from './systems/SaveSystem.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: { 
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.CENTER_BOTH, 
        width: 450, 
        height: 800 
    },
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload, create, update },
    // Crisp rendering fixes (fixes blurry cards/text)
    pixelArt: true,
    roundPixels: true
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('particle-flare', 'https://labs.phaser.io/assets/sprites/muzzleflash2.png');
}

function create() {
    console.log("FUSIONGOD v3.90.0 — Interactions + Crisp Fixed ⚡");

    this.saveSystem = new SaveSystem(this);
    this.saveSystem.load();

    this.playerStats = this.playerStats || { hp: 100, maxHp: 100, gold: 0, depth: 1 };
    this.discoveredEntries = this.discoveredEntries || ['fire', 'water', 'wolf'];

    this.handManager = new HandManager(this);
    this.uiManager = new UIManager(this);
    this.fusionManager = new FusionManager(this);
    this.dungeonManager = new DungeonManager(this);

    this.hpText = this.add.text(20, 20, '', { fontFamily: 'Orbitron', fontSize: '24px', color: '#ff4b2b' });
    this.goldText = this.add.text(20, 50, '', { fontFamily: 'Orbitron', fontSize: '20px', color: '#ffd700' });
    this.uiManager.updateHUD();

    this.add.rectangle(225, 700, 400, 150, 0x1a1a1a).setStrokeStyle(2, 0xffd700, 0.5);

    new Card(this, 150, 700, ELEMENT_DATA['fire'], true);
    new Card(this, 300, 700, ELEMENT_DATA['wolf'], true);
    this.dungeonManager.fillRow();

    // === ONBOARDING ===
    if (!this.saveSystem.load()) {
        this.time.delayedCall(800, () => this.uiManager.createToast("👉 Drag cards onto each other to FUSE!"));
        this.time.delayedCall(3200, () => this.uiManager.createToast("👉 Drag a card up to the dungeon row!"));
    }

    // === FIXED DRAG DROP LOGIC (this was missing) ===
    this.eventBus.on('card-dragend', ({ card }) => {
        if (!card) return;

        // Check for fusion or dungeon interaction
        const targets = this.children.list.filter(c => 
            c instanceof Card && c !== card && c.active
        );

        let actionTaken = false;
        for (let target of targets) {
            const dist = Phaser.Math.Distance.Between(card.x, card.y, target.x, target.y);
            if (dist < 80) {   // close enough = interact
                if (card.isPlayerCard && target.isPlayerCard) {
                    this.fusionManager.performFusion(card, target);
                    actionTaken = true;
                } else if (card.isPlayerCard && target.isDungeonEntity) {
                    this.dungeonManager.handleInteraction(card, target);
                    actionTaken = true;
                }
                break;
            }
        }

        if (!actionTaken && card.isPlayerCard) {
            this.handManager.organize();
        }
    });

    this.eventBus.on('fusion-complete', () => this.handManager.organize());
    this.eventBus.on('dungeon-updated', () => {
        this.dungeonManager.fillRow();
        this.handManager.organize();
    });
}

function update() {}