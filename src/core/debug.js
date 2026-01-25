/**
 * Debug and logging utilities for Name Tracker extension
 * Provides module-specific logging, performance monitoring, and state inspection
 */

const MODULE_NAME = 'STnametracker';

class DebugLogger {
    constructor() {
        this.modules = new Map();
        this.performanceMarks = new Map();
        this.operationTraces = new Map();
    }

    /**
     * Create a module-specific logger
     * @param {string} moduleName - Name of the module
     * @returns {Object} Logger instance with module-specific methods
     */
    createModuleLogger(moduleName) {
        if (this.modules.has(moduleName)) {
            return this.modules.get(moduleName);
        }

        const logger = {
            log: (...args) => this.log(moduleName, 'log', ...args),
            warn: (...args) => this.log(moduleName, 'warn', ...args),
            error: (...args) => this.log(moduleName, 'error', ...args),
            debug: (...args) => this.log(moduleName, 'debug', ...args),
            trace: (operationId, message) => this.addTrace(moduleName, operationId, message),
            startTimer: (timerName) => this.startTimer(moduleName, timerName),
            endTimer: (timerName) => this.endTimer(moduleName, timerName),
        };

        this.modules.set(moduleName, logger);
        return logger;
    }

    /**
     * Internal logging method
     * @param {string} moduleName - Module name
     * @param {string} level - Log level
     * @param {...any} args - Arguments to log
     */
    log(moduleName, level, ...args) {
        if (!this.isDebugEnabled()) {
            return;
        }

        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${MODULE_NAME}:${moduleName}] ${timestamp}`;

        switch (level) {
            case 'error':
                console.error(prefix, ...args);
                break;
            case 'warn':
                console.warn(prefix, ...args);
                break;
            case 'debug':
                console.debug(prefix, ...args);
                break;
            default:
                console.log(prefix, ...args);
        }
    }

    /**
     * Add operation trace for debugging workflows
     * @param {string} moduleName - Module name
     * @param {string} operationId - Unique operation identifier
     * @param {string} message - Trace message
     */
    addTrace(moduleName, operationId, message) {
        if (!this.isDebugEnabled()) {
            return;
        }

        if (!this.operationTraces.has(operationId)) {
            this.operationTraces.set(operationId, []);
        }

        this.operationTraces.get(operationId).push({
            module: moduleName,
            timestamp: Date.now(),
            message: message,
        });
    }

    /**
     * Get trace history for an operation
     * @param {string} operationId - Operation identifier
     * @returns {Array} Trace entries
     */
    getTrace(operationId) {
        return this.operationTraces.get(operationId) || [];
    }

    /**
     * Start performance timer
     * @param {string} moduleName - Module name
     * @param {string} timerName - Timer identifier
     */
    startTimer(moduleName, timerName) {
        const key = `${moduleName}:${timerName}`;
        this.performanceMarks.set(key, performance.now());
    }

    /**
     * End performance timer and log duration
     * @param {string} moduleName - Module name
     * @param {string} timerName - Timer identifier
     * @returns {number} Duration in milliseconds
     */
    endTimer(moduleName, timerName) {
        const key = `${moduleName}:${timerName}`;
        const startTime = this.performanceMarks.get(key);

        if (startTime === undefined) {
            this.log(moduleName, 'warn', `Timer '${timerName}' was not started`);
            return 0;
        }

        const duration = performance.now() - startTime;
        this.performanceMarks.delete(key);

        this.log(moduleName, 'debug', `Timer '${timerName}': ${duration.toFixed(2)}ms`);
        return duration;
    }

    /**
     * Check if debug mode is enabled
     * @returns {boolean} Debug mode status
     */
    isDebugEnabled() {
        // This will be overridden by main.js to connect to settings
        return true; // Default during initialization
    }

    /**
     * Clear all traces and performance data
     */
    clear() {
        this.operationTraces.clear();
        this.performanceMarks.clear();
    }

    /**
     * Get performance summary
     * @returns {Object} Performance statistics
     */
    getPerformanceSummary() {
        return {
            activeTimers: this.performanceMarks.size,
            activeTraces: this.operationTraces.size,
            modules: Array.from(this.modules.keys()),
        };
    }
}

// Create singleton instance
const debugLogger = new DebugLogger();

// Export the instance and key methods for easy access
export { debugLogger };
export const createModuleLogger = debugLogger.createModuleLogger.bind(debugLogger);
export const addTrace = debugLogger.addTrace.bind(debugLogger);
export const startTimer = debugLogger.startTimer.bind(debugLogger);
export const endTimer = debugLogger.endTimer.bind(debugLogger);
export default debugLogger;
