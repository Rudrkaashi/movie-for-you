/**
 * Reusable Button Component
 */

import { sanitize } from '../../lib/sanitizers.js';
import { dom } from '../../lib/dom-utils.js';

export class Button {
    constructor(options = {}) {
        this.options = {
            text: 'Button',
            icon: null,
            variant: 'primary', // primary, secondary, outline, ghost
            size: 'medium', // small, medium, large
            fullWidth: false,
            disabled: false,
            loading: false,
            onClick: null,
            className: '',
            ...options
        };
    }

    render() {
        const btn = document.createElement('button');
        btn.className = this.getClassName();
        btn.disabled = this.options.disabled || this.options.loading;
        
        if (this.options.onClick) {
            btn.addEventListener('click', this.options.onClick);
        }

        btn.innerHTML = this.getContent();
        return btn;
    }

    getClassName() {
        const classes = ['btn', `btn-${this.options.variant}`, `btn-${this.options.size}`];
        
        if (this.options.fullWidth) classes.push('btn-full-width');
        if (this.options.disabled) classes.push('btn-disabled');
        if (this.options.loading) classes.push('btn-loading');
        if (this.options.className) classes.push(this.options.className);

        return classes.join(' ');
    }

    getContent() {
        if (this.options.loading) {
            return '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
        }

        const icon = this.options.icon ? `<i class="${this.options.icon}"></i>` : '';
        const text = sanitize.html(this.options.text);

        return `${icon}<span>${text}</span>`;
    }
}
