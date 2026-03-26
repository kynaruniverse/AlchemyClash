/**
 * Modernized UI Module for Phaser v3.90.0
 */

// 1. Enhanced Toast System
function createToast(scene, message) {
    // Check if a toast already exists to prevent overlapping (Depth Management)
    const activeToasts = scene.children.list.filter(c => c.isToast);
    const yOffset = activeToasts.length * 70; // Stack them if multiple trigger

    let toast = scene.add.container(225, -100);
    toast.isToast = true; // Label for stacking logic
    
    // AAA Style: Rounded corners and a stroke for a "Premium" look
    let bg = scene.add.rectangle(0, 0, 340, 60, 0xffd700)
        .setAlpha(0.95)
        .setStrokeStyle(3, 0xffffff, 0.8);
        
    let txt = scene.add.text(0, 0, message, {
        fontFamily: 'MedievalSharp', 
        fontSize: '18px', 
        color: '#000',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    toast.add([bg, txt]);
    toast.setDepth(2000); // Ensure it's above everything

    scene.tweens.add({
        targets: toast,
        y: 80 + yOffset, // Slide down to its stack position
        duration: 600,
        ease: 'Back.easeOut',
        yoyo: true,
        hold: 2500,
        onComplete: () => toast.destroy()
    });
}

// 2. Dynamic HUD System
function updateHUD(scene) {
    if (!scene.hpText || !scene.goldText) return;

    // Logic: If HP changed, trigger a "Pulse" effect on the text
    if (scene.hpText.text !== `❤️ HP: ${scene.playerStats.hp}`) {
        pulseElement(scene, scene.hpText);
    }
    
    // Logic: If Gold changed, trigger a pulse
    if (scene.goldText.text !== `💰 GOLD: ${scene.playerStats.gold}`) {
        pulseElement(scene, scene.goldText);
    }

    scene.hpText.setText(`❤️ HP: ${scene.playerStats.hp}`);
    scene.goldText.setText(`💰 GOLD: ${scene.playerStats.gold}`);
}

/**
 * AAA Polish: Makes text "Pop" when the value changes
 */
function pulseElement(scene, target) {
    scene.tweens.add({
        targets: target,
        scale: 1.2,
        duration: 100,
        yoyo: true,
        ease: 'Quad.easeInOut'
    });
}
