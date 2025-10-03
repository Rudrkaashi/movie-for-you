/**
 * Event Bus - Global Event System
 * Pub/Sub pattern for decoupled communication
 */

import { Logger } from './logger.js';

const logger = new Logger('EventBus');

export class EventBus {
    static instance = null;

    constructor() {
        if (EventBus.instance) {
            return EventBus.instance;
        }

        this.events = new Map();
        EventBus.instance = this;
    }

    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    /**
     * Subscribe to an event
     */
    on(event, callback) {
        if (typeof callback !== 'function') {
            logger.error(`Callback must be a function for event: ${event}`);
            return;
        }

        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }

        this.events.get(event).add(callback);
        logger.debug(`Subscribed to event: ${event}`);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Unsubscribe from an event
     */
    off(event, callback) {
        if (!this.events.has(event)) return;

        this.events.get(event).delete(callback);

        if (this.events.get(event).size === 0) {
            this.events.delete(event);
        }

        logger.debug(`Unsubscribed from event: ${event}`);
    }

    /**
     * Emit an event
     */
    emit(event, data) {
        if (!this.events.has(event)) {
            logger.debug(`No subscribers for event: ${event}`);
            return;
        }

        logger.debug(`Emitting event: ${event}`, data);

        this.events.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                logger.error(`Error in event handler for ${event}:`, error);
            }
        });
    }

    /**
     * Subscribe to event once
     */
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };

        return this.on(event, onceCallback);
    }

    /**
     * Clear all event listeners
     */
    clear() {
        this.events.clear();
        logger.info('All event listeners cleared');
    }

    /**
     * Get all registered events
     */
    getEvents() {
        return Array.from(this.events.keys());
    }
}
