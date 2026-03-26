import Card from '../entities/Card.js';
import { CONSTANTS } from '../core/Constants.js';

export default class HandManager {
    constructor(scene) {
        this.scene = scene;
        this.slotPositions = CONSTANTS.HAND.SLOT_POSITIONS;
        this.handY = CONSTANTS.HAND.Y;
        this.baseDepth = CONSTANTS.HAND.BASE_DEPTH;
    }

    organize() {
        const cards = this.scene.children.list.filter(child => 
            child instanceof Card && 
            child.isPlayerCard && 
            child.active && 
            (!child.input || !child.input.isDragged)
        );

        cards.forEach((card, index) => {
            if (index < this.slotPositions.length) {
                card.setDepth(this.baseDepth + index);
                this.scene.tweens.add({
                    targets: card,
                    x: this.slotPositions[index],
                    y: this.handY,
                    scale: 1,
                    alpha: 1,
                    duration: 400,
                    ease: 'Cubic.easeOut',
                    onStart: () => { if (card.disableInteractive) card.disableInteractive(); },
                    onComplete: () => { if (card.setInteractive) card.setInteractive(); }
                });
            } else {
                card.setPosition(this.slotPositions[4], this.handY);
            }
        });
    }
}