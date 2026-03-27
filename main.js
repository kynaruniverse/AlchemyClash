/**
 * ALCHEMY CLASH: MAIN ORCHESTRATOR
 * Manages the high-level game state: Menu -> Deck Building -> Battle.
 */

import { Engine3D } from './src/core/Engine3D.js';
import { CardFactory } from './src/core/CardFactory.js';
import { InputSystem } from './src/core/InputSystem.js';
import { DuelManager } from './src/game/DuelManager.js';
import { VFXManager } from './src/core/VFXManager.js';
import { Interface } from './src/ui/Interface.js';
import { AIManager } from './src/game/AIManager.js';
import { Environment } from './src/core/Environment.js';
import { DeckBuilder } from './src/ui/DeckBuilder.js';
import { AudioManager } from './src/core/AudioManager.js';


class GameBootstrapper {
    constructor() {
        // 1. Initialize 3D Core
        this.app = new Engine3D();
        this.world = new Environment(this.app.scene);
        this.vfx = new VFXManager(this.app.scene);
        this.app.setVFX(this.vfx);
        this.audio = new AudioManager();

        // 2. Initialize Game Logic
        this.duel = new DuelManager(this.app.scene, this.vfx, this.audio);

        this.factory = new CardFactory(this.app.scene);
        this.ai = new AIManager(this.duel, this.factory);
        this.ui = new Interface(this.duel);

        // 3. Dependency Injection
        this.duel.ui = this.ui;
        this.duel.ai = this.ai;
        this.input = new InputSystem(this.app, this.duel);
        
        // Ensure input is disabled during cinematics
        this.input.enabled = false;

        this.heroCard = null;
        this.setupMenu();
    }

    /**
     * Creates the initial "Hero View" with the floating Fire Dragon
     */
    setupMenu() {
        this.heroCard = this.factory.createCard('FIRE_DRAGON', 0, 0);
        
        // Infinite rotation for the title screen
        gsap.to(this.heroCard.rotation, { 
            y: Math.PI * 2, 
            duration: 12, 
            repeat: -1, 
            ease: "none" 
        });

        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.onclick = () => this.openDeckBuilder();
        }
    }

    /**
     * Transition from Menu to the Deck Selection Screen
     */
    openDeckBuilder() {
        // 1. Visual Feedback
        const menu = document.getElementById('menu-layer');
        const uiLayer = document.getElementById('ui-layer');
        
        // Ensure UI layer is ready to receive the deck builder
        uiLayer.style.display = 'block'; 

        gsap.to(menu, { opacity: 0, duration: 0.5, onComplete: () => {
            menu.style.display = 'none';
            
            // 2. Launch Deck Builder
            try {
                new DeckBuilder((selectedDeck) => {
                    this.startBattle(selectedDeck);
                });
            } catch (e) {
                console.error("DeckBuilder failed to initialize:", e);
            }
        }});
    }



    /**
     * The "AAA Transition": Fly camera into the Arena and spawn the chosen deck
     */
    startBattle(playerDeck) {
        // 1. Cinematic Camera Move
        this.app.transitionToBattle();

        // 2. Clean up Menu Assets
        if (this.heroCard) {
            gsap.to(this.heroCard.scale, { 
                x: 0, y: 0, z: 0, 
                duration: 0.6, 
                onComplete: () => {
                    this.disposeHeroCard();
                    this.initializeMatch(playerDeck);
                }
            });
        }
    }

    /**
     * Populate the 3D board with the player's selected cards
     */
    initializeMatch(playerDeck) {
        this.input.enabled = true;

        // Spread the 4 selected cards across the bottom "Hand" area
        playerDeck.forEach((cardKey, index) => {
            const xPos = -4.5 + (index * 3); // Spacing cards out evenly
            const yPos = -6.5; // Positioning at the bottom of the screen
            
            setTimeout(() => {
                this.factory.createCard(cardKey, xPos, yPos, 'PLAYER');
                
                // If it's the last card, trigger the UI announcement
                if (index === playerDeck.length - 1) {
                    this.ui.announce("MATCH START");
                    this.ui.updateUI();
                }
            }, index * 200); // Slight delay between each card spawning for polish
        });
    }

    /**
     * Memory cleanup for the hero card to save GPU resources
     */
    disposeHeroCard() {
        if (!this.heroCard) return;
        this.app.scene.remove(this.heroCard);
        if (this.heroCard.geometry) this.heroCard.geometry.dispose();
        if (Array.isArray(this.heroCard.material)) {
            this.heroCard.material.forEach(m => m.dispose());
        } else {
            this.heroCard.material.dispose();
        }
        this.heroCard = null;
    }
}

// Global initialization on load
window.addEventListener('DOMContentLoaded', () => {
    window.Game = new GameBootstrapper();
});
