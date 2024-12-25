// Connect to the WebSocket server
const socket = new WebSocket('wss://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com');

// Event: When the WebSocket connection is open
socket.onopen = () => {
    console.log('Connected to WebSocket server');
};

// Event: When a message is received from the WebSocket server
socket.onmessage = (event) => {
    const message = typeof event.data === "string" ? event.data : new TextDecoder().decode(event.data);
    console.log('Message from server:', message);
    displayMessage(message, document.getElementById("chat-box"), "Other User");
};
// Event: When the WebSocket connection is closed
socket.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

// Event: When an error occurs on the WebSocket
socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// Add event listener to send button
document.getElementById('send-btn')
    .addEventListener('click', () => sendMessage(
        document.getElementById("chat-box"),
        document.getElementById("chat-input")
    ));

// Add "Enter" key functionality for the input box
document.getElementById('chat-input').addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage(
            document.getElementById("chat-box"),
            document.getElementById("chat-input")
        );
    }
});

// Function to send a message to the WebSocket server
function sendMessage(chatBox, chatInput) {
    const message = chatInput.value;

    if (message.trim() !== '' && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        displayMessage(message, chatBox, "You"); // Add sent message to chat
        chatInput.value = ''; // Clear input box
    } else if (socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not open. Unable to send message.');
    }
}

// Function to display a message in the chat box
function displayMessage(message, chatBox, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}
