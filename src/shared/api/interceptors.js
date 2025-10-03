/**
 * API Interceptors
 * Request and response interceptors
 */

import { Logger } from '../../core/logger.js';

const logger = new Logger('APIInterceptors');

export class Interceptors {
    constructor() {
        this.requestInterceptors = [];
        this.responseInterceptors = [];
    }

    /**
     * Add request interceptor
     */
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Add response interceptor
     */
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }

    /**
     * Apply request interceptors
     */
    async applyRequestInterceptors(config) {
        let modifiedConfig = config;
        
        for (const interceptor of this.requestInterceptors) {
            try {
                modifiedConfig = await interceptor(modifiedConfig);
            } catch (error) {
                logger.error('Request interceptor error:', error);
            }
        }
        
        return modifiedConfig;
    }

    /**
     * Apply response interceptors
     */
    async applyResponseInterceptors(response) {
        let modifiedResponse = response;
        
        for (const interceptor of this.responseInterceptors) {
            try {
                modifiedResponse = await interceptor(modifiedResponse);
            } catch (error) {
                logger.error('Response interceptor error:', error);
            }
        }
        
        return modifiedResponse;
    }

    /**
     * Clear all interceptors
     */
    clear() {
        this.requestInterceptors = [];
        this.responseInterceptors = [];
    }
}

export default new Interceptors();
