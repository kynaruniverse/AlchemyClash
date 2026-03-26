/**
 * FUSIONGOD - HandManager Class (Phase 2)
 * Clean, reusable, EventBus-aware
 */
export default class HandManager {
    constructor(scene) {
        this.scene = scene;
        this.slotPositions = [65, 145, 225, 305, 385];
        this.handY = 700;
        this.baseDepth = 10;
    }

    organize() {
        // Only active player cards that are NOT being dragged
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
                    onStart: () => card.disableInteractive && card.disableInteractive(),
                    onComplete: () => card.setInteractive && card.setInteractive()
                });
            } else {
                card.setPosition(this.slotPositions[4], this.handY);
            }
        });
    }
}