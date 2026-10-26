const BASE = 'https://jsonplaceholder.typicode.com';

async function fetchJson(url, timeoutMs = 5000) {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return res.json();
}

async function main() {
    console.log('Fetching user and posts in parallel...');
    const start = Date.now();
    try {
        const [user, posts] = await Promise.all([
            fetchJson(`${BASE}/users/1`),
            fetchJson(`${BASE}/posts?userId=1`),
        ]);
        console.log(`User: ${user.name} (${user.email})`);
        console.log(`Posts by this user: ${posts.length}`);
        console.log(`First: ${posts[0].title}`);
    } catch (err) {
        if (err.name === 'TimeoutError') {
            console.error('Request timed out. Check your internet.');
        } else {
            console.error('Could not load data:', err.message);
        }
    } finally {
        console.log(`Done in ${Date.now() - start} ms`);
    }
}

main();
