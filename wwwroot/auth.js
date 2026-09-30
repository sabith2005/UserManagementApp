document.getElementById("loginForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = "";

    if (!email || !password) {
        errorMessage.textContent =
            "Email and password are required.";
        return;
    }

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage.textContent =
                data.message || "Invalid email or password.";
            return;
        }

        window.location.href = "/users.html";
    }
    catch (error) {
        console.error("Login error:", error);

        errorMessage.textContent =
            "Unable to connect to the server.";
    }
});