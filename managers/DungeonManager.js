import Card from '../entities/Card.js';
import { DUNGEON_DATA, getRandomDungeonKey } from '../data/dungeon.js';
import { CONSTANTS } from '../core/Constants.js';

export default class DungeonManager {
    constructor(scene) {
        this.scene = scene;
        this.dungeonRow = [null, null, null];
    }

    fillRow() {
        for (let i = 0; i < 3; i++) {
            if (!this.dungeonRow[i] || !this.dungeonRow[i].active) {
                const randomKey = getRandomDungeonKey();
                const data = DUNGEON_DATA[randomKey];
                const dungeonCard = new Card(this.scene, 100 + (i * CONSTANTS.DUNGEON.CARD_SPACING), CONSTANTS.DUNGEON.START_Y, data, false);
                this.dungeonRow[i] = dungeonCard;

                this.scene.tweens.add({
                    targets: dungeonCard,
                    y: CONSTANTS.DUNGEON.ROW_Y,
                    duration: 600,
                    ease: 'Back.easeOut',
                    delay: i * 150
                });
            }
        }
    }

    handleInteraction(playerCard, dungeonCard) {
        if (!playerCard || !dungeonCard || !playerCard.active || !dungeonCard.active) return;

        this.scene.cameras.main.shake(80, 0.006);

        const type = dungeonCard.cardData.type;
        if (type === 'enemy') {
            this.scene.eventBus.emit('battle-start', { playerCard, dungeonCard });
        } else if (type === 'loot') {
            this.scene.playerStats.gold += dungeonCard.cardData.gold || 50;
            this.scene.uiManager.updateHUD();
            dungeonCard.kill();
            playerCard.kill();
            this.scene.eventBus.emit('dungeon-updated');
        } else if (type === 'hazard') {
            this.scene.playerStats.hp -= dungeonCard.cardData.damage || 20;
            this.scene.uiManager.updateHUD();
            dungeonCard.kill();
            playerCard.kill();
            this.scene.eventBus.emit('dungeon-updated');
        }

        if (this.scene.saveSystem) this.scene.saveSystem.save();
    }
}