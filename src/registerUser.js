document.getElementById("confirm").addEventListener("click", async () =>{
    const username = document.getElementById("userName").value;
    const passwordTop = document.getElementById("password").value;
    const passwordBottom = document.getElementById("comparePassword").value;
    const email = document.getElementById("email").value;
    await registrationSteps(username, passwordTop, passwordBottom, email);
})


async function registrationSteps(username, passwordTop, passwordBottom, email) {
    const passwordsAreTheSame = await doublePasswordCheck(passwordTop, passwordBottom);
    if (passwordsAreTheSame) {
        await createUser(username, passwordTop, passwordBottom, email);
    } else {
        document.getElementById("successOfUserRegistration").innerHTML = "Passwords are not the same."
    }
}

async function doublePasswordCheck(passwordTop, passwordBottom) {
    if (passwordTop === passwordBottom) {
        return true;
    } else {
        return false;
    }
}

async function createUser(userName, password, email) {
    const response = await fetch(
        "https://web-ing-iib23-chat-app-backend-377dbfe5320c.herokuapp.com/api/users",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user: userName, password: password, email: email})
        }
    );
    const data = await response.json();
    document.getElementById("successOfUserRegistration").innerHTML = data.message;
}