const API_URL = 'http://localhost:3000';

async function sendMessage() {
    const username = document.getElementById('username').value;
    const recipient = document.getElementById('recipient').value;
    const message = document.getElementById('message').value;
    const statusDiv = document.getElementById('status');

    if (!username || !recipient || !message) {
        statusDiv.innerHTML = '<div class="error">Please fill in all fields</div>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: username,
                to: recipient,
                message: message
            })
        });

        const data = await response.json();

        if (response.ok) {
            statusDiv.innerHTML = '<div class="success">Message sent successfully!</div>';
            document.getElementById('message').value = '';
        } else {
            statusDiv.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        statusDiv.innerHTML = '<div class="error">Failed to send message. Is the server running?</div>';
    }
}

async function loadMessages() {
    const username = document.getElementById('username').value;
    const messagesDiv = document.getElementById('messages');

    if (!username) {
        messagesDiv.innerHTML = '<div class="error">Please enter your username first</div>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/messages/${username}`);
        const data = await response.json();

        if (response.ok) {
            if (data.messages.length === 0) {
                messagesDiv.innerHTML = '<p>No messages yet</p>';
            } else {
                messagesDiv.innerHTML = data.messages.map(msg => `
                    <div class="message">
                        <div class="message-header">
                            <span class="message-from">From: ${msg.from}</span>
                            <span class="message-to">To: ${msg.to}</span>
                        </div>
                        <div class="message-content">${msg.message}</div>
                    </div>
                `).join('');
            }
        } else {
            messagesDiv.innerHTML = `<div class="error">${data.error}</div>`;
        }
    } catch (error) {
        messagesDiv.innerHTML = '<div class="error">Failed to load messages. Is the server running?</div>';
    }
}
