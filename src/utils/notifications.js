/**
 * Notification utilities for Name Tracker extension
 * Centralizes toastr notifications with consistent styling
 */

import debugLogger from '../core/debug.js';

const logger = debugLogger.createModuleLogger('Notifications');

class NotificationManager {
    constructor() {
        this.defaultOptions = {
            timeOut: 5000,
            extendedTimeOut: 2000,
            closeButton: true,
            progressBar: true,
            preventDuplicates: true,
        };

        this.prefix = 'Name Tracker: ';
    }

    /**
     * Show success notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {Object} options - Toastr options
     */
    success(message, title = 'Success', options = {}) {
        const opts = { ...this.defaultOptions, ...options };
        toastr.success(this.prefix + message, title, opts);
        logger.debug('Success notification:', message);
    }

    /**
     * Show info notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {Object} options - Toastr options
     */
    info(message, title = 'Info', options = {}) {
        const opts = { ...this.defaultOptions, ...options };
        toastr.info(this.prefix + message, title, opts);
        logger.debug('Info notification:', message);
    }

    /**
     * Show warning notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {Object} options - Toastr options
     */
    warning(message, title = 'Warning', options = {}) {
        const opts = { ...this.defaultOptions, timeOut: 8000, ...options };
        toastr.warning(this.prefix + message, title, opts);
        logger.debug('Warning notification:', message);
    }

    /**
     * Show error notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {Object} options - Toastr options
     */
    error(message, title = 'Error', options = {}) {
        const opts = {
            ...this.defaultOptions,
            timeOut: 10000,
            extendedTimeOut: 5000,
            ...options,
        };
        toastr.error(this.prefix + message, title, opts);
        logger.error('Error notification:', message);
    }

    /**
     * Show persistent notification that doesn't auto-close
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {string} type - Notification type (info, success, warning, error)
     */
    persistent(message, title = 'Notice', type = 'info') {
        const opts = {
            ...this.defaultOptions,
            timeOut: 0,
            extendedTimeOut: 0,
        };

        switch (type) {
            case 'success':
                toastr.success(this.prefix + message, title, opts);
                break;
            case 'warning':
                toastr.warning(this.prefix + message, title, opts);
                break;
            case 'error':
                toastr.error(this.prefix + message, title, opts);
                break;
            default:
                toastr.info(this.prefix + message, title, opts);
        }

        logger.debug('Persistent notification:', message);
    }

    /**
     * Show progress notification for long operations
     * @param {string} message - Message to display
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} id - Unique ID for updating the same notification
     * @returns {string} Notification ID for updates
     */
    progress(message, progress = 0, id = null) {
        const notificationId = id || `progress_${Date.now()}`;
        const progressHtml = `
            <div style="margin-bottom: 8px;">${this.prefix}${message}</div>
            <div style="background: #333; border-radius: 3px; overflow: hidden;">
                <div style="background: #007acc; height: 6px; width: ${progress}%; transition: width 0.3s ease;"></div>
            </div>
            <div style="text-align: center; font-size: 11px; margin-top: 4px;">${progress}%</div>
        `;

        const opts = {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: false,
            progressBar: false,
            preventDuplicates: false,
            toastId: notificationId,
        };

        // Remove existing notification with same ID
        toastr.remove();

        toastr.info(progressHtml, '', opts);
        logger.debug('Progress notification:', message, `${progress}%`);

        return notificationId;
    }

    /**
     * Clear all notifications
     */
    clear() {
        toastr.clear();
        logger.debug('Cleared all notifications');
    }

    /**
     * Show a confirmation-style notification with action buttons
     * @param {string} message - Message to display
     * @param {Function} onConfirm - Callback for confirm action
     * @param {Function} onCancel - Callback for cancel action
     * @param {string} title - Optional title
     */
    confirm(message, onConfirm, onCancel = null, title = 'Confirm') {
        const confirmId = `confirm_${Date.now()}`;
        const confirmHtml = `
            <div style="margin-bottom: 12px;">${message}</div>
            <div style="text-align: right;">
                <button class="btn btn-sm btn-secondary me-2" onclick="nameTrackerNotifications.handleConfirmCancel('${confirmId}')">Cancel</button>
                <button class="btn btn-sm btn-primary" onclick="nameTrackerNotifications.handleConfirmOk('${confirmId}')">Confirm</button>
            </div>
        `;

        // Store callbacks globally for onclick handlers
        window.nameTrackerNotifications = window.nameTrackerNotifications || {};
        window.nameTrackerNotifications.confirmCallbacks = window.nameTrackerNotifications.confirmCallbacks || {};
        window.nameTrackerNotifications.confirmCallbacks[confirmId] = { onConfirm, onCancel };

        window.nameTrackerNotifications.handleConfirmOk = (id) => {
            const callbacks = window.nameTrackerNotifications.confirmCallbacks[id];
            if (callbacks && callbacks.onConfirm) {
                callbacks.onConfirm();
            }
            delete window.nameTrackerNotifications.confirmCallbacks[id];
            toastr.clear();
        };

        window.nameTrackerNotifications.handleConfirmCancel = (id) => {
            const callbacks = window.nameTrackerNotifications.confirmCallbacks[id];
            if (callbacks && callbacks.onCancel) {
                callbacks.onCancel();
            }
            delete window.nameTrackerNotifications.confirmCallbacks[id];
            toastr.clear();
        };

        const opts = {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: false,
            progressBar: false,
            preventDuplicates: false,
            toastId: confirmId,
        };

        toastr.info(confirmHtml, this.prefix + title, opts);
        logger.debug('Confirmation notification:', message);

        return confirmId;
    }

    /**
     * Get notification status for debugging
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            defaultOptions: this.defaultOptions,
            prefix: this.prefix,
            activeConfirms: Object.keys(window.nameTrackerNotifications?.confirmCallbacks || {}).length,
        };
    }
}

// Create singleton instance
const notifications = new NotificationManager();

logger.debug('Notifications module loaded');

export { NotificationManager };
export default notifications;
