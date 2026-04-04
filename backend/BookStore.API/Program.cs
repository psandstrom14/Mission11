using BookStore.API.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("allowReactApp", policy =>
    {
        // CRA default; replace with http://localhost:3001 if needed. Vite uses 5173.
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors("allowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();