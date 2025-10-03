/**
 * Intersection Observer Wrapper
 * For lazy loading and scroll animations
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('IntersectionObserver');

export class LazyLoader {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1,
            ...options
        };

        this.observer = null;
        this.elements = new Set();
        this.init();
    }

    /**
     * Initialize observer
     */
    init() {
        if (!('IntersectionObserver' in window)) {
            logger.warn('IntersectionObserver not supported');
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleIntersection(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.options);

        logger.debug('Intersection observer initialized');
    }

    /**
     * Handle intersection
     */
    handleIntersection(element) {
        // Add visible class
        element.classList.add('visible');

        // Load images
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }

        // Execute callback if exists
        if (element.dataset.callback) {
            const callback = window[element.dataset.callback];
            if (typeof callback === 'function') {
                callback(element);
            }
        }

        this.elements.delete(element);
    }

    /**
     * Observe element
     */
    observe(element) {
        if (!this.observer || !element) return;
        
        this.observer.observe(element);
        this.elements.add(element);
    }

    /**
     * Observe multiple elements
     */
    observeAll(elements) {
        elements.forEach(el => this.observe(el));
    }

    /**
     * Unobserve element
     */
    unobserve(element) {
        if (!this.observer || !element) return;
        
        this.observer.unobserve(element);
        this.elements.delete(element);
    }

    /**
     * Disconnect observer
     */
    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
            this.elements.clear();
            logger.debug('Intersection observer disconnected');
        }
    }
}
