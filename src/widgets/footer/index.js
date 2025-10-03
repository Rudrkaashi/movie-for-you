/**
 * Footer Widget
 * Application footer with links and info
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('Footer');

export class Footer {
    constructor(container) {
        this.container = container;
    }

    /**
     * Render footer
     */
    async render() {
        this.container.innerHTML = this.getTemplate();
        this.attachEventListeners();
        logger.debug('Footer rendered');
    }

    /**
     * Get HTML template
     */
    getTemplate() {
        const currentYear = new Date().getFullYear();
        
        return `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <!-- Brand Section -->
                        <div class="footer-section">
                            <div class="logo">
    <img src="./assets/media/images/logo.svg" alt="Movies-For-You Logo" class="logo-image">
    <span class="logo-text">
        Movies<span class="text-gradient">ForYou</span>
    </span>
</div>

                            <p class="footer-desc">
                                Discover and explore movies with stunning cinematic experience.
                                Your ultimate destination for movie discovery.
                            </p>
                            <div class="social-links">
                                <a href="#" aria-label="Facebook" class="social-link">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                <a href="#" aria-label="Twitter" class="social-link">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" aria-label="Instagram" class="social-link">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="#" aria-label="YouTube" class="social-link">
                                    <i class="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                        
                        <!-- Quick Links -->
                        <div class="footer-section">
                            <h4>Quick Links</h4>
                            <ul class="footer-links">
                                <li><a href="#home">Home</a></li>
                                <li><a href="#trending">Trending</a></li>
                                <li><a href="#favorites">Favorites</a></li>
                                <li><a href="#about">About</a></li>
                            </ul>
                        </div>
                        
                        <!-- Resources -->
                        <div class="footer-section">
                            <h4>Resources</h4>
                            <ul class="footer-links">
                                <li><a href="#api">API Documentation</a></li>
                                <li><a href="#privacy">Privacy Policy</a></li>
                                <li><a href="#terms">Terms of Service</a></li>
                                <li><a href="#cookies">Cookie Policy</a></li>
                            </ul>
                        </div>
                        
                        <!-- Contact -->
                        <div class="footer-section">
                            <h4>Contact</h4>
                            <ul class="footer-links">
                                <li>
                                    <i class="fas fa-envelope"></i>
                                    <span>support@moviesforyou.com</span>
                                </li>
                                <li>
                                    <i class="fas fa-phone"></i>
                                    <span>+91 1234567890</span>
                                </li>
                                <li>
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>New Delhi, India</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Footer Bottom -->
                    <div class="footer-bottom">
                        <p>&copy; ${currentYear} Movies-For-You. All rights reserved.</p>
                        <p class="api-credit">Powered by <a href="https://www.omdbapi.com/" target="_blank" rel="noopener">OMDb API</a></p>
                    </div>
                </div>
            </footer>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Smooth scroll for footer links
        const footerLinks = this.container.querySelectorAll('a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}
