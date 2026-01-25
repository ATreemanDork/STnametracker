/**
 * Runtime method validation utilities
 * Catch method assumption errors at runtime with helpful messages
 */

/**
 * Creates a safe wrapper that validates method calls
 */
export function createSafeWrapper(obj, name, knownMethods = []) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);

            // If accessing a method that doesn't exist, provide helpful error
            if (typeof value === 'undefined' && typeof prop === 'string') {
                const availableMethods = Object.getOwnPropertyNames(target)
                    .filter(key => typeof target[key] === 'function');

                const allMethods = [...new Set([...availableMethods, ...knownMethods])];

                // Find close matches
                const closeMatches = allMethods.filter(method =>
                    method.toLowerCase().includes(prop.toLowerCase()) ||
                    prop.toLowerCase().includes(method.toLowerCase()),
                );

                let errorMsg = `Method '${prop}' does not exist on ${name}.`;

                if (closeMatches.length > 0) {
                    errorMsg += ` Did you mean: ${closeMatches.join(', ')}?`;
                } else {
                    errorMsg += ` Available methods: ${allMethods.join(', ')}`;
                }

                throw new Error(errorMsg);
            }

            return value;
        },
    });
}

/**
 * Validates that an object has expected methods
 */
export function validateInterface(obj, expectedMethods, name = 'object') {
    const missing = [];

    for (const method of expectedMethods) {
        if (typeof obj[method] !== 'function') {
            missing.push(method);
        }
    }

    if (missing.length > 0) {
        const available = Object.getOwnPropertyNames(obj)
            .filter(key => typeof obj[key] === 'function');

        throw new Error(
            `Interface validation failed for ${name}. ` +
            `Missing methods: ${missing.join(', ')}. ` +
            `Available methods: ${available.join(', ')}`,
        );
    }

    return true;
}

/**
 * Creates a development-only wrapper that logs all method calls
 */
export function createMethodLogger(obj, name) {
    if (process.env.NODE_ENV === 'production') {
        return obj; // No logging in production
    }

    return new Proxy(obj, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);

            if (typeof value === 'function') {
                return function(...args) {
                    console.log(`[Method Call] ${name}.${String(prop)}(${args.map(a => typeof a).join(', ')})`);
                    try {
                        const result = value.apply(this, args);
                        console.log(`[Method Result] ${name}.${String(prop)} -> ${typeof result}`);
                        return result;
                    } catch (error) {
                        console.error(`[Method Error] ${name}.${String(prop)} ->`, error);
                        throw error;
                    }
                };
            }

            return value;
        },
    });
}
