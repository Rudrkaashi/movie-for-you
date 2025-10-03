/**
 * Favorites Page
 * Displays user's favorite movies
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import favoritesManager from '../../features/favorites/index.js';
import { MovieCard } from '../../entities/movie/movie-card.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('FavoritesPage');
const eventBus = EventBus.getInstance();

export class FavoritesPage {
    constructor(container) {
        this.container = container;
        this.favorites = [];
    }

    /**
     * Render favorites page
     */
    async render() {
        this.container.innerHTML = this.getTemplate();
        this.loadFavorites();
        this.attachEventListeners();
        logger.debug('Favorites page rendered');
    }

    /**
     * Get HTML template
     */
    getTemplate() {
        return `
            <div class="favorites-page">
                <section class="page-header">
                    <div class="container">
                        <h1 class="page-title">
                            <i class="fas fa-heart"></i>
                            My Favorites
                        </h1>
                        <p class="page-subtitle" id="favorites-count">
                            You have 0 favorite movies
                        </p>
                    </div>
                </section>

                <section class="favorites-section">
                    <div class="container">
                        <div class="favorites-grid" id="favorites-grid">
                            <!-- Favorite movies will be displayed here -->
                        </div>

                        <div class="empty-favorites" id="empty-favorites">
                            <i class="fas fa-heart-broken"></i>
                            <h3>No Favorites Yet</h3>
                            <p>Start adding movies to your favorites!</p>
                            <button class="action-button primary" id="browse-movies">
                                <i class="fas fa-search"></i>
                                Browse Movies
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    /**
     * Load favorites
     */
    loadFavorites() {
        this.favorites = favoritesManager.getAll();
        this.displayFavorites();
    }

    /**
     * Display favorites
     */
    displayFavorites() {
        const grid = dom.$('#favorites-grid', this.container);
        const empty = dom.$('#empty-favorites', this.container);
        const count = dom.$('#favorites-count', this.container);

        if (this.favorites.length === 0) {
            dom.hide(grid);
            dom.show(empty);
            count.textContent = 'You have no favorite movies';
            return;
        }

        dom.show(grid);
        dom.hide(empty);
        count.textContent = `You have ${this.favorites.length} favorite ${this.favorites.length === 1 ? 'movie' : 'movies'}`;

        grid.innerHTML = '';
        const fragment = document.createDocumentFragment();

        this.favorites.forEach((movie, index) => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'movie-card-container';
            cardContainer.style.animationDelay = `${index * 0.05}s`;

            const card = new MovieCard(movie);
            const cardElement = card.render();

            cardContainer.appendChild(cardElement);
            fragment.appendChild(cardContainer);
        });

        grid.appendChild(fragment);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Browse movies button
        const browseBtn = dom.$('#browse-movies', this.container);
        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                eventBus.emit('navigation:change', { section: 'home' });
            });
        }

        // Listen to favorites changes
        eventBus.on('favorites:added', () => this.loadFavorites());
        eventBus.on('favorites:removed', () => this.loadFavorites());
        eventBus.on('favorites:cleared', () => this.loadFavorites());
    }
}
