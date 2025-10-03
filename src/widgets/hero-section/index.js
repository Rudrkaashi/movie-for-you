/**
 * Hero Section Widget
 * Cinematic hero with animated background and search
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { SearchFeature } from '../../features/search/index.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('HeroSection');
const eventBus = EventBus.getInstance();

export class HeroSection {
    constructor(container) {
        this.container = container;
        this.searchFeature = null;
    }

    /**
     * Render hero section
     */
    async render() {
        this.container.innerHTML = this.getTemplate();
        await this.initializeSearch();
        this.initializeAnimations();
        logger.debug('Hero section rendered');
    }

    /**
     * Get HTML template
     */
    getTemplate() {
        return `
            <section class="hero-section">
                <!-- Animated Background -->
                <div class="hero-background">
                    <div class="hero-overlay"></div>
                    <div class="floating-particles">
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                    </div>
                </div>
                
                <!-- Hero Content -->
                <div class="hero-content container">
                    <!-- Title with Animation -->
                    <h1 class="hero-title animate-fade-in">
                        Discover Your Next
                        <span class="text-cinematic text-gradient">Favorite Movie</span>
                    </h1>
                    
                    <!-- Subtitle -->
                    <p class="hero-subtitle animate-fade-in">
                        Search millions of movies, explore details, and dive into the cinematic universe.
                        Your journey starts here.
                    </p>
                    
                    <!-- Search Container -->
                    <div class="hero-search-container animate-slide-up" id="hero-search"></div>
                    
                    <!-- Quick Stats -->
                    <div class="hero-stats animate-slide-up">
                        <div class="stat-item">
                            <i class="fas fa-film"></i>
                            <div class="stat-content">
                                <span class="stat-number" data-target="1000000">0</span>
                                <span class="stat-label">Movies</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-star"></i>
                            <div class="stat-content">
                                <span class="stat-number" data-target="500000">0</span>
                                <span class="stat-label">Reviews</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-users"></i>
                            <div class="stat-content">
                                <span class="stat-number" data-target="100000">0</span>
                                <span class="stat-label">Users</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Scroll Indicator -->
                <div class="scroll-indicator">
                    <div class="scroll-mouse">
                        <div class="scroll-wheel"></div>
                    </div>
                    <span>Scroll to explore</span>
                </div>
            </section>
        `;
    }

    /**
     * Initialize search feature
     */
    async initializeSearch() {
        const searchContainer = dom.$('#hero-search', this.container);
        if (searchContainer) {
            this.searchFeature = new SearchFeature(searchContainer);
            await this.searchFeature.render();
        }
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Animate stat numbers
        this.animateStats();
        
        // Floating particles animation
        this.animateParticles();
    }

    /**
     * Animate statistics counters
     */
    animateStats() {
        const statNumbers = dom.$$('.stat-number', this.container);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    /**
     * Count up animation
     */
    countUp(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target.toLocaleString() + '+';
            }
        };

        updateCount();
    }

    /**
     * Animate floating particles
     */
    animateParticles() {
        const particles = dom.$$('.particle', this.container);
        
        particles.forEach((particle, index) => {
            const duration = 15 + Math.random() * 10;
            const delay = index * 2;
            const size = 100 + Math.random() * 200;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
        });
    }
}
