console.log("ADD USER JS LOADED");

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("addUserForm");

    if (!form) {
        console.error("Add User form was not found.");
        return;
    }

    form.addEventListener("submit", saveUser);

});


async function saveUser(event) {

    event.preventDefault();

    console.log("Save User button clicked.");

    const message = document.getElementById("message");

    const name = document
        .getElementById("name")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const status = document
        .getElementById("status")
        .value;


    // Basic validation

    if (!name) {

        message.textContent =
            "Name is required.";

        return;
    }


    if (!email) {

        message.textContent =
            "Email is required.";

        return;
    }


    if (!password) {

        message.textContent =
            "Password is required.";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    message.textContent =
        "Saving user...";


    try {

        console.log("Sending request to /api/users");


        const response = await fetch(
            "/api/users",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    status: status
                })
            }
        );


        console.log(
            "Response status:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "Server response:",
            responseText
        );


        // Not logged in

        if (response.status === 401) {

            message.textContent =
                "Your session has expired. Please login again.";

            setTimeout(function () {

                window.location.href =
                    "/index.html";

            }, 1000);

            return;
        }


        // Email already exists

        if (response.status === 409) {

            try {

                const data =
                    JSON.parse(responseText);

                message.textContent =
                    data.message ||
                    "Email already exists.";

            } catch {

                message.textContent =
                    "Email already exists.";
            }

            return;
        }


        // Other server errors

        if (!response.ok) {

            message.textContent =
                "Unable to create user.";

            console.error(
                "Server error:",
                responseText
            );

            return;
        }


        // Success

        message.textContent =
            "User created successfully!";


        console.log(
            "User created successfully."
        );


        // Go back to User List

        setTimeout(function () {

            window.location.href =
                "/users.html";

        }, 500);

    }


    catch (error) {

        console.error(
            "Save User error:",
            error
        );

        message.textContent =
            "Unable to connect to the server.";
    }

}