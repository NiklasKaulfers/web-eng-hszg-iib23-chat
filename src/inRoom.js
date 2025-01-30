const roomForSocket = sessionStorage.getItem("room");
const roomTokenForSocket = sessionStorage.getItem("room_token");
if (!roomForSocket) {
    displayMessage("Not logged into any room",document.getElementById("chat-box"), "Server")
}
if (!roomTokenForSocket) {
    displayMessage("Authorization missing please login again.",document.getElementById("chat-box"), "Server")
}
const params = {
    room: roomForSocket,
    roomToken: roomTokenForSocket,
}
const queryString = new URLSearchParams(params).toString();


const socket =
    new WebSocket(`wss://jleaiewm4jdsrd2wm2coiwuwnu.appsync-realtime-api.eu-central-1.amazonaws.com?${queryString}`);

// socket endpoint
const socketCallSocket = async () => {
    const token = sessionStorage.getItem("room_token");
    if (!token) {
        alert("Please log in and try again!");
        return;
    }
    try{
        const requestForKey = await fetch("http://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/chatKey", {
            method: "Get",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
    }catch(err){
        alert(err)
        return;
    }
    if (!requestForKey) {
        alert("Error with verification please login and try again!");
        return;
    }
    const data = await requestForKey.json();
    if (data.error) {
        alert(data.error);
        return;
    }
    if (data.success) {
        // not working properly, secret not existing in backend
        socket.send({

        });
    }
};


socket.onopen = () => {

    socket.send(JSON.stringify({
        type: "auth",
        body: {
            room: roomForSocket,
            roomToken: roomTokenForSocket,
        }
    }));
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
        //todo: impl of refresh function in backend and frontend
    }
}

// Function to send a message to the WebSocket server
async function sendMessage(chatBox, chatInput) {
    const message = chatInput.value;
    const token = sessionStorage.getItem("room_token");
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
    }
    if (socket.readyState !== WebSocket.OPEN) {
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
    // todo: impl subscription in backend to not have api key displayed publicly
}
function handleEventData(payload) {
    // Process the event data
    console.log('Received event:', payload);
    displayMessage(payload.data.message, document.getElementById("chat-box"), payload.data.user)
}


