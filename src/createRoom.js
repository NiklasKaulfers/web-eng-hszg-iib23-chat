document.getElementById("submitRoomCreation").addEventListener("click", async () => {
    const roomName = document.getElementById("roomName").value;
    const roomPin = document.getElementById("roomPin").value;
    await sendRoomCreation(roomName, roomPin);
});

async function sendRoomCreation(roomName, roomPin) {
    const token = localStorage.getItem("jwt_token");
    if (!roomPin) {
        roomPin = "";
    }
    if (token === null|| token === undefined) {
        const notLoggedInError = new Error("Please log in or create an account to be able to create rooms.");
        console.error(notLoggedInError);
        return;
    }
    console.log("token: " + token);

    const response = await fetch("https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            pin: roomPin,
            display_name: roomName
        })
    });

    const data = await response.json();
    if (response.ok) {
        console.log(data.message);
        // todo: implement visual display for the user
    } else {
        if (response.status === 403) {
            alert("Session expired or invalid token. Please log in again.");
        }
        console.log(data.error);
    }
}
