self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('chat-cache-v1').then((cache) => {
            return cache.addAll(['/', '/index.html']);
        })
    );
    self.skipWaiting();
});
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.notification?.title || '💕 رسالة جديدة';
    const body = data.notification?.body || 'لديك رسالة جديدة في الشات';
    const icon = data.notification?.icon || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💕</text></svg>';
    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            badge: icon,
            tag: 'chat-message',
            requireInteraction: true,
            data: data.data || {}
        })
    );
});
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) { return clientList[0].focus(); }
            return clients.openWindow('/');
        })
    );
});