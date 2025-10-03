/**
 * Data Formatters
 * Format data for display
 */

export const formatters = {
    /**
     * Format number with commas
     */
    number(num) {
        if (!num && num !== 0) return 'N/A';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Format currency
     */
    currency(amount, currency = 'USD') {
        if (!amount && amount !== 0) return 'N/A';
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
        }).format(amount);
    },

    /**
     * Format date
     */
    date(dateStr, options = {}) {
        if (!dateStr) return 'N/A';
        
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                ...options
            });
        } catch {
            return dateStr;
        }
    },

    /**
     * Format relative time
     */
    relativeTime(dateStr) {
        if (!dateStr) return 'N/A';
        
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} minutes ago`;
            if (diffHours < 24) return `${diffHours} hours ago`;
            if (diffDays < 7) return `${diffDays} days ago`;
            
            return this.date(dateStr);
        } catch {
            return dateStr;
        }
    },

    /**
     * Truncate text
     */
    truncate(text, maxLength = 100, suffix = '...') {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        
        return text.substring(0, maxLength).trim() + suffix;
    },

    /**
     * Format runtime (minutes to hours)
     */
    runtime(minutes) {
        if (!minutes || isNaN(minutes)) return 'N/A';
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        
        return `${hours}h ${mins}m`;
    },

    /**
     * Capitalize first letter
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Convert to title case
     */
    titleCase(str) {
        if (!str) return '';
        
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
};
