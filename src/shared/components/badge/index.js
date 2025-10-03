/**
 * Reusable Badge Component
 */

import { sanitize } from '../../lib/sanitizers.js';

export class Badge {
    constructor(options = {}) {
        this.options = {
            text: '',
            variant: 'default', // default, primary, success, warning, error, info
            size: 'medium', // small, medium, large
            icon: null,
            pill: false,
            ...options
        };
    }

    render() {
        const badge = document.createElement('span');
        badge.className = this.getClassName();
        badge.innerHTML = this.getContent();
        return badge;
    }

    getClassName() {
        const classes = ['badge', `badge-${this.options.variant}`, `badge-${this.options.size}`];
        
        if (this.options.pill) classes.push('badge-pill');

        return classes.join(' ');
    }

    getContent() {
        const icon = this.options.icon ? `<i class="${this.options.icon}"></i>` : '';
        const text = sanitize.html(this.options.text);
        return `${icon}${text}`;
    }
}
