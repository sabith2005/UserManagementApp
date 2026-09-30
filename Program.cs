using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using UserManagementApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();

// Add SQL Server Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Cookie Authentication
builder.Services.AddAuthentication(
    CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/index.html";
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;

        // Return 401 instead of redirecting API requests to login page
        options.Events.OnRedirectToLogin = context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            }

            context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };

        // Return 403 for API requests
        options.Events.OnRedirectToAccessDenied = context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }

            context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };
    });

// Add Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Serve HTML, CSS and JavaScript from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// Seed the first admin user
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await DbSeeder.SeedAsync(context);
}

// Map API Controllers
app.MapControllers();

app.Run();