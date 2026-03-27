/**
 * ALCHEMY CLASH: DECK BUILDER
 * Handles card selection before the match begins.
 */

import { CARD_DATABASE } from '../game/CardData.js';

export class DeckBuilder {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.selectedCards = [];
        this.container = document.createElement('div');
        this.container.id = 'deck-builder-screen';
        document.body.appendChild(this.container);
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="builder-content">
                <h2>SELECT YOUR DECK (4 CARDS)</h2>
                <div id="card-grid"></div>
                <button id="confirm-deck-btn" disabled>LOCK DECK</button>
            </div>
        `;

        const grid = this.container.querySelector('#card-grid');
        
        Object.keys(CARD_DATABASE).forEach(key => {
            const card = CARD_DATABASE[key];
            const item = document.createElement('div');
            item.className = 'builder-card';
            item.innerHTML = `
                <div class="card-art" style="border-color: #${card.color.toString(16)}">
                    <strong>${card.name}</strong><br>
                    <span>ATK: ${card.atk} | COST: ${card.cost}</span>
                </div>
            `;
            item.onclick = () => this.toggleCard(key, item);
            grid.appendChild(item);
        });

        this.container.querySelector('#confirm-deck-btn').onclick = () => {
            this.container.style.display = 'none';
            this.onComplete(this.selectedCards);
        };
    }

    toggleCard(key, element) {
        if (this.selectedCards.includes(key)) {
            this.selectedCards = this.selectedCards.filter(k => k !== key);
            element.classList.remove('selected');
        } else if (this.selectedCards.length < 4) {
            this.selectedCards.push(key);
            element.classList.add('selected');
        }

        const btn = document.getElementById('confirm-deck-btn');
        btn.disabled = this.selectedCards.length !== 4;
    }
}
