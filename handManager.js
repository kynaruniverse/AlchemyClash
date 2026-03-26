/**
 * Organizes the player's hand into designated slots.
 * Updated for Phaser v3.90.0 "Tsugumi"
 */
function organizeHand(scene) {
    // 1. Core Hand Layout Constants
    const slotPositions = [65, 145, 225, 305, 385];
    const handY = 700;
    const baseDepth = 10; // Keeps hand above background but below UI toasts

    // 2. Filter only active player cards that are NOT currently being dragged
    let cards = scene.children.list.filter(child => 
        child.isPlayerCard && 
        child.active && 
        (!child.input || !child.input.isDragged)
    );

    // 3. Animate each card into its specific slot
    cards.forEach((card, index) => {
        if (index < slotPositions.length) {
            // Set depth based on index so cards on the right overlap cards on the left slightly
            card.setDepth(baseDepth + index);

            scene.tweens.add({
                targets: card,
                x: slotPositions[index],
                y: handY,
                scale: 1, // Ensure scale is reset if coming from a fusion/shrink animation
                alpha: 1,
                duration: 400,
                ease: 'Cubic.easeOut', // Smoother "slide-to-home" feel
                onStart: () => {
                    // Prevent interaction during reorganization to avoid physics glitches
                    if (card.input) card.disableInteractive();
                },
                onComplete: () => {
                    // Re-enable interaction once the card is safely in its slot
                    if (card.input) card.setInteractive();
                }
            });
        } else {
            // AAA Logic: If player has more than 5 cards, move extras off-screen or destroy
            // For now, let's keep it simple: extras stay at the last slot
            card.setPosition(slotPositions[4], handY);
        }
    });
}
