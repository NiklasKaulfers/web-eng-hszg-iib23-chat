document.getElementById("confirm").addEventListener("click",
    async function (){
    const username = document.getElementById("userName").value;
    const password = document.getElementById("password").value;
    await login(username, password);
    });

async function login(username, password) {
    const response = await fetch("https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username: username, password: password})
    });

    if (response.ok) {
        console.log("Login successful");
        sessionStorage.setItem("userName", username);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("jwt_token", response.body["accessToken"]);
        console.log("JWT token saved.");
        sessionStorage.setItem("refreshToken", response.body["refreshToken"]);
        await showNotification("login successful.")
    } else {
        console.log("Login failed");
        await showNotification("login failed")
    }
}

async function showNotification(text) {
    const notification = document.getElementById('response');
    notification.innerText = text;
    notification.style.display = 'block';
}