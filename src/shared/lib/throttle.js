/**
 * Throttle Function
 * Limits execution to once per specified time period
 */

export function throttle(func, limit = 300) {
    let inThrottle;

    return function throttled(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}
