using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagementApp.Data;
using UserManagementApp.DTOs;
using UserManagementApp.Models;

namespace UserManagementApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public UsersController(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        // GET: /api/users
        // Search and pagination
        [HttpGet]
        public async Task<IActionResult> GetUsers(
            string? search = null,
            int page = 1,
            int pageSize = 10)
        {
            if (page < 1)
            {
                page = 1;
            }

            if (pageSize < 1)
            {
                pageSize = 10;
            }

            var query = _context.Users
                .AsNoTracking();

            // Search by name or email
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();

                query = query.Where(u =>
                    u.Name.Contains(search) ||
                    u.Email.Contains(search));
            }

            // Get total number of records
            var totalCount = await query.CountAsync();

            // Get records for current page
            var users = await query
                .OrderBy(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Status,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                items = users,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(
                    totalCount / (double)pageSize)
            });
        }


        // GET: /api/users/1
        // Get one user
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Status,
                    u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(user);
        }


        // POST: /api/users
        // Create a new user
        [HttpPost]
        public async Task<IActionResult> CreateUser(
            CreateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = request.Email.Trim();

            // Check duplicate email
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == email);

            if (emailExists)
            {
                return Conflict(new
                {
                    message = "Email already exists."
                });
            }

            var user = new User
            {
                Name = request.Name.Trim(),
                Email = email,
                Status = request.Status,
                CreatedAt = DateTime.UtcNow
            };

            // Hash password before saving
            user.PasswordHash = _passwordHasher.HashPassword(
                user,
                request.Password
            );

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetUser),
                new { id = user.Id },
                new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Status,
                    user.CreatedAt
                });
        }


        // PUT: /api/users/1
        // Update an existing user
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(
            int id,
            UpdateUserRequest request)
        {
            // Validate request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find user
            var user = await _context.Users
                .FindAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            // Clean email
            var email = request.Email.Trim();

            // Check whether another user already has this email
            var emailExists = await _context.Users
                .AnyAsync(u =>
                    u.Email == email &&
                    u.Id != id);

            if (emailExists)
            {
                return Conflict(new
                {
                    message = "Email already exists."
                });
            }

            // Update editable fields
            user.Name = request.Name.Trim();
            user.Email = email;
            user.Status = request.Status;

            // IMPORTANT:
            // We do NOT change PasswordHash here.
            // Therefore, the existing password remains unchanged.

            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Status,
                user.CreatedAt
            });
        }


        // DELETE: /api/users/1
        // Delete a user
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .FindAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}