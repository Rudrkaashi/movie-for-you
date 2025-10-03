/**
 * API Client
 * Advanced HTTP client with caching, retry, and error handling
 */

import { Logger } from '../../core/logger.js';
import { EventBus } from '../../core/event-bus.js';

const logger = new Logger('APIClient');
const eventBus = EventBus.getInstance();

export class APIClient {
    static instance = null;

    constructor() {
        if (APIClient.instance) {
            return APIClient.instance;
        }

        this.config = {
            baseURL: 'https://www.omdbapi.com/',
            apiKey: 'e753590b',
            timeout: 10000,
            maxRetries: 3,
            retryDelay: 1000
        };

        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.requestQueue = new Map();
        this.abortController = null;

        APIClient.instance = this;
    }

    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!APIClient.instance) {
            APIClient.instance = new APIClient();
        }
        return APIClient.instance;
    }

    /**
     * Build URL with query parameters
     */
    buildURL(params) {
        const url = new URL(this.config.baseURL);
        url.searchParams.append('apikey', this.config.apiKey);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.append(key, value);
            }
        });

        return url.toString();
    }

    /**
     * Generate cache key
     */
    getCacheKey(params) {
        return JSON.stringify(params);
    }

    /**
     * Get cached response
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        
        if (!cached) return null;

        const { data, timestamp } = cached;
        const isExpired = Date.now() - timestamp > this.cacheExpiry;

        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        logger.debug('Cache hit:', key);
        return data;
    }

    /**
     * Set cache
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        logger.debug('Cached:', key);
    }

    /**
     * Delay utility
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fetch with timeout and retry
     */
    async fetchWithRetry(url, retries = this.config.maxRetries) {
        this.abortController = new AbortController();

        const timeoutId = setTimeout(
            () => this.abortController.abort(),
            this.config.timeout
        );

        try {
            const response = await fetch(url, {
                signal: this.abortController.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response;

        } catch (error) {
            clearTimeout(timeoutId);

            if (retries > 0 && error.name !== 'AbortError') {
                logger.warn(`Retrying... (${retries} attempts left)`);
                await this.delay(this.config.retryDelay);
                return this.fetchWithRetry(url, retries - 1);
            }

            throw error;
        }
    }

    /**
     * Get error message
     */
    getErrorMessage(error) {
        if (error.name === 'AbortError') {
            return 'Request timeout. Please try again.';
        }

        if (!navigator.onLine) {
            return 'No internet connection. Please check your network.';
        }

        return error.message || 'Failed to fetch data. Please try again.';
    }

    /**
     * Generic request handler
     */
    async request(params, useCache = true) {
        const cacheKey = this.getCacheKey(params);

        // Check cache
        if (useCache) {
            const cachedData = this.getFromCache(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }

        // Check if same request is in progress
        if (this.requestQueue.has(cacheKey)) {
            logger.debug('Request already in progress, waiting...');
            return this.requestQueue.get(cacheKey);
        }

        const url = this.buildURL(params);

        const requestPromise = (async () => {
            try {
                eventBus.emit('api:request:start', { params });
                
                const response = await this.fetchWithRetry(url);
                const data = await response.json();

                if (data.Response === 'False') {
                    eventBus.emit('api:request:error', { error: data.Error });
                    return {
                        success: false,
                        error: data.Error,
                        data: null
                    };
                }

                const result = {
                    success: true,
                    data,
                    error: null
                };

                if (useCache) {
                    this.setCache(cacheKey, result);
                }

                eventBus.emit('api:request:success', { data });
                return result;

            } catch (error) {
                logger.error('API Request Error:', error);
                eventBus.emit('api:request:error', { error });

                return {
                    success: false,
                    error: this.getErrorMessage(error),
                    data: null
                };
            } finally {
                this.requestQueue.delete(cacheKey);
            }
        })();

        this.requestQueue.set(cacheKey, requestPromise);
        return requestPromise;
    }

    /**
     * Search movies
     */
    async searchMovies(searchTerm, options = {}) {
        const { page = 1, type = '', year = '' } = options;

        if (!searchTerm || !searchTerm.trim()) {
            return {
                success: false,
                error: 'Search term is required',
                movies: [],
                totalResults: 0
            };
        }

        const result = await this.request({
            s: searchTerm.trim(),
            page,
            type,
            y: year
        });

        if (result.success) {
            return {
                ...result,
                movies: result.data.Search || [],
                totalResults: parseInt(result.data.totalResults) || 0
            };
        }

        return {
            ...result,
            movies: [],
            totalResults: 0
        };
    }

    /**
     * Get movie details
     */
    async getMovieDetails(imdbID) {
        if (!imdbID || !imdbID.trim()) {
            return {
                success: false,
                error: 'IMDb ID is required',
                movie: null
            };
        }

        const result = await this.request({
            i: imdbID.trim(),
            plot: 'full'
        });

        return {
            ...result,
            movie: result.data
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        logger.info('API cache cleared');
    }

    /**
     * Cancel requests
     */
    cancelRequests() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }
}
