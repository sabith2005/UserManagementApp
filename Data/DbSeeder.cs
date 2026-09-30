using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UserManagementApp.Models;

namespace UserManagementApp.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            await context.Database.MigrateAsync();

            if (await context.Users.AnyAsync())
            {
                return;
            }

            var user = new User
            {
                Name = "Admin User",
                Email = "admin@example.com",
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            var passwordHasher = new PasswordHasher<User>();

            user.PasswordHash = passwordHasher.HashPassword(
                user,
                "admin123"
            );

            context.Users.Add(user);

            await context.SaveChangesAsync();
        }
    }
}