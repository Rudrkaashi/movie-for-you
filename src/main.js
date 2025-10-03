 /**
 * Movies-For-You - Main Entry Point
 * Advanced modular architecture with cinematic experience
 */

// Import core initialization
import { AppBootstrap } from './core/bootstrap.js';
import { Logger } from './core/logger.js';

// Import shared utilities
import { dom } from './shared/lib/dom-utils.js';

// Initialize logger
const logger = new Logger('MainApp');

/**
 * Application Entry Point
 */
class MoviesForYou {
    constructor() {
        this.isInitialized = false;
        this.bootstrap = null;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            logger.info('🎬 Starting Movies-For-You...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize bootstrap
            this.bootstrap = new AppBootstrap();
            await this.bootstrap.init();
            
            // Hide loading screen with animation
            await this.hideLoadingScreen();
            
            this.isInitialized = true;
            logger.success('✨ Movies-For-You initialized successfully!');
            
        } catch (error) {
            logger.error('❌ Failed to initialize application:', error);
            this.showErrorScreen(error);
        }
    }

    /**
     * Wait for DOM to be fully loaded
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Hide loading screen with animation
     */
    hideLoadingScreen() {
        return new Promise((resolve) => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                // Delay to show loading animation
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    setTimeout(resolve, 500); // Wait for fade out
                }, 1000);
            } else {
                resolve();
            }
        });
    }

    /**
     * Show error screen if initialization fails
     */
    showErrorScreen(error) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; 
                            min-height: 100vh; text-align: center; padding: 2rem;">
                    <div>
                        <i class="fas fa-exclamation-triangle" 
                           style="font-size: 4rem; color: #ef4444; margin-bottom: 1rem;"></i>
                        <h1 style="font-size: 2rem; margin-bottom: 1rem;">
                            Something went wrong
                        </h1>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                            ${error.message || 'Failed to load the application'}
                        </p>
                        <button onclick="location.reload()" 
                                style="padding: 1rem 2rem; background: var(--accent-primary); 
                                       color: white; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                            Reload Page
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Create and initialize app instance
const app = new MoviesForYou();
app.init();

// Export for debugging
window.__MOVIES_APP__ = app;
