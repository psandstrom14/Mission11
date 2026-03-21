using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookStore.API.Models;

public partial class Book
{
    [Required]
    public int BookId { get; set; }

    [Required]
    public string Title { get; set; } = null!;

    [Required]
    public string Author { get; set; } = null!;

    [Required]
    public string Publisher { get; set; } = null!;

    [Required]
    public string Isbn { get; set; } = null!;

    [Required]
    public string Classification { get; set; } = null!;

    [Required]
    public string Category { get; set; } = null!;

    [Required]
    public int PageCount { get; set; }

    [Required]
    public double Price { get; set; }
}
