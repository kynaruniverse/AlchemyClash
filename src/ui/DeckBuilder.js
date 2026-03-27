/**
 * ALCHEMY CLASH: AAA DECK BUILDER (SNAP STYLE)
 * Orchestrates card selection with high-fidelity grid visuals.
 */

import { CARD_DATABASE } from '../game/CardData.js';

export class DeckBuilder {
    constructor(parentContainer) {
        this.parent = parentContainer;
        this.selectedCards = [];
        this.onComplete = null; // Defined by main.js after instantiation
        
        // Internal styling to keep the grid looking "AAA"
        this.injectStyles();
    }

    /**
     * Initializes the view and renders the collection grid
     */
    init() {
        console.log("DeckBuilder: Initializing UI...");
        this.parent.innerHTML = ''; // Clean slate
        
        const builderScreen = document.createElement('div');
        builderScreen.id = 'deck-builder-screen';
        builderScreen.className = 'game-screen active-screen';
        
        builderScreen.innerHTML = `
            <div id="builder-header">
                <div id="builder-title">COLLECTION</div>
                <div id="builder-count">SELECTED: <span id="card-count">0/4</span></div>
            </div>
            
            <div id="card-grid-container">
                <div id="card-grid"></div>
            </div>

            <div id="builder-footer">
                <button id="confirm-deck-btn" class="aaa-button locked" disabled>PICK 4 CARDS</button>
            </div>
        `;

        this.parent.appendChild(builderScreen);
        this.renderGrid();
    }

    renderGrid() {
        const grid = document.getElementById('card-grid');
        
        Object.keys(CARD_DATABASE).forEach(key => {
            const card = CARD_DATABASE[key];
            const item = document.createElement('div');
            item.className = 'grid-card';
            
            // Format color for CSS
            const hexColor = typeof card.color === 'number' 
                ? `#${card.color.toString(16).padStart(6, '0')}` 
                : card.color;
            
            item.innerHTML = `
                <div class="card-inner" style="border-bottom: 4px solid ${hexColor}">
                    <div class="card-cost">${card.cost}</div>
                    <div class="card-art-thumb" style="background-image: url('${card.texture}')"></div>
                    <div class="card-info">
                        <div class="card-name">${card.name}</div>
                        <div class="card-atk">POW: ${card.atk}</div>
                    </div>
                </div>
            `;

            item.onclick = () => this.toggleCard(key, item);
            grid.appendChild(item);
        });

        const confirmBtn = document.getElementById('confirm-deck-btn');
        confirmBtn.onclick = () => {
            if (this.selectedCards.length === 4 && typeof this.onComplete === 'function') {
                this.onComplete(this.selectedCards);
            }
        };
    }

    toggleCard(key, element) {
        const index = this.selectedCards.indexOf(key);
        const btn = document.getElementById('confirm-deck-btn');
        const countDisplay = document.getElementById('card-count');

        if (index > -1) {
            this.selectedCards.splice(index, 1);
            element.classList.remove('selected');
        } else if (this.selectedCards.length < 4) {
            this.selectedCards.push(key);
            element.classList.add('selected');
        }

        // Update UI State
        const count = this.selectedCards.length;
        countDisplay.innerText = `${count}/4`;
        
        if (count === 4) {
            btn.disabled = false;
            btn.classList.remove('locked');
            btn.innerText = "READY TO CLASH";
        } else {
            btn.disabled = true;
            btn.classList.add('locked');
            btn.innerText = `PICK ${4 - count} MORE`;
        }
    }

    injectStyles() {
        if (document.getElementById('deck-builder-styles')) return;
        const style = document.createElement('style');
        style.id = 'deck-builder-styles';
        style.innerHTML = `
            #deck-builder-screen {
                background: linear-gradient(to bottom, #050510, #101025);
                display: flex; flex-direction: column;
            }
            #builder-header { 
                padding: 40px 20px 10px; display: flex; 
                justify-content: space-between; align-items: flex-end;
            }
            #builder-title { font-size: 32px; font-weight: 900; letter-spacing: -1px; color: #00ffff; }
            #builder-count { font-size: 14px; color: #aaa; }
            
            #card-grid-container {
                flex: 1; overflow-y: auto; padding: 20px;
                mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
            }
            #card-grid {
                display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;
            }
            .grid-card {
                background: #1a1a1a; border-radius: 8px; position: relative;
                transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 2px solid transparent; overflow: hidden;
            }
            .grid-card.selected { border-color: #00ffff; transform: scale(1.05); z-index: 2; box-shadow: 0 0 20px rgba(0,255,255,0.4); }
            .card-inner { height: 180px; display: flex; flex-direction: column; }
            .card-cost { 
                position: absolute; top: 5px; left: 5px; background: #0066ff; 
                width: 24px; height: 24px; border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900;
            }
            .card-art-thumb { flex: 1; background-size: cover; background-position: center; }
            .card-info { padding: 8px; background: rgba(0,0,0,0.8); }
            .card-name { font-size: 10px; font-weight: 900; white-space: nowrap; overflow: hidden; }
            .card-atk { font-size: 12px; color: #ff0055; font-weight: 900; }
            
            #builder-footer { padding: 30px; display: flex; justify-content: center; }
            .aaa-button.locked { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }
        `;
        document.head.appendChild(style);
    }
}
