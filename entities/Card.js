/**
 * FUSIONGOD - Animash-Style Card (cute, glowing, emoji icons)
 */
export default class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, data, isPlayerCard = true) {
        super(scene, x, y);
        this.scene = scene;
        this.cardData = JSON.parse(JSON.stringify(data));
        this.isPlayerCard = isPlayerCard;
        this.isDungeonEntity = !isPlayerCard;

        // Background frame (Animash soft rounded look)
        const bg = scene.add.rectangle(0, 0, 110, 150, 0x1a1a1a)
            .setStrokeStyle(4, data.color || 0x333333, 0.9);

        // Extra glow layer for hybrids
        if (data.id === 'hybrid') {
            const glow = scene.add.rectangle(0, 0, 118, 158, 0xffffff).setAlpha(0.25);
            this.add(glow);
        }

        // Cute emoji icon (center)
        const emoji = {
            fire: '🔥',
            water: '💧',
            wolf: '🐺',
            hybrid: '✨'
        }[data.id] || '❓';

        const icon = scene.add.text(0, -15, emoji, {
            fontSize: '48px',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const title = scene.add.text(0, 48, data.name || '???', {
            fontFamily: 'MedievalSharp',
            fontSize: '22px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5).setShadow(2, 2, '#000000', 3, true);

        const stats = scene.add.text(0, 78, 
            isPlayerCard ? `ATK:\( {data.atk || 0} HP: \){data.hp || 0}` : (data.description || ''),
            { fontFamily: 'Orbitron', fontSize: '15px', color: '#ffffff' }
        ).setOrigin(0.5);

        this.add([bg, icon, title, stats]);
        this.setSize(110, 150);

        this.setInteractive({ draggable: true });
        scene.input.setDraggable(this);

        this.on('drag', (p, dragX, dragY) => this.setPosition(dragX, dragY).setDepth(1000));
        this.on('dragend', () => {
            this.setDepth(10);
            if (this.scene && this.scene.eventBus) this.scene.eventBus.emit('card-dragend', { card: this });
        });

        scene.add.existing(this);

        // Animash pop-in
        this.setScale(0.1);
        this.scene.tweens.add({ targets: this, scale: 1, duration: 350, ease: 'Back.easeOut' });
    }

    kill() {
        if (!this.active) return;
        this.setVisible(false);
        this.setActive(false);
        this.removeAllListeners();
    }
}