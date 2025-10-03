/**
 * Cookie Management
 * Helper functions for cookie operations
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('CookieManager');

export class CookieManager {
    /**
     * Set cookie
     */
    static set(name, value, days = 365) {
        try {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = `expires=${date.toUTCString()}`;
            const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
            document.cookie = `${name}=${encodeURIComponent(cookieValue)};${expires};path=/;SameSite=Lax`;
            return true;
        } catch (error) {
            logger.error('Failed to set cookie:', error);
            return false;
        }
    }

    /**
     * Get cookie
     */
    static get(name, defaultValue = null) {
        try {
            const nameEQ = name + "=";
            const cookies = document.cookie.split(';');
            
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.indexOf(nameEQ) === 0) {
                    const value = decodeURIComponent(cookie.substring(nameEQ.length));
                    try {
                        return JSON.parse(value);
                    } catch {
                        return value;
                    }
                }
            }
            return defaultValue;
        } catch (error) {
            logger.error('Failed to get cookie:', error);
            return defaultValue;
        }
    }

    /**
     * Delete cookie
     */
    static delete(name) {
        this.set(name, '', -1);
    }

    /**
     * Check if cookie exists
     */
    static has(name) {
        return this.get(name) !== null;
    }

    /**
     * Get all cookies
     */
    static getAll() {
        const cookies = {};
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name) {
                cookies[name] = decodeURIComponent(value);
            }
        });
        return cookies;
    }

    /**
     * Clear all cookies
     */
    static clearAll() {
        const cookies = this.getAll();
        Object.keys(cookies).forEach(name => this.delete(name));
    }
}

export default CookieManager;
