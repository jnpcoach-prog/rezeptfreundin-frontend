// Wartet, bis die komplette Webseite geladen ist
document.addEventListener('DOMContentLoaded', () => {

    // Holt sich die wichtigen Elemente von der HTML-Seite
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatWindow = document.querySelector('.chat-window'); // NEU: Das Chat-Fenster

    // Diese Funktion wird ausgeführt, wenn der "Senden"-Button geklickt wird
    const handleSend = () => {
        const message = userInput.value.trim(); // Holt den Text aus dem Eingabefeld

        // Prüft, ob überhaupt etwas eingegeben wurde
        if (message) {
            // NEU: Zeigt die Nachricht des Nutzers sofort im Chat an
            addMessageToChat(message, 'user');

            // NEU: Sendet die Nachricht an unsere "Küche" (Backend)
            sendMessageToBackend(message);

            userInput.value = ''; // Leert das Eingabefeld nach dem Senden
        }
    };

    // NEU: Funktion, um eine Nachricht im Chat-Fenster anzuzeigen
    const addMessageToChat = (text, sender) => {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';

        if (sender === 'user') {
            // Nachricht vom Nutzer (rechtsbündig, anderer Stil)
            messageWrapper.classList.add('user-message-wrapper');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            const p = document.createElement('p');
            p.textContent = text;
            messageDiv.appendChild(p);
            messageWrapper.appendChild(messageDiv);
        } else {
            // Nachricht vom Bot (mit Avatar)
            const avatar = document.createElement('img');
            avatar.src = 'foto-hero.jpg';
            avatar.alt = 'Jacqueline';
            avatar.className = 'avatar';
            messageWrapper.appendChild(avatar);

            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            const p = document.createElement('p');
            p.textContent = text;
            messageDiv.appendChild(p);
            messageWrapper.appendChild(messageDiv);
        }

        chatWindow.appendChild(messageWrapper);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scrollt automatisch nach unten
    };

    // NEU: Die Kernfunktion, die mit dem Backend spricht
    const sendMessageToBackend = async (message) => {
        // WICHTIG: Ersetze diese URL mit der URL deines Backends!
        const backendUrl = 'https://rezeptfreundin-backend.onrender.com';

        try {
            // Zeigt eine "denkt nach..." Nachricht an
            addMessageToChat('...', 'bot');

            // Schickt die Anfrage an die "Küche"
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }) // Sendet die Nachricht als JSON
            });

            const data = await response.json(); // Liest die Antwort der Küche

            // Aktualisiert die "denkt nach..." Nachricht mit der echten Antwort
            const thinkingMessage = chatWindow.querySelector('.bot-message:last-child p');
            if (thinkingMessage && thinkingMessage.textContent === '...') {
                thinkingMessage.textContent = data.reply;
            }

        } catch (error) {
            console.error("Fehler bei der Kommunikation mit dem Backend:", error);
            // Aktualisiert die "denkt nach..." Nachricht mit einer Fehlermeldung
            const thinkingMessage = chatWindow.querySelector('.bot-message:last-child p');
            if (thinkingMessage && thinkingMessage.textContent === '...') {
                thinkingMessage.textContent = 'Oh, entschuldige. Meine Küche hat gerade ein kleines technisches Problem. Bitte versuche es in einem Moment noch einmal.';
            }
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
