using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UserManagementApp.Data;
using UserManagementApp.DTOs;
using UserManagementApp.Models;

namespace UserManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new
                {
                    message = "Email and password are required."
                });
            }

            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password
            );

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            if (!string.Equals(user.Status, "Active",
                StringComparison.OrdinalIgnoreCase))
            {
                return Unauthorized(new
                {
                    message = "Your account is inactive."
                });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var identity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme);

            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal);

            return Ok(new
            {
                message = "Login successful.",
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Status
                }
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);

            return Ok(new
            {
                message = "Logout successful."
            });
        }

        [HttpGet("me")]
        public IActionResult Me()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Unauthorized();
            }

            return Ok(new
            {
                id = User.FindFirstValue(ClaimTypes.NameIdentifier),
                name = User.FindFirstValue(ClaimTypes.Name),
                email = User.FindFirstValue(ClaimTypes.Email)
            });
        }
    }
}