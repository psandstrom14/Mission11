using BookStore.API.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// CORS: hardcoded origins (course pattern). Before Azure deploy, add your Static Web App URL here.
builder.Services.AddCors(options =>
{
    options.AddPolicy("allowReactApp", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:3000",
                  "http://localhost:5173",
                  "https://black-river-06eab840f.1.azurestaticapps.net")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

var app = builder.Build();

// CORS before HTTPS redirect avoids some browsers failing preflight on redirect responses.
app.UseCors("allowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();