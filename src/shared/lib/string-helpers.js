/**
 * String Helper Functions
 */

export const stringHelpers = {
    /**
     * Truncate string to length
     */
    truncate(str, length = 100, suffix = '...') {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length).trim() + suffix;
    },

    /**
     * Capitalize first letter
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Title case
     */
    titleCase(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    /**
     * Slugify string
     */
    slugify(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Remove extra whitespace
     */
    clean(str) {
        if (!str) return '';
        return str.replace(/\s+/g, ' ').trim();
    },

    /**
     * Check if string contains substring (case-insensitive)
     */
    contains(str, search) {
        if (!str || !search) return false;
        return str.toLowerCase().includes(search.toLowerCase());
    },

    /**
     * Count words in string
     */
    wordCount(str) {
        if (!str) return 0;
        return str.trim().split(/\s+/).length;
    },

    /**
     * Reverse string
     */
    reverse(str) {
        if (!str) return '';
        return str.split('').reverse().join('');
    },

    /**
     * Extract numbers from string
     */
    extractNumbers(str) {
        if (!str) return [];
        const matches = str.match(/\d+/g);
        return matches ? matches.map(Number) : [];
    }
};

export default stringHelpers;
