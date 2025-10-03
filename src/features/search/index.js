/**
 * Search Feature
 * Advanced search with debouncing and suggestions
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { debounce } from '../../shared/lib/debounce.js';
import { validators } from '../../shared/lib/validators.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('SearchFeature');
const eventBus = EventBus.getInstance();

export class SearchFeature {
    constructor(container) {
        this.container = container;
        this.searchInput = null;
        this.debouncedSearch = debounce((query) => {
            this.handleSearch(query);
        }, 500);
    }

    /**
     * Render search feature
     */
    async render() {
        this.container.innerHTML = this.getTemplate();
        this.cacheElements();
        this.attachEventListeners();
        logger.debug('Search feature rendered');
    }

    /**
     * Get HTML template
     */
    getTemplate() {
        return `
            <div class="search-feature">
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input 
                        type="text" 
                        class="search-input" 
                        id="search-input"
                        placeholder="Search for movies, series, episodes..."
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <button class="search-btn" id="search-btn">
                        <span>Search</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="clear-btn" id="clear-btn" aria-label="Clear search">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Search Suggestions (optional) -->
                <div class="search-suggestions" id="search-suggestions"></div>
            </div>
        `;
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.searchInput = dom.$('#search-input', this.container);
        this.searchBtn = dom.$('#search-btn', this.container);
        this.clearBtn = dom.$('#clear-btn', this.container);
        this.suggestions = dom.$('#search-suggestions', this.container);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Search button click
        this.searchBtn.addEventListener('click', () => {
            this.submitSearch();
        });

        // Enter key press
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitSearch();
            }
        });

        // Input change (debounced)
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Show/hide clear button
            if (query) {
                dom.show(this.clearBtn);
                this.debouncedSearch(query);
            } else {
                dom.hide(this.clearBtn);
                this.hideSuggestions();
            }
        });

        // Clear button
        this.clearBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        // Input focus effects
        this.searchInput.addEventListener('focus', () => {
            this.searchInput.parentElement.classList.add('focused');
        });

        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.searchInput.parentElement.classList.remove('focused');
                this.hideSuggestions();
            }, 200);
        });
    }

    /**
     * Submit search
     */
    submitSearch() {
        const query = this.searchInput.value.trim();

        if (!validators.isNotEmpty(query)) {
            this.showError('Please enter a search term');
            return;
        }

        if (!validators.lengthBetween(query, 2, 100)) {
            this.showError('Search term must be between 2 and 100 characters');
            return;
        }

        logger.info('Search submitted:', query);
        eventBus.emit('search:submit', { query });
        this.hideSuggestions();
    }

    /**
     * Handle search (debounced)
     */
    handleSearch(query) {
        logger.debug('Search query:', query);
        // Could show suggestions here
        // For now, just emit event
        eventBus.emit('search:change', { query });
    }

    /**
     * Clear search
     */
    clearSearch() {
        this.searchInput.value = '';
        this.searchInput.focus();
        dom.hide(this.clearBtn);
        this.hideSuggestions();
        eventBus.emit('search:clear');
    }

    /**
     * Show error
     */
    showError(message) {
        eventBus.emit('toast:show', {
            type: 'warning',
            message
        });
    }

    /**
     * Hide suggestions
     */
    hideSuggestions() {
        dom.hide(this.suggestions);
        this.suggestions.innerHTML = '';
    }
}
