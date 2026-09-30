# User Management Application

A simple User Management application developed as part of the Junior Developer Technical Assessment.

The application provides user authentication, user management, search, pagination, and a Fibonacci table generator.

---

## 1. Technologies Used

- ASP.NET Core .NET 10
- C#
- HTML
- JavaScript
- SQL Server
- Entity Framework Core
- Cookie Authentication
- Microsoft.AspNetCore.Identity PasswordHasher

No frontend framework is used.

---

## 2. Main Features

### Login

Users can log in using:

- Email
- Password

Successful login redirects the user to the User List.

Invalid login credentials display an error message.

Inactive users cannot log in.

---

### User Management

The application supports:

- View users
- Search users by name or email
- Pagination
- Add user
- Edit user
- Delete user
- Logout

The User List displays:

- No
- Name
- Email
- Status
- Created At
- Actions

---

### Add User

A new user can be created with:

- Name
- Email
- Password
- Status

The password is hashed before it is stored in the database.

Duplicate email addresses are not allowed.

---

### Edit User

Existing users can be edited.

The following information can be changed:

- Name
- Email
- Status

The existing password is not changed when editing a user.

---

### Delete User

Users can be deleted from the User List.

A confirmation message is displayed before deletion.

---

### Logout

The logout function removes the authentication cookie and returns the user to the login page.

---

## 3. Fibonacci Generator

The application includes a separate Fibonacci Generator.

The user enters:

- Number of rows
- Number of columns

The application generates the required number of Fibonacci values and places them into the table from left to right, continuing on the next row.

Example:

For 4 rows and 5 columns:

| 0 | 1 | 1 | 2 | 3 |
|---|---|---|---|---|
| 5 | 8 | 13 | 21 | 34 |
| 55 | 89 | 144 | 233 | 377 |
| 610 | 987 | 1597 | 2584 | 4181 |

---

## 4. Project Structure

```text
UserManagementApp
│
├── Controllers
│   ├── AuthController.cs
│   └── UsersController.cs
│
├── Data
│   ├── AppDbContext.cs
│   └── DbSeeder.cs
│
├── DTOs
│   ├── CreateUserRequest.cs
│   ├── LoginRequest.cs
│   └── UpdateUserRequest.cs
│
├── Models
│   └── User.cs
│
├── Migrations
│
├── wwwroot
│   ├── index.html
│   ├── auth.js
│   │
│   ├── users.html
│   ├── users.js
│   │
│   ├── add-user.html
│   ├── add-user.js
│   │
│   ├── edit-user.html
│   ├── edit-user.js
│   │
│   ├── fibonacci.html
│   └── fibonacci.js
│
├── Program.cs
├── appsettings.json
└── README.md