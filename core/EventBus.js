/**
 * FUSIONGOD - Tiny EventBus (fixes all coupling)
 * Zero dependencies, works perfectly in Spck + Phaser
 */
class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data = {}) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
}

// Make it globally available (easiest for mobile Spck)
window.eventBus = new EventBus();
console.log("⚡ EventBus v1 ready - all systems now talk through events");