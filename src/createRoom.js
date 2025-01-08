document.getElementById("submitRoomCreation").addEventListener("click", async () => {
    const roomName = document.getElementById("roomName").value;
    const roomPin = document.getElementById("roomPin").value;
    await sendRoomCreation(roomName, roomPin);
});

async function sendRoomCreation(roomName, roomPin) {
    const token = localStorage.getItem("jwt_token");
    if (!roomPin){
        roomPin = "";
    }
    if (!token){
        const notLoggedInError = new Error("please login or create an account to be able to create rooms.");
        console.error(notLoggedInError);
        // todo implement error
        return;
    }
    const response = await fetch("https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            pin: roomPin,
            display_name: roomName
            }
        )
    });
    if (response.ok){
        // todo: implement visual display for user
        console.log(response.message);
    } else {
        console.log(response.message)
    }
}