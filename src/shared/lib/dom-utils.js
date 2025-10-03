/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

export const dom = {
    /**
     * Query selector wrapper
     */
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    /**
     * Query selector all wrapper
     */
    $$(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    },

    /**
     * Create element with attributes and children
     */
    create(tag, attrs = {}, children = []) {
        const element = document.createElement(tag);

        // Set attributes
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.assign(element.dataset, value);
            } else if (key.startsWith('on')) {
                const event = key.slice(2).toLowerCase();
                element.addEventListener(event, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        // Append children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });

        return element;
    },

    /**
     * Set HTML content safely
     */
    setHTML(element, html) {
        if (element) {
            element.innerHTML = html;
        }
    },

    /**
     * Add class(es)
     */
    addClass(element, ...classes) {
        if (element) {
            element.classList.add(...classes);
        }
    },

    /**
     * Remove class(es)
     */
    removeClass(element, ...classes) {
        if (element) {
            element.classList.remove(...classes);
        }
    },

    /**
     * Toggle class
     */
    toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    },

    /**
     * Check if element has class
     */
    hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    },

    /**
     * Get/Set attribute
     */
    attr(element, name, value) {
        if (!element) return null;
        
        if (value === undefined) {
            return element.getAttribute(name);
        }
        
        element.setAttribute(name, value);
        return element;
    },

    /**
     * Remove element
     */
    remove(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    /**
     * Clear element children
     */
    empty(element) {
        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },

    /**
     * Show element
     */
    show(element) {
        if (element) {
            element.style.display = '';
            element.classList.remove('hidden');
        }
    },

    /**
     * Hide element
     */
    hide(element) {
        if (element) {
            element.classList.add('hidden');
        }
    },

    /**
     * Add event listener with delegation
     */
    on(element, event, selector, handler) {
        if (!element) return;

        element.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target) {
                handler.call(target, e);
            }
        });
    }
};
