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

// Add "Enter" key functionality for the input box
document.getElementById('chat-input').addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage(
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
        const userName= getCookie("userName");
        const passWord = getCookie("password")
        await login(userName, passWord);
    }
}

// Function to send a message to the WebSocket server
async function sendMessage(chatBox, chatInput) {
    const message = chatInput.value;
    const token = localStorage.getItem("jwt_token");

    if (message.trim() !== '' && socket.readyState === WebSocket.OPEN) {
        localLogin();
        const formattedMessage = JSON.stringify({ message: message });
        const sendMessage =  await fetch(
            "https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/message",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,},
                body: JSON.stringify({message:formattedMessage, user:user}),
            }
        )
        displayMessage(message, chatBox, "You");
        if (!sendMessage.ok){
            displayMessage("Could not send last message.", chatBox, "Server")
        }
 // Add sent message to chat
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
// copy and paste from login.js
async function login(username, password) {
    const response = await fetch("https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username: username, password: password})
    });

    const data = await response.json();

    if (response.ok) {
        console.log("Login successful");
        document.cookie = `authToken=${data.token}; path=/; expires=${d.getUTCDate() + 3600000}; Secure; HttpOnly`;
        document.cookie = `userName=${data.userName}; path=/; expires=${d.getUTCDate() + 3600000}; Secure; HttpOnly`;
        document.cookie = `password=${data.password}; path=/; expires=${d.getUTCDate() + 3600000}; Secure; HttpOnly`;
    } else {
        console.log("Login failed");
    }
}
function getCookie(name) {
    const cookieArray = document.cookie.split("; ");
    for (const cookie of cookieArray) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null; // Return null if the cookie is not found
}