 /**
 * Application Bootstrap
 * Initializes all core services, widgets, and features
 */

import { EventBus } from './event-bus.js';
import { Logger } from './logger.js';
import { ThemeManager } from '../features/theme-toggle/theme-manager.js';
import { StorageManager } from '../shared/storage/local-storage.js';
import { APIClient } from '../shared/api/client.js';
import { ScrollToTop } from '../shared/components/scroll-top/index.js';
import { ToastSystem } from '../shared/components/toast/index.js';
import { Header } from '../widgets/header/index.js';
import { Footer } from '../widgets/footer/index.js';
import { HomePage } from '../pages/home/index.js';
import movieModal from '../widgets/movie-modal/index.js';

const logger = new Logger('Bootstrap');

export class AppBootstrap {
    constructor() {
        this.services = {};
        this.widgets = {};
        this.isInitialized = false;
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            logger.info('🚀 Initializing application services...');

            // Phase 1: Initialize core services
            await this.initCoreServices();

            // Phase 2: Initialize global widgets
            await this.initGlobalWidgets();

            // Phase 3: Initialize pages
            await this.initPages();

            // Phase 4: Setup global event listeners
            this.setupGlobalListeners();

            this.isInitialized = true;
            logger.success('✅ Application bootstrap complete');

        } catch (error) {
            logger.error('❌ Bootstrap failed:', error);
            throw error;
        }
    }

    /**
     * Initialize core services
     */
    async initCoreServices() {
        logger.info('Initializing core services...');

        // Event Bus - Global pub/sub system
        this.services.eventBus = EventBus.getInstance();
        logger.info('✓ Event Bus initialized');

        // Storage Manager - LocalStorage wrapper
        this.services.storage = new StorageManager();
        logger.info('✓ Storage Manager initialized');

        // Theme Manager - Dark/Light mode
        this.services.theme = ThemeManager.getInstance();
        this.services.theme.init();
        logger.info('✓ Theme Manager initialized');

        // API Client - OMDB API handler
        this.services.api = APIClient.getInstance();
        logger.info('✓ API Client initialized');

        // Scroll to Top Button
        this.services.scrollTop = new ScrollToTop();
        logger.info('✓ Scroll to Top initialized');

        // Toast Notification System
        this.services.toast = new ToastSystem();
        logger.info('✓ Toast System initialized');

        // Movie Modal (singleton - auto-initialized)
        this.services.movieModal = movieModal;
        logger.info('✓ Movie Modal initialized');

        logger.success('Core services ready');
    }

    /**
     * Initialize global widgets (Header, Footer)
     */
    async initGlobalWidgets() {
        logger.info('Initializing global widgets...');

        // Header Widget
        const headerRoot = document.getElementById('header-root');
        if (headerRoot) {
            this.widgets.header = new Header(headerRoot);
            await this.widgets.header.render();
            logger.info('✓ Header widget loaded');
        } else {
            logger.warn('Header root element not found');
        }

        // Footer Widget
        const footerRoot = document.getElementById('footer-root');
        if (footerRoot) {
            this.widgets.footer = new Footer(footerRoot);
            await this.widgets.footer.render();
            logger.info('✓ Footer widget loaded');
        } else {
            logger.warn('Footer root element not found');
        }

        logger.success('Global widgets ready');
    }

    /**
     * Initialize pages
     */
    async initPages() {
        logger.info('Initializing pages...');

        // Home Page
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            this.widgets.homePage = new HomePage(mainContent);
            await this.widgets.homePage.render();
            logger.info('✓ Home page loaded');
        } else {
            logger.warn('Main content element not found');
        }

        logger.success('Pages ready');
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        logger.info('Setting up global event listeners...');

        const eventBus = this.services.eventBus;

        // Online/Offline detection
        window.addEventListener('online', () => {
            logger.info('🌐 Connection restored');
            eventBus.emit('connection:online');
            this.services.toast.success('Connection restored');
        });

        window.addEventListener('offline', () => {
            logger.warn('🔌 Connection lost');
            eventBus.emit('connection:offline');
            this.services.toast.warning('No internet connection');
        });

        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                eventBus.emit('page:hidden');
                logger.debug('Page hidden');
            } else {
                eventBus.emit('page:visible');
                logger.debug('Page visible');
            }
        });

        // Before unload (optional - for cleanup)
        window.addEventListener('beforeunload', () => {
            logger.info('Application closing...');
            this.cleanup();
        });

        // Unhandled errors
        window.addEventListener('error', (event) => {
            logger.error('Unhandled error:', event.error);
            eventBus.emit('error:unhandled', { error: event.error });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            logger.error('Unhandled promise rejection:', event.reason);
            eventBus.emit('error:unhandled-promise', { reason: event.reason });
        });

        // Listen to API events for toasts
        eventBus.on('api:request:error', ({ error }) => {
            if (error && typeof error === 'string') {
                this.services.toast.error(error);
            }
        });

        // Listen to search events
        eventBus.on('search:submit', ({ query }) => {
            logger.info('Search initiated:', query);
        });

        // Listen to movie selection
        eventBus.on('movie:select', ({ movie }) => {
            logger.info('Movie selected:', movie.Title);
        });

        // Listen to favorite toggles
        eventBus.on('movie:favorite:toggle', ({ movie, isFavorite }) => {
            logger.info(`Movie ${isFavorite ? 'added to' : 'removed from'} favorites:`, movie.Title);
        });

        // Listen to theme changes
        eventBus.on('theme:changed', ({ theme }) => {
            logger.info('Theme changed to:', theme);
        });

        logger.success('Global event listeners attached');
    }

    /**
     * Cleanup resources before unload
     */
    cleanup() {
        try {
            // Clear API cache if needed
            if (this.services.api) {
                this.services.api.clearCache();
            }

            // Clear event bus
            if (this.services.eventBus) {
                this.services.eventBus.clear();
            }

            logger.info('Cleanup complete');
        } catch (error) {
            logger.error('Cleanup error:', error);
        }
    }

    /**
     * Get service instance by name
     * @param {string} name - Service name
     * @returns {*} Service instance
     */
    getService(name) {
        if (!this.services[name]) {
            logger.warn(`Service not found: ${name}`);
            return null;
        }
        return this.services[name];
    }

    /**
     * Get widget instance by name
     * @param {string} name - Widget name
     * @returns {*} Widget instance
     */
    getWidget(name) {
        if (!this.widgets[name]) {
            logger.warn(`Widget not found: ${name}`);
            return null;
        }
        return this.widgets[name];
    }

    /**
     * Check if application is initialized
     * @returns {boolean}
     */
    isReady() {
        return this.isInitialized;
    }

    /**
     * Get all services
     * @returns {Object}
     */
    getServices() {
        return this.services;
    }

    /**
     * Get all widgets
     * @returns {Object}
     */
    getWidgets() {
        return this.widgets;
    }
}

// Export for debugging (optional)
export default AppBootstrap;
