/**
 * Movie Card Component
 * Individual movie card with poster, info, and interactions
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { sanitize } from '../../shared/lib/sanitizers.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('MovieCard');
const eventBus = EventBus.getInstance();

export class MovieCard {
    constructor(movie) {
        this.movie = movie;
    }

    /**
     * Render movie card
     */
    render() {
        const card = this.createCardElement();
        this.attachEventListeners(card);
        return card;
    }

    /**
     * Create card element
     */
    createCardElement() {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-imdb-id', this.movie.imdbID);
        
        card.innerHTML = `
            <div class="movie-card-inner">
                <!-- Poster -->
                <div class="movie-poster">
                    ${this.renderPoster()}
                    <div class="movie-overlay">
                        <button class="play-btn" aria-label="View details">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    ${this.renderBadges()}
                </div>
                
                <!-- Movie Info -->
                <div class="movie-info">
                    <h3 class="movie-title" title="${sanitize.html(this.movie.Title)}">
                        ${sanitize.html(this.movie.Title)}
                    </h3>
                    
                    <div class="movie-meta">
                        <span class="movie-year">
                            <i class="fas fa-calendar"></i>
                            ${this.movie.Year}
                        </span>
                        <span class="movie-type ${this.movie.Type}">
                            ${this.getTypeIcon()}
                            ${this.movie.Type}
                        </span>
                    </div>
                    
                    <!-- Actions -->
                    <div class="movie-actions">
                        <button class="action-btn favorite-btn" data-action="favorite" aria-label="Add to favorites">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="action-btn share-btn" data-action="share" aria-label="Share movie">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    /**
     * Render poster image
     */
    renderPoster() {
        const posterUrl = this.movie.Poster !== 'N/A' 
            ? this.movie.Poster 
            : this.getPlaceholderPoster();
        
        return `
            <img 
                src="${posterUrl}" 
                alt="${sanitize.html(this.movie.Title)}"
                class="poster-img"
                loading="lazy"
                onerror="this.src='${this.getPlaceholderPoster()}'"
            >
        `;
    }

    /**
     * Get placeholder poster
     */
   getPlaceholderPoster() {
    return './assets/media/images/placeholder.jpg';
}

    /**
     * Render badges
     */
    renderBadges() {
        return `
            <div class="movie-badges">
                <span class="badge year-badge">${this.movie.Year}</span>
            </div>
        `;
    }

    /**
     * Get type icon
     */
    getTypeIcon() {
        const icons = {
            movie: '<i class="fas fa-film"></i>',
            series: '<i class="fas fa-tv"></i>',
            episode: '<i class="fas fa-play-circle"></i>'
        };
        return icons[this.movie.Type.toLowerCase()] || icons.movie;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners(card) {
        // Card click - view details
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking action buttons
            if (e.target.closest('.action-btn')) return;
            
            this.handleCardClick();
        });

        // Favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleFavorite(favoriteBtn);
            });
        }

        // Share button
        const shareBtn = card.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleShare();
            });
        }

        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
    }

    /**
     * Handle card click
     */
    handleCardClick() {
        logger.info('Movie card clicked:', this.movie.Title);
        eventBus.emit('movie:select', { movie: this.movie });
    }

    /**
     * Handle favorite
     */
    handleFavorite(btn) {
        const icon = btn.querySelector('i');
        const isFavorite = icon.classList.contains('fas');
        
        if (isFavorite) {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.showToast('Removed from favorites', 'info');
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#ef4444';
            this.showToast('Added to favorites', 'success');
        }
        
        eventBus.emit('movie:favorite:toggle', { 
            movie: this.movie, 
            isFavorite: !isFavorite 
        });
    }

    /**
     * Handle share
     */
    handleShare() {
        if (navigator.share) {
            navigator.share({
                title: this.movie.Title,
                text: `Check out ${this.movie.Title} (${this.movie.Year})`,
                url: `https://www.imdb.com/title/${this.movie.imdbID}/`
            }).catch(err => logger.warn('Share failed:', err));
        } else {
            this.copyToClipboard(`https://www.imdb.com/title/${this.movie.imdbID}/`);
        }
        
        eventBus.emit('movie:share', { movie: this.movie });
    }

    /**
     * Copy to clipboard
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Link copied to clipboard!', 'success');
        }).catch(err => {
            logger.error('Copy failed:', err);
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        eventBus.emit('toast:show', { message, type });
    }
}
