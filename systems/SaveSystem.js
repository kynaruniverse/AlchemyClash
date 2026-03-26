/**
 * FUSIONGOD - SaveSystem (Phase 5)
 * Robust auto-save with error handling
 */
export default class SaveSystem {
    constructor(scene) {
        this.scene = scene;
        this.KEY = 'fusiongod_save';
    }

    save() {
        try {
            const saveData = {
                playerStats: this.scene.playerStats,
                discoveredEntries: this.scene.discoveredEntries,
                timestamp: Date.now()
            };
            localStorage.setItem(this.KEY, JSON.stringify(saveData));
            console.log("💾 Game auto-saved");
        } catch (e) {
            console.warn("Save failed (private browsing?):", e);
        }
    }

    load() {
        try {
            const saved = localStorage.getItem(this.KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.scene.playerStats = data.playerStats || { hp: 100, maxHp: 100, gold: 0, depth: 1 };
                this.scene.discoveredEntries = data.discoveredEntries || ['fire', 'water', 'wolf'];
                console.log("📂 Game loaded from save");
                return true;
            }
        } catch (e) {
            console.warn("Load failed:", e);
        }
        return false;
    }

    clear() {
        localStorage.removeItem(this.KEY);
    }
}