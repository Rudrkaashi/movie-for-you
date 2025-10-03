/**
 * Reusable Input Component
 */

import { sanitize } from '../../lib/sanitizers.js';
import { validators } from '../../lib/validators.js';

export class Input {
    constructor(options = {}) {
        this.options = {
            type: 'text',
            placeholder: '',
            value: '',
            label: '',
            name: '',
            id: '',
            required: false,
            disabled: false,
            icon: null,
            error: '',
            helpText: '',
            validator: null,
            onChange: null,
            onBlur: null,
            className: '',
            ...options
        };
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = `input-wrapper ${this.options.className}`;

        if (this.options.label) {
            wrapper.appendChild(this.renderLabel());
        }

        wrapper.appendChild(this.renderInputGroup());

        if (this.options.error) {
            wrapper.appendChild(this.renderError());
        }

        if (this.options.helpText && !this.options.error) {
            wrapper.appendChild(this.renderHelpText());
        }

        return wrapper;
    }

    renderLabel() {
        const label = document.createElement('label');
        label.className = 'input-label';
        label.htmlFor = this.options.id || this.options.name;
        label.innerHTML = sanitize.html(this.options.label);
        
        if (this.options.required) {
            label.innerHTML += ' <span class="required">*</span>';
        }

        return label;
    }

    renderInputGroup() {
        const group = document.createElement('div');
        group.className = 'input-group';

        if (this.options.icon) {
            const icon = document.createElement('i');
            icon.className = `input-icon ${this.options.icon}`;
            group.appendChild(icon);
        }

        const input = document.createElement('input');
        input.type = this.options.type;
        input.className = 'input-field';
        input.placeholder = this.options.placeholder;
        input.value = this.options.value;
        input.name = this.options.name;
        input.id = this.options.id || this.options.name;
        input.disabled = this.options.disabled;
        input.required = this.options.required;

        if (this.options.onChange) {
            input.addEventListener('input', this.options.onChange);
        }

        if (this.options.onBlur) {
            input.addEventListener('blur', this.options.onBlur);
        }

        group.appendChild(input);
        return group;
    }

    renderError() {
        const error = document.createElement('div');
        error.className = 'input-error';
        error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${sanitize.html(this.options.error)}`;
        return error;
    }

    renderHelpText() {
        const help = document.createElement('div');
        help.className = 'input-help';
        help.textContent = this.options.helpText;
        return help;
    }

    validate() {
        if (this.options.validator) {
            return this.options.validator(this.options.value);
        }
        return true;
    }
}
