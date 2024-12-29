
document.getElementById("confirm").addEventListener("click",
    function (){
    const username = document.getElementById("userName").value;
    const password = document.getElementById("password").value;
    login(username, password);
    });

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
        const d = new Date();
        console.log("Login successful");
        document.cookie = `authToken=${data.token}; path=/; expires=${d.getUTCDate() + 3600000}; Secure; HttpOnly`;
        document.cookie = `userName=${data.userName}; path=/; expires=${d.getUTCDate() + 3600000}; Secure; HttpOnly`;
        document.cookie = `password=${data.password}; path=/; expires=${d.getUTCDate() + 3600000}; Secure; HttpOnly`;
    } else {
        console.log("Login failed");
    }
}