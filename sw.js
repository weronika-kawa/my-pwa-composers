const cacheName = 'piac-pwa-v1';
// Lista plików, które chcemy zapisać na start (Krok 5)

const filesToCache = [
    '',
    'index.html',
    'composers.html',
    'style.css',
    'js/main.js',
    'images/apple-icon-180.png',
    'images/apple-splash-640-1136.jpg',
    'images/apple-splash-750-1334.jpg',
    'images/apple-splash-828-1792.jpg',
    'images/apple-splash-1125-2436.jpg'
];

// 1. Instalacja: Zapisujemy podstawowe pliki w pamięci (Krok 5)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

// 2. Aktywacja: Czyścimy stare wersje aplikacji, jeśli wrzucimy aktualizację
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Przechwytywanie (Fetch): Tu dzieje się magia offline! (Krok 7 i 9)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Jeśli mamy plik w pamięci (cache), oddaj go.
            // Jeśli nie, pobierz go z sieci i od razu zapisz kopię na przyszłość!
            return response || fetch(event.request).then((fetchResponse) => {
                return caches.open(cacheName).then((cache) => {
                    // Zapisujemy tylko zapytania typu GET (zwykłe pobieranie stron/obrazków)
                    if (event.request.method === 'GET') {
                        cache.put(event.request, fetchResponse.clone());
                    }
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // Jeśli nie ma internetu I nie mamy pliku w pamięci, 
            // zwróć stronę główną (Krok 7 fallback)
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});