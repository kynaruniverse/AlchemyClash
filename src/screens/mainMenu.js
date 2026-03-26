export class MainMenu extends Phaser.Scene {
    constructor() { super('MainMenu'); }

    create() {
        this.add.image(180, 320, 'bg_menu');
        
        // AAA Title Effect
        let title = this.add.text(180, 150, 'ALCHEMY\nCLASH', {
            fontSize: '42px', fontStyle: 'bold', align: 'center', fill: '#ff0055'
        }).setOrigin(0.5);

        // Play Button
        let playBtn = this.add.rectangle(180, 400, 200, 60, 0xffffff, 0.1)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive();
        
        this.add.text(180, 400, 'START DUEL', { fontSize: '20px' }).setOrigin(0.5);

        playBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('DuelScreen');
            });
        });
    }
}
