export class DuelManager {
    constructor() {
        // Tracks power in each lane [Lane 1, Lane 2, Lane 3]
        this.laneScores = [0, 0, 0];
        this.playerMana = 1;
        this.currentTurn = 1;
    }

    // Update the score when a card is dropped
    addCardToLane(laneIndex, cardPower) {
        this.laneScores[laneIndex] += cardPower;
        console.log(`Lane ${laneIndex} Score: ${this.laneScores[laneIndex]}`);
        
        // Return true if player is winning this lane (simple logic for now)
        return this.laneScores[laneIndex];
    }

    nextTurn() {
        this.currentTurn++;
        this.playerMana = Math.min(this.currentTurn, 6); // Max 6 energy like Snap
    }
}
