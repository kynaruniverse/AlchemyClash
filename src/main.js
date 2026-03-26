import { LoadingScreen } from './src/screens/loadingScreen.js';
import { MainMenu } from './src/screens/mainMenu.js';
import { DuelScreen } from './src/screens/duelScreen.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 360,
    height: 640,
    backgroundColor: '#05050a',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    // We register all screens here
    scene: [LoadingScreen, MainMenu, DuelScreen]
};

const game = new Phaser.Game(config);
