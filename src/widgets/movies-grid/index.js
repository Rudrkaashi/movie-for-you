/**
 * Movies Grid Widget
 * Displays movie search results in a responsive grid
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { APIClient } from '../../shared/api/client.js';
import { MovieCard } from '../../entities/movie/movie-card.js';
import { LazyLoader } from '../../shared/observers/intersection-observer.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('MoviesGrid');
const eventBus = EventBus.getInstance();

export class MoviesGrid {
    constructor(container) {
        this.container = container;
        this.api = APIClient.getInstance();
        this.movies = [];
        this.filteredMovies = [];
        this.currentFilter = 'all';
        this.lazyLoader = new LazyLoader();
        this.isLoading = false;
    }

    /**
     * Render movies grid
     */
    async render() {
        this.container.innerHTML = this.getTemplate();
        this.cacheElements();
        this.attachEventListeners();
        logger.debug('Movies grid rendered');
    }

    /**
     * Get HTML template
     */
    getTemplate() {
        return `
            <section class="movies-section" id="movies-section" style="display: none;">
                <div class="container">
                    <!-- Section Header -->
                    <div class="section-header">
                        <h2 class="section-title">Search Results</h2>
                        <p class="results-count" id="results-count"></p>
                    </div>
                    
                    <!-- Filter Controls -->
                    <div class="filter-controls" id="filter-controls">
                        <button class="filter-btn active" data-filter="all">
                            <i class="fas fa-th"></i>
                            <span>All</span>
                        </button>
                        <button class="filter-btn" data-filter="movie">
                            <i class="fas fa-film"></i>
                            <span>Movies</span>
                        </button>
                        <button class="filter-btn" data-filter="series">
                            <i class="fas fa-tv"></i>
                            <span>Series</span>
                        </button>
                        <button class="filter-btn" data-filter="episode">
                            <i class="fas fa-play-circle"></i>
                            <span>Episodes</span>
                        </button>
                    </div>
                    
                    <!-- Movies Grid -->
                    <div class="movies-grid" id="movies-grid">
                        <!-- Movie cards will be inserted here -->
                    </div>
                    
                    <!-- Loading Spinner -->
                    <div class="grid-loading" id="grid-loading">
                        <div class="spinner">
                            <i class="fas fa-film"></i>
                        </div>
                        <p>Loading movies...</p>
                    </div>
                    
                    <!-- No Results -->
                    <div class="no-results" id="no-results">
                        <i class="fas fa-film-slash"></i>
                        <h3>No Movies Found</h3>
                        <p>Try searching with different keywords or filters</p>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.section = dom.$('#movies-section', this.container);
        this.grid = dom.$('#movies-grid', this.container);
        this.loading = dom.$('#grid-loading', this.container);
        this.noResults = dom.$('#no-results', this.container);
        this.resultsCount = dom.$('#results-count', this.container);
        this.filterBtns = dom.$$('.filter-btn', this.container);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.setActiveFilter(btn);
                this.filterMovies(filter);
            });
        });
    }

    /**
     * Search movies
     */
    async searchMovies(query) {
        if (this.isLoading) {
            logger.warn('Search already in progress');
            return;
        }

        logger.info('Searching movies:', query);
        
        this.showLoading();
        this.hideNoResults();
        this.clearGrid();
        
        try {
            this.isLoading = true;
            const result = await this.api.searchMovies(query);
            
            if (result.success && result.movies.length > 0) {
                this.movies = result.movies;
                this.filteredMovies = result.movies;
                this.displayMovies(result.movies);
                this.updateResultsCount(result.totalResults);
                this.showSection();
            } else {
                this.showNoResults(result.error || 'No movies found');
            }
        } catch (error) {
            logger.error('Search error:', error);
            this.showNoResults('An error occurred. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    /**
     * Display movies in grid
     */
    displayMovies(movies) {
        this.clearGrid();
        
        if (movies.length === 0) {
            this.showNoResults('No movies match your filters');
            return;
        }

        const fragment = document.createDocumentFragment();
        
        movies.forEach((movie, index) => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'movie-card-container';
            cardContainer.style.animationDelay = `${index * 0.05}s`;
            
            const card = new MovieCard(movie);
            const cardElement = card.render();
            
            cardContainer.appendChild(cardElement);
            fragment.appendChild(cardContainer);
            
            // Lazy load animation
            this.lazyLoader.observe(cardContainer);
        });
        
        this.grid.appendChild(fragment);
        this.hideNoResults();
    }

    /**
     * Filter movies
     */
    filterMovies(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredMovies = this.movies;
        } else {
            this.filteredMovies = this.movies.filter(movie => 
                movie.Type.toLowerCase() === filter.toLowerCase()
            );
        }
        
        this.displayMovies(this.filteredMovies);
        this.updateResultsCount(this.filteredMovies.length);
        
        eventBus.emit('filter:applied', { filter, count: this.filteredMovies.length });
    }

    /**
     * Set active filter button
     */
    setActiveFilter(activeBtn) {
        this.filterBtns.forEach(btn => {
            dom.removeClass(btn, 'active');
        });
        dom.addClass(activeBtn, 'active');
    }

    /**
     * Update results count
     */
    updateResultsCount(count) {
        if (this.resultsCount) {
            const text = count === 1 ? 'result' : 'results';
            this.resultsCount.textContent = `Found ${count.toLocaleString()} ${text}`;
        }
    }

    /**
     * Show/Hide methods
     */
    showSection() {
        this.section.style.display = 'block';
        this.section.classList.add('animate-fade-in');
    }

    showLoading() {
        dom.show(this.loading);
    }

    hideLoading() {
        dom.hide(this.loading);
    }

    showNoResults(message) {
        const noResultsMsg = this.noResults.querySelector('p');
        if (noResultsMsg && message) {
            noResultsMsg.textContent = message;
        }
        dom.show(this.noResults);
    }

    hideNoResults() {
        dom.hide(this.noResults);
    }

    clearGrid() {
        dom.empty(this.grid);
    }
}
