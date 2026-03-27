/**
 * ALCHEMY CLASH: AAA STATE ORCHESTRATOR
 * Orchestrates: Splash -> Main Menu -> Deck Builder -> 3D Battle
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Alchemy Clash: PWA Ready.'))
            .catch(err => console.log('SW Registration Failed:', err));
    });
}

import { Engine3D } from './src/core/Engine3D.js';
import { CardFactory } from './src/core/CardFactory.js';
import { InputSystem } from './src/core/InputSystem.js';
import { DuelManager } from './src/game/DuelManager.js';
import { VFXManager } from './src/core/VFXManager.js';
import { Interface } from './src/ui/Interface.js';
import { AIManager } from './src/game/AIManager.js';
import { Environment } from './src/core/Environment.js';
import { AudioManager } from './src/core/AudioManager.js';
import { DeckBuilder } from './src/ui/DeckBuilder.js';

class GameBootstrapper {
    constructor() {
        console.log("ALCHEMY CLASH: State Architecture Online");
        
        this.app = null;
        this.duel = null;
        this.input = null;
        this.audio = new AudioManager();
        this.uiHub = document.getElementById('ui-container');
        this.battleContainer = document.getElementById('game-container');

        this.initSplashScreen();
    }

    /** STATE 1: SPLASH SCREEN */
    initSplashScreen() {
        this.uiHub.innerHTML = '';
        const splash = document.createElement('div');
        splash.id = 'splash-screen';
        splash.className = 'game-screen';
        splash.innerHTML = `
            <div id="splash-logo">
                <div id="splash-title">ALCHEMY<br>CLASH</div>
                <div id="splash-subtext">MASTER THE ELEMENTS</div>
            </div>
            <button id="enter-arena-btn" class="aaa-button">ENTER ARENA</button>
        `;
        this.uiHub.appendChild(splash);
        requestAnimationFrame(() => splash.classList.add('active-screen'));

        document.getElementById('enter-arena-btn').onclick = () => {
            this.audio.play('SNAP', 0.5);
            this.transitionState(splash, () => this.initMenuScreen());
        };
    }

    /** STATE 2: MAIN MENU */
    initMenuScreen() {
        const menu = document.createElement('div');
        menu.id = 'menu-screen';
        menu.className = 'game-screen';
        menu.innerHTML = `
            <div id="menu-top">
                <div id="menu-player">
                    <div id="player-avatar"></div>
                    <div id="player-meta">
                        <div id="player-level">LVL 70</div>
                        <div id="player-name">ALCHEMIST</div>
                    </div>
                </div>
                <div id="menu-resources">
                    <div class="resource-pill">💎 150</div>
                    <div class="resource-pill gold">🎫 300</div>
                </div>
            </div>
            <div id="menu-center">
                <div id="seasonal-mission-banner">SEASONAL<br>BATTLE PASS</div>
            </div>
            <div id="menu-bottom">
                <div id="menu-subtext">READY TO DUEL?</div>
                <div id="play-btn-wrapper">
                    <div id="current-deck-label">STARTER DECK</div>
                    <button id="main-play-btn" class="play-button">PLAY</button>
                </div>
                <div id="bottom-nav">
                    <div class="nav-item">Shop</div>
                    <div class="nav-item active-nav">Main</div>
                    <div class="nav-item">Collection</div>
                </div>
            </div>
        `;
        this.uiHub.appendChild(menu);
        requestAnimationFrame(() => menu.classList.add('active-screen'));

        document.getElementById('main-play-btn').onclick = () => {
            this.audio.play('CLICK', 0.5);
            this.transitionState(menu, () => this.initDeckBuilderState());
        };
    }

    /** STATE 3: DECK BUILDER */
    initDeckBuilderState() {
        try {
            const builder = new DeckBuilder(this.uiHub);
            builder.onComplete = (selectedDeck) => {
                console.log("Deck Confirmed:", selectedDeck);
                this.audio.play('SNAP', 0.5);
                this.gotoBattleState(selectedDeck);
            };
            builder.init();
        } catch (e) {
            console.error("DeckBuilder Failed:", e);
        }
    }

    /** STATE 4: 3D BATTLE */
    gotoBattleState(playerDeck) {
        gsap.to(this.uiHub, { opacity: 0, duration: 0.4, onComplete: () => {
            this.uiHub.innerHTML = '';
            this.init3DSystems(playerDeck);
            this.initBattleHUD();
            this.battleContainer.style.display = 'block';
            gsap.to(this.battleContainer, { opacity: 1, duration: 1.2 });
            gsap.to(this.uiHub, { opacity: 1, duration: 0.6, delay: 0.8 });
        }});
    }

    init3DSystems(playerDeck) {
        try {
            this.app = new Engine3D();
            this.vfx = new VFXManager(this.app.scene);
            this.app.setVFX(this.vfx);

            this.duel = new DuelManager(this.app.scene, this.vfx, this.audio);
            this.factory = new CardFactory(this.app.scene, this.vfx);
            this.ai = new AIManager(this.duel, this.factory);

            this.ui = new Interface(this.duel);
            this.duel.ui = this.ui;
            this.duel.ai = this.ai;

            this.input = new InputSystem(this.app, this.duel);
            this.input.enabled = false;

            this.app.transitionToBattle();

            this.factory.spawnDeck(playerDeck, 'PLAYER', () => {
                this.input.enabled = true;
                this.ui.announce("ROUND 1");
                this.ui.updateUI();
            });
        } catch (e) {
            console.error("3D Systems Initialization Failed:", e);
        }
    }

    initBattleHUD() {
        const battleHUD = document.createElement('div');
        battleHUD.id = 'battle-screen';
        battleHUD.className = 'game-screen active-screen';
        battleHUD.innerHTML = `
            <div id="score-container">
                ${[0,1,2].map(i => `
                <div class="lane-ui">
                    <div class="enemy-score" id="enemy-${i}">0</div>
                    <div class="lane-score" id="score-${i}">0</div>
                </div>`).join('')}
            </div>
            <div id="announcer">MATCH START</div>
            <div id="bottom-bar">
                <div class="mana-container">
                    <div class="mana-hex"><span id="mana-value">1</span></div>
                    <div class="mana-label">ENERGY</div>
                </div>
                <button id="end-turn-btn">END TURN</button>
            </div>
        `;
        this.uiHub.appendChild(battleHUD);

        document.getElementById('end-turn-btn').onclick = () => {
            if (this.duel) this.duel.processTurn();
        };
    }

    /** Smooth Screen Transitions */
    transitionState(outgoing, nextStateCallback) {
        gsap.to(outgoing, { opacity: 0, x: -20, duration: 0.3, onComplete: () => {
            outgoing.remove();
            nextStateCallback();
        }});
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.Game = new GameBootstrapper();
});