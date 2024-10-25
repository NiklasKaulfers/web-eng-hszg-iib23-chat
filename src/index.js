document.getElementById('send-btn').addEventListener('click', function() {
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
});

