
fetchRooms();

async function fetchRooms() {
    try {
        const response = await fetch('https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/rooms', {
            method: "GET"
        });
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
                let pin = "";
                roomDiv.onclick = async () => {
                    if (room.has_password === "True") {
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
                                alert("PIN is required to join this room.");
                            }
                        }
                    }

                    const token = sessionStorage.getItem("jwt_token");
                    try {
                        const response = await fetch('https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/rooms/' + room.id, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({pin: pin})
                        });

                        if (response.ok) {
                            const data = response.json();
                            if (!data){
                                console.error("Error getting the content of the response.")
                                return;
                            }
                            if (!data.roomToken){
                                console.error("Server sent no token.");
                                return;
                            }
                            console.log(`joined successfully in room ${room.id} (${room.display_name})`);
                            sessionStorage.setItem("room_key", data.roomToken);
                            document.body.removeChild(overlay);
                            document.body.removeChild(pinInput);
                        } else {
                            const error = await response.json();
                            alert(error.message || "Failed to join the room.");
                        }
                    } catch (err) {
                        alert("An error occurred while trying to join the room.");
                    }
                }
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
