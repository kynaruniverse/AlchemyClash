/**
 * FUSIONGOD - Reusable Card Class (fixes duplication + performance)
 * Extends Phaser Container + built-in pooling prep
 */
export default class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, data, isPlayerCard = true) {
        super(scene, x, y);
        this.scene = scene;
        this.cardData = JSON.parse(JSON.stringify(data)); // deep copy
        this.isPlayerCard = isPlayerCard;
        this.isDungeonEntity = !isPlayerCard;

        // Visuals (now unified for both player and dungeon cards)
        let bg;
        if (isPlayerCard) {
            bg = scene.add.sprite(0, 0, 'card-frame').setScale(1.2);
        } else {
            bg = scene.add.rectangle(0, 0, 100, 140, 0x1a1a1a).setStrokeStyle(3, data.color || 0x333333);
        }
        if (data.color) bg.setTint(data.color);

        const title = scene.add.text(0, isPlayerCard ? 45 : -40, data.name, {
            fontFamily: 'MedievalSharp', fontSize: isPlayerCard ? '20px' : '18px',
            color: '#ffd700', fontStyle: 'bold'
        }).setOrigin(0.5);

        const stats = scene.add.text(0, isPlayerCard ? 75 : 40, 
            isPlayerCard ? `ATK:\( {data.atk} HP: \){data.hp}` : data.description || '', 
            { fontFamily: 'Orbitron', fontSize: '14px', color: '#ffffff' }
        ).setOrigin(0.5);

        this.add([bg, title, stats]);
        this.setSize(bg.width || 100, bg.height || 140);

        // Draggable
        this.setInteractive({ draggable: true });
        scene.input.setDraggable(this);

        this.on('drag', (pointer, dragX, dragY) => {
            this.setPosition(dragX, dragY);
            this.setDepth(1000);
        });

        this.on('dragend', () => {
            this.setDepth(10);
            this.scene.eventBus.emit('card-dragend', { card: this });
        });

        scene.add.existing(this);
    }

    // Pool-friendly kill (we'll activate this in Phase 2)
    kill() {
        this.setVisible(false);
        this.setActive(false);
        this.removeAllListeners();
    }
}