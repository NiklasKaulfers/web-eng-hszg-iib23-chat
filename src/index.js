// whattafak

document.getElementById('send-btn').addEventListener('click', sendMessage(document.getElementById("chat-box"), document.getElementById("chat-input")));
document.getElementById('chat-input').addEventListener("keypress", function(e){
    if (e.key === "Enter"){
        sendMessage(document.getElementById("chat-box"), document.getElementById("chat-input"));
    }
});

function sendMessage(chatBox, chatInput){
    const message = chatInput.value;

    if (message.trim() !== '') {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
