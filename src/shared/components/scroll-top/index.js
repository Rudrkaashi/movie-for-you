/**
 * Scroll to Top Button
 * Shows a button to quickly scroll to page top
 */

import { Logger } from '../../../core/logger.js';
import { throttle } from '../../lib/throttle.js';
import { dom } from '../../lib/dom-utils.js';

const logger = new Logger('ScrollTop');

export class ScrollToTop {
    constructor() {
        this.button = null;
        this.threshold = 300;
        this.init();
    }

    /**
     * Initialize scroll to top button
     */
    init() {
        this.createButton();
        this.attachEventListeners();
        logger.debug('Scroll to top initialized');
    }

    /**
     * Create button element
     */
    createButton() {
        const buttonHTML = `
            <button class="scroll-top-btn" id="scroll-top-btn" aria-label="Scroll to top">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', buttonHTML);
        this.button = dom.$('#scroll-top-btn');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Scroll event (throttled)
        const handleScroll = throttle(() => {
            this.updateVisibility();
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Click event
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    /**
     * Update button visibility based on scroll position
     */
    updateVisibility() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollY > this.threshold) {
            dom.addClass(this.button, 'visible');
        } else {
            dom.removeClass(this.button, 'visible');
        }
    }

    /**
     * Scroll to top with smooth animation
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        logger.debug('Scrolling to top');
    }
}
