/**
 * Movie Entity Module
 * Central exports for movie-related components and utilities
 */

// Components
export { MovieCard } from './movie-card.js';

// Movie data structure/schema
export const MovieSchema = {
    imdbID: String,
    Title: String,
    Year: String,
    Type: String,
    Poster: String,
    Plot: String,
    Director: String,
    Actors: String,
    Genre: String,
    Runtime: String,
    imdbRating: String,
    Ratings: Array,
    Released: String,
    Language: String,
    Country: String,
    Awards: String,
    BoxOffice: String,
    Production: String,
    Writer: String,
    Metascore: String,
    imdbVotes: String,
    Rated: String
};

// Movie type constants
export const MovieTypes = {
    MOVIE: 'movie',
    SERIES: 'series',
    EPISODE: 'episode'
};

// Movie helpers
export const MovieHelpers = {
    /**
     * Check if movie has valid poster
     */
    hasPoster(movie) {
        return movie.Poster && movie.Poster !== 'N/A';
    },

    /**
     * Get movie display title
     */
    getDisplayTitle(movie) {
        return `${movie.Title} (${movie.Year})`;
    },

    /**
     * Check if movie is a series
     */
    isSeries(movie) {
        return movie.Type === MovieTypes.SERIES;
    },

    /**
     * Check if movie is an episode
     */
    isEpisode(movie) {
        return movie.Type === MovieTypes.EPISODE;
    },

    /**
     * Get IMDb URL
     */
    getIMDbURL(movie) {
        return `https://www.imdb.com/title/${movie.imdbID}/`;
    },

    /**
     * Format runtime
     */
    formatRuntime(runtime) {
        if (!runtime || runtime === 'N/A') return 'N/A';
        
        const minutes = parseInt(runtime);
        if (isNaN(minutes)) return runtime;
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        
        return `${hours}h ${mins}m`;
    },

    /**
     * Get rating color
     */
    getRatingColor(rating) {
        const numRating = parseFloat(rating);
        if (isNaN(numRating)) return '#6B8E23';
        
        if (numRating >= 8) return '#22c55e'; // Green
        if (numRating >= 6) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    },

    /**
     * Validate movie object
     */
    isValid(movie) {
        return movie && movie.imdbID && movie.Title;
    }
};

// Export all
export default {
    MovieCard,
    MovieSchema,
    MovieTypes,
    MovieHelpers
};
