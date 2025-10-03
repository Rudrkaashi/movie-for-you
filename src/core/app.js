/**
 * Application Class
 * Main application orchestrator
 */

import { Logger } from './logger.js';
import { AppBootstrap } from './bootstrap.js';

const logger = new Logger('App');

export class App {
    constructor() {
        this.bootstrap = null;
        this.isInitialized = false;
        this.startTime = Date.now();
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            logger.info('🎬 Initializing Movies-For-You...');
            
            this.bootstrap = new AppBootstrap();
            await this.bootstrap.init();
            
            this.isInitialized = true;
            
            const loadTime = Date.now() - this.startTime;
            logger.success(`✨ App initialized in ${loadTime}ms`);
            
            return true;
        } catch (error) {
            logger.error('❌ App initialization failed:', error);
            throw error;
        }
    }

    /**
     * Get service
     */
    getService(name) {
        return this.bootstrap?.getService(name);
    }

    /**
     * Get widget
     */
    getWidget(name) {
        return this.bootstrap?.getWidget(name);
    }

    /**
     * Check if ready
     */
    isReady() {
        return this.isInitialized;
    }

    /**
     * Restart application
     */
    async restart() {
        logger.info('Restarting application...');
        window.location.reload();
    }

    /**
     * Get app info
     */
    getInfo() {
        return {
            name: 'Movies-For-You',
            version: '1.0.0',
            initialized: this.isInitialized,
            loadTime: Date.now() - this.startTime
        };
    }
}

export default App;
