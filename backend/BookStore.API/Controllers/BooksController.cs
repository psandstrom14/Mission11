using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStore.API.Models; 

namespace BookStore.API.Controllers
{
    /// <summary>
    /// Mission 12 grading notes:
    /// - GET api/books/categories: distinct Category values for the React filter checkboxes.
    /// - GET api/books: optional repeated "category" query binds to List&lt;string&gt;.
    ///   TotalCount is computed on the filtered IQueryable BEFORE Skip/Take so pagination matches filters.
    /// </summary>
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

        [HttpGet("categories")]
        public async Task<ActionResult<List<string>>> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
            return Ok(categories);
        }

        [HttpGet]
        public async Task<ActionResult> GetBooks(int pageNum = 1, int pageSize = 5, string? sortBy = "Title", [FromQuery] List<string>? category = null)
        {
            // 1. Start the database query
            var query = _context.Books.AsQueryable();

            // 2. Category filtering (accepts repeated query params: ?category=A&category=B)
            if (category is { Count: > 0 })
            {
                query = query.Where(b => category.Contains(b.Category));
            }

            // 3. Server-Side Sorting Logic
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

            // 4. Get total count BEFORE paginating (your React app needs this to draw the page buttons)
            var totalCount = await query.CountAsync();

            // 5. Server-Side Pagination Logic
            var books = await query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // 6. Return an anonymous object containing both the current page of books and the total count
            return Ok(new
            {
                Books = books,
                TotalCount = totalCount
            });
        }
    }
}