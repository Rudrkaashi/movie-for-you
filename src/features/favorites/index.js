/**
 * Favorites Feature
 * Manages user's favorite movies
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { StorageManager } from '../../shared/storage/local-storage.js';

const logger = new Logger('FavoritesFeature');
const eventBus = EventBus.getInstance();
const storage = new StorageManager();

export class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.storageKey = 'favorites';
        this.load();
    }

    /**
     * Load favorites from storage
     */
    load() {
        const stored = storage.get(this.storageKey, []);
        this.favorites = Array.isArray(stored) ? stored : [];
        logger.info(`Loaded ${this.favorites.length} favorites`);
    }

    /**
     * Save favorites to storage
     */
    save() {
        storage.set(this.storageKey, this.favorites);
        logger.debug('Favorites saved');
    }

    /**
     * Add movie to favorites
     */
    add(movie) {
        if (!movie || !movie.imdbID) {
            logger.warn('Invalid movie object');
            return false;
        }

        if (this.isFavorite(movie.imdbID)) {
            logger.info('Movie already in favorites:', movie.Title);
            return false;
        }

        this.favorites.push({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Type: movie.Type,
            Poster: movie.Poster,
            addedAt: Date.now()
        });

        this.save();
        eventBus.emit('favorites:added', { movie });
        logger.info('Added to favorites:', movie.Title);
        return true;
    }

    /**
     * Remove movie from favorites
     */
    remove(imdbID) {
        const index = this.favorites.findIndex(m => m.imdbID === imdbID);
        
        if (index === -1) {
            logger.warn('Movie not in favorites:', imdbID);
            return false;
        }

        const removed = this.favorites.splice(index, 1)[0];
        this.save();
        eventBus.emit('favorites:removed', { movie: removed });
        logger.info('Removed from favorites:', removed.Title);
        return true;
    }

    /**
     * Toggle favorite status
     */
    toggle(movie) {
        if (this.isFavorite(movie.imdbID)) {
            return this.remove(movie.imdbID);
        } else {
            return this.add(movie);
        }
    }

    /**
     * Check if movie is in favorites
     */
    isFavorite(imdbID) {
        return this.favorites.some(m => m.imdbID === imdbID);
    }

    /**
     * Get all favorites
     */
    getAll() {
        return [...this.favorites];
    }

    /**
     * Get favorites count
     */
    count() {
        return this.favorites.length;
    }

    /**
     * Clear all favorites
     */
    clear() {
        this.favorites = [];
        this.save();
        eventBus.emit('favorites:cleared');
        logger.info('All favorites cleared');
    }

    /**
     * Search favorites
     */
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.favorites.filter(movie => 
            movie.Title.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get favorites by type
     */
    getByType(type) {
        return this.favorites.filter(movie => 
            movie.Type.toLowerCase() === type.toLowerCase()
        );
    }

    /**
     * Sort favorites
     */
    sort(sortBy = 'recent') {
        const sorted = [...this.favorites];

        switch (sortBy) {
            case 'title':
                return sorted.sort((a, b) => a.Title.localeCompare(b.Title));
            case 'year':
                return sorted.sort((a, b) => b.Year.localeCompare(a.Year));
            case 'recent':
            default:
                return sorted.sort((a, b) => b.addedAt - a.addedAt);
        }
    }
}

// Export singleton instance
export default new FavoritesManager();
