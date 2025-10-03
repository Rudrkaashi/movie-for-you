/**
 * Application Constants
 * Centralized configuration values
 */

export const APP_CONFIG = {
    NAME: 'Movies-For-You',
    VERSION: '1.0.0',
    DESCRIPTION: 'Discover and explore movies with stunning cinematic experience',
    AUTHOR: 'Your Name',
    REPOSITORY: 'https://github.com/yourusername/movies-for-you'
};

export const API_CONFIG = {
    OMDB_BASE_URL: 'https://www.omdbapi.com/',
    OMDB_API_KEY: 'e753590b',
    REQUEST_TIMEOUT: 10000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
};

export const THEME_CONFIG = {
    DEFAULT_THEME: 'dark',
    STORAGE_KEY: 'movies_app_theme',
    THEMES: {
        DARK: 'dark',
        LIGHT: 'light'
    }
};

export const STORAGE_CONFIG = {
    PREFIX: 'movies_app_',
    KEYS: {
        THEME: 'theme',
        FAVORITES: 'favorites',
        RECENT_SEARCHES: 'recent_searches',
        USER_PREFERENCES: 'user_preferences'
    }
};

export const UI_CONFIG = {
    TOAST_DURATION: 5000,
    SCROLL_THRESHOLD: 300,
    DEBOUNCE_DELAY: 500,
    THROTTLE_DELAY: 100,
    ANIMATION_DURATION: 300,
    LAZY_LOAD_MARGIN: '50px'
};

export const SEARCH_CONFIG = {
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 100,
    RESULTS_PER_PAGE: 10,
    MAX_RESULTS: 100
};

export const MOVIE_CONFIG = {
    TYPES: {
        ALL: 'all',
        MOVIE: 'movie',
        SERIES: 'series',
        EPISODE: 'episode'
    },
    SORT_OPTIONS: {
        RELEVANCE: 'relevance',
        TITLE: 'title',
        YEAR: 'year',
        RATING: 'rating'
    }
};

export const ROUTES = {
    HOME: '/',
    SEARCH: '/search',
    FAVORITES: '/favorites',
    ABOUT: '/about'
};

export const SOCIAL_LINKS = {
    FACEBOOK: '#',
    TWITTER: '#',
    INSTAGRAM: '#',
    YOUTUBE: '#'
};

export const CONTACT_INFO = {
    EMAIL: 'support@moviesforyou.com',
    PHONE: '+91 1234567890',
    ADDRESS: 'New Delhi, India'
};

export const EXTERNAL_LINKS = {
    OMDB_API: 'https://www.omdbapi.com/',
    IMDB_BASE: 'https://www.imdb.com/title/'
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    API_ERROR: 'Failed to fetch data. Please try again.',
    SEARCH_ERROR: 'Search failed. Please try again.',
    NO_RESULTS: 'No movies found. Try different keywords.',
    INVALID_INPUT: 'Please enter a valid search term.',
    TIMEOUT: 'Request timeout. Please try again.',
    UNKNOWN: 'An unexpected error occurred.'
};

export const SUCCESS_MESSAGES = {
    SEARCH_COMPLETE: 'Search completed successfully',
    FAVORITE_ADDED: 'Added to favorites',
    FAVORITE_REMOVED: 'Removed from favorites',
    LINK_COPIED: 'Link copied to clipboard',
    CONNECTION_RESTORED: 'Connection restored'
};

// Export all as default
export default {
    APP_CONFIG,
    API_CONFIG,
    THEME_CONFIG,
    STORAGE_CONFIG,
    UI_CONFIG,
    SEARCH_CONFIG,
    MOVIE_CONFIG,
    ROUTES,
    SOCIAL_LINKS,
    CONTACT_INFO,
    EXTERNAL_LINKS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};
