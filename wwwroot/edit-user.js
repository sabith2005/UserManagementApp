document.addEventListener("DOMContentLoaded", function () {

    loadUser();

    const form =
        document.getElementById("editUserForm");

    form.addEventListener("submit", updateUser);

});


async function loadUser() {

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        alert("User ID is missing.");

        window.location.href = "/users.html";

        return;
    }

    try {

        const response = await fetch(
            `/api/users/${id}`,
            {
                credentials: "include"
            }
        );

        if (response.status === 401) {

            window.location.href = "/index.html";

            return;
        }

        if (!response.ok) {

            alert("Unable to load user.");

            return;
        }

        const user = await response.json();

        document.getElementById("name").value =
            user.name;

        document.getElementById("email").value =
            user.email;

        document.getElementById("status").value =
            user.status;

    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Unable to load user.";
    }
}


async function updateUser(event) {

    event.preventDefault();

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    const name =
        document.getElementById("name")
            .value
            .trim();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const status =
        document.getElementById("status")
            .value;

    const message =
        document.getElementById("message");

    if (!name || !email) {

        message.textContent =
            "Name and email are required.";

        return;
    }

    message.textContent =
        "Updating user...";

    try {

        const response = await fetch(
            `/api/users/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    name: name,
                    email: email,
                    status: status
                })
            }
        );

        console.log(
            "Update status:",
            response.status
        );

        const responseText =
            await response.text();

        console.log(
            "Update response:",
            responseText
        );

        if (response.status === 401) {

            window.location.href =
                "/index.html";

            return;
        }

        if (!response.ok) {

            message.textContent =
                "Unable to update user.";

            return;
        }

        message.textContent =
            "User updated successfully.";

        setTimeout(function () {

            window.location.href =
                "/users.html";

        }, 500);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";
    }
}