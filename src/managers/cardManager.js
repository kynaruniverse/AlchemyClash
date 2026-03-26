import { CARD_DATABASE } from '../../data/cards.js';
import { CardDisplay } from '../ui/cardDisplay.js';

export class CardManager {
    constructor(scene) {
        this.scene = scene;
    }

    // Get a random card from the database
    getRandomCard() {
        const randomIndex = Math.floor(Math.random() * CARD_DATABASE.length);
        return CARD_DATABASE[randomIndex];
    }

    // Create a physical card in the scene
    createCardAt(x, y, cardId) {
        const data = CARD_DATABASE.find(c => c.id === cardId) || this.getRandomCard();
        const card = new CardDisplay(this.scene, x, y, data);
        return card;
    }
}
