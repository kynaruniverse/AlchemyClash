/**
 * FUSIONGOD - UIManager Class (Phase 2)
 * All HUD, toasts, pulses — now a proper class
 */
export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.hpText = scene.hpText;
        this.goldText = scene.goldText;
    }

    createToast(message) {
        const activeToasts = this.scene.children.list.filter(c => c.isToast);
        const yOffset = activeToasts.length * 70;

        let toast = this.scene.add.container(225, -100);
        toast.isToast = true;

        let bg = this.scene.add.rectangle(0, 0, 340, 60, 0xffd700)
            .setAlpha(0.95)
            .setStrokeStyle(3, 0xffffff, 0.8);

        let txt = this.scene.add.text(0, 0, message, {
            fontFamily: 'MedievalSharp', fontSize: '18px', color: '#000', fontStyle: 'bold'
        }).setOrigin(0.5);

        toast.add([bg, txt]);
        toast.setDepth(2000);

        this.scene.tweens.add({
            targets: toast,
            y: 80 + yOffset,
            duration: 600,
            ease: 'Back.easeOut',
            yoyo: true,
            hold: 2500,
            onComplete: () => toast.destroy()
        });
    }

    updateHUD() {
        if (!this.hpText || !this.goldText) return;

        const oldHp = this.hpText.text;
        const oldGold = this.goldText.text;

        this.hpText.setText(`HP: ${this.scene.playerStats.hp}`);
        this.goldText.setText(`GOLD: ${this.scene.playerStats.gold}`);

        if (oldHp !== this.hpText.text) this.pulseElement(this.hpText);
        if (oldGold !== this.goldText.text) this.pulseElement(this.goldText);
    }

    pulseElement(target) {
        this.scene.tweens.add({
            targets: target,
            scale: 1.2,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeInOut'
        });
    }
}