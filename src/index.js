const ws = new WebSocket('ws://your-websocket-server-url');

ws.onopen = () => {
    console.log('Connected to the server');
};

ws.onmessage = (event) => {
    const messages = document.getElementById('chat-messages');
    const message = document.createElement('li');
    message.textContent = event.data;
    messages.appendChild(message);
};

const form = document.getElementById('chat-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('message');
    ws.send(input.value);
    input.value = '';
});
