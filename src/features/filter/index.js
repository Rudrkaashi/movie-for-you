/**
 * Filter Feature
 * Handles movie filtering and sorting
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';

const logger = new Logger('FilterFeature');
const eventBus = EventBus.getInstance();

export class FilterFeature {
    constructor() {
        this.currentFilter = 'all';
        this.currentSort = 'relevance';
        this.filters = {
            ALL: 'all',
            MOVIE: 'movie',
            SERIES: 'series',
            EPISODE: 'episode'
        };
        this.sortOptions = {
            RELEVANCE: 'relevance',
            TITLE: 'title',
            YEAR: 'year'
        };
    }

    /**
     * Filter movies by type
     */
    filterMovies(movies, filterType = 'all') {
        if (filterType === this.filters.ALL) {
            return movies;
        }

        return movies.filter(movie => 
            movie.Type.toLowerCase() === filterType.toLowerCase()
        );
    }

    /**
     * Sort movies
     */
    sortMovies(movies, sortBy = 'relevance') {
        const sorted = [...movies];

        switch (sortBy) {
            case this.sortOptions.TITLE:
                return sorted.sort((a, b) => 
                    a.Title.localeCompare(b.Title)
                );

            case this.sortOptions.YEAR:
                return sorted.sort((a, b) => {
                    const yearA = parseInt(a.Year) || 0;
                    const yearB = parseInt(b.Year) || 0;
                    return yearB - yearA; // Newest first
                });

            case this.sortOptions.RELEVANCE:
            default:
                return sorted; // Keep original order
        }
    }

    /**
     * Apply filter and sort
     */
    applyFilterAndSort(movies, filterType, sortBy) {
        let result = this.filterMovies(movies, filterType);
        result = this.sortMovies(result, sortBy);
        return result;
    }

    /**
     * Get filter statistics
     */
    getFilterStats(movies) {
        return {
            all: movies.length,
            movie: movies.filter(m => m.Type === 'movie').length,
            series: movies.filter(m => m.Type === 'series').length,
            episode: movies.filter(m => m.Type === 'episode').length
        };
    }

    /**
     * Set current filter
     */
    setFilter(filterType) {
        if (Object.values(this.filters).includes(filterType)) {
            this.currentFilter = filterType;
            logger.info('Filter set to:', filterType);
            eventBus.emit('filter:changed', { filter: filterType });
        }
    }

    /**
     * Set current sort
     */
    setSort(sortBy) {
        if (Object.values(this.sortOptions).includes(sortBy)) {
            this.currentSort = sortBy;
            logger.info('Sort set to:', sortBy);
            eventBus.emit('sort:changed', { sort: sortBy });
        }
    }

    /**
     * Get current filter
     */
    getFilter() {
        return this.currentFilter;
    }

    /**
     * Get current sort
     */
    getSort() {
        return this.currentSort;
    }

    /**
     * Reset filters
     */
    reset() {
        this.currentFilter = this.filters.ALL;
        this.currentSort = this.sortOptions.RELEVANCE;
        logger.info('Filters reset');
        eventBus.emit('filter:reset');
    }
}

// Export singleton instance
export default new FilterFeature();
