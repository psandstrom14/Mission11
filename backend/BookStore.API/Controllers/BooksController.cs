using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStore.API.Models; 

namespace BookStore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        // Dependency Injection to bring in the database context
        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetBooks(int pageNum = 1, int pageSize = 5, string? sortBy = "Title")
        {
            // 1. Start the database query
            var query = _context.Books.AsQueryable();

            // 2. Server-Side Sorting Logic
            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy.ToLower() == "title")
                {
                    query = query.OrderBy(b => b.Title);
                }
                else if (sortBy.ToLower() == "titledesc")
                {
                    query = query.OrderByDescending(b => b.Title);
                }
            }

            // 3. Get total count BEFORE paginating (your React app needs this to draw the page buttons)
            var totalCount = await query.CountAsync();

            // 4. Server-Side Pagination Logic
            var books = await query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // 5. Return an anonymous object containing both the current page of books and the total count
            return Ok(new
            {
                Books = books,
                TotalCount = totalCount
            });
        }
    }
}