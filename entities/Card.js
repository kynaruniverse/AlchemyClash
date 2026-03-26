/**
 * FUSIONGOD - Reusable Card Class (Phase 5 Robustness)
 */
export default class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, data, isPlayerCard = true) {
        if (!scene || !data) {
            console.error("Card created with missing scene or data");
            return;
        }
        super(scene, x, y);
        this.scene = scene;
        this.cardData = JSON.parse(JSON.stringify(data));
        this.isPlayerCard = isPlayerCard;
        this.isDungeonEntity = !isPlayerCard;

        const bg = scene.add.rectangle(0, 0, 100, 140, 0x1a1a1a)
            .setStrokeStyle(3, data.color || 0x333333);

        if (data.id === 'hybrid') bg.setStrokeStyle(4, 0xffffff, 0.9);

        const title = scene.add.text(0, isPlayerCard ? 45 : -40, data.name || '???', {
            fontFamily: 'MedievalSharp', fontSize: isPlayerCard ? '20px' : '18px',
            color: '#ffd700', fontStyle: 'bold'
        }).setOrigin(0.5);

        const stats = scene.add.text(0, isPlayerCard ? 75 : 40, 
            isPlayerCard ? `ATK:\( {data.atk || 0} HP: \){data.hp || 0}` : (data.description || ''),
            { fontFamily: 'Orbitron', fontSize: '14px', color: '#ffffff' }
        ).setOrigin(0.5);

        this.add([bg, title, stats]);
        this.setSize(100, 140);

        this.setInteractive({ draggable: true });
        scene.input.setDraggable(this);

        this.on('drag', (pointer, dragX, dragY) => {
            this.setPosition(dragX, dragY);
            this.setDepth(1000);
        });

        this.on('dragend', () => {
            this.setDepth(10);
            if (this.scene && this.scene.eventBus) {
                this.scene.eventBus.emit('card-dragend', { card: this });
            }
        });

        scene.add.existing(this);

        this.setScale(0.3);
        this.scene.tweens.add({ targets: this, scale: 1, duration: 300, ease: 'Back.easeOut' });
    }

    kill() {
        if (!this.active) return;
        this.setVisible(false);
        this.setActive(false);
        this.removeAllListeners();
    }
}