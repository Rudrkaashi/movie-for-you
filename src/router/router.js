/**
 * Client-Side Router
 * Handles SPA navigation without page reload
 */

import { Logger } from '../core/logger.js';
import { EventBus } from '../core/event-bus.js';

const logger = new Logger('Router');
const eventBus = EventBus.getInstance();

export class Router {
    constructor(routes = []) {
        this.routes = routes;
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });

        // Intercept link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });

        // Load initial route
        this.handleRoute(window.location.pathname);
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }

    handleRoute(path) {
        const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');
        
        if (route) {
            this.currentRoute = route;
            this.loadRoute(route);
            eventBus.emit('route:changed', { path, route });
            logger.info('Route changed:', path);
        }
    }

    async loadRoute(route) {
        const container = document.getElementById('main-content');
        
        if (route.component) {
            const page = new route.component(container);
            await page.render();
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}
