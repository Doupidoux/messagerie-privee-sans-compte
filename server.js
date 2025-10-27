const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// In-memory storage (data will be lost when server restarts)
const messages = [];

app.use(cors());
app.use(express.json());

// Send a message
app.post('/send', (req, res) => {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMessage = {
        id: messages.length + 1,
        from,
        to,
        message,
        timestamp: new Date().toISOString()
    };

    messages.push(newMessage);
    res.json({ success: true, message: 'Message sent' });
});

// Get messages for a specific user
app.get('/messages/:username', (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const userMessages = messages.filter(msg => msg.to === username);
    res.json({ messages: userMessages });
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'Server is running', totalMessages: messages.length });
});

app.listen(PORT, () => {
    console.log(`Private Messenger server running on http://localhost:${PORT}`);
});
