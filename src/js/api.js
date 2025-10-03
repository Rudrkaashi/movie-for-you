 /**
 * Movie API Manager - Works without modules
 */

const MovieAPI = (() => {
    'use strict';
    
    class MovieAPIClass {
        constructor() {
            this.config = {
                apiKey: 'e753590b',
                baseURL: 'https://www.omdbapi.com/',
                timeout: 10000,
                maxRetries: 3,
                retryDelay: 1000
            };
            
            this.cache = new Map();
            this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
            this.requestQueue = new Map();
            this.abortController = null;
        }
        
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
        
        getCacheKey(params) {
            return JSON.stringify(params);
        }
        
        getFromCache(key) {
            const cached = this.cache.get(key);
            
            if (!cached) return null;
            
            const { data, timestamp } = cached;
            const isExpired = Date.now() - timestamp > this.cacheExpiry;
            
            if (isExpired) {
                this.cache.delete(key);
                return null;
            }
            
            return data;
        }
        
        setCache(key, data) {
            this.cache.set(key, {
                data,
                timestamp: Date.now()
            });
        }
        
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
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
                    await this.delay(this.config.retryDelay);
                    return this.fetchWithRetry(url, retries - 1);
                }
                
                throw error;
            }
        }
        
        getErrorMessage(error) {
            if (error.name === 'AbortError') {
                return 'Request timeout. Please try again.';
            }
            
            if (!navigator.onLine) {
                return 'No internet connection. Please check your network.';
            }
            
            return error.message || 'Failed to fetch data. Please try again.';
        }
        
        async request(params, useCache = true) {
            const cacheKey = this.getCacheKey(params);
            
            if (useCache) {
                const cachedData = this.getFromCache(cacheKey);
                if (cachedData) {
                    return cachedData;
                }
            }
            
            if (this.requestQueue.has(cacheKey)) {
                return this.requestQueue.get(cacheKey);
            }
            
            const url = this.buildURL(params);
            
            const requestPromise = (async () => {
                try {
                    const response = await this.fetchWithRetry(url);
                    const data = await response.json();
                    
                    if (data.Response === 'False') {
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
                    
                    return result;
                    
                } catch (error) {
                    console.error('API Request Error:', error);
                    
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
        
        async searchMovies(searchTerm, options = {}) {
            const { page = 1, type = '', year = '' } = options;
            
            if (!searchTerm || !searchTerm.trim()) {
                return {
                    success: false,
                    error: 'Search term is required',
                    data: null,
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
        
        async getMovieDetails(imdbID) {
            if (!imdbID || !imdbID.trim()) {
                return {
                    success: false,
                    error: 'IMDb ID is required',
                    data: null,
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
        
        async getMovieByTitle(title, year = '') {
            if (!title || !title.trim()) {
                return {
                    success: false,
                    error: 'Title is required',
                    data: null,
                    movie: null
                };
            }
            
            const result = await this.request({
                t: title.trim(),
                y: year
            });
            
            return {
                ...result,
                movie: result.data
            };
        }
        
        cancelRequests() {
            if (this.abortController) {
                this.abortController.abort();
            }
        }
        
        clearCache() {
            this.cache.clear();
        }
        
        updateConfig(config) {
            this.config = { ...this.config, ...config };
        }
    }
    
    // Return singleton instance
    return new MovieAPIClass();
})();
