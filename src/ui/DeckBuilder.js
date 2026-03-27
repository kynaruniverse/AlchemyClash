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
        this.container.style.display = 'flex'; // Force visibility
        this.container.style.pointerEvents = 'auto'; // Enable clicks
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
            
            // Fix: Ensure 6-digit hex color for CSS
            const hexColor = card.color.toString(16).padStart(6, '0');
            
            item.innerHTML = `
                <div class="card-art" style="border-color: #${hexColor}">
                    <strong>${card.name}</strong><br>
                    <span>ATK: ${card.atk} | COST: ${card.cost}</span>
                    <p style="font-size: 9px; color: #888; margin-top: 5px;">${card.desc || ''}</p>
                </div>
            `;
            item.onclick = () => this.toggleCard(key, item);
            grid.appendChild(item);
        });

        const confirmBtn = this.container.querySelector('#confirm-deck-btn');
        confirmBtn.className = 'glow-button'; // Apply AAA styling
        confirmBtn.onclick = () => {

            this.container.style.display = 'none';
            this.onComplete(this.selectedCards);
        };
    }

    toggleCard(key, element) {
        const isSelected = this.selectedCards.includes(key);

        if (isSelected) {
            this.selectedCards = this.selectedCards.filter(k => k !== key);
            element.classList.remove('selected');
        } else if (this.selectedCards.length < 4) {
            this.selectedCards.push(key);
            element.classList.add('selected');
        }

        // Visual feedback for the button
        const btn = this.container.querySelector('#confirm-deck-btn');
        const count = this.selectedCards.length;
        btn.disabled = count !== 4;
        btn.innerText = count === 4 ? "LOCK DECK" : `PICK ${4 - count} MORE`;
    }
}
