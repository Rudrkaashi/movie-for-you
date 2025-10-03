/**
 * Header Widget
 * Main navigation header with theme toggle and mobile menu
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { ThemeManager } from '../../features/theme-toggle/theme-manager.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('Header');
const eventBus = EventBus.getInstance();

export class Header {
    constructor(container) {
        this.container = container;
        this.themeManager = ThemeManager.getInstance();
        this.isMenuOpen = false;
    }

    /**
     * Render header
     */
    async render() {
        this.container.innerHTML = this.getTemplate();
        this.attachEventListeners();
        this.setupScrollEffect();
        logger.debug('Header rendered');
    }

    /**
     * Get HTML template
     */
    getTemplate() {
        return `
            <header class="header" id="main-header">
                <nav class="nav-container container">
                    <!-- Logo -->
<div class="logo">
    <img src="./assets/media/images/logo.svg" alt="Movies-For-You Logo" class="logo-image">
    <span class="logo-text">
        Movies<span class="text-gradient">ForYou</span>
    </span>
</div>

                    
                    <!-- Navigation Links -->
                    <ul class="nav-menu" id="nav-menu">
                        <li class="nav-item">
                            <a href="#home" class="nav-link active" data-link="home">
                                <i class="fas fa-home"></i>
                                <span>Home</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#trending" class="nav-link" data-link="trending">
                                <i class="fas fa-fire"></i>
                                <span>Trending</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#favorites" class="nav-link" data-link="favorites">
                                <i class="fas fa-heart"></i>
                                <span>Favorites</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#about" class="nav-link" data-link="about">
                                <i class="fas fa-info-circle"></i>
                                <span>About</span>
                            </a>
                        </li>
                    </ul>
                    
                    <!-- Actions -->
                    <div class="nav-actions">
                        <!-- Theme Toggle -->
                        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                            <i class="fas fa-sun sun-icon"></i>
                            <i class="fas fa-moon moon-icon"></i>
                        </button>
                        
                        <!-- Mobile Menu Toggle -->
                        <button class="hamburger" id="hamburger" aria-label="Toggle menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </nav>
            </header>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Theme toggle
        const themeToggle = dom.$('#theme-toggle', this.container);
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.themeManager.toggleTheme();
            });
        }

        // Mobile menu toggle
        const hamburger = dom.$('#hamburger', this.container);
        const navMenu = dom.$('#nav-menu', this.container);
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Navigation links
        const navLinks = dom.$$('.nav-link', this.container);
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavClick(link);
            });
        });

        // Listen to theme changes
        eventBus.on('theme:changed', ({ theme }) => {
            this.updateThemeIcon(theme);
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const hamburger = dom.$('#hamburger', this.container);
        const navMenu = dom.$('#nav-menu', this.container);
        
        this.isMenuOpen = !this.isMenuOpen;
        
        dom.toggleClass(hamburger, 'active');
        dom.toggleClass(navMenu, 'active');
        
        // Prevent body scroll when menu is open
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle navigation link click
     */
    handleNavClick(link) {
        const section = link.getAttribute('data-link');
        
        // Update active state
        const navLinks = dom.$$('.nav-link', this.container);
        navLinks.forEach(l => dom.removeClass(l, 'active'));
        dom.addClass(link, 'active');
        
        // Close mobile menu
        if (this.isMenuOpen) {
            this.toggleMobileMenu();
        }
        
        // Emit navigation event
        eventBus.emit('navigation:change', { section });
        
        // Smooth scroll to section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Setup scroll effect
     */
    setupScrollEffect() {
        const header = dom.$('#main-header', this.container);
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                dom.addClass(header, 'scrolled');
            } else {
                dom.removeClass(header, 'scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Update theme icon
     */
    updateThemeIcon(theme) {
        const sunIcon = dom.$('.sun-icon', this.container);
        const moonIcon = dom.$('.moon-icon', this.container);
        
        if (theme === 'dark') {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'rotate(0deg)';
            moonIcon.style.opacity = '0';
            moonIcon.style.transform = 'rotate(180deg)';
        } else {
            sunIcon.style.opacity = '0';
            sunIcon.style.transform = 'rotate(-180deg)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'rotate(0deg)';
        }
    }
}
