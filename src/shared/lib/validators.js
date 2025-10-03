/**
 * Input Validators
 * Validate user input and form data
 */

export const validators = {
    /**
     * Check if string is not empty
     */
    isNotEmpty(value) {
        return value !== null && value !== undefined && value.toString().trim().length > 0;
    },

    /**
     * Check if valid email
     */
    isEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Check if valid URL
     */
    isURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Check if string length is within range
     */
    lengthBetween(value, min, max) {
        const length = value ? value.toString().length : 0;
        return length >= min && length <= max;
    },

    /**
     * Check if value is numeric
     */
    isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    /**
     * Check if valid year
     */
    isValidYear(year) {
        const currentYear = new Date().getFullYear();
        const numYear = parseInt(year);
        return numYear >= 1888 && numYear <= currentYear + 1;
    }
};
