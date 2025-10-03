/**
 * Movie Details Modal
 * Shows complete movie information in a cinematic modal
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import { APIClient } from '../../shared/api/client.js';
import { sanitize } from '../../shared/lib/sanitizers.js';
import { formatters } from '../../shared/lib/formatters.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('MovieModal');
const eventBus = EventBus.getInstance();

export class MovieModal {
    constructor() {
        this.api = APIClient.getInstance();
        this.modal = null;
        this.currentMovie = null;
        this.isOpen = false;
        this.init();
    }

    /**
     * Initialize modal
     */
    init() {
        this.createModal();
        this.attachEventListeners();
        this.listenToEvents();
        logger.debug('Movie modal initialized');
    }

    /**
     * Create modal structure
     */
    createModal() {
        const modalHTML = `
            <div class="movie-modal" id="movie-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="modal-overlay" id="modal-overlay"></div>
                <div class="modal-container">
                    <div class="modal-content" id="modal-content">
                        <!-- Content will be dynamically inserted -->
                    </div>
                    <button class="modal-close" id="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        this.modal = dom.$('#movie-modal');
        this.modalContent = dom.$('#modal-content', this.modal);
        this.modalOverlay = dom.$('#modal-overlay', this.modal);
        this.modalClose = dom.$('#modal-close', this.modal);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Close button
        this.modalClose.addEventListener('click', () => this.close());
        
        // Overlay click
        this.modalOverlay.addEventListener('click', () => this.close());
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Listen to global events
     */
    listenToEvents() {
        eventBus.on('movie:select', async ({ movie }) => {
            await this.open(movie.imdbID);
        });
    }

    /**
     * Open modal with movie details
     */
    async open(imdbID) {
        if (this.isOpen) return;
        
        logger.info('Opening movie modal:', imdbID);
        
        // Show loading state
        this.showLoadingState();
        this.modal.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Fetch movie details
        const result = await this.api.getMovieDetails(imdbID);
        
        if (result.success) {
            this.currentMovie = result.movie;
            this.renderContent(result.movie);
        } else {
            this.renderError(result.error);
        }
    }

    /**
     * Close modal
     */
    close() {
        if (!this.isOpen) return;
        
        logger.info('Closing movie modal');
        
        this.modal.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
        
        // Clear content after animation
        setTimeout(() => {
            this.modalContent.innerHTML = '';
            this.currentMovie = null;
        }, 300);
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        this.modalContent.innerHTML = `
            <div class="modal-loading">
                <div class="spinner">
                    <i class="fas fa-film"></i>
                </div>
                <p>Loading movie details...</p>
            </div>
        `;
    }

    /**
     * Render movie content
     */
    renderContent(movie) {
        const posterUrl = movie.Poster !== 'N/A' 
            ? movie.Poster 
            : this.getPlaceholderPoster(movie.Title);

        this.modalContent.innerHTML = `
            <!-- Hero Header -->
            <div class="modal-hero" style="background-image: url('${posterUrl}');">
                <div class="modal-hero-overlay"></div>
                <div class="modal-hero-content">
                    <div class="modal-title-section">
                        <h2 class="modal-title" id="modal-title">
                            ${sanitize.html(movie.Title)}
                        </h2>
                        ${movie.Tagline && movie.Tagline !== 'N/A' ? `
                            <p class="modal-tagline">${sanitize.html(movie.Tagline)}</p>
                        ` : ''}
                    </div>
                    
                    <div class="modal-meta">
                        ${this.renderMetaBadges(movie)}
                    </div>
                </div>
            </div>

            <!-- Content Body -->
            <div class="modal-body">
                <!-- Ratings Section -->
                ${this.renderRatings(movie)}
                
                <!-- Plot Section -->
                ${this.renderPlot(movie)}
                
                <!-- Details Grid -->
                ${this.renderDetails(movie)}
                
                <!-- Cast & Crew -->
                ${this.renderCastCrew(movie)}
                
                <!-- Action Buttons -->
                ${this.renderActionButtons(movie)}
            </div>
        `;
    }

    /**
     * Render meta badges
     */
    renderMetaBadges(movie) {
        return `
            <div class="meta-badges">
                ${movie.Year !== 'N/A' ? `
                    <span class="meta-badge">
                        <i class="fas fa-calendar"></i>
                        ${movie.Year}
                    </span>
                ` : ''}
                
                ${movie.Runtime !== 'N/A' ? `
                    <span class="meta-badge">
                        <i class="fas fa-clock"></i>
                        ${movie.Runtime}
                    </span>
                ` : ''}
                
                ${movie.Rated !== 'N/A' ? `
                    <span class="meta-badge rated">
                        <i class="fas fa-certificate"></i>
                        ${movie.Rated}
                    </span>
                ` : ''}
                
                ${movie.Type !== 'N/A' ? `
                    <span class="meta-badge type">
                        ${this.getTypeIcon(movie.Type)}
                        ${formatters.capitalize(movie.Type)}
                    </span>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render ratings section
     */
    renderRatings(movie) {
        const ratings = [
            {
                name: 'IMDb',
                value: movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A',
                icon: 'fas fa-star',
                color: '#f5c518',
                votes: movie.imdbVotes
            },
            {
                name: 'Rotten Tomatoes',
                value: movie.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A',
                icon: 'fas fa-tomato',
                color: '#FA320A'
            },
            {
                name: 'Metacritic',
                value: movie.Metascore !== 'N/A' ? movie.Metascore + '/100' : 'N/A',
                icon: 'fas fa-chart-bar',
                color: '#6B8E23'
            }
        ];

        return `
            <div class="ratings-section">
                ${ratings.map(rating => `
                    <div class="rating-card">
                        <i class="${rating.icon}" style="color: ${rating.color};"></i>
                        <div class="rating-content">
                            <div class="rating-value">${rating.value}</div>
                            <div class="rating-label">${rating.name}</div>
                            ${rating.votes ? `<div class="rating-votes">${formatters.number(rating.votes)} votes</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render plot section
     */
    renderPlot(movie) {
        if (movie.Plot === 'N/A') return '';
        
        return `
            <div class="plot-section">
                <h3 class="section-title">
                    <i class="fas fa-align-left"></i>
                    Plot
                </h3>
                <p class="plot-text">${sanitize.html(movie.Plot)}</p>
            </div>
        `;
    }

    /**
     * Render details grid
     */
    renderDetails(movie) {
        const details = [
            { icon: 'tags', label: 'Genre', value: movie.Genre },
            { icon: 'video', label: 'Director', value: movie.Director },
            { icon: 'pen', label: 'Writer', value: movie.Writer },
            { icon: 'users', label: 'Actors', value: movie.Actors },
            { icon: 'language', label: 'Language', value: movie.Language },
            { icon: 'globe', label: 'Country', value: movie.Country },
            { icon: 'trophy', label: 'Awards', value: movie.Awards },
            { icon: 'dollar-sign', label: 'Box Office', value: movie.BoxOffice },
            { icon: 'building', label: 'Production', value: movie.Production },
            { icon: 'film', label: 'Released', value: movie.Released }
        ].filter(detail => detail.value && detail.value !== 'N/A');

        if (details.length === 0) return '';

        return `
            <div class="details-section">
                <h3 class="section-title">
                    <i class="fas fa-info-circle"></i>
                    Details
                </h3>
                <div class="details-grid">
                    ${details.map(detail => `
                        <div class="detail-item">
                            <div class="detail-label">
                                <i class="fas fa-${detail.icon}"></i>
                                ${detail.label}
                            </div>
                            <div class="detail-value">${sanitize.html(detail.value)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render cast and crew
     */
    renderCastCrew(movie) {
        if (movie.Actors === 'N/A' && movie.Director === 'N/A') return '';

        return `
            <div class="cast-crew-section">
                ${movie.Actors !== 'N/A' ? `
                    <div class="cast-section">
                        <h3 class="section-title">
                            <i class="fas fa-users"></i>
                            Cast
                        </h3>
                        <div class="cast-list">
                            ${movie.Actors.split(',').map(actor => `
                                <span class="cast-member">${sanitize.html(actor.trim())}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render action buttons
     */
    renderActionButtons(movie) {
        return `
            <div class="action-buttons">
                ${movie.imdbID !== 'N/A' ? `
                    <a href="https://www.imdb.com/title/${movie.imdbID}/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="action-button primary">
                        <i class="fab fa-imdb"></i>
                        View on IMDb
                    </a>
                ` : ''}
                
                <button class="action-button secondary" id="share-movie">
                    <i class="fas fa-share-alt"></i>
                    Share Movie
                </button>
                
                <button class="action-button secondary" id="add-favorite">
                    <i class="far fa-heart"></i>
                    Add to Favorites
                </button>
            </div>
        `;
    }

    /**
     * Render error state
     */
    renderError(errorMessage) {
        this.modalContent.innerHTML = `
            <div class="modal-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Movie</h3>
                <p>${sanitize.html(errorMessage)}</p>
                <button class="action-button primary" onclick="document.getElementById('modal-close').click()">
                    Close
                </button>
            </div>
        `;
    }

    /**
     * Get type icon
     */
    getTypeIcon(type) {
        const icons = {
            movie: '<i class="fas fa-film"></i>',
            series: '<i class="fas fa-tv"></i>',
            episode: '<i class="fas fa-play-circle"></i>'
        };
        return icons[type.toLowerCase()] || icons.movie;
    }

    /**
     * Get placeholder poster
     */
   getPlaceholderPoster(title) {
    return './assets/media/images/placeholder.jpg';
}
}

// Initialize modal when module loads
const movieModal = new MovieModal();
export default movieModal;
