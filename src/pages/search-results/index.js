/**
 * Search Results Page
 * Dedicated page for search results
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { MoviesGrid } from '../../widgets/movies-grid/index.js';
import { FilterUI } from '../../features/filter/filter-ui.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('SearchResultsPage');
const eventBus = EventBus.getInstance();

export class SearchResultsPage {
    constructor(container) {
        this.container = container;
        this.searchQuery = '';
        this.moviesGrid = null;
        this.filterUI = null;
    }

    async render(query = '') {
        this.searchQuery = query;
        this.container.innerHTML = this.getTemplate();
        await this.initializeComponents();
        this.attachEventListeners();
        
        if (this.searchQuery) {
            await this.search(this.searchQuery);
        }
        
        logger.debug('Search results page rendered');
    }

    getTemplate() {
        return `
            <div class="search-results-page">
                <section class="results-header">
                    <div class="container">
                        <h1 class="results-title">Search Results</h1>
                        <p class="results-query" id="results-query">
                            ${this.searchQuery ? `for "${this.searchQuery}"` : ''}
                        </p>
                    </div>
                </section>

                <!-- Filter UI -->
                <div class="container">
                    <div id="filter-ui-container"></div>
                </div>

                <!-- Movies Grid -->
                <div id="movies-grid-container"></div>
            </div>
        `;
    }

    async initializeComponents() {
        // Filter UI
        const filterContainer = dom.$('#filter-ui-container', this.container);
        if (filterContainer) {
            this.filterUI = new FilterUI(filterContainer);
            this.filterUI.render();
        }

        // Movies Grid
        const gridContainer = dom.$('#movies-grid-container', this.container);
        if (gridContainer) {
            this.moviesGrid = new MoviesGrid(gridContainer);
            await this.moviesGrid.render();
        }
    }

    attachEventListeners() {
        // Listen to new searches
        eventBus.on('search:submit', async ({ query }) => {
            this.searchQuery = query;
            await this.search(query);
        });
    }

    async search(query) {
        if (this.moviesGrid) {
            await this.moviesGrid.searchMovies(query);
            
            const queryElement = dom.$('#results-query', this.container);
            if (queryElement) {
                queryElement.textContent = `for "${query}"`;
            }
        }
    }
}
