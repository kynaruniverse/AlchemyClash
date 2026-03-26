export class LoadingScreen extends Phaser.Scene {
    constructor() { super('LoadingScreen'); }

    preload() {
        // Create a simple text "Loading..." so we know it's working
        this.add.text(180, 280, 'LOADING...', { fill: '#ffffff' }).setOrigin(0.5);

        // ERROR HANDLING: This stops the game from hanging if a file is missing
        this.load.on('loaderror', (file) => {
            console.warn('File failed to load: ' + file.src);
        });

        // Use standard placeholders that definitely exist online
        this.load.image('bg_menu', 'https://picsum.photos/360/640'); 
        this.load.image('card_back', 'https://placehold.co/80x110/333333/white?text=Alchemy');
    }

    create() {
        console.log("Loading Complete. Switching to MainMenu.");
        this.scene.start('MainMenu');
    }
}
