// Cache version and name
const CACHE_NAME = 'custom-cache-v1';
const POST_CACHE = 'post-cache-v1';

// Install event: Pre-cache static assets if necessary
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(self.skipWaiting()); // Activate the worker immediately
});

// Activate event: Cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_NAME, POST_CACHE].includes(cacheName)) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  return self.clients.claim(); // Take control of all clients immediately
});

// Fetch event: Intercept and handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Handle POST requests
  if (request.method === 'POST') {
    event.respondWith(handlePostRequest(request));
    return;
  }

  // Handle GET requests
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request));
    return;
  }
});

// Function to handle POST requests
async function handlePostRequest(request) {
  const cache = await caches.open(POST_CACHE);
  const clonedRequest = request.clone(); // Clone the request to read it multiple times

  // Generate a unique cache key based on URL and body
  const requestBody = await clonedRequest.json().catch(() => null);
  const cacheKey = `${request.url}-${JSON.stringify(requestBody)}`;

  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    console.log('[Service Worker] Serving POST response from cache:', cacheKey);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(clonedRequest);

    // Cache the response only if it succeeds
    if (networkResponse.ok) {
      console.log('[Service Worker] Caching POST response:', cacheKey);
      cache.put(cacheKey, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] POST request failed:', error);
    return new Response('Network error occurred.', { status: 503 });
  }
}

// Function to handle GET requests
async function handleGetRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  // Try fetching from cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('[Service Worker] Serving GET response from cache:', request.url);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache the network response
    if (networkResponse.ok) {
      console.log('[Service Worker] Caching GET response:', request.url);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] GET request failed:', error);
    return new Response('Network error occurred.', { status: 503 });
  }
}

