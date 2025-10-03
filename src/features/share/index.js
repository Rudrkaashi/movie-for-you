/**
 * Share Feature
 * Handles movie sharing functionality
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';

const logger = new Logger('ShareFeature');
const eventBus = EventBus.getInstance();

export class ShareManager {
    constructor() {
        this.hasNativeShare = 'share' in navigator;
    }

    /**
     * Share movie
     */
    async share(movie) {
        const shareData = {
            title: movie.Title,
            text: `Check out ${movie.Title} (${movie.Year})`,
            url: this.getShareURL(movie)
        };

        if (this.hasNativeShare) {
            try {
                await navigator.share(shareData);
                logger.info('Movie shared:', movie.Title);
                eventBus.emit('share:success', { movie });
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    logger.warn('Native share failed:', error);
                }
            }
        }

        // Fallback to copy link
        return this.copyLink(shareData.url);
    }

    /**
     * Copy link to clipboard
     */
    async copyLink(url) {
        try {
            await navigator.clipboard.writeText(url);
            eventBus.emit('share:link-copied', { url });
            logger.info('Link copied to clipboard');
            return true;
        } catch (error) {
            logger.error('Copy failed:', error);
            eventBus.emit('share:error', { error });
            return false;
        }
    }

    /**
     * Get shareable URL
     */
    getShareURL(movie) {
        return `https://www.imdb.com/title/${movie.imdbID}/`;
    }

    /**
     * Share to specific platform
     */
    shareToSocial(movie, platform) {
        const url = this.getShareURL(movie);
        const text = `Check out ${movie.Title} (${movie.Year})`;
        
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
            logger.info(`Shared to ${platform}:`, movie.Title);
            eventBus.emit('share:social', { movie, platform });
        }
    }

    /**
     * Generate share image (for future implementation)
     */
    generateShareImage(movie) {
        // Could implement canvas-based image generation
        logger.info('Share image generation not yet implemented');
    }
}

export default new ShareManager();
