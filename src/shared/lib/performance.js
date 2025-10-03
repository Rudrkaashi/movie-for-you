/**
 * Performance Utilities
 * Measure and optimize application performance
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('Performance');

export const performance = {
    /**
     * Measure function execution time
     */
    async measure(name, fn) {
        const start = Date.now();
        const result = await fn();
        const duration = Date.now() - start;
        
        logger.debug(`⏱️ ${name}: ${duration}ms`);
        
        return { result, duration };
    },

    /**
     * Create performance mark
     */
    mark(name) {
        if (window.performance && window.performance.mark) {
            window.performance.mark(name);
        }
    },

    /**
     * Measure between two marks
     */
    measureBetween(name, startMark, endMark) {
        if (window.performance && window.performance.measure) {
            try {
                window.performance.measure(name, startMark, endMark);
                const measure = window.performance.getEntriesByName(name)[0];
                logger.debug(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
                return measure.duration;
            } catch (error) {
                logger.warn('Performance measure failed:', error);
            }
        }
        return null;
    },

    /**
     * Get navigation timing
     */
    getNavigationTiming() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                responseTime: timing.responseEnd - timing.requestStart
            };
        }
        return null;
    },

    /**
     * Log performance metrics
     */
    logMetrics() {
        const timing = this.getNavigationTiming();
        if (timing) {
            logger.info('📊 Performance Metrics:', timing);
        }
    },

    /**
     * Optimize images (lazy loading)
     */
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
};

export default performance;
