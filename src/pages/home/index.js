/**
 * Home Page
 * Main landing page with hero section and search
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { HeroSection } from '../../widgets/hero-section/index.js';
import { MoviesGrid } from '../../widgets/movies-grid/index.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('HomePage');
const eventBus = EventBus.getInstance();

export class HomePage {
    constructor(container) {
        this.container = container;
        this.heroSection = null;
        this.moviesGrid = null;
    }

    /**
     * Render home page
     */
    async render() {
        logger.info('Rendering home page...');
        
        // Create page structure
        this.container.innerHTML = this.getTemplate();
        
        // Initialize widgets
        await this.initializeWidgets();
        
        // Setup event listeners
        this.setupEventListeners();
        
        logger.success('Home page rendered');
    }

    /**
     * Get HTML template
     */
    getTemplate() {
        return `
            <div class="home-page" id="home">
                <!-- Hero Section Container -->
                <div id="hero-section"></div>
                
                <!-- Movies Grid Section Container -->
                <div id="movies-grid-section"></div>
            </div>
        `;
    }

    /**
     * Initialize widgets
     */
    async initializeWidgets() {
        // Hero Section
        const heroContainer = dom.$('#hero-section', this.container);
        if (heroContainer) {
            this.heroSection = new HeroSection(heroContainer);
            await this.heroSection.render();
        }

        // Movies Grid
        const gridContainer = dom.$('#movies-grid-section', this.container);
        if (gridContainer) {
            this.moviesGrid = new MoviesGrid(gridContainer);
            await this.moviesGrid.render();
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for search events
        eventBus.on('search:submit', async ({ query }) => {
            logger.info('Search submitted:', query);
            await this.moviesGrid.searchMovies(query);
        });

        // Listen for filter events
        eventBus.on('filter:change', ({ filter }) => {
            logger.info('Filter changed:', filter);
            this.moviesGrid.filterMovies(filter);
        });
    }
}
