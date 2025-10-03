/**
 * Local Storage Manager
 * Provides safe and structured access to localStorage
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('StorageManager');

export class StorageManager {
    constructor(prefix = 'movies_app_') {
        this.prefix = prefix;
        this.isAvailable = this.checkAvailability();
    }

    /**
     * Check if localStorage is available
     */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            logger.warn('localStorage not available:', error);
            return false;
        }
    }

    /**
     * Get prefixed key
     */
    getKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Set item in localStorage
     */
    set(key, value) {
        if (!this.isAvailable) return false;

        try {
            const serialized = JSON.stringify({
                value,
                timestamp: Date.now()
            });
            localStorage.setItem(this.getKey(key), serialized);
            logger.debug(`Stored: ${key}`);
            return true;
        } catch (error) {
            logger.error(`Failed to store ${key}:`, error);
            return false;
        }
    }

    /**
     * Get item from localStorage
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;

        try {
            const item = localStorage.getItem(this.getKey(key));
            
            if (!item) return defaultValue;

            const parsed = JSON.parse(item);
            return parsed.value;
        } catch (error) {
            logger.error(`Failed to retrieve ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Remove item from localStorage
     */
    remove(key) {
        if (!this.isAvailable) return false;

        try {
            localStorage.removeItem(this.getKey(key));
            logger.debug(`Removed: ${key}`);
            return true;
        } catch (error) {
            logger.error(`Failed to remove ${key}:`, error);
            return false;
        }
    }

    /**
     * Clear all items with prefix
     */
    clear() {
        if (!this.isAvailable) return false;

        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            logger.info('Storage cleared');
            return true;
        } catch (error) {
            logger.error('Failed to clear storage:', error);
            return false;
        }
    }

    /**
     * Check if key exists
     */
    has(key) {
        if (!this.isAvailable) return false;
        return localStorage.getItem(this.getKey(key)) !== null;
    }

    /**
     * Get all keys
     */
    keys() {
        if (!this.isAvailable) return [];

        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(this.prefix, ''));
    }

    /**
     * Get storage size in bytes
     */
    getSize() {
        if (!this.isAvailable) return 0;

        let size = 0;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                size += localStorage.getItem(key).length + key.length;
            }
        });
        return size;
    }
}
