// The calls the scenes use from Python's random module.

export function random() {
    return Math.random();
}

// A whole number from a to b, both included.
export function randint(a, b) {
    return a + Math.floor(random() * (b - a + 1));
}

export function uniform(a, b) {
    return a + (b - a) * random();
}

export function choice(items) {
    return items[Math.floor(random() * items.length)];
}

export function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
}

// k different items, in random order.
export function sample(items, k) {
    const pool = [...items];
    const picked = [];
    for (let i = 0; i < k; i++) {
        const j = Math.floor(random() * (pool.length - i));
        picked.push(pool[j]);
        pool[j] = pool[pool.length - i - 1];
    }
    return picked;
}
