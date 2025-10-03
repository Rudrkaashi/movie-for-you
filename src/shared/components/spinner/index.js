/**
 * Reusable Spinner Component
 */

export class Spinner {
    constructor(options = {}) {
        this.options = {
            size: 'medium', // small, medium, large
            color: 'primary',
            text: '',
            centered: false,
            ...options
        };
    }

    render() {
        const container = document.createElement('div');
        container.className = this.getClassName();

        container.innerHTML = `
            <div class="spinner-icon">
                <i class="fas fa-film"></i>
            </div>
            ${this.options.text ? `<p class="spinner-text">${this.options.text}</p>` : ''}
        `;

        return container;
    }

    getClassName() {
        const classes = ['spinner-component', `spinner-${this.options.size}`, `spinner-${this.options.color}`];
        
        if (this.options.centered) classes.push('spinner-centered');

        return classes.join(' ');
    }
}
