# User Management Application

A simple User Management application developed as part of the Junior Developer Technical Assessment.

The application provides user authentication, user management, search, pagination, and a Fibonacci table generator.

---

## 1. Technologies Used

* ASP.NET Core .NET 10
* C#
* HTML
* JavaScript
* SQL Server
* Entity Framework Core
* Cookie Authentication
* Microsoft.AspNetCore.Identity PasswordHasher

No frontend framework is used.

---

## 2. Main Features

### Login

Users can log in using:

* Email
* Password

Successful login redirects the user to the User List.

Invalid login credentials display an error message.

Inactive users cannot log in.

### User Management

The application supports:

* View users
* Search users by name or email
* Pagination
* Add user
* Edit user
* Delete user
* Logout

The User List displays:

* No
* Name
* Email
* Status
* Created At
* Actions

### Add User

A new user can be created with:

* Name
* Email
* Password
* Status

The password is hashed before it is stored in the database.

Duplicate email addresses are not allowed.

### Edit User

Existing users can be edited.

The following information can be changed:

* Name
* Email
* Status

The existing password is not changed when editing a user.

### Delete User

Users can be deleted from the User List.

A confirmation message is displayed before deletion.

### Logout

The logout function removes the authentication cookie and returns the user to the login page.

---

## 3. Fibonacci Generator

The application includes a separate Fibonacci Generator.

The user enters:

* Number of rows
* Number of columns

The application generates the required number of Fibonacci values and places them into the table from left to right, continuing on the next row.

Example:

For 4 rows and 5 columns:

| 0   | 1   | 1    | 2    | 3    |
| --- | --- | ---- | ---- | ---- |
| 5   | 8   | 13   | 21   | 34   |
| 55  | 89  | 144  | 233  | 377  |
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
│   ├── users.html
│   ├── users.js
│   ├── add-user.html
│   ├── add-user.js
│   ├── edit-user.html
│   ├── edit-user.js
│   ├── fibonacci.html
│   └── fibonacci.js
│
├── Program.cs
├── appsettings.json
└── README.md
```

---

## 5. Database

The application uses SQL Server with Entity Framework Core.

The database is named:

```text
UserManagementDb
```

The application automatically applies Entity Framework Core migrations when it starts.

The first user is automatically created by the database seeder if no users exist.

---

## 6. Demo Login

The application creates the following initial user:

```text
Email: admin@example.com
Password: admin123
```

The password is stored as a secure hash rather than plain text.

---

## 7. Security

The application includes the following security measures:

* Password hashing using `PasswordHasher`
* Cookie-based authentication
* Authorization on user management APIs
* Authentication checks before accessing protected pages
* Duplicate email validation
* Input validation using Data Annotations
* Passwords are never returned by the API
* Password hashes are not exposed to the frontend
* API requests from unauthenticated users return HTTP 401
* Sensitive user information is not included in user list responses

---

## 8. How to Run

### Prerequisites

Install:

* .NET 10 SDK
* SQL Server
* Visual Studio or another compatible C# IDE

### Steps

1. Clone the repository.
2. Open the solution in Visual Studio.
3. Make sure SQL Server is running.
4. Check the connection string in `appsettings.json`.
5. Build the solution.
6. Run the application.

The application will automatically:

* Create/apply the database migration.
* Create the database if required.
* Seed the initial admin user if no users exist.

---

## 9. API Endpoints

### Authentication

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Users

```text
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

---

## 10. Design Decisions

### Backend

ASP.NET Core was selected to provide:

* API development
* Authentication
* Authorization
* Database access
* Server-side validation

### Database

SQL Server with Entity Framework Core was selected for persistent user storage.

### Frontend

Plain HTML and JavaScript were used instead of a frontend framework because the assessment allows plain HTML and the application does not require a large frontend framework.

### Authentication

Cookie authentication was selected to maintain the authenticated session between the frontend and backend.

---

## 11. Error Handling

The application handles common errors such as:

* Invalid login credentials
* Inactive user login attempts
* Missing required fields
* Invalid email addresses
* Duplicate email addresses
* User not found
* Unauthorized requests
* Database/API request failures

---

## 12. Assumptions

* The initial administrator account is created automatically when the database contains no users.
* Passwords must contain at least 6 characters when creating a user.
* User email addresses must be unique.
* Editing a user does not require changing the existing password.
* Fibonacci rows and columns are limited to reasonable values to prevent excessive browser processing.

---

## 13. GitHub Repository

The complete source code is available in the GitHub repository for this assessment.

---

## 14. Assessment Requirements Covered

The application covers the requested functionality including:

* Login
* User list
* User search
* Pagination
* Add user
* Edit user
* Delete user
* Logout
* Fibonacci generator
* Database persistence
* Password hashing
* Authentication and authorization
* Input validation
* Error handling
* Project documentation

---

## 15. Candidate Notes

The project was developed with a focus on simple project structure, readable code, secure password handling, server-side validation, and separation between frontend and backend responsibilities.
