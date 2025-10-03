/**
 * Session Storage Manager
 * Temporary storage for current session
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('SessionStorage');

export class SessionStorageManager {
    constructor(prefix = 'movies_app_session_') {
        this.prefix = prefix;
        this.isAvailable = this.checkAvailability();
    }

    /**
     * Check if sessionStorage is available
     */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (error) {
            logger.warn('sessionStorage not available:', error);
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
     * Set item
     */
    set(key, value) {
        if (!this.isAvailable) return false;

        try {
            const serialized = JSON.stringify({
                value,
                timestamp: Date.now()
            });
            sessionStorage.setItem(this.getKey(key), serialized);
            return true;
        } catch (error) {
            logger.error(`Failed to store ${key}:`, error);
            return false;
        }
    }

    /**
     * Get item
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;

        try {
            const item = sessionStorage.getItem(this.getKey(key));
            
            if (!item) return defaultValue;

            const parsed = JSON.parse(item);
            return parsed.value;
        } catch (error) {
            logger.error(`Failed to retrieve ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Remove item
     */
    remove(key) {
        if (!this.isAvailable) return false;

        try {
            sessionStorage.removeItem(this.getKey(key));
            return true;
        } catch (error) {
            logger.error(`Failed to remove ${key}:`, error);
            return false;
        }
    }

    /**
     * Clear all session items
     */
    clear() {
        if (!this.isAvailable) return false;

        try {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    sessionStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            logger.error('Failed to clear session storage:', error);
            return false;
        }
    }

    /**
     * Check if key exists
     */
    has(key) {
        if (!this.isAvailable) return false;
        return sessionStorage.getItem(this.getKey(key)) !== null;
    }
}

export default SessionStorageManager;
