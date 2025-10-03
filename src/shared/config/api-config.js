/**
 * API Configuration
 * Centralized API settings
 */

export const API_CONFIG = {
    // OMDB API
    OMDB: {
        BASE_URL: 'https://www.omdbapi.com/',
        API_KEY: 'e753590b',
        TIMEOUT: 10000,
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000
    },

    // Cache settings
    CACHE: {
        ENABLED: true,
        DURATION: 5 * 60 * 1000, // 5 minutes
        MAX_SIZE: 100 // Max cached items
    },

    // Request settings
    REQUEST: {
        HEADERS: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        CREDENTIALS: 'omit',
        MODE: 'cors'
    }
};

export default API_CONFIG;
