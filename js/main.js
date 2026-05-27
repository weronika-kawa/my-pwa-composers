window.onload = () => {
    'use strict';

    // Sprawdzamy, czy przeglądarka w ogóle obsługuje Service Workery
    if ('serviceWorker' in navigator) {
        // Rejestrujemy plik sw.js, który jest w głównym folderze
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker zarejestrowany pomyślnie!'))
            .catch((error) => console.error('Błąd rejestracji:', error));
    }
};

// Funkcja pytająca o zgodę na powiadomienia
function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Zgoda na powiadomienia udzielona!');
            showTestNotification();
        }
    });
}

// Funkcja pokazująca powiadomienie
function showTestNotification() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Wirtuozi Historii', { // Tytuł
                body: 'Mistrzowie czekają. Czy chcesz poznać tajemnice ich symfonii?', // Treść
                icon: 'images/apple-icon-180.png', // Ikona powiadomienia
                badge: 'images/apple-icon-180.png', // Mała ikonka na pasku statusu (Android)
                vibrate: [100, 50, 100], // Wibracja (krótka-pauza-krótka)
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                }
            });
        });
    }
}

// Wywołajmy prośbę o powiadomienia po 5 sekundach od wejścia na stronę
setTimeout(requestNotificationPermission, 5000);