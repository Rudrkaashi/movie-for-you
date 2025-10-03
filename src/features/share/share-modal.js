/**
 * Share Modal Component
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';
import shareManager from './index.js';
import { dom } from '../../shared/lib/dom-utils.js';

const logger = new Logger('ShareModal');
const eventBus = EventBus.getInstance();

export class ShareModal {
    constructor() {
        this.modal = null;
        this.currentMovie = null;
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
        this.listenToEvents();
    }

    createModal() {
        const modalHTML = `
            <div class="share-modal" id="share-modal">
                <div class="share-overlay"></div>
                <div class="share-content">
                    <button class="share-close" id="share-close">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <h3 class="share-title">
                        <i class="fas fa-share-alt"></i>
                        Share Movie
                    </h3>
                    
                    <div class="share-movie-info" id="share-movie-info"></div>
                    
                    <div class="share-options">
                        <button class="share-option" data-platform="facebook">
                            <i class="fab fa-facebook"></i>
                            Facebook
                        </button>
                        <button class="share-option" data-platform="twitter">
                            <i class="fab fa-twitter"></i>
                            Twitter
                        </button>
                        <button class="share-option" data-platform="whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp
                        </button>
                        <button class="share-option" data-platform="telegram">
                            <i class="fab fa-telegram"></i>
                            Telegram
                        </button>
                        <button class="share-option" data-platform="linkedin">
                            <i class="fab fa-linkedin"></i>
                            LinkedIn
                        </button>
                    </div>
                    
                    <div class="share-link">
                        <input type="text" 
                               class="share-link-input" 
                               id="share-link-input" 
                               readonly>
                        <button class="share-copy-btn" id="share-copy-btn">
                            <i class="fas fa-copy"></i>
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = dom.$('#share-modal');
    }

    attachEventListeners() {
        // Close button
        const closeBtn = dom.$('#share-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Overlay click
        const overlay = dom.$('.share-overlay', this.modal);
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // Share options
        const options = dom.$$('.share-option', this.modal);
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const platform = e.currentTarget.getAttribute('data-platform');
                this.shareToSocial(platform);
            });
        });

        // Copy link button
        const copyBtn = dom.$('#share-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyLink());
        }
    }

    listenToEvents() {
        eventBus.on('share:open', ({ movie }) => {
            this.open(movie);
        });
    }

    open(movie) {
        this.currentMovie = movie;
        this.updateContent(movie);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        logger.info('Share modal opened for:', movie.Title);
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentMovie = null;
    }

    updateContent(movie) {
        const infoDiv = dom.$('#share-movie-info', this.modal);
        if (infoDiv) {
            infoDiv.innerHTML = `
                <div class="share-movie-poster">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : './assets/media/images/placeholder.jpg'}" 
     alt="${movie.Title}">
                </div>
                <div class="share-movie-details">
                    <h4>${movie.Title}</h4>
                    <p>${movie.Year}</p>
                </div>
            `;
        }

        const linkInput = dom.$('#share-link-input');
        if (linkInput) {
            linkInput.value = shareManager.getShareURL(movie);
        }
    }

    shareToSocial(platform) {
        if (this.currentMovie) {
            shareManager.shareToSocial(this.currentMovie, platform);
        }
    }

    async copyLink() {
        const linkInput = dom.$('#share-link-input');
        if (linkInput) {
            const success = await shareManager.copyLink(linkInput.value);
            if (success) {
                eventBus.emit('toast:show', {
                    type: 'success',
                    message: 'Link copied to clipboard!'
                });
            }
        }
    }
}

// Initialize
const shareModal = new ShareModal();
export default shareModal;
