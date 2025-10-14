document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatWindow = document.querySelector('.chat-window');
    const preferencesCheckboxes = document.querySelectorAll('.preferences input[type="checkbox"]');

    const handleSend = () => {
        const message = userInput.value.trim();

        // NEU: Liest alle angehakten Checkboxen aus
        const selectedPreferences = [];
        preferencesCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedPreferences.push(checkbox.value);
            }
        });

        if (message) {
            addMessageToChat(message, 'user');
            // NEU: Sendet jetzt auch die Präferenzen mit
            sendMessageToBackend(message, selectedPreferences);
            userInput.value = '';
        }
    };

    const addMessageToChat = (text, sender) => {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';

        if (sender === 'user') {
            messageWrapper.classList.add('user-message-wrapper');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            const p = document.createElement('p');
            p.textContent = text;
            messageDiv.appendChild(p);
            messageWrapper.appendChild(messageDiv);
        } else {
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
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // NEU: Die Funktion akzeptiert jetzt auch die Präferenzen
    const sendMessageToBackend = async (message, preferences) => {
        const backendUrl = 'https://rezeptfreundin-backend.onrender.com';

        try {
            addMessageToChat('...', 'bot');

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // NEU: Sendet jetzt ein Paket mit Nachricht UND Präferenzen
                body: JSON.stringify({ 
                    message: message,
                    preferences: preferences 
                })
            });

            if (!response.ok) {
                // Fängt Server-Fehler ab (wie 502)
                throw new Error(`Server-Fehler: ${response.status}`);
            }

            const data = await response.json();

            const thinkingMessage = chatWindow.querySelector('.bot-message:last-child p');
            if (thinkingMessage && thinkingMessage.textContent === '...') {
                thinkingMessage.textContent = data.reply;
            }

        } catch (error) {
            console.error("Fehler bei der Kommunikation mit dem Backend:", error);
            const thinkingMessage = chatWindow.querySelector('.bot-message:last-child p');
            if (thinkingMessage && thinkingMessage.textContent === '...') {
                thinkingMessage.textContent = 'Oh, entschuldige. Meine Küche hat gerade ein kleines technisches Problem. Bitte versuche es in einem Moment noch einmal.';
            }
        }
    };

    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    });
});
