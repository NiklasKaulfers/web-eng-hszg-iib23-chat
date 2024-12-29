const userName = document.getElementById("username").value;
const password = document.getElementById("password").value;

document.getElementById("confirm").addEventListener("click",
    useLogin(userName, password));

function useLogin(userName, password) {
    const loginSuccess = login(userName, password);
}

async function login(username, password) {
    const response = await fetch("https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username: username, password: password})
    });

    const data = await response.json();

    if (response.ok) {
        console.log("Login successful");
        localStorage.setItem("jwt_token", data.token)
    } else {
        console.log("Login failed");
    }
}