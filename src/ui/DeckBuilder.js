/**
 * ALCHEMY CLASH: AAA DECK BUILDER - UPGRADED
 * Snap-style, high-fidelity card selection with responsive grid and cinematic feedback.
 */

import { CARD_DATABASE } from '../game/CardData.js';
import gsap from 'gsap';

export class DeckBuilder {
    constructor(parentContainer, maxDeckSize = 4) {
        this.parent = parentContainer;
        this.selectedCards = [];
        this.onComplete = null; 
        this.maxDeckSize = maxDeckSize;

        this.injectStyles();
    }

    init() {
        console.log("DeckBuilder: Initializing UI...");
        this.parent.innerHTML = '';

        const builderScreen = document.createElement('div');
        builderScreen.id = 'deck-builder-screen';
        builderScreen.className = 'game-screen active-screen';

        builderScreen.innerHTML = `
            <div id="builder-header">
                <div id="builder-title">COLLECTION</div>
                <div id="builder-count">SELECTED: <span id="card-count">0/${this.maxDeckSize}</span></div>
            </div>
            
            <div id="card-grid-container">
                <div id="card-grid"></div>
            </div>

            <div id="builder-footer">
                <button id="confirm-deck-btn" class="aaa-button locked" disabled>PICK ${this.maxDeckSize} CARDS</button>
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

            item.addEventListener('click', () => this.toggleCard(key, item));
            grid.appendChild(item);
        });

        const confirmBtn = document.getElementById('confirm-deck-btn');
        confirmBtn.addEventListener('click', () => {
            if (this.selectedCards.length === this.maxDeckSize && typeof this.onComplete === 'function') {
                this.onComplete(this.selectedCards);
            }
        });
    }

    toggleCard(key, element) {
        const index = this.selectedCards.indexOf(key);
        const btn = document.getElementById('confirm-deck-btn');
        const countDisplay = document.getElementById('card-count');

        if (index > -1) {
            this.selectedCards.splice(index, 1);
            gsap.to(element, { scale: 1, duration: 0.3, boxShadow: "0px 0px 0px rgba(0,0,0,0)" });
            element.classList.remove('selected');
        } else if (this.selectedCards.length < this.maxDeckSize) {
            this.selectedCards.push(key);
            gsap.to(element, { scale: 1.05, duration: 0.3, boxShadow: "0px 0px 20px rgba(0,255,255,0.5)" });
            element.classList.add('selected');
        }

        const count = this.selectedCards.length;
        countDisplay.innerText = `${count}/${this.maxDeckSize}`;

        if (count === this.maxDeckSize) {
            btn.disabled = false;
            btn.classList.remove('locked');
            btn.innerText = "READY TO CLASH";
            gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: "back.out(1.7)" });
        } else {
            btn.disabled = true;
            btn.classList.add('locked');
            btn.innerText = `PICK ${this.maxDeckSize - count} MORE`;
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
            #builder-title { font-size: 36px; font-weight: 900; letter-spacing: -1px; color: #00ffff; }
            #builder-count { font-size: 14px; color: #aaa; }
            
            #card-grid-container {
                flex: 1; overflow-y: auto; padding: 20px;
                mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
            }
            #card-grid {
                display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;
            }
            .grid-card {
                background: #1a1a1a; border-radius: 12px; position: relative;
                transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s;
                border: 2px solid transparent; overflow: hidden; cursor: pointer;
            }
            .grid-card.selected { border-color: #00ffff; z-index: 2; }
            .card-inner { height: 200px; display: flex; flex-direction: column; }
            .card-cost { 
                position: absolute; top: 5px; left: 5px; background: #0066ff; 
                width: 28px; height: 28px; border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900;
            }
            .card-art-thumb { flex: 1; background-size: cover; background-position: center; border-radius: 6px; }
            .card-info { padding: 10px; background: rgba(0,0,0,0.85); }
            .card-name { font-size: 12px; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .card-atk { font-size: 14px; color: #ff0055; font-weight: 900; }
            
            #builder-footer { padding: 30px; display: flex; justify-content: center; }
            .aaa-button.locked { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }
            .aaa-button { padding: 12px 24px; font-weight: 900; font-size: 16px; letter-spacing: 1px; cursor: pointer; background: #00ffff; color: #050510; border: none; border-radius: 8px; transition: transform 0.2s ease; }
            .aaa-button:hover:not(.locked) { transform: scale(1.05); }
        `;
        document.head.appendChild(style);
    }
}