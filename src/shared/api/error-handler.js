/**
 * API Error Handler
 * Centralized error handling for API calls
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('APIErrorHandler');

export class APIErrorHandler {
    /**
     * Handle API error
     */
    static handle(error) {
        if (error.name === 'AbortError') {
            return {
                type: 'timeout',
                message: 'Request timeout. Please try again.',
                recoverable: true
            };
        }

        if (!navigator.onLine) {
            return {
                type: 'network',
                message: 'No internet connection. Please check your network.',
                recoverable: true
            };
        }

        if (error.response) {
            return this.handleResponseError(error.response);
        }

        return {
            type: 'unknown',
            message: error.message || 'An unexpected error occurred.',
            recoverable: false
        };
    }

    /**
     * Handle response error
     */
    static handleResponseError(response) {
        const status = response.status;

        const errorMap = {
            400: { type: 'bad_request', message: 'Invalid request. Please check your input.' },
            401: { type: 'unauthorized', message: 'Invalid API key or unauthorized access.' },
            403: { type: 'forbidden', message: 'Access forbidden.' },
            404: { type: 'not_found', message: 'Resource not found.' },
            429: { type: 'rate_limit', message: 'Too many requests. Please try again later.' },
            500: { type: 'server_error', message: 'Server error. Please try again.' },
            503: { type: 'service_unavailable', message: 'Service temporarily unavailable.' }
        };

        return errorMap[status] || {
            type: 'http_error',
            message: `HTTP Error: ${status}`,
            recoverable: false
        };
    }

    /**
     * Log error
     */
    static log(error, context = '') {
        logger.error(`${context}:`, error);
    }

    /**
     * Check if error is recoverable
     */
    static isRecoverable(error) {
        const handled = this.handle(error);
        return handled.recoverable;
    }
}

export default APIErrorHandler;
