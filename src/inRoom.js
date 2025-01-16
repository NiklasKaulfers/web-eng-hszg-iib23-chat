
const socket = new WebSocket('wss://' + process.env.AWS_WS_ENDPOINT);

socket.onopen = () => {
    socket.send(JSON.stringify({type: "connection_init"}))
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch(data.type) {
        case 'connection_ack':
            // Connection established, subscribe to events
            subscribeToEvents();
            break;
        case 'ka':
            // Keep-alive message, no action needed
            break;
        case 'data':
            handleEventData(data.payload);
            break;
        // Handle other message types as needed
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
async function refreshToken() {
    const d = new Date();
    if (lastTokenRequest === null || lastTokenRequest <= d.getTime() - (60000 * 30)) {
        lastTokenRequest = d.getTime();
        const refresh = await fetch()

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
        await refreshToken();
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

// Function to display a message in the chat box
function displayMessage(message, chatBox, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}


function subscribeToEvents() {
    // Send subscription message
    socket.send(JSON.stringify({
        id: 'unique_subscription_id',
        type: 'start',
        payload: {
            "data": "subscription MySubscription{ onNewMessage {message user}}"
        },
        "authorization":{
            "x-api-key": process.env.AWS_API_KEY,
            "host": "wss://" + process.env.AWS_WS_ENDPOINT
        }
    }));
}
function handleEventData(payload) {
    // Process the event data
    console.log('Received event:', payload);
    displayMessage(payload.data.message, document.getElementById("chat-box"), payload.data.user)
}


/**
 * Encodes an object into Base64 URL format
 * @param {*} authorization - an object with the required authorization properties
 **/
function getBase64URLEncoded(authorization) {
    return btoa(JSON.stringify(authorization))
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_') // Convert '/' to '_'
        .replace(/=+$/, '') // Remove padding `=`
}

function getAuthProtocol(authorization) {
    const header = getBase64URLEncoded(authorization)
    return `header-${header}`
}

