export class CardDisplay extends Phaser.GameObjects.Container {
    constructor(scene, x, y, cardData) {
        super(scene, x, y);
        this.scene = scene;
        this.data = cardData;

        // 1. The Card Base (Glow/Shadow)
        this.shadow = scene.add.rectangle(4, 4, 80, 110, 0x000000, 0.4);
        
        // 2. The Main Frame
        this.frame = scene.add.rectangle(0, 0, 80, 110, cardData.color || 0x333333)
            .setStrokeStyle(3, 0xffffff);

        // 3. The Artwork Placeholder (AAA games use separate sprites here)
        this.art = scene.add.rectangle(0, -10, 70, 60, 0x000000, 0.2);

        // 4. Power Badge (The 'Snap' circle)
        this.badge = scene.add.circle(30, -45, 15, 0xff0055).setStrokeStyle(2, 0xffffff);
        this.powerText = scene.add.text(30, -45, cardData.atk, { 
            fontSize: '14px', fontStyle: 'bold', fill: '#fff' 
        }).setOrigin(0.5);

        // 5. Name Label
        this.nameText = scene.add.text(0, 35, cardData.name.toUpperCase(), {
            fontSize: '11px', fontStyle: 'bold', fill: '#fff'
        }).setOrigin(0.5);

        // Add all parts to the container
        this.add([this.shadow, this.frame, this.art, this.badge, this.powerText, this.nameText]);
        
        // Add to scene
        scene.add.existing(this);
        
        // Initial "Hidden" state for animation
        this.setScale(0);
        this.alpha = 0;
    }

    // AAA Entrance Animation
    animateIn(delay = 0) {
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            alpha: 1,
            angle: { from: -10, to: 0 },
            duration: 400,
            delay: delay,
            ease: 'Back.easeOut'
        });
    }

    // Hover effect for mobile touch
    setHighlight(isActive) {
        this.scene.tweens.add({
            targets: this,
            scale: isActive ? 1.1 : 1.0,
            duration: 100
        });
        this.frame.setStrokeStyle(isActive ? 5 : 3, isActive ? 0xffff00 : 0xffffff);
    }
}
