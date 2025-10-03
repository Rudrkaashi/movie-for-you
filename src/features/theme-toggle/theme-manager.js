/**
 * Theme Manager
 * Handles dark/light theme switching with smooth transitions
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { StorageManager } from '../../shared/storage/local-storage.js';

const logger = new Logger('ThemeManager');
const eventBus = EventBus.getInstance();
const storage = new StorageManager();

export class ThemeManager {
    static instance = null;

    constructor() {
        if (ThemeManager.instance) {
            return ThemeManager.instance;
        }

        this.themes = {
            DARK: 'dark',
            LIGHT: 'light'
        };

        this.currentTheme = null;
        this.body = document.body;
        this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        ThemeManager.instance = this;
    }

    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    /**
     * Initialize theme manager
     */
    init() {
        logger.info('Initializing theme manager...');
        
        // Apply saved or system theme
        const savedTheme = storage.get('theme');
        const theme = savedTheme || (this.prefersDarkScheme.matches ? this.themes.DARK : this.themes.LIGHT);
        
        this.setTheme(theme, false);
        this.watchSystemPreference();
        
        logger.success('Theme manager initialized');
    }

    /**
     * Set theme
     */
    setTheme(theme, animate = true) {
        if (!Object.values(this.themes).includes(theme)) {
            logger.error(`Invalid theme: ${theme}`);
            return;
        }

        const oldTheme = this.currentTheme;

        // Add transition class
        if (animate) {
            this.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        }

        // Apply theme
        this.body.setAttribute('data-theme', theme);
        this.currentTheme = theme;

        // Save to storage
        storage.set('theme', theme);

        // Emit event
        eventBus.emit('theme:changed', { theme, oldTheme });

        // Remove transition after animation
        if (animate) {
            setTimeout(() => {
                this.body.style.transition = '';
            }, 300);
        }

        logger.info(`Theme changed to: ${theme}`);
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === this.themes.DARK 
            ? this.themes.LIGHT 
            : this.themes.DARK;
        
        this.setTheme(newTheme);
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Watch for system preference changes
     */
    watchSystemPreference() {
        this.prefersDarkScheme.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set preference
            if (!storage.has('theme')) {
                const systemTheme = e.matches ? this.themes.DARK : this.themes.LIGHT;
                this.setTheme(systemTheme);
            }
        });
    }
}
