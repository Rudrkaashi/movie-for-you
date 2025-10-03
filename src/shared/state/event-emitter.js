/**
 * Event Emitter
 * Simple pub/sub pattern implementation
 */

export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    /**
     * Subscribe to event
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        
        return () => this.off(event, callback);
    }

    /**
     * Subscribe once
     */
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }

    /**
     * Unsubscribe from event
     */
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    /**
     * Emit event
     */
    emit(event, ...args) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error('Event handler error:', error);
                }
            });
        }
    }

    /**
     * Clear all listeners
     */
    clear() {
        this.events.clear();
    }

    /**
     * Get event names
     */
    eventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * Get listener count
     */
    listenerCount(event) {
        return this.events.has(event) ? this.events.get(event).size : 0;
    }
}

export default EventEmitter;
