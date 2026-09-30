let currentPage = 1;
const pageSize = 10;
let currentSearch = "";

document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
});

async function checkLogin() {

    try {

        const response = await fetch("/api/auth/me", {
            credentials: "include"
        });

        if (!response.ok) {
            window.location.href = "/index.html";
            return;
        }

        const user = await response.json();

        document.getElementById("currentUser").textContent =
            `Logged in as: ${user.name} (${user.email})`;

        loadUsers();

    } catch (error) {

        console.error(error);

        window.location.href = "/index.html";
    }
}

async function loadUsers() {

    try {

        let url = `/api/users?page=${currentPage}&pageSize=${pageSize}`;

        if (currentSearch) {
            url += `&search=${encodeURIComponent(currentSearch)}`;
        }

        const response = await fetch(url, {
            credentials: "include"
        });

        if (response.status === 401) {
            window.location.href = "/index.html";
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to load users.");
            return;
        }

        displayUsers(data);

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");
    }
}

function displayUsers(data) {

    const tableBody = document.getElementById("userTableBody");

    tableBody.innerHTML = "";

    if (data.items.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">No users found.</td>
            </tr>
        `;

        document.getElementById("recordInfo").textContent = "";
        document.getElementById("pagination").innerHTML = "";

        return;
    }

    data.items.forEach((user, index) => {

        const row = document.createElement("tr");

        const number =
            ((data.page - 1) * data.pageSize) + index + 1;

        row.innerHTML = `
            <td>${number}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.status)}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button onclick="editUser(${user.id})">
                    Edit
                </button>

                <button onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    const start =
        ((data.page - 1) * data.pageSize) + 1;

    const end =
        Math.min(
            data.page * data.pageSize,
            data.totalCount
        );

    document.getElementById("recordInfo").textContent =
        `Showing ${start}-${end} of ${data.totalCount} records`;

    displayPagination(data);
}

function displayPagination(data) {

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    if (data.totalPages <= 1) {
        return;
    }

    if (data.page > 1) {

        const previousButton = document.createElement("button");

        previousButton.textContent = "Previous";

        previousButton.onclick = function () {
            currentPage--;
            loadUsers();
        };

        pagination.appendChild(previousButton);
    }

    pagination.appendChild(
        document.createTextNode(
            ` Page ${data.page} of ${data.totalPages} `
        )
    );

    if (data.page < data.totalPages) {

        const nextButton = document.createElement("button");

        nextButton.textContent = "Next";

        nextButton.onclick = function () {
            currentPage++;
            loadUsers();
        };

        pagination.appendChild(nextButton);
    }
}

function searchUsers() {

    currentSearch =
        document.getElementById("searchInput").value.trim();

    currentPage = 1;

    loadUsers();
}

function clearSearch() {

    document.getElementById("searchInput").value = "";

    currentSearch = "";

    currentPage = 1;

    loadUsers();
}

function editUser(id) {

    window.location.href =
        `/edit-user.html?id=${id}`;
}

async function deleteUser(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`/api/users/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (response.status === 401) {
            window.location.href = "/index.html";
            return;
        }

        if (!response.ok) {

            const data = await response.json();

            alert(data.message || "Unable to delete user.");

            return;
        }

        loadUsers();

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");
    }
}

async function logout() {

    try {

        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

    } catch (error) {

        console.error(error);

    } finally {

        window.location.href = "/index.html";
    }
}

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    return new Date(dateString).toLocaleDateString();
}

function escapeHtml(value) {

    if (value == null) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}