/**
 * HTML Sanitizers
 * Prevent XSS attacks by sanitizing user input
 */

export const sanitize = {
    /**
     * Sanitize HTML string
     */
    html(str) {
        if (!str) return '';
        
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    /**
     * Sanitize URL
     */
    url(url) {
        if (!url) return '';
        
        try {
            const parsed = new URL(url);
            // Only allow http and https protocols
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return '';
            }
            return parsed.href;
        } catch {
            return '';
        }
    },

    /**
     * Strip HTML tags
     */
    stripTags(str) {
        if (!str) return '';
        
        const temp = document.createElement('div');
        temp.innerHTML = str;
        return temp.textContent || temp.innerText || '';
    },

    /**
     * Escape special characters
     */
    escape(str) {
        if (!str) return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        
        return str.replace(/[&<>"'/]/g, char => map[char]);
    }
};
