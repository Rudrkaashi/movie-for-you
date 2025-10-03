/**
 * Resize Observer Wrapper
 * Observe element size changes
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('ResizeObserverWrapper');

export class ElementResizeObserver {
    constructor() {
        this.observer = null;
        this.callbacks = new Map();
    }

    /**
     * Observe element
     */
    observe(element, callback) {
        if (!element) return;

        if (!this.observer) {
            this.observer = new ResizeObserver((entries) => {
                entries.forEach(entry => {
                    const callback = this.callbacks.get(entry.target);
                    if (callback) {
                        try {
                            callback(entry);
                        } catch (error) {
                            logger.error('Resize callback error:', error);
                        }
                    }
                });
            });
        }

        this.callbacks.set(element, callback);
        this.observer.observe(element);
        logger.debug('Started observing element resize');
    }

    /**
     * Unobserve element
     */
    unobserve(element) {
        if (this.observer && element) {
            this.observer.unobserve(element);
            this.callbacks.delete(element);
        }
    }

    /**
     * Disconnect observer
     */
    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
            this.callbacks.clear();
            logger.debug('Disconnected resize observer');
        }
    }
}

export default new ElementResizeObserver();
