fetchRooms();

async function fetchRooms() {
    try {
        const response = await fetch(
            'https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/rooms', {
                method: "GET"
            }
        );
        if (!response.ok) {
            console.error("Error fetching the rooms")
            return;
        }

        const data = await response.json();
        const roomsContainer = document.getElementById('roomsContainer');

        roomsContainer.innerHTML = '';

        if (data.rooms && data.rooms.length > 0) {
            data.rooms.forEach(room => {
                const roomDiv = document.createElement('div');
                roomDiv.className = 'room';
                roomDiv.addEventListener("click", async () => {
                    if (room.has_password === "True") {
                        await sendJoinRequestWithPin(room.id);
                    } else {
                        await sendJoinRequestWithoutPin(room.id);
                    }
                });
                const displayName = document.createElement('h3');
                displayName.textContent = room.display_name;

                const id = document.createElement('p');
                id.textContent = `ID: ${room.id}`;

                const creator = document.createElement('p');
                creator.textContent = `Creator: ${room.creator}`;

                const hasPassword = document.createElement('p');
                hasPassword.textContent = `Has Password: ${room.has_password}`;

                roomDiv.appendChild(displayName);
                roomDiv.appendChild(id);
                roomDiv.appendChild(creator);
                roomDiv.appendChild(hasPassword);

                roomsContainer.appendChild(roomDiv);
            });
        } else {
            roomsContainer.innerHTML = '<p>No rooms found.</p>';
        }
    } catch (error) {
        console.error('Error fetching rooms:', error);
        document.getElementById('roomsContainer').innerHTML = '<p>Failed to load rooms.</p>';
    }
}

async function sendJoinRequestWithoutPin(roomId) {
    const token = sessionStorage.getItem("jwt_token");
    if (!token) {
        console.error("Error getting the token.");
        return;
    }
    const pin = "";
    try {
        const response = await fetch("https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/rooms/" + roomId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                pin: pin
            })
        });
        const data = await response.json();
        if (!response.ok || !data) {
            console.error("Error joining room.");
            return;
        }
        sessionStorage.setItem("room_token", data.roomToken);
    } catch (error) {
        console.error('Error sending joinRequest', error);
    }

}

async function sendJoinRequestWithPin(roomId) {
    const pinInput = document.createElement('div');
    pinInput.className = "modal";

    const overlay = document.createElement('div');
    overlay.className = "overlay";
    overlay.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(pinInput);
    };

    const modalContent = document.createElement('div');
    modalContent.className = "modal-content";

    const label = document.createElement('label');
    label.textContent = "Enter Room PIN:";
    modalContent.appendChild(label);

    const input = document.createElement('input');
    input.type = "password";
    input.placeholder = "Enter PIN";
    modalContent.appendChild(input);

    const submitButton = document.createElement('button');
    submitButton.textContent = "Join";
    modalContent.appendChild(submitButton);
    pinInput.appendChild(modalContent);

    document.body.appendChild(overlay);
    document.body.appendChild(pinInput);
    submitButton.onclick = async () => {
        const pin = input.value;
        if (!pin) {

        }
    }

    const token = sessionStorage.getItem("jwt_token");
    if (!token) {
        console.error("Error getting the token.");
        return;
    }
    // posts a join request to the specific room, with the pin input prior
    // will on success return a token, that allows access to the room to this specific user
    // todo: will add user to a list of users in that room, that are able to listen to what other users write
    try {
        const response = await fetch(
            "https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/rooms/"
            + roomId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({pin: pin})
            }
        );
        const data = await response.json();
        if (!response.ok || !data) {
            console.error("Error joining room.");
            return;
        }
        sessionStorage.setItem("room", roomId)
        sessionStorage.setItem("room_token", data.roomToken);
    } catch (error) {
        console.error('Error sending joinRequest', error);
    }
}