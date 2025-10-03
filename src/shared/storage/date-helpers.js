/**
 * Date Helper Functions
 * Utility functions for date formatting and manipulation
 */

export const dateHelpers = {
    /**
     * Format date to locale string
     */
    format(date, options = {}) {
        if (!date) return 'N/A';
        
        try {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                ...options
            });
        } catch (error) {
            return date;
        }
    },

    /**
     * Format date to short format
     */
    formatShort(date) {
        return this.format(date, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Get relative time (e.g., "2 hours ago")
     */
    relative(date) {
        if (!date) return 'N/A';
        
        try {
            const d = new Date(date);
            const now = new Date();
            const diffMs = now - d;
            const diffSecs = Math.floor(diffMs / 1000);
            const diffMins = Math.floor(diffSecs / 60);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);

            if (diffSecs < 60) return 'just now';
            if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
            if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
            if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
            if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
            return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
        } catch (error) {
            return date;
        }
    },

    /**
     * Check if date is valid
     */
    isValid(date) {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    },

    /**
     * Get current timestamp
     */
    now() {
        return Date.now();
    },

    /**
     * Parse date string
     */
    parse(dateString) {
        return new Date(dateString);
    }
};

export default dateHelpers;
