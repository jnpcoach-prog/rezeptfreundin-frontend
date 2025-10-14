// Wartet, bis die komplette Webseite geladen ist
document.addEventListener('DOMContentLoaded', () => {

    // Holt sich die wichtigen Elemente von der HTML-Seite
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');

    // Diese Funktion wird ausgeführt, wenn der "Senden"-Button geklickt wird
    const handleSend = () => {
        const message = userInput.value.trim(); // Holt den Text aus dem Eingabefeld

        // Prüft, ob überhaupt etwas eingegeben wurde
        if (message) {
            console.log("Nachricht des Nutzers:", message); // Gibt die Nachricht in der Konsole aus

            // Hier werden wir später die Nachricht an unsere "Küche" (Backend) schicken

            userInput.value = ''; // Leert das Eingabefeld nach dem Senden
        }
    };

    // Lauscht auf Klicks auf den "Senden"-Button
    sendButton.addEventListener('click', handleSend);

    // Ermöglicht das Senden auch durch Drücken der Enter-Taste
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    });

});
