/**
 * Filter UI Component
 * Visual filter controls with advanced options
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import filterFeature from './index.js';

const logger = new Logger('FilterUI');
const eventBus = EventBus.getInstance();

export class FilterUI {
    constructor(container) {
        this.container = container;
        this.filterFeature = filterFeature;
    }

    render() {
        this.container.innerHTML = this.getTemplate();
        this.attachEventListeners();
        logger.debug('Filter UI rendered');
    }

    getTemplate() {
        return `
            <div class="filter-ui">
                <!-- Type Filters -->
                <div class="filter-group">
                    <label class="filter-group-label">
                        <i class="fas fa-filter"></i>
                        Type
                    </label>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">
                            <i class="fas fa-th"></i>
                            All
                        </button>
                        <button class="filter-btn" data-filter="movie">
                            <i class="fas fa-film"></i>
                            Movies
                        </button>
                        <button class="filter-btn" data-filter="series">
                            <i class="fas fa-tv"></i>
                            Series
                        </button>
                        <button class="filter-btn" data-filter="episode">
                            <i class="fas fa-play-circle"></i>
                            Episodes
                        </button>
                    </div>
                </div>

                <!-- Sort Options -->
                <div class="filter-group">
                    <label class="filter-group-label">
                        <i class="fas fa-sort"></i>
                        Sort By
                    </label>
                    <select class="sort-select" id="sort-select">
                        <option value="relevance">Relevance</option>
                        <option value="title">Title (A-Z)</option>
                        <option value="year">Year (Newest)</option>
                    </select>
                </div>

                <!-- Year Filter (Optional) -->
                <div class="filter-group">
                    <label class="filter-group-label">
                        <i class="fas fa-calendar"></i>
                        Year
                    </label>
                    <input type="number" 
                           class="year-input" 
                           id="year-input" 
                           placeholder="e.g., 2024"
                           min="1888"
                           max="${new Date().getFullYear() + 1}">
                </div>

                <!-- Clear Filters -->
                <button class="clear-filters-btn" id="clear-filters">
                    <i class="fas fa-times-circle"></i>
                    Clear All
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        // Type filter buttons
        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target.closest('.filter-btn'));
            });
        });

        // Sort select
        const sortSelect = this.container.querySelector('#sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filterFeature.setSort(e.target.value);
                eventBus.emit('filter:sort-changed', { sort: e.target.value });
            });
        }

        // Year input
        const yearInput = this.container.querySelector('#year-input');
        if (yearInput) {
            yearInput.addEventListener('change', (e) => {
                eventBus.emit('filter:year-changed', { year: e.target.value });
            });
        }

        // Clear filters
        const clearBtn = this.container.querySelector('#clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    handleFilterClick(btn) {
        const filter = btn.getAttribute('data-filter');
        
        // Update active state
        this.container.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // Update filter
        this.filterFeature.setFilter(filter);
    }

    clearFilters() {
        // Reset to defaults
        this.filterFeature.reset();
        
        // Reset UI
        const allBtn = this.container.querySelector('[data-filter="all"]');
        if (allBtn) allBtn.click();
        
        const sortSelect = this.container.querySelector('#sort-select');
        if (sortSelect) sortSelect.value = 'relevance';
        
        const yearInput = this.container.querySelector('#year-input');
        if (yearInput) yearInput.value = '';

        eventBus.emit('filter:cleared');
        logger.info('Filters cleared');
    }
}
