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

// Funkcja, która wysyła powiadomienie z konkretną treścią
function sendDynamicNotification(title, message) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body: message,
                icon: 'images/apple-icon-180.png',
                vibrate: [100, 50, 100],
                badge: 'images/apple-icon-180.png'
            });
        });
    }
}

// Przykład: Powiadomienie powitalne po 5 sekundach
setTimeout(() => {
    sendDynamicNotification('Wirtuozi Historii', 'Czy wiesz, że Bach miał 20 dzieci? Odkryj więcej ciekawostek!');
}, 5000);

// Przykład: Powiadomienie przy próbie wyjścia (jeśli mysz opuści okno przeglądarki)
document.addEventListener('mouseleave', () => {
    sendDynamicNotification('Nie odchodź!', 'Mistrzowie mają jeszcze wiele do opowiedzenia.');
});