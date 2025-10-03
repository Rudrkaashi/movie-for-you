/**
 * Logger - Centralized Logging System
 * Provides structured logging with different levels
 */

export class Logger {
    static levels = {
        DEBUG: 0,
        INFO: 1,
        SUCCESS: 2,
        WARN: 3,
        ERROR: 4
    };

    static currentLevel = Logger.levels.INFO;

    constructor(context = 'App') {
        this.context = context;
    }

    /**
     * Set global log level
     */
    static setLevel(level) {
        Logger.currentLevel = level;
    }

    /**
     * Format log message
     */
    formatMessage(level, message, ...args) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${level}] [${this.context}]`;
        return [prefix, message, ...args];
    }

    /**
     * Debug log
     */
    debug(message, ...args) {
        if (Logger.currentLevel <= Logger.levels.DEBUG) {
            console.log(...this.formatMessage('DEBUG', message, ...args));
        }
    }

    /**
     * Info log
     */
    info(message, ...args) {
        if (Logger.currentLevel <= Logger.levels.INFO) {
            console.log(
                ...this.formatMessage('INFO', message, ...args)
            );
        }
    }

    /**
     * Success log
     */
    success(message, ...args) {
        if (Logger.currentLevel <= Logger.levels.SUCCESS) {
            console.log(
                '%c' + this.formatMessage('SUCCESS', message).join(' '),
                'color: #22c55e; font-weight: bold',
                ...args
            );
        }
    }

    /**
     * Warning log
     */
    warn(message, ...args) {
        if (Logger.currentLevel <= Logger.levels.WARN) {
            console.warn(...this.formatMessage('WARN', message, ...args));
        }
    }

    /**
     * Error log
     */
    error(message, ...args) {
        if (Logger.currentLevel <= Logger.levels.ERROR) {
            console.error(...this.formatMessage('ERROR', message, ...args));
        }
    }

    /**
     * Group logs
     */
    group(label, callback) {
        console.group(`[${this.context}] ${label}`);
        callback();
        console.groupEnd();
    }

    /**
     * Table output
     */
    table(data) {
        console.table(data);
    }
}

// Set development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    Logger.setLevel(Logger.levels.DEBUG);
}
