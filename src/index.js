// whattafak

document.getElementById('send-btn').addEventListener('click', sendMessage());
document.getElementById('text').addEventListener("keypress", function(e){
    if (e.key === "Enter"){
        sendMessage();
    }
});

function sendMessage(){
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value;

    if (message.trim() !== '') {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
