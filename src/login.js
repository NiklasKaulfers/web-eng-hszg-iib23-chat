
document.getElementById("confirm").addEventListener("click",
    function (){
    const username = document.getElementById("userName").value;
    const password = document.getElementById("password").value;
    login(username, password);
    });

export async function login(username, password) {
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
        localStorage.setItem("userName", data.userName)
        localStorage.setItem("password", data.password)
    } else {
        console.log("Login failed");
    }
}