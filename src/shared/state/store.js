/**
 * Global State Store
 * Centralized state management with reactivity
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';

const logger = new Logger('Store');
const eventBus = EventBus.getInstance();

export class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = new Map();
        this.history = [];
        this.maxHistory = 50;
    }

    /**
     * Get state value
     */
    get(key) {
        if (key) {
            return this.state[key];
        }
        return { ...this.state };
    }

    /**
     * Set state value
     */
    set(key, value) {
        const oldValue = this.state[key];
        
        if (oldValue === value) return;

        // Save to history
        this.addToHistory(key, oldValue, value);

        // Update state
        this.state[key] = value;

        // Notify listeners
        this.notify(key, value, oldValue);

        // Emit global event
        eventBus.emit('state:changed', { key, value, oldValue });

        logger.debug(`State updated: ${key}`, value);
    }

    /**
     * Update multiple state values
     */
    update(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Subscribe to state changes
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }

        this.listeners.get(key).add(callback);

        // Return unsubscribe function
        return () => this.unsubscribe(key, callback);
    }

    /**
     * Unsubscribe from state changes
     */
    unsubscribe(key, callback) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).delete(callback);
        }
    }

    /**
     * Notify listeners
     */
    notify(key, newValue, oldValue) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (error) {
                    logger.error('Listener error:', error);
                }
            });
        }
    }

    /**
     * Add to history
     */
    addToHistory(key, oldValue, newValue) {
        this.history.push({
            timestamp: Date.now(),
            key,
            oldValue,
            newValue
        });

        // Keep history size limited
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    /**
     * Get state history
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Reset state to initial
     */
    reset() {
        const keys = Object.keys(this.state);
        keys.forEach(key => {
            this.set(key, undefined);
        });
        this.clearHistory();
        logger.info('State reset');
    }

    /**
     * Get all state keys
     */
    keys() {
        return Object.keys(this.state);
    }

    /**
     * Check if key exists
     */
    has(key) {
        return key in this.state;
    }
}

// Create global store instance
export const globalStore = new Store({
    currentTheme: 'dark',
    searchQuery: '',
    searchResults: [],
    favorites: [],
    currentMovie: null,
    isLoading: false,
    filters: {
        type: 'all',
        sort: 'relevance',
        year: ''
    }
});

export default globalStore;
