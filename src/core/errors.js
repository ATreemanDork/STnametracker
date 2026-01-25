/**
 * Error handling and recovery system for Name Tracker extension
 * Provides error boundaries, graceful degradation, and transaction rollback
 */

import debugLogger from './debug.js';

const logger = debugLogger.createModuleLogger('ErrorHandler');

class NameTrackerError extends Error {
    constructor(message, code, module, recoverable = true) {
        super(message);
        this.name = 'NameTrackerError';
        this.code = code;
        this.module = module;
        this.recoverable = recoverable;
        this.timestamp = Date.now();
    }
}

class ErrorHandler {
    constructor() {
        this.errorHistory = [];
        this.transactionStack = [];
        this.recoveryStrategies = new Map();
        this.criticalErrorCallbacks = [];
    }

    /**
     * Create error boundary for a module operation
     * @param {string} moduleName - Module name
     * @param {Function} operation - Operation to execute
     * @param {Object} options - Error handling options
     * @returns {Promise<any>} Operation result or error recovery result
     */
    async withErrorBoundary(moduleName, operation, options = {}) {
        const {
            fallback = null,
            retries = 0,
            silent = false,
            operationId = null,
        } = options;

        let lastError = null;
        const startTime = Date.now();

        if (operationId) {
            logger.trace(operationId, `Starting operation in ${moduleName}`);
        }

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const result = await operation();

                if (operationId) {
                    logger.trace(operationId, `Operation completed successfully in ${moduleName}`);
                }

                return result;
            } catch (error) {
                console.log(`[STnametracker] Error caught in ${moduleName}:`, error);
                lastError = error;

                if (attempt < retries) {
                    console.log(`[STnametracker] Retrying operation in ${moduleName}, attempt ${attempt + 1}/${retries + 1}:`, error.message);
                    logger.warn(`Retrying operation in ${moduleName}, attempt ${attempt + 1}/${retries + 1}:`, error.message);
                    await this.delay(Math.pow(2, attempt) * 100); // Exponential backoff
                    continue;
                }
            }
        }

        // All retries failed
        console.log(`[STnametracker] All retries failed in ${moduleName}, tracking error:`, lastError);
        const trackedError = this.trackError(lastError, moduleName, {
            operation: operation.name || 'anonymous',
            duration: Date.now() - startTime,
            retries: retries,
            operationId: operationId,
        });

        if (!silent) {
            console.log(`[STnametracker] Notifying user of error in ${moduleName}`);
            this.notifyUser(trackedError);
        }

        // Try recovery strategy
        if (fallback) {
            try {
                logger.debug(`Attempting fallback for ${moduleName}:`, trackedError.code);
                return await fallback(trackedError);
            } catch (fallbackError) {
                logger.error(`Fallback failed for ${moduleName}:`, fallbackError);
            }
        }

        // Check if we have a recovery strategy
        const recovery = this.recoveryStrategies.get(trackedError.code);
        if (recovery) {
            try {
                return await recovery(trackedError);
            } catch (recoveryError) {
                logger.error(`Recovery strategy failed for ${trackedError.code}:`, recoveryError);
            }
        }

        throw trackedError;
    }

    /**
     * Track and categorize errors
     * @param {Error} error - Original error
     * @param {string} moduleName - Module where error occurred
     * @param {Object} context - Additional context
     * @returns {NameTrackerError} Tracked error
     */
    trackError(error, moduleName, context = {}) {
        let trackedError;

        if (error instanceof NameTrackerError) {
            trackedError = error;
        } else {
            // Categorize common error types
            const code = this.categorizeError(error, moduleName);
            trackedError = new NameTrackerError(
                error.message,
                code,
                moduleName,
                this.isRecoverable(error, code),
            );
        }

        trackedError.context = context;
        this.errorHistory.push(trackedError);

        // Keep only last 100 errors
        if (this.errorHistory.length > 100) {
            this.errorHistory.shift();
        }

        logger.error(`Error in ${moduleName}:`, {
            code: trackedError.code,
            message: trackedError.message,
            context: context,
        });

        return trackedError;
    }

    /**
     * Categorize error types for better handling
     * @param {Error} error - Original error
     * @param {string} moduleName - Module name
     * @returns {string} Error code
     */
    categorizeError(error, moduleName) {
        if (error.message.includes('fetch') || error.message.includes('network')) {
            return 'NETWORK_ERROR';
        }

        if (error.message.includes('JSON') || error.message.includes('parse')) {
            return 'DATA_FORMAT_ERROR';
        }

        if (error.message.includes('context') || error.message.includes('SillyTavern')) {
            return 'CONTEXT_ERROR';
        }

        if (error.name === 'TypeError') {
            return 'TYPE_ERROR';
        }

        if (moduleName === 'LLM' && (error.message.includes('quota') || error.message.includes('rate'))) {
            return 'API_LIMIT_ERROR';
        }

        return 'UNKNOWN_ERROR';
    }

    /**
     * Determine if an error is recoverable
     * @param {Error} error - Original error
     * @param {string} code - Error code
     * @returns {boolean} Whether error is recoverable
     */
    isRecoverable(error, code) {
        const nonRecoverableErrors = [
            'CONTEXT_ERROR',
            'TYPE_ERROR',
        ];

        return !nonRecoverableErrors.includes(code);
    }

    /**
     * Start a transaction for rollback capability
     * @param {string} transactionId - Unique transaction identifier
     * @param {Object} initialState - State to potentially rollback to
     */
    startTransaction(transactionId, initialState) {
        this.transactionStack.push({
            id: transactionId,
            state: JSON.stringify(initialState),
            timestamp: Date.now(),
        });

        logger.debug(`Started transaction: ${transactionId}`);
    }

    /**
     * Commit a transaction (remove from rollback stack)
     * @param {string} transactionId - Transaction identifier
     */
    commitTransaction(transactionId) {
        const index = this.transactionStack.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            this.transactionStack.splice(index, 1);
            logger.debug(`Committed transaction: ${transactionId}`);
        }
    }

    /**
     * Rollback a transaction
     * @param {string} transactionId - Transaction identifier
     * @returns {Object|null} Previous state or null if not found
     */
    rollbackTransaction(transactionId) {
        const index = this.transactionStack.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            const transaction = this.transactionStack.splice(index, 1)[0];
            logger.debug(`Rolled back transaction: ${transactionId}`);
            return JSON.parse(transaction.state);
        }
        return null;
    }

    /**
     * Register a recovery strategy for specific error codes
     * @param {string} errorCode - Error code to handle
     * @param {Function} strategy - Recovery function
     */
    registerRecoveryStrategy(errorCode, strategy) {
        this.recoveryStrategies.set(errorCode, strategy);
        logger.debug(`Registered recovery strategy for: ${errorCode}`);
    }

    /**
     * Register callback for critical errors
     * @param {Function} callback - Function to call on critical errors
     */
    onCriticalError(callback) {
        this.criticalErrorCallbacks.push(callback);
    }

    /**
     * Notify user of errors via toastr
     * @param {NameTrackerError} error - Error to display
     */
    notifyUser(error) {
        const message = `Name Tracker: ${error.message}`;

        if (error.recoverable) {
            toastr.warning(message, 'Warning', { timeOut: 5000 });
        } else {
            toastr.error(message, 'Error', { timeOut: 8000 });

            // Notify critical error callbacks
            this.criticalErrorCallbacks.forEach(callback => {
                try {
                    callback(error);
                } catch (callbackError) {
                    logger.error('Critical error callback failed:', callbackError);
                }
            });
        }
    }

    /**
     * Get recent error history
     * @param {number} count - Number of recent errors to return
     * @returns {Array} Recent errors
     */
    getRecentErrors(count = 10) {
        return this.errorHistory.slice(-count);
    }

    /**
     * Clear error history
     */
    clearHistory() {
        this.errorHistory = [];
        logger.debug('Cleared error history');
    }

    /**
     * Utility delay function for retries
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Delay promise
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export { errorHandler, NameTrackerError };
export const withErrorBoundary = errorHandler.withErrorBoundary.bind(errorHandler);
export default errorHandler;
