import { Amplify } from 'aws-amplify';
import { events } from 'aws-amplify/data';

Amplify.configure({
    "API": {
        "Events": {
            "endpoint": process.env.AWS_ENDPOINT,
            "region": "eu-central-1",
            "defaultAuthMode": "apiKey",
            "apiKey": process.env.API_KEY,
        }
    }
});

// Connect to the WebSocket server
const socket = new WebSocket('wss://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com');
// Event: When the WebSocket connection is open
socket.onopen = () => {
    console.log('Connected to WebSocket server');
};

// Event: When a message is received from the WebSocket server
socket.onmessage = (event) => {
    console.log("Raw message received:", event.data); // Log raw message for debugging
    try {
        const data = JSON.parse(event.data); // Parse the incoming message

        const user = data.user;
        const message = data.message;

        // Display the message correctly
        displayMessage(message, document.getElementById("chat-box"), user);
    } catch (e) {
        console.error("Error parsing message:", e);
    }
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

document.getElementById('chat-input').addEventListener("keypress", async function (e) {
    if (e.key === "Enter") {
        await sendMessage(
            document.getElementById("chat-box"),
            document.getElementById("chat-input")
        );
    }
});
let lastTokenRequest;
// refresh token all 30 minutes
async function localLogin() {
    const d = new Date();
    if (lastTokenRequest === null || lastTokenRequest <= d.getTime() - (60000 * 30)) {
        lastTokenRequest = d.getTime();
        // calls function which will save new token
        const user = sessionStorage.getItem("userName");
        const password = sessionStorage.getItem("password")
        await login(user, password);
    }
}

// Function to send a message to the WebSocket server
async function sendMessage(chatBox, chatInput) {
    const message = chatInput.value;
    const token = sessionStorage.getItem("roomToken");
    if (!token) {
        displayMessage( "Please log into the room again to send messages.",chatBox, "Server");
        return;
    }

    if (message.trim() !== '' && socket.readyState === WebSocket.OPEN) {
        await localLogin();
        const formattedMessage = JSON.stringify({ message: message });
        const sendMessage =  await fetch(
            "https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/messages",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`},
                body: formattedMessage,
            }
        )
        displayMessage(message, chatBox, "You");
        if (!sendMessage.ok){
            displayMessage("Could not send last message.", chatBox, "Server")
        }
        chatInput.value = '';
    } else if (socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not open. Unable to send message.');
        displayMessage("Could not send last message.", chatBox, "Server")
    }
}

async function listen(){
    const channel = await events.connect('/default/' );
    channel.subscribe({
        next: (data) => {
            displayMessage(data.message, document.getElementById("chat-box"), data.sender);
        },
        error: (err) => displayMessage(err.message, document.getElementById("chat-box"), "Server"),
    });
}

// Function to display a message in the chat box
function displayMessage(message, chatBox, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

