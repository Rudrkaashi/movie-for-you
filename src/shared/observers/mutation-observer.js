/**
 * Mutation Observer Wrapper
 * Observe DOM changes
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('MutationObserverWrapper');

export class DOMObserver {
    constructor(options = {}) {
        this.options = {
            childList: true,
            subtree: true,
            attributes: false,
            ...options
        };
        this.observer = null;
        this.callbacks = new Set();
    }

    /**
     * Start observing
     */
    observe(target, callback) {
        if (callback) {
            this.callbacks.add(callback);
        }

        if (!this.observer) {
            this.observer = new MutationObserver((mutations) => {
                this.callbacks.forEach(cb => {
                    try {
                        cb(mutations);
                    } catch (error) {
                        logger.error('Observer callback error:', error);
                    }
                });
            });
        }

        this.observer.observe(target, this.options);
        logger.debug('Started observing DOM changes');
    }

    /**
     * Stop observing
     */
    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
            this.callbacks.clear();
            logger.debug('Stopped observing DOM changes');
        }
    }

    /**
     * Remove callback
     */
    removeCallback(callback) {
        this.callbacks.delete(callback);
    }
}

export default DOMObserver;
