export class LoadingScreen extends Phaser.Scene {
    constructor() { super('LoadingScreen'); }

    preload() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // AAA Progress Bar UI
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(60, 300, 240, 30);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xff0055, 1);
            progressBar.fillRect(70, 310, 220 * value, 10);
        });

        // Load Placeholders for now
        this.load.image('bg_menu', 'https://placehold.co/360x640/1a1a2e/white?text=Main+Menu');
        this.load.image('card_back', 'https://placehold.co/80x110/333333/white?text=Alchemy');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
