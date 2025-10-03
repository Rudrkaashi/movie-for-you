/**
 * Environment Configuration
 * Detects and manages environment settings
 */

export const ENV = {
    // Environment detection
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // App info
    APP_NAME: 'Movies-For-You',
    VERSION: '1.0.0',
    
    // URLs
    BASE_URL: window.location.origin,
    API_URL: 'https://www.omdbapi.com/',
    
    // Feature flags
    FEATURES: {
        ENABLE_ANALYTICS: false,
        ENABLE_ERROR_REPORTING: false,
        ENABLE_SERVICE_WORKER: false,
        ENABLE_NOTIFICATIONS: false
    },
    
    // Debug mode
    DEBUG: window.location.hostname === 'localhost',
    
    // Browser info
    BROWSER: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine
    }
};

/**
 * Get environment variable
 */
export function getEnv(key, defaultValue = null) {
    return ENV[key] !== undefined ? ENV[key] : defaultValue;
}

/**
 * Check if development mode
 */
export function isDev() {
    return ENV.isDevelopment;
}

/**
 * Check if production mode
 */
export function isProd() {
    return ENV.isProduction;
}

export default ENV;
