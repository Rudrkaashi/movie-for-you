/**
 * State Manager Helper
 * Utility functions for state management
 */

import { globalStore } from './store.js';
import { Logger } from '../../core/logger.js';

const logger = new Logger('StateManager');

export class StateManager {
    /**
     * Get current search query
     */
    static getSearchQuery() {
        return globalStore.get('searchQuery');
    }

    /**
     * Set search query
     */
    static setSearchQuery(query) {
        globalStore.set('searchQuery', query);
    }

    /**
     * Get search results
     */
    static getSearchResults() {
        return globalStore.get('searchResults') || [];
    }

    /**
     * Set search results
     */
    static setSearchResults(results) {
        globalStore.set('searchResults', results);
    }

    /**
     * Get favorites
     */
    static getFavorites() {
        return globalStore.get('favorites') || [];
    }

    /**
     * Set favorites
     */
    static setFavorites(favorites) {
        globalStore.set('favorites', favorites);
    }

    /**
     * Get current movie
     */
    static getCurrentMovie() {
        return globalStore.get('currentMovie');
    }

    /**
     * Set current movie
     */
    static setCurrentMovie(movie) {
        globalStore.set('currentMovie', movie);
    }

    /**
     * Get loading state
     */
    static isLoading() {
        return globalStore.get('isLoading') || false;
    }

    /**
     * Set loading state
     */
    static setLoading(loading) {
        globalStore.set('isLoading', loading);
    }

    /**
     * Get filters
     */
    static getFilters() {
        return globalStore.get('filters') || {
            type: 'all',
            sort: 'relevance',
            year: ''
        };
    }

    /**
     * Update filters
     */
    static updateFilters(filters) {
        const current = this.getFilters();
        globalStore.set('filters', { ...current, ...filters });
    }

    /**
     * Subscribe to state changes
     */
    static subscribe(key, callback) {
        return globalStore.subscribe(key, callback);
    }

    /**
     * Get entire state (for debugging)
     */
    static getState() {
        return globalStore.get();
    }

    /**
     * Reset all state
     */
    static reset() {
        globalStore.reset();
        logger.info('State manager reset');
    }
}

export default StateManager;
