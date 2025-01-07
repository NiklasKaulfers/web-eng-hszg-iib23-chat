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
        localStorage.setItem("userName", username);
        localStorage.setItem("password", password);
        localStorage.setItem("jwt_token", response.body["accessToken"]);
        console.log("JWT token saved.");
        localStorage.setItem("refreshToken", response.body["refreshToken"]);
    } else {
        console.log("Login failed");
    }
}