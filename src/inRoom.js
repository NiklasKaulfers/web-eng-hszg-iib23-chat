// Connect to the WebSocket server
const socket = new WebSocket('wss://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com');
let user = null;
let password = null;
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
        await login(user, password);
    }
}

// Function to send a message to the WebSocket server
async function sendMessage(chatBox, chatInput) {
    const message = chatInput.value;
    const token = localStorage.getItem("jwt_token");

    if (message.trim() !== '' && socket.readyState === WebSocket.OPEN) {
        await localLogin();
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
        chatInput.value = '';
    } else if (socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not open. Unable to send message.');
        displayMessage("Could not send last message.", chatBox, "Server")
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
        this.user = username;
        this.password = password;
        this.token = data.token;
        console.log("Login successful");
 } else {
        console.log("Login failed");
    }
}

// JavaScript for handling modal behavior
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("loginModal");
    const openBtn = document.getElementById("openLoginBtn");
    const closeBtn = document.getElementById("closeLoginBtn");
    const loginForm = document.getElementById("loginForm");

    // Open the modal
    openBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close the modal when clicking the "X" button
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close the modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle form submission
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username: username, password: password})
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                user = username;
                modal.style.display = "none"; // Close the modal
            } else {
                alert("Login failed: " + data.error);
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
