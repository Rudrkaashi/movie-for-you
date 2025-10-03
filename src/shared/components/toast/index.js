/**
 * Toast Notifications System
 * Shows temporary notification messages
 */

import { Logger } from '../../../core/logger.js';
import { EventBus } from '../../../core/event-bus.js';
import { dom } from '../../lib/dom-utils.js';

const logger = new Logger('ToastSystem');
const eventBus = EventBus.getInstance();

export class ToastSystem {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.defaultDuration = 5000;
        this.init();
    }

    /**
     * Initialize toast system
     */
    init() {
        this.container = dom.$('#toast-container');
        
        if (!this.container) {
            this.createContainer();
        }

        this.listenToEvents();
        logger.debug('Toast system initialized');
    }

    /**
     * Create toast container
     */
    createContainer() {
        const containerHTML = `
            <div class="toast-container" id="toast-container"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', containerHTML);
        this.container = dom.$('#toast-container');
    }

    /**
     * Listen to global events
     */
    listenToEvents() {
        eventBus.on('toast:show', ({ message, type = 'info', duration }) => {
            this.show(message, type, duration);
        });
    }

    /**
     * Show toast notification
     */
    show(message, type = 'info', duration = this.defaultDuration) {
        const toast = this.createToast(message, type);
        const toastId = Date.now();
        
        this.toasts.set(toastId, toast);
        this.container.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            dom.addClass(toast, 'show');
        });

        // Auto dismiss
        const timeoutId = setTimeout(() => {
            this.dismiss(toastId);
        }, duration);

        // Manual dismiss
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(timeoutId);
                this.dismiss(toastId);
            });
        }

        logger.debug(`Toast shown: ${message} (${type})`);
        return toastId;
    }

    /**
     * Create toast element
     */
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="toast-icon">
                ${icon}
            </div>
            <div class="toast-content">
                <div class="toast-message">${this.sanitizeMessage(message)}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return toast;
    }

    /**
     * Get icon for toast type
     */
    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        
        return icons[type] || icons.info;
    }

    /**
     * Dismiss toast
     */
    dismiss(toastId) {
        const toast = this.toasts.get(toastId);
        
        if (!toast) return;

        dom.removeClass(toast, 'show');
        dom.addClass(toast, 'hide');

        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(toastId);
        }, 300);
    }

    /**
     * Sanitize message
     */
    sanitizeMessage(message) {
        const temp = document.createElement('div');
        temp.textContent = message;
        return temp.innerHTML;
    }

    /**
     * Show success toast
     */
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    /**
     * Show error toast
     */
    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    /**
     * Show warning toast
     */
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Show info toast
     */
    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    /**
     * Clear all toasts
     */
    clearAll() {
        this.toasts.forEach((toast, id) => {
            this.dismiss(id);
        });
    }
}
