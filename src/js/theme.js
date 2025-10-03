 /**
 * Theme Manager - Works without modules
 */

const ThemeManager = (() => {
    'use strict';
    
    // Private variables
    let instance = null;
    
    class ThemeManagerClass {
        constructor() {
            if (instance) {
                return instance;
            }
            
            this.themes = {
                DARK: 'dark',
                LIGHT: 'light'
            };
            
            this.body = document.body;
            this.themeToggle = null;
            this.observers = new Set();
            this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            instance = this;
        }
        
        init() {
            this.themeToggle = document.getElementById('themeToggle');
            
            if (!this.themeToggle) {
                console.error('Theme toggle button not found');
                return;
            }
            
            this.attachEventListeners();
            this.applyInitialTheme();
            this.watchSystemPreference();
        }
        
        getCurrentTheme() {
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme) {
                return savedTheme;
            }
            
            return this.prefersDarkScheme.matches 
                ? this.themes.DARK 
                : this.themes.LIGHT;
        }
        
        applyInitialTheme() {
            const currentTheme = this.getCurrentTheme();
            this.setTheme(currentTheme, false);
        }
        
        setTheme(theme, animate = true) {
            const oldTheme = this.body.getAttribute('data-theme');
            
            if (oldTheme === theme) return;
            
            if (animate) {
                this.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            }
            
            this.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            this.updateThemeIcon(theme);
            this.notifyObservers(theme, oldTheme);
            
            if (animate) {
                setTimeout(() => {
                    this.body.style.transition = '';
                }, 300);
            }
        }
        
        toggleTheme() {
            const currentTheme = this.body.getAttribute('data-theme');
            const newTheme = currentTheme === this.themes.DARK 
                ? this.themes.LIGHT 
                : this.themes.DARK;
            
            this.setTheme(newTheme);
        }
        
        updateThemeIcon(theme) {
            const sunIcon = this.themeToggle.querySelector('.sun-icon');
            const moonIcon = this.themeToggle.querySelector('.moon-icon');
            
            if (!sunIcon || !moonIcon) return;
            
            const isDark = theme === this.themes.DARK;
            
            requestAnimationFrame(() => {
                sunIcon.style.cssText = isDark 
                    ? 'opacity: 1; transform: rotate(0deg);' 
                    : 'opacity: 0; transform: rotate(-180deg);';
                
                moonIcon.style.cssText = isDark 
                    ? 'opacity: 0; transform: rotate(180deg);' 
                    : 'opacity: 1; transform: rotate(0deg);';
            });
        }
        
        watchSystemPreference() {
            this.prefersDarkScheme.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    const systemTheme = e.matches ? this.themes.DARK : this.themes.LIGHT;
                    this.setTheme(systemTheme);
                }
            });
        }
        
        attachEventListeners() {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            
            this.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
        
        subscribe(callback) {
            if (typeof callback === 'function') {
                this.observers.add(callback);
            }
        }
        
        unsubscribe(callback) {
            this.observers.delete(callback);
        }
        
        notifyObservers(newTheme, oldTheme) {
            this.observers.forEach(callback => {
                try {
                    callback({ newTheme, oldTheme });
                } catch (error) {
                    console.error('Error in theme observer:', error);
                }
            });
        }
        
        getActiveTheme() {
            return this.body.getAttribute('data-theme');
        }
    }
    
    // Return singleton instance
    return new ThemeManagerClass();
})();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ThemeManager.init();
    });
} else {
    ThemeManager.init();
}
