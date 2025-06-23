const CACHE_NAME = 'rm-estetica-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
];

// Evento de Instalação: Salva os arquivos do App Shell em cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Fetch: Intercepta as requisições
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Ignora as requisições para a API do Supabase, sempre buscando na rede
    if (requestUrl.hostname.includes('supabase.co')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Estratégia "Cache first, then Network" para outros recursos
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se encontrar no cache, retorna
                if (response) {
                    return response;
                }
                // Senão, busca na rede
                return fetch(event.request).then(
                    networkResponse => {
                        // E salva uma cópia no cache para uso futuro
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    }
                );
            })
    );
});

// Evento de Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
