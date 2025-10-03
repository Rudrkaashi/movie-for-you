/**
 * Debounce Function
 * Delays execution until after wait period of inactivity
 */

export function debounce(func, wait = 300) {
    let timeoutId;

    return function debounced(...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}
