const socket = new WebSocket('wss://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/');

socket.onopen = () => {
    console.log('Connected to WebSocket server');
    socket.send('Hello from GitHub Pages!');
};

socket.onmessage = (event) => {
    displayMessage(event.data, document.getElementById("chat-box"));
    console.log('Message from server:', event.data);
};

socket.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};
document.getElementById('send-btn')
    .addEventListener('click', () => sendMessage(
        document.getElementById("chat-box"),
        document.getElementById("chat-input")
    ));
document.getElementById('chat-input').addEventListener("keypress", function(e){
    if (e.key === "Enter"){
        sendMessage(document.getElementById("chat-box"), document.getElementById("chat-input"));
    }
});

function sendMessage(chatBox, chatInput){
    const message = chatInput.value;

    if (message.trim() !== '') {
        socket.send(message.toString())
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
function displayMessage(message, chatBox, sender = "Server") {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}
