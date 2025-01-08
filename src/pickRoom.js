async function fetchRooms() {
    try {
        const response = await fetch('https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/rooms', {
            method: "GET"
        });
        if (!response.ok) {
            console.error("Error fetching the rooms")
            throw new Error('Failed to fetch rooms');
        }

        const data = await response.json();
        const roomsContainer = document.getElementById('roomsContainer');

        // Clear initial loading message
        roomsContainer.innerHTML = '';

        if (data.rooms && data.rooms.length > 0) {
            data.rooms.forEach(room => {
                const roomDiv = document.createElement('div');
                roomDiv.className = 'room';
                roomDiv.onclick = () => alert(`Room ID: ${room.id}`); // Example button action

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

await fetchRooms();